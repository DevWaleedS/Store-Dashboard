import { createSlice } from "@reduxjs/toolkit";
import {
	CategoriesThunk,
	ChangeAllCategoriesStatusThunk,
	ChangeCategoriesStatusThunk,
	DeleteAllCategoriesThunk,
	DeleteCategoriesThunk,
	addCategoryThunk,
} from "../Thunk/CategoriesThunk";

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

	isDeleteCategoryAlertOpen: false,
	messageAlert: "",
};

const CategoriesSlice = createSlice({
	name: "Categories",
	initialState: initialState,
	reducers: {
		openDeleteCategoryAlert: (state, action) => {
			state.isDeleteCategoryAlertOpen = true;
			state.messageAlert = action?.payload;
		},
		closeDeleteCategoryAlert: (state, action) => {
			state.isDeleteCategoryAlertOpen = false;
		},
	},
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
			})
			// DeleteCategoriesThunk
			.addCase(DeleteCategoriesThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(DeleteCategoriesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(DeleteCategoriesThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			}) // DeleteAllCategoriesThunk
			.addCase(DeleteAllCategoriesThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(DeleteAllCategoriesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(DeleteAllCategoriesThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			})

			//ChangeCategoriesStatusThunk
			.addCase(ChangeCategoriesStatusThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ChangeCategoriesStatusThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(ChangeCategoriesStatusThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			})

			//ChangeAllCategoriesStatusThunk
			.addCase(ChangeAllCategoriesStatusThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ChangeAllCategoriesStatusThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(ChangeAllCategoriesStatusThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			});
	},
});

export const { openDeleteCategoryAlert, closeDeleteCategoryAlert } =
	CategoriesSlice.actions;
export default CategoriesSlice.reducer;
