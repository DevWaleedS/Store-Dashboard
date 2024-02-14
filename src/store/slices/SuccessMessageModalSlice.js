import { createSlice } from "@reduxjs/toolkit";
// import table images

const initialValueState = {
	isOpenMessageOpen: false,
};
// slices
const SuccessMessageModalSlice = createSlice({
	name: "ImportProductHintModal",
	initialState: initialValueState,
	reducers: {
		openMessage: (state, action) => {
			state.isOpenMessageOpen = true;
		},
		closeMessage: (state, action) => {
			state.isOpenMessageOpen = false;
		},
	},
});

export const { openMessage, closeMessage } = SuccessMessageModalSlice.actions;
export default SuccessMessageModalSlice.reducer;
