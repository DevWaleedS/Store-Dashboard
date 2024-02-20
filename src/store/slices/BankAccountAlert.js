import { createSlice } from "@reduxjs/toolkit";

const initialValueState = {
	isMessageAlertOpen: false,
	messageAlert: "",
};

// slices
const BankAccountAlert = createSlice({
	name: "BankAccountAlert",
	initialState: initialValueState,
	reducers: {
		openMessageAlert: (state, action) => {
			state.isMessageAlertOpen = true;
			state.messageAlert = action?.payload;
		},
		closeMessageAlert: (state, action) => {
			state.isMessageAlertOpen = false;
		},
	},
});

export const { openMessageAlert, closeMessageAlert } = BankAccountAlert.actions;
export default BankAccountAlert.reducer;
