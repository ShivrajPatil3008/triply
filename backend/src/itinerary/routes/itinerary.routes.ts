import { Router } from "express";
import { upload } from "../../config/multer.config";
import {
	deleteItinerary,
	generateItinerary,
	getAllItineraries,
	getItineraryByCode,
	getItineraryById,
	updateItinerary,
	updateTimeline,
} from "../controller/itinerary.controller";
import { auth } from "../../middlewares/auth";

const router = Router();

router.post("/", auth, upload.array("files", 100), generateItinerary);
router.get("/", auth, getAllItineraries);
router.get("/code/:tripCode", getItineraryByCode);

router.put("/:id", auth, upload.array("files", 100), updateItinerary);
router.patch("/:id", auth, updateTimeline);
router.get("/:id", auth, getItineraryById);
router.delete("/:id", auth, deleteItinerary);

export default router;
