import { createSlice } from "@reduxjs/toolkit";

const initialValueState = {
	isCommentOpen: false,
};
// slices
const BankAccStatusCommentModal = createSlice({
	name: "BankAccStatusCommentModal",
	initialState: initialValueState,
	reducers: {
		openCommentModal: (state, action) => {
			state.isCommentOpen = true;
		},
		closeCommentModal: (state, action) => {
			state.isCommentOpen = false;
		},
	},
});

export const { openCommentModal, closeCommentModal } =
	BankAccStatusCommentModal.actions;
export default BankAccStatusCommentModal.reducer;
