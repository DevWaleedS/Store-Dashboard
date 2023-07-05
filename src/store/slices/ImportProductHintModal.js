import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpenProductHintModal: false,
};
// slices
const ImportProductHintModal = createSlice({
	name: 'ImportProductHintModal',
	initialState: initialValueState,
	reducers: {
		openProductHintModal: (state, action) => {
			state.isOpenProductHintModal = true;
		},
		closeProductHintModal: (state, action) => {
			state.isOpenProductHintModal = false;
		},
	},
});

export const { openProductHintModal, closeProductHintModal } = ImportProductHintModal.actions;
export default ImportProductHintModal.reducer;
