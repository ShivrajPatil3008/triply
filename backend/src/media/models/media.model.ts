import mongoose, { Types } from "mongoose";

export interface IMediaFile {
	fieldname: string;
	originalname: string;
	encoding: string;
	mimetype: string;
	size: number;
	destination: string;
	filename: string;
	path: string;
	buffer?: Buffer;
	fileLocation?: string;
	_id?: Types.ObjectId;
}

const mediaSchema = new mongoose.Schema<IMediaFile>(
	{
		fieldname: { type: String },
		originalname: { type: String },
		mimetype: { type: String },
		size: { type: Number },
		destination: { type: String },
		filename: { type: String },
		path: { type: String },
		buffer: { type: Buffer },
		fileLocation: { type: String },
	},
	{
		timestamps: true,
	},
);

export const Media = mongoose.model<IMediaFile>("media", mediaSchema);
