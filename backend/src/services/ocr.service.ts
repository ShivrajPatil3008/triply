import Tesseract from "tesseract.js";
import { extractorConfig } from "../config/extractor.config";

export const extractTextFromImage = async (
	filePath: string,
): Promise<string> => {
	const result = await Tesseract.recognize(
		filePath,
		extractorConfig.image.language,
		extractorConfig.image.options,
	);

	return result.data.text;
};
