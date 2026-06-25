import jwt, { type JwtPayload as JwtLibPayload } from "jsonwebtoken";
import { config } from "dotenv";
import { NextFunction, Request, Response } from "express";
config();

export interface JwtPayload {
	id: string;
	role: string;
	email: string;
}
export interface AuthenticatedRequest extends Request {
	user?: JwtPayload;
	cookies: {
		token?: string;
	};
}
interface AuthJwtPayload extends JwtLibPayload {
	id: string;
	role: string;
	email: string;
}

export const auth = async (
	req: AuthenticatedRequest,
	res: Response,
	next: NextFunction,
) => {
	try {
		const token =
			req.headers.authorization?.split(" ")[1] || req.cookies?.token;

		if (!token) {
			return res.status(401).json({ message: "Unauthorized" });
		}

		const decoded = jwt.verify(
			token,
			process.env.JWT_SECRET as string,
		) as AuthJwtPayload;

		req.user = {
			id: decoded.id,
			role: decoded.role,
			email: decoded.email,
		};

		next();
	} catch (error) {
		return res.status(401).json({
			message: "Invalid or expired token",
			error: (error as Error).message,
		});
	}
};
