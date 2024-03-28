import { createSlice } from "@reduxjs/toolkit";
import { categoriesThunk } from "../Thunk/CategoryTableThunk";

const initialState = {
	loading: false,
	reload: false,
	Categories: [],
	currentPage: 1,
	etlobhaCurrentPage: 1,
	etlobhaPageCount: 2,
	pageCount: 1,
	errors: "",
	storeCategory: [],
	SouqOtlbhaCategory: [],
};

const CategoriesSlice = createSlice({
	name: "Categories",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(categoriesThunk.pending, (state) => {
				state.reload = true;
			})
			.addCase(categoriesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.currentPage = action.payload.data.current_page;
				state.etlobhaCurrentPage = action.payload.data.etlobha_current_page;
				state.etlobhaPageCount = action.payload.data.etlobha_page_count;
				state.pageCount = action.payload.data.page_count;
				state.Categories = action.payload.data;
				state.storeCategory = action?.payload?.data.categories;
				state.SouqOtlbhaCategory = action?.payload?.data?.etlobha_categories;
			})
			.addCase(categoriesThunk.rejected, (state, action) => {
				state.reload = false;
				state.errors = action.error.message;
			});
	},
});

export default CategoriesSlice.reducer;
