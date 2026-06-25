import mongoose from "mongoose";

const extractedDataSchema = new mongoose.Schema(
	{
		// documentNumber: { type: Number, default: 0 },
		passengerName: { type: String, default: "N/A" },
		passengerEmail: { type: String, default: "N/A" },
		vehicleType: { type: String, default: "N/A" },
		bookingReference: { type: String, default: "N/A" },
		otherDetails: { type: String, default: "N/A" },
		vehicleName: { type: String, default: "N/A" },
		vehicleNumber: { type: String, default: "N/A" },
		departureStation: { type: String, default: "N/A" },
		departureCity: { type: String, default: "N/A" },
		departureDate: { type: String, default: "N/A" },
		departureTime: { type: String, default: "N/A" },
		arrivalStation: { type: String, default: "N/A" },
		arrivalCity: { type: String, default: "N/A" },
		arrivalDate: { type: String, default: "N/A" },
		arrivalTime: { type: String, default: "N/A" },
		seatNumber: { type: String, default: "N/A" },
		ticketNumber: { type: String, default: "N/A" },
		hotelName: { type: String, default: "N/A" },
		hotelAddress: { type: String, default: "N/A" },
		checkInDate: { type: String, default: "N/A" },
		checkInTime: { type: String, default: "N/A" },
		checkOutDate: { type: String, default: "N/A" },
		checkOutTime: { type: String, default: "N/A" },
		roomNumber: { type: String, default: "N/A" },
		hotelBookingId: { type: String, default: "N/A" },
		roomType: { type: String, default: "N/A" },
		amount: { type: String, default: "N/A" },
		totalAmount: { type: String, default: "N/A" },
		contactNumber: { type: String, default: "N/A" },
		mediaId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "media",
		},
	},
	{ _id: false },
);

const cleanTimeLineSchema = new mongoose.Schema(
	{
		day: { type: String, default: "N/A" },
		date: { type: String, default: "N/A" },
		event: { type: String, default: "N/A" },
		time: { type: String, default: "N/A" },
	},
	{ _id: false },
);

const itinerarySchema = new mongoose.Schema({
	tripTitle: { type: String, required: true },
	userId: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
	tripCode: { type: String, unique: true },

	extractedData: {
		type: [extractedDataSchema],
		default: [],
	},

	cleanTimeLine: {
		type: [cleanTimeLineSchema],
		default: [],
	},
});

export const Itinerary = mongoose.model("itinerary", itinerarySchema);
