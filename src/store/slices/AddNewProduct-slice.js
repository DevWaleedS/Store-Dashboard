import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpen: false,
};
// slices
const AddNewProductSlice = createSlice({
	name: 'AddNewProductPage',
	initialState: initialValueState,
	reducers: {
		openAddNewProductModal: (state, action) => {
			state.isOpen = true;
		},
		closeAddNewProductModal: (state, action) => {
			state.isOpen = false;
		},
	},
});

export const { openAddNewProductModal, closeAddNewProductModal } = AddNewProductSlice.actions;
export default AddNewProductSlice.reducer;
