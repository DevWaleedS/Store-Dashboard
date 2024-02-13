import { createSlice } from "@reduxjs/toolkit";

const initialValueState = {
	isEditBankAccountModalOpen: false,
};
// slices
const EditBankAccountModal = createSlice({
	name: "EditBankAccountModal",
	initialState: initialValueState,
	reducers: {
		openEditBankAccountModal: (state, action) => {
			state.isEditBankAccountModalOpen = true;
		},
		closeEditBankAccountModal: (state, action) => {
			state.isEditBankAccountModalOpen = false;
		},
	},
});

export const { openEditBankAccountModal, closeEditBankAccountModal } =
	EditBankAccountModal.actions;
export default EditBankAccountModal.reducer;
