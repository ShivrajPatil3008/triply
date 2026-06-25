import { Request, Response } from "express";
import app from "./config/server.config";
import jwt from "jsonwebtoken";
import itineraryRoutes from "./itinerary/routes/itinerary.routes";
import userRoutes from "./user/routes/user.routes";

app.use("/api/test", async (req: Request, res: Response) => {
	try {
		return res
			.status(200)
			.json({ success: true, message: "Server is running!! " });
	} catch (error) {
		return res
			.status(500)
			.json({ success: false, error: (error as Error).message });
	}
});

app.use("/api/jwt", async (req, res) => {
	try {
		const token = req.cookies.token;
		if (!token) {
			return res.status(401).json({ valid: false });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

		return res.json({ valid: true, user: decoded });
	} catch (error) {
		return res.status(500).json({
			success: false,
			error: (error as Error).message,
			validate: false,
		});
	}
});

app.use("/api/itinerary", itineraryRoutes);
app.use("/api/user", userRoutes);

export { default } from "./config/server.config";
