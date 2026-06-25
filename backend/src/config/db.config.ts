import { config } from "dotenv";
import mongoose from "mongoose";
config();

const uri: string | undefined = process.env.MONGO_URI;

if (!uri) {
	throw new Error("MONGO_URI is not defined in .env");
}

export const connectDB = async (): Promise<void> => {
	try {
		const conn = await mongoose.connect(uri);
		console.log(`MongoDB Connected: ${conn.connection.host}`);
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};
