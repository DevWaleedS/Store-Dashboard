import { createSlice } from "@reduxjs/toolkit";

const initialValueState = {
	isAddBankAccountModalOpen: false,
};
// slices
const AddBankAccountModal = createSlice({
	name: "AddBankAccountModal",
	initialState: initialValueState,
	reducers: {
		openAddBankAccountModal: (state, action) => {
			state.isAddBankAccountModalOpen = true;
		},
		closeAddBankAccountModal: (state, action) => {
			state.isAddBankAccountModalOpen = false;
		},
	},
});

export const { openAddBankAccountModal, closeAddBankAccountModal } =
	AddBankAccountModal.actions;
export default AddBankAccountModal.reducer;
