import { createSlice } from "@reduxjs/toolkit";
import { CategoriesThunk, addCategoryThunk } from "../Thunk/CategoriesThunk";

const initialState = {
	loading: false,
	reload: false,
	Categories: [],
	currentPage: 1,
	etlobhaCurrentPage: 1,
	etlobhaPageCount: 2,
	pageCount: 1,
	error: "",
	storeCategory: [],
	SouqOtlbhaCategory: [],
};

const CategoriesSlice = createSlice({
	name: "Categories",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all category
			.addCase(CategoriesThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(CategoriesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.etlobhaCurrentPage = action.payload.data.etlobha_current_page;
				state.etlobhaPageCount = action.payload.data.etlobha_page_count;
				state.pageCount = action.payload.data.page_count;
				state.Categories = action.payload.data;
				state.storeCategory = action?.payload?.data.categories;
				state.SouqOtlbhaCategory = action?.payload?.data?.etlobha_categories;
			})
			.addCase(CategoriesThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})

			//add new category
			.addCase(addCategoryThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(addCategoryThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(addCategoryThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			});
	},
});

export default CategoriesSlice.reducer;
