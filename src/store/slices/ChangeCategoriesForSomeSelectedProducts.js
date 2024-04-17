import { createSlice } from "@reduxjs/toolkit";

const initialValueState = {
	modalIsOpen: false,
};

const ChangeCategoriesForSomeSelectedProductsSlice = createSlice({
	name: "ChangeCategoriesForSomeSelectedProducts",
	initialState: initialValueState,
	reducers: {
		openModal: (state, action) => {
			state.modalIsOpen = true;
		},
		closeModal: (state) => {
			state.modalIsOpen = false;
		},
	},
});

export const { openModal, closeModal } =
	ChangeCategoriesForSomeSelectedProductsSlice.actions;
export default ChangeCategoriesForSomeSelectedProductsSlice.reducer;
