import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isVerifyStoreAlertOpen: false,
};
// slices
const VerifyStoreAlertModalSlice = createSlice({
	name: 'VerifyModalSlice',
	initialState: initialValueState,
	reducers: {
		openVerifyStoreAlertModal: (state, action) => {
			state.isVerifyStoreAlertOpen = true;
		},
		closeVerifyStoreAlertModal: (state, action) => {
			state.isVerifyStoreAlertOpen = false;
		},
	},
});

export const { openVerifyStoreAlertModal, closeVerifyStoreAlertModal } = VerifyStoreAlertModalSlice.actions;
export default VerifyStoreAlertModalSlice.reducer;
