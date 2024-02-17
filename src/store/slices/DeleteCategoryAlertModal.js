import { createSlice } from "@reduxjs/toolkit";

const initialValueState = {
	isDeleteCategoryAlertOpen: false,
	messageAlert: "",
};

// slices
const DeleteCategoryAlertModal = createSlice({
	name: "DeleteCategoryAlertModal",
	initialState: initialValueState,
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
	DeleteCategoryAlertModal.actions;
export default DeleteCategoryAlertModal.reducer;
