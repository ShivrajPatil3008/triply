import { configureStore } from "@reduxjs/toolkit";

import themeReducer from "../slices/themeSlice";
import tokenReducer from "../slices/tokenSlice";

import { userApi } from "../userApi";
import { serverStatusApi } from "../serverStatusApi";
import { itineraryApi } from "../itineraryApi";

export const store = configureStore({
	reducer: {
		theme: themeReducer,
		token: tokenReducer,
		[userApi.reducerPath]: userApi.reducer,
		[itineraryApi.reducerPath]: itineraryApi.reducer,
		[serverStatusApi.reducerPath]: serverStatusApi.reducer,
	},
	middleware: (getDefault) =>
		getDefault({
			serializableCheck: {},
		}).concat(
			userApi.middleware,
			serverStatusApi.middleware,
			itineraryApi.middleware,
		),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
