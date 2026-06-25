import fs from "node:fs";

export const deleteTempUpload = async (file?: Express.Multer.File) => {
	if (!file) return;

	if (file.path && fs.existsSync(file.path)) {
		fs.unlinkSync(file.path);
	}
};
