import { createSlice } from "@reduxjs/toolkit";

const initialState = {
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
});

export const { openDeleteCategoryAlert, closeDeleteCategoryAlert } =
	CategoriesSlice.actions;
export default CategoriesSlice.reducer;
