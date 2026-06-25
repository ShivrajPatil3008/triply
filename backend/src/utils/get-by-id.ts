import { IMediaFile, Media } from "../media/models/media.model";

export const getUploadedFileById = async (
	id: string,
): Promise<IMediaFile | null> => {
	try {
		const file = await Media.findById(id);
		if (!file) {
			throw new Error("File not found");
		}
		return file;
	} catch (error) {
		console.error("Error fetching file:", error);
		throw error;
	}
};
