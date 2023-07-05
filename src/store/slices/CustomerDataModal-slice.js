import { createSlice } from '@reduxjs/toolkit';
// import table images

const initialValueState = {
	isOpen: false,
};
// slices
const customerDataModalSlice = createSlice({
	name: 'customerDataModal',
	initialState: initialValueState,
	reducers: {
		openCustomerDataModal: (state, action) => {
			state.isOpen = true;
		},
		closeCustomerDataModal: (state, action) => {
			state.isOpen = false;
		},
	},
});

export const { openCustomerDataModal, closeCustomerDataModal } = customerDataModalSlice.actions;
export default customerDataModalSlice.reducer;
