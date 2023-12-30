import { createSlice } from "@reduxjs/toolkit";

const initialValueState = {
	isProductOptionOpen: false,
};
// slices
const ProductOptionModal = createSlice({
	name: "ProductOptionModal",
	initialState: initialValueState,
	reducers: {
		openProductOptionModal: (state, action) => {
			state.isProductOptionOpen = true;
		},
		closeProductOptionModal: (state, action) => {
			state.isProductOptionOpen = false;
		},
	},
});

export const { openProductOptionModal, closeProductOptionModal } =
	ProductOptionModal.actions;
export default ProductOptionModal.reducer;
