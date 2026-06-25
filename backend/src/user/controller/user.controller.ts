import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { User } from "../model/user.model";
import { saveUploadedFile } from "../../utils/save-uploaded-file";
import { Types } from "mongoose";
import { deleteTempUpload } from "../../utils/delete-temp-files";
import { deleteUploadedFileById } from "../../utils/delete-by-id";
import jwt from "jsonwebtoken";
import { AuthenticatedRequest } from "../../middlewares/auth";

export const registerUser = async (req: Request, res: Response) => {
	const file = req.file as Express.Multer.File | undefined;
	try {
		const { userName, email, phone, address, password, age, gender, role } =
			req.body;

		if (!userName || !email || !password) {
			return res.status(400).json({
				success: false,
				message: "userName, email, password are required",
			});
		}

		const existingUser = await User.findOne({ email });
		if (existingUser) {
			return res.status(409).json({
				success: false,
				message: "User already exists",
			});
		}

		let avatarId: Types.ObjectId | undefined = undefined;

		// save avatar file in media collection
		if (file) {
			const savedFile = await saveUploadedFile(file);
			avatarId = savedFile._id;
		}

		const hashedPassword = await bcrypt.hash(password, 10);

		const newUser = await User.create({
			userName,
			email,
			phone,
			address,
			password: hashedPassword,
			age,
			gender,
			role: role || "user",
			avatar: avatarId,
		});

		return res.status(201).json({
			success: true,
			message: "User registered successfully",
			data: newUser,
		});
	} catch (error: any) {
		if (file) {
			await deleteTempUpload(file);
		}
		return res.status(500).json({
			success: false,
			message: error.message || "Something went wrong",
		});
	}
};

export const getUserById = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const id = req.user?.id;

		const user = await User.findById(id).populate("avatar");

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: user,
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const deleteUser = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const id = req.user?.id;

		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		if (user.avatar) {
			await deleteUploadedFileById(user.avatar);
		}

		await User.findByIdAndDelete(id);

		return res.status(200).json({
			success: true,
			message: "User deleted successfully",
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const updateUser = async (req: AuthenticatedRequest, res: Response) => {
	try {
		const id = req.user?.id;
		const file = req.file as Express.Multer.File | undefined;

		const { userName, email, phone, address, password, age, gender, role } =
			req.body;

		const user = await User.findById(id);

		if (!user) {
			return res.status(404).json({
				success: false,
				message: "User not found",
			});
		}

		let avatarId: Types.ObjectId | undefined = undefined;

		if (file) {
			const savedFile = await saveUploadedFile(file);
			avatarId = savedFile._id;
		}

		let updatedPassword = user.password;

		if (password) {
			updatedPassword = await bcrypt.hash(password, 10);
		}

		const updatedUser = await User.findByIdAndUpdate(
			id,
			{
				userName,
				email,
				phone,
				address,
				password: updatedPassword,
				age,
				gender,
				role,
				...(avatarId && { avatar: avatarId }),
			},
			{ new: true },
		).populate("avatar");

		return res.status(200).json({
			success: true,
			message: "User updated successfully",
			data: updatedUser,
		});
	} catch (error: any) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

export const loginUser = async (req: Request, res: Response) => {
	try {
		const { email, password } = req.body;

		const existingUser = await User.findOne({ email });
		if (!existingUser) {
			return res
				.status(401)
				.json({ success: false, message: "Invalid Credentials" });
		}

		const match = await bcrypt.compare(password, existingUser.password);
		if (!match) {
			return res.status(401).json({
				success: false,
				message: "Invalid Credentials",
			});
		}

		const token = jwt.sign(
			{
				id: existingUser._id,
				role: existingUser.role,
				email: existingUser.email,
			},
			process.env.JWT_SECRET as string,
			{ expiresIn: "30d" },
		);

		res.cookie("token", token, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "prod",
			sameSite: process.env.NODE_ENV === "prod" ? "none" : "lax",
		});

		const { password: _, ...userData } = existingUser.toObject();

		return res.json({
			success: true,
			message: "User logged in",
			data: userData,
			token,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Server Error",
			error: (error as Error).message,
		});
	}
};

export const changeUserCredentials = async (
	req: AuthenticatedRequest,
	res: Response,
) => {
	try {
		const id = req.user?.id;
		const { email, password } = req.body;
		if (!email && !password) {
			return res
				.status(400)
				.json({ success: false, message: "Required fields are missing" });
		}

		const hashed = await bcrypt.hash(password, 10);

		await User.findByIdAndUpdate(id, { email, password: hashed });
		return res.status(200).json({
			success: true,
			message: "User Credentials has been updated Successfully",
		});
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, error: (error as Error).message });
	}
};
export const userLogout = async (req: Request, res: Response) => {
	try {
		return res.clearCookie("token").status(200).json({
			success: true,
			message: "User has been logout successfully!",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
			error: (error as Error).message,
		});
	}
};

export const authUser = async (req: AuthenticatedRequest, res: Response) => {
	try {
		if (req.user?.role === "user") {
			return res.status(200).json({ success: true, userAuthentication: true });
		}
		return res.status(403).json({
			success: false,
			message: "Not an user",
			userAuthentication: false,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Failed to authenticate",
			error: (error as Error).message,
		});
	}
};
