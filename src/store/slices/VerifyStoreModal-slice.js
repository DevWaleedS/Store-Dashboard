import { createSlice } from "@reduxjs/toolkit";
import { StoreVerificationThunk } from "../Thunk/storeVerificationThunk";

const initialValueState = {
	isOpenVerifyModal: false,
	verificationStoreStatus: "",
};

// Slices
const VerifyModalSlice = createSlice({
	name: "VerifyModalSlice",
	initialState: initialValueState,
	reducers: {
		openVerifyModal: (state, action) => {
			state.isOpenVerifyModal = true;
		},
		closeVerifyModal: (state, action) => {
			state.isOpenVerifyModal = false;
		},
	},

	extraReducers: (builder) => {
		builder
			.addCase(StoreVerificationThunk.pending, (state) => {
				// handle pending state if needed
			})
			.addCase(StoreVerificationThunk.fulfilled, (state, action) => {
				state.verificationStoreStatus = action.payload?.data?.stores?.map(
					(store) => store?.verification_status
				)[0];
			})
			.addCase(StoreVerificationThunk.rejected, (state, action) => {
				// handle error state if needed
			});
	},
});

export const { openVerifyModal, closeVerifyModal } = VerifyModalSlice.actions;
export default VerifyModalSlice.reducer;
