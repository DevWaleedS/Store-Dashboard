import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isVerifyAfterMainOpen: false,
};
// slices
const VerifyStoreAlertAfterMainModalSlice = createSlice({
	name: 'VerifyAfterMainModalSlice',
	initialState: initialValueState,
	reducers: {
		openVerifyAfterMainModal: (state, action) => {
			state.isVerifyAfterMainOpen = true;
		},
		closeVerifyAfterMainModal: (state, action) => {
			state.isVerifyAfterMainOpen = false;
		},
	},
});

export const { openVerifyAfterMainModal, closeVerifyAfterMainModal } = VerifyStoreAlertAfterMainModalSlice.actions;
export default VerifyStoreAlertAfterMainModalSlice.reducer;
