import { createSlice } from "@reduxjs/toolkit";

import {
	FilterProductsByCategoriesThunk,
	SouqOtlobhaThunk,
} from "../Thunk/SouqOtlobhaThunk";

const initialState = {
	loading: false,
	reload: false,

	products: [],
	categories: [],
	pageCount: 1,
	currentPage: 1,

	error: "",
};

const SouqOtlobhaSlice = createSlice({
	name: "SouqOtlobha",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all products
			.addCase(SouqOtlobhaThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(SouqOtlobhaThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.pageCount = action.payload.data.page_count;
				state.currentPage = action.payload.data.current_page;
				state.categories = action.payload.data.categories;
				state.products = action?.payload?.data.products;
			})
			.addCase(SouqOtlobhaThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})

			//FilterProductsByCategoriesThunk
			.addCase(FilterProductsByCategoriesThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(FilterProductsByCategoriesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.pageCount = action.payload.data.page_count;
				state.currentPage = action.payload.data.current_page;
				state.categories = action.payload.data.categories;
				state.products = action?.payload?.data.products;
			})
			.addCase(FilterProductsByCategoriesThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default SouqOtlobhaSlice.reducer;
