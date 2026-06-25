import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface IserverStatus {
	success: boolean;
	message: string;
}

export const serverStatusApi = createApi({
	reducerPath: "serverStatusApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/api/test`,
		credentials: "include",
		// for token from local storage
		prepareHeaders: (headers) => {
			const token = localStorage.getItem("token");

			if (token) {
				headers.set("authorization", `Bearer ${token}`);
			}

			return headers;
		},
	}),
	refetchOnFocus: true,

	tagTypes: ["serverStatus"],
	endpoints: (builder) => ({
		//get service details
		getServerStatus: builder.query<IserverStatus, void>({
			query: () => "",
			providesTags: ["serverStatus"],
		}),
	}),
});

export const { useGetServerStatusQuery } = serverStatusApi;
