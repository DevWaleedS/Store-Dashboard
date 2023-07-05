import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpen: false,
};
// slices
const EditProductPageModalSlice = createSlice({
	name: 'EditProductPageModal',
	initialState: initialValueState,
	reducers: {
		openEditProductPageModal: (state, action) => {
			state.isOpen = true;
		},
		closeEditProductPageModal: (state, action) => {
			state.isOpen = false;
		},
	},
});

export const { openEditProductPageModal, closeEditProductPageModal } = EditProductPageModalSlice.actions;
export default EditProductPageModalSlice.reducer;
