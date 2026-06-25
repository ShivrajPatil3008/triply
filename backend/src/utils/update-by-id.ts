import fs from "node:fs";
import { config } from "dotenv";
import { IMediaFile, Media } from "../media/models/media.model";
import { Types } from "mongoose";
config();
export const updateUploadedFileById = async (
	id: Types.ObjectId | string,
	file: Express.Multer.File,
): Promise<IMediaFile> => {
	try {
		const existing = await Media.findById(id);
		if (!existing) {
			throw new Error("File record not found");
		}

		console.log("updateFile", file);

		if (existing.path && fs.existsSync(existing.path)) {
			fs.unlinkSync(existing.path);
		}

		existing.fieldname = file.fieldname;
		existing.originalname = file.originalname;
		existing.mimetype = file.mimetype;
		existing.size = file.size;
		existing.destination = file.destination;
		existing.filename = file.filename;
		existing.path = file.path;
		existing.buffer = file.buffer;
		existing.fileLocation = `${process.env.BACKEND_URL}/uploads/${file.filename}`;

		await existing.save();
		return existing;
	} catch (err) {
		console.error("Update file error:", err);
		throw err;
	}
};
