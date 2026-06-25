import multer from "multer";
import path from "path";
import fs from "fs";
const uploadDir = path.join(__dirname, "../../uploads");
if (!fs.existsSync(uploadDir)) {
	fs.mkdirSync(uploadDir, { recursive: true });
}

// multer storage config
const storage = multer.diskStorage({
	destination: (_req, _file, cb) => {
		cb(null, "uploads");
	},
	filename: (_req, file, cb) => {
		const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
		const ext = path.extname(file.originalname);
		cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
	},
});

// Multer instance
export const upload = multer({ storage });
