import { Request, Response } from "express";
import { extractDocumentText } from "../../services/document.service";
import { deleteTempUpload } from "../../utils/delete-temp-files";
import { saveUploadedFile } from "../../utils/save-uploaded-file";
import { generateItineraryUsingAI } from "../../services/ai.service";
import { Itinerary } from "../model/itinerary.model";
import { generateTripCode } from "../../utils/tripCodeGenerator";
import mongoose from "mongoose";
import { deleteUploadedFileById } from "../../utils/delete-by-id";
import { AuthenticatedRequest } from "../../middlewares/auth";

export const generateItinerary = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	let files: Express.Multer.File[] = [];
	let createdMediaIds: string[] = [];

	const userId = req.user?.id;

	try {
		files = (req.files as Express.Multer.File[]) || [];

		const tripTitle = req.body?.tripTitle;
		if (!tripTitle) {
			throw new Error("tripTitle is required");
		}

		const isExist = await Itinerary.findOne({ tripTitle, userId });

		if (isExist) {
			throw new Error("Trip title already exists");
		}
		if (!files.length) {
			throw new Error("No files uploaded");
		}

		//  Process all files parallel (get's raw data)
		const documents = await Promise.all(
			files.map(async (file, index) => {
				const savedFile = await saveUploadedFile(file);
				if (!savedFile._id) {
					throw new Error("Failed to save media file");
				}

				// for deleting mongoose data if api fails
				createdMediaIds.push(savedFile._id.toString());

				const extractedText = await extractDocumentText(file);

				return {
					documentNumber: index,
					mediaId: savedFile._id.toString(),
					extractedText,
				};
			}),
		);

		// not sending objectId to the ai as ai can mess media objectId
		const aiDocuments = documents.map((doc) => ({
			documentNumber: doc.documentNumber,
			extractedText: doc.extractedText,
		}));

		//  use AI to  clean the data
		const itineraryData = await generateItineraryUsingAI(aiDocuments);

		if (!Array.isArray(itineraryData?.extractedData)) {
			throw new Error("Invalid AI response");
		}
		// attach mediaId back to extracted data
		const extractedDataWithMedia = itineraryData.extractedData.map(
			(item: any, index: number) => ({
				...item,
				mediaId: documents[index]?.mediaId ?? null,
			}),
		);

		// unique code
		const tripCode = generateTripCode();

		// clean timeline
		const finalData = {
			userId,
			tripTitle,
			tripCode,
			extractedData: extractedDataWithMedia,
			cleanTimeLine: itineraryData.cleanTimeLine ?? [],
		};
		//  Save itinerary to DB
		const savedItinerary = await Itinerary.create(finalData);

		return res.status(200).json({
			success: true,
			data: savedItinerary,
		});
	} catch (error) {
		// deletes physical files
		if (files.length) {
			for (const file of files) {
				await deleteTempUpload(file);
			}
		}

		// delete created media records
		for (const id of createdMediaIds) {
			await deleteUploadedFileById(id);
		}

		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
};

export const updateItinerary = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	let files: Express.Multer.File[] = [];

	const userId = req.user?.id;

	try {
		files = (req.files as Express.Multer.File[]) || [];

		const { id } = req.params;
		const tripTitle = req.body?.tripTitle;

		if (!id) throw new Error("Itinerary id required");

		const existing = await Itinerary.findOne({
			_id: id,
			userId,
		});

		if (!existing) {
			throw new Error("Itinerary not found");
		}

		// store old media ids safely (for later cleanup)
		const oldMediaIds = existing.extractedData
			.map((item: any) => item?.mediaId)
			.filter(Boolean);

		const documents = await Promise.all(
			files.map(async (file, index) => {
				const savedFile = await saveUploadedFile(file);
				const extractedText = await extractDocumentText(file);

				if (!savedFile?._id) {
					throw new Error("Failed to save media file");
				}

				return {
					documentNumber: index,
					mediaId: savedFile._id.toString(),
					extractedText,
				};
			}),
		);

		const aiDocuments = documents.map((d) => ({
			documentNumber: d.documentNumber,
			extractedText: d.extractedText,
		}));

		const itineraryData = await generateItineraryUsingAI(aiDocuments);

		if (!itineraryData || !Array.isArray(itineraryData.extractedData)) {
			throw new Error(
				"Invalid AI response: extractedData missing or corrupted",
			);
		}

		const extractedDataWithMedia = itineraryData.extractedData.map(
			(item: any, index: number) => {
				return {
					...item,
					mediaId: documents[index]?.mediaId ?? null,
				};
			},
		);
		const updatedData = {
			tripTitle: tripTitle ?? existing.tripTitle,
			extractedData: extractedDataWithMedia,
			cleanTimeLine: itineraryData.cleanTimeLine ?? [],
		};

		const updated = await Itinerary.findOneAndUpdate(
			{
				_id: id,
				userId,
			},
			{
				$set: updatedData,
			},
			{
				new: true,
			},
		)
			.populate("userId")
			.populate("extractedData.mediaId")
			.lean();

		if (updated) {
			await Promise.allSettled(
				oldMediaIds.map((mediaId) => deleteUploadedFileById(mediaId)),
			);
		}
		return res.status(200).json({
			success: true,
			data: updated,
		});
	} catch (error) {
		// cleanup temp uploads
		if (files.length) {
			for (const file of files) {
				await deleteTempUpload(file);
			}
		}

		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
};

export const updateTimeline = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id;

	try {
		const { id } = req.params;
		const { tripTitle, cleanTimeLine } = req.body;

		if (!id) {
			throw new Error("Itinerary id is required");
		}

		// if (!cleanTimeLine || !Array.isArray(cleanTimeLine)) {
		// 	throw new Error("cleanTimeLine must be an array");
		// }

		if (cleanTimeLine !== undefined && !Array.isArray(cleanTimeLine)) {
			throw new Error("cleanTimeLine must be an array");
		}

		const existing = await Itinerary.findOne({
			_id: id,
			userId,
		});

		if (!existing) {
			throw new Error("Itinerary not found");
		}

		// const updated = await Itinerary.findByIdAndUpdate(
		// 	id,
		// 	{
		// 		$set: {
		// 			tripTitle: tripTitle ?? existing.tripTitle,
		// 			cleanTimeLine,
		// 		},
		// 	},
		// 	{ new: true },
		// )
		// 	.populate("userId")
		// 	.populate("extractedData.mediaId")
		// 	.lean();

		const updated = await Itinerary.findByIdAndUpdate(
			{
				_id: id,
				userId,
			},
			{
				$set: {
					tripTitle: tripTitle ?? existing.tripTitle,
					cleanTimeLine,
				},
			},
			{ new: true },
		)
			.populate("userId")
			.populate("extractedData.mediaId")
			.lean();

		return res.status(200).json({
			success: true,
			data: updated,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
};

export const getItineraryById = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id;

	try {
		const { id } = req.params;

		if (!id) {
			throw new Error("Itinerary id is required");
		}

		// const itinerary = await Itinerary.findById(id).lean();

		const itinerary = await Itinerary.findOne({
			_id: id,
			userId,
		})
			.populate("userId")
			.populate("extractedData.mediaId")
			.lean();

		if (!itinerary) {
			throw new Error("Itinerary not found");
		}

		return res.status(200).json({
			success: true,
			data: itinerary,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
};

export const getItineraryByCode = async (req: Request, res: Response) => {
	try {
		const { tripCode } = req.params;

		if (!tripCode) {
			throw new Error("Itinerary id is required");
		}

		const itinerary = await Itinerary.findOne({ tripCode })
			.populate("userId")
			.populate("extractedData.mediaId")
			.lean();

		if (!itinerary) {
			throw new Error("Itinerary not found");
		}

		return res.status(200).json({
			success: true,
			data: itinerary,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
};

export const deleteItinerary = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	const userId = req.user?.id;

	try {
		const { id } = req.params;

		if (!id) {
			throw new Error("Itinerary id is required");
		}

		const existing = await Itinerary.findOne({
			_id: id,
			userId,
		});
		if (!existing) {
			throw new Error("Itinerary not found");
		}

		if (existing.extractedData?.length) {
			await Promise.allSettled(
				existing.extractedData.map(async (item: any) => {
					if (item.mediaId) {
						await deleteUploadedFileById(item.mediaId);
					}
				}),
			);
		}

		// await Itinerary.findByIdAndDelete(id);
		await Itinerary.findOneAndDelete({
			_id: id,
			userId,
		});

		return res.status(200).json({
			success: true,
			message: "Itinerary deleted successfully",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
};

export const getAllItineraries = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const userId = req.user?.id;
		const { search, sort } = req.query;

		const query: any = {};

		if (search) {
			query.$or = [
				{ tripTitle: { $regex: search, $options: "i" } },
				{ tripCode: { $regex: search, $options: "i" } },
			];
		}

		let sortOption: any = { createdAt: -1 };

		if (sort === "asc") {
			sortOption = { createdAt: 1 };
		} else if (sort === "desc") {
			sortOption = { createdAt: -1 };
		}

		const itineraries = await Itinerary.find({
			...query,
			userId,
		})
			.populate("userId")
			.populate("extractedData.mediaId")
			.sort(sortOption)
			.lean();

		return res.status(200).json({
			success: true,
			data: itineraries,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error instanceof Error ? error.message : "Something went wrong",
		});
	}
};
