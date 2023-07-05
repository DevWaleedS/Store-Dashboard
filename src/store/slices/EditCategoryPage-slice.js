import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpen: false,
};
// slices
const EditCategoryPageSlice = createSlice({
	name: 'EditCategoryPageModal',
	initialState: initialValueState,
	reducers: {
		openEditCategoryPageModal: (state, action) => {
			state.isOpen = true;
		},
		closeEditCategoryPageModal: (state, action) => {
			state.isOpen = false;
		},
	},
});

export const { openEditCategoryPageModal, closeEditCategoryPageModal } = EditCategoryPageSlice.actions;
export default EditCategoryPageSlice.reducer;
