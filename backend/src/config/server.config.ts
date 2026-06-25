import express, { Express } from "express";
import cors from "cors";
import { connectDB } from "./db.config";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import morgan from "morgan";

config();

const app: Express = express();

app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(__dirname, "../../uploads")));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());

const allowedOrigins = [
	process.env.FRONTEND_URL,
	"http://localhost:5173",
].filter(Boolean);

app.use(
	cors({
		origin: function (origin, callback) {
			if (!origin || allowedOrigins.includes(origin)) {
				return callback(null, true);
			}
			return callback(new Error("Not allowed by CORS"));
		},
		credentials: true,
	}),
);

connectDB();

export default app;
