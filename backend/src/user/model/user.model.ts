import mongoose, { Schema, Types } from "mongoose";

export interface IUser {
	userName: string;
	email: string;
	phone: string;
	address: string;
	password: string;
	age: string;
	gender: string;
	avatar: Types.ObjectId;
	role: string;
}

export const userSchema = new mongoose.Schema<IUser>({
	userName: { type: String },
	email: { type: String, trim: true, unique: true },
	phone: {
		type: String,
	},
	address: { type: String },

	password: { type: String },
	age: { type: String },
	gender: { type: String },
	role: { type: String, default: "user" },
	avatar: { type: Schema.Types.ObjectId, ref: "media" },
});

export const User = mongoose.model<IUser>("user", userSchema);
