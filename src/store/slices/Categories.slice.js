import { createSlice } from "@reduxjs/toolkit";
import { categoriesThunk } from "../Thunk/CategoryTableThunk";

const initialState = {
	loading: false,
	reload: false,
	Categories: [],
	currentPage: 1,
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
				state.currentPage = action.payload.currentPage;
				state.Categories = action.payload.data;
				state.storeCategory = action?.payload?.data?.categories?.filter(
					(category) => category.store !== null
				);
				state.SouqOtlbhaCategory = action?.payload?.data?.categories?.filter(
					(category) => category.store === null
				);
			})
			.addCase(categoriesThunk.rejected, (state, action) => {
				state.reload = false;
				state.errors = action.error.message;
			});
	},
});

export const {} = CategoriesSlice.actions;

export default CategoriesSlice.reducer;
