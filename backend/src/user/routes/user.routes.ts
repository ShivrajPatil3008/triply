import { Router } from "express";
import { upload } from "../../config/multer.config";
import { auth } from "../../middlewares/auth";
import {
	authUser,
	changeUserCredentials,
	deleteUser,
	getUserById,
	loginUser,
	registerUser,
	updateUser,
	userLogout,
} from "../controller/user.controller";

const router = Router();

router.post("/", upload.single("avatar"), registerUser);

router.post("/login", loginUser);

router.post("/logout", userLogout);

router.delete("/", auth, deleteUser);

router.get("/", auth, getUserById);

router.put("/", auth, upload.single("avatar"), updateUser);

router.put("/change-password", auth, changeUserCredentials);

router.get("/auth", auth, authUser);

export default router;
