import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BaseResponse {
	success: boolean;
	message: string;
}

export interface FileStringData {
	_id: string;
	fileLocation: string;
	originalname: string;
}

export interface MediaFile {
	_id?: string;
	fileLocation?: string;
	originalname?: string;
	mimetype?: string;
	size?: number;
}

export interface UserData {
	_id?: string;
	userName?: string;
	email?: string;
}

export interface ExtractedData {
	passengerName?: string;
	passengerEmail?: string;
	vehicleType?: string;
	bookingReference?: string;
	otherDetails?: string;
	vehicleName?: string;
	vehicleNumber?: string;
	departureStation?: string;
	departureCity?: string;
	departureDate?: string;
	departureTime?: string;
	arrivalStation?: string;
	arrivalCity?: string;
	arrivalDate?: string;
	arrivalTime?: string;
	seatNumber?: string;
	ticketNumber?: string;
	hotelName?: string;
	hotelAddress?: string;
	checkInDate?: string;
	checkInTime?: string;
	checkOutDate?: string;
	checkOutTime?: string;
	roomNumber?: string;
	hotelBookingId?: string;
	roomType?: string;
	amount?: string;
	totalAmount?: string;
	contactNumber?: string;
	mediaId?: string | MediaFile;
}

export interface CleanTimeLine {
	day?: string;
	date?: string;
	event?: string;
	time?: string;
}

export interface Itinerary {
	_id?: string;
	tripTitle: string;
	userId?: string | UserData;
	tripCode?: string;

	extractedData?: ExtractedData[];
	cleanTimeLine?: CleanTimeLine[];

	createdAt?: string;
	updatedAt?: string;
}

export interface GenerateItineraryRequest {
	tripTitle: string;
	files: FileList | File[];
}

export interface UpdateTimelineRequest {
	tripTitle?: string;
	cleanTimeLine: CleanTimeLine[];
}

export interface ItineraryListResponse extends BaseResponse {
	data: Itinerary[];
}

export interface ItineraryResponse extends BaseResponse {
	data: Itinerary;
}

export const itineraryApi = createApi({
	reducerPath: "itineraryApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/api/itinerary`,
		credentials: "include",
		prepareHeaders: (headers) => {
			const token = localStorage.getItem("token");

			if (token) {
				headers.set("authorization", `Bearer ${token}`);
			}

			return headers;
		},
	}),
	refetchOnFocus: true,
	tagTypes: ["Itinerary"],

	endpoints: (builder) => ({
		generateItinerary: builder.mutation<ItineraryResponse, FormData>({
			query: (formData) => ({
				url: "/",
				method: "POST",
				body: formData,
			}),
			invalidatesTags: ["Itinerary"],
		}),

		getAllItineraries: builder.query<
			ItineraryListResponse,
			{ search?: string; sort?: string } | void
		>({
			query: (params) => {
				const query = new URLSearchParams();

				if (params?.search) query.append("search", params.search);
				if (params?.sort) query.append("sort", String(params.sort));

				return `/?${query.toString()}`;
			},
			providesTags: ["Itinerary"],
		}),

		getItineraryById: builder.query<ItineraryResponse, string>({
			query: (id) => `/${id}`,
			providesTags: ["Itinerary"],
		}),

		getItineraryByCode: builder.query<ItineraryResponse, string>({
			query: (tripCode) => `/code/${tripCode}`,
			providesTags: ["Itinerary"],
		}),

		updateItinerary: builder.mutation<
			ItineraryResponse,
			{ id: string; formData: FormData }
		>({
			query: ({ id, formData }) => ({
				url: `/${id}`,
				method: "PUT",
				body: formData,
			}),
			invalidatesTags: ["Itinerary"],
		}),

		updateTimeline: builder.mutation<
			ItineraryResponse,
			{ id: string; body: UpdateTimelineRequest }
		>({
			query: ({ id, body }) => ({
				url: `/${id}`,
				method: "PATCH",
				body,
			}),
			invalidatesTags: ["Itinerary"],
		}),

		deleteItinerary: builder.mutation<BaseResponse, string>({
			query: (id) => ({
				url: `/${id}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Itinerary"],
		}),
	}),
});

export const {
	useGenerateItineraryMutation,
	useGetAllItinerariesQuery,
	useGetItineraryByIdQuery,
	useGetItineraryByCodeQuery,
	useUpdateItineraryMutation,
	useUpdateTimelineMutation,
	useDeleteItineraryMutation,
} = itineraryApi;
