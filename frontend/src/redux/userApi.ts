import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface BaseResponse {
	success: boolean;
	message: string;
}

export interface BaseResponseForLogin {
	success: boolean;
	message: string;
	token: string;
}

export type FileStringData = {
	_id: string;
	fileLocation: string;
	originalname: string;
};

export interface UserData {
	_id?: string;
	__v?: number;
	userName?: string;
	email?: string;
	phone?: string;
	address?: string;
	password?: string;
	age?: string;
	gender?: string;
	role?: string;

	avatar?: FileList | FileStringData;
}

export interface LoginData {
	email: string;
	password: string;
}

export interface UserResponse extends BaseResponse {
	data: UserData;
}

export interface UserAuthRequestBody {
	success: boolean;
	userAuthentication: boolean;
}
export const userApi = createApi({
	reducerPath: "userApi",
	baseQuery: fetchBaseQuery({
		baseUrl: `${import.meta.env.VITE_BASE_URL}/api/user`,
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

	tagTypes: ["User"],
	endpoints: (builder) => ({
		getUserDetails: builder.query<UserResponse, void>({
			query: () => "/",
			providesTags: ["User"],
		}),

		deleteUserDetails: builder.mutation<BaseResponse, void>({
			query: () => ({
				url: "/",
				method: "DELETE",
			}),
			invalidatesTags: ["User"],
		}),

		registerUser: builder.mutation<UserResponse, FormData>({
			query: (formData) => ({
				url: "/",
				method: "POST",
				body: formData,
			}),
			invalidatesTags: ["User"],
		}),

		loginUser: builder.mutation<BaseResponseForLogin, LoginData>({
			query: (body) => ({
				url: "/login",
				method: "POST",
				body,
			}),
			invalidatesTags: ["User"],
		}),

		logoutUser: builder.mutation<UserResponse, void>({
			query: () => ({
				url: "/logout",
				method: "POST",
			}),
			invalidatesTags: ["User"],
		}),

		updateUser: builder.mutation<UserResponse, FormData>({
			query: (formData) => ({
				url: "/",
				method: "PUT",
				body: formData,
			}),
			invalidatesTags: ["User"],
		}),

		changeCredentials: builder.mutation<UserResponse, LoginData>({
			query: (body) => ({
				url: "/",
				method: "PUT",
				body,
			}),
			invalidatesTags: ["User"],
		}),

		userAuth: builder.query<UserAuthRequestBody, void>({
			query: () => "/auth",
			providesTags: ["User"],
		}),
	}),
});

export const {
	useRegisterUserMutation,
	useChangeCredentialsMutation,
	useDeleteUserDetailsMutation,
	useGetUserDetailsQuery,
	useLoginUserMutation,
	useLogoutUserMutation,
	useUpdateUserMutation,
} = userApi;
