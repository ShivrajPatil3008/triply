import { createSlice } from "@reduxjs/toolkit";

interface ThemeState {
	theme: string;
}

const initialState: ThemeState = {
	theme: "dark",
};

const themeSlice = createSlice({
	name: "theme",
	initialState,
	reducers: {
		toggleTheme: (state) => {
			if (state.theme === "dark") {
				state.theme = "light";
			} else {
				state.theme = "dark";
			}
		},
	},
});

export const { toggleTheme } = themeSlice.actions;

export default themeSlice.reducer;
