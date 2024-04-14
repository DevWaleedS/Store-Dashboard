import { createSlice } from "@reduxjs/toolkit";
import { CategoriesSelectThunk } from "../Thunk/CategoriesSelectThunk";

const initialState = {
	loading: false,
	Categories: [],
};

const CategoriesSelectSlice = createSlice({
	name: "CategoriesSelect",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all category
			.addCase(CategoriesSelectThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(CategoriesSelectThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.Categories = action?.payload?.data?.categories;
			})
			.addCase(CategoriesSelectThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default CategoriesSelectSlice.reducer;
