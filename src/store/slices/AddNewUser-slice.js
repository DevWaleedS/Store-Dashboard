import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpen: false,
};
// slices
const AddNewUserSlice = createSlice({
	name: 'EditProductPageModal',
	initialState: initialValueState,
	reducers: {
		openAddUserModal: (state, action) => {
			state.isOpen = true;
		},
		closeAddUserModal: (state, action) => {
			state.isOpen = false;
		},
	},
});

export const { openAddUserModal, closeAddUserModal } = AddNewUserSlice.actions;
export default AddNewUserSlice.reducer;
