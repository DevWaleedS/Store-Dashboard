import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpen: false,
};
// slices
const DelegateRequestAlert = createSlice({
	name: 'DelegateRequestAlert',
	initialState: initialValueState,
	reducers: {
		openDelegateRequestAlert: (state, action) => {
			state.isOpen = true;
		},
		closeDelegateRequestAlert: (state, action) => {
			state.isOpen = false;
		},
	},
});

export const { openDelegateRequestAlert, closeDelegateRequestAlert } = DelegateRequestAlert.actions;
export default DelegateRequestAlert.reducer;
