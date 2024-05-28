import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	isProductOptionOpen: false,
};

const ProductsSlice = createSlice({
	name: "Products",
	initialState: initialState,
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
	ProductsSlice.actions;

export default ProductsSlice.reducer;
