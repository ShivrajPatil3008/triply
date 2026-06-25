import { extractTextFromImage } from "./ocr.service";
import { extractTextFromPDF } from "./pdf.service";

interface UploadedFile {
	path: string;

	mimetype: string;
}

export const extractDocumentText = async (
	file: UploadedFile,
): Promise<string> => {
	let text = "";

	if (file.mimetype === "application/pdf") {
		text = await extractTextFromPDF(file.path);
	} else if (file.mimetype.startsWith("image")) {
		text = await extractTextFromImage(file.path);
	}

	return text;
};
