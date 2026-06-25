import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface TokenSate {
	token: string;
}

const initialState: TokenSate = {
	token: "",
};

const tokenSlice = createSlice({
	name: "token",
	initialState,
	reducers: {
		handleToken: (state, action: PayloadAction<string>) => {
			state.token = action.payload;
		},
		clearToken: (state) => {
			state.token = "";
		},
	},
});

export const { handleToken, clearToken } = tokenSlice.actions;

export default tokenSlice.reducer;
