import { config } from "dotenv";
import { IMediaFile, Media } from "../media/models/media.model";
config();

export const saveUploadedFile = async (
	file: Express.Multer.File,
): Promise<IMediaFile> => {
	if (!file) {
		throw new Error("No file provided");
	}
	console.log("file", file);

	const newFile = new Media({
		fieldname: file.fieldname,
		originalname: file.originalname,
		mimetype: file.mimetype,
		size: file.size,
		destination: file.destination,
		filename: file.filename,
		path: file.path,
		buffer: file.buffer,
		fileLocation: `${process.env.BACKEND_URL}/uploads/${file.filename}`,
	});

	return await newFile.save();
};
