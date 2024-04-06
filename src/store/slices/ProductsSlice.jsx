import { createSlice } from "@reduxjs/toolkit";
import {
	ChangeAllProductsStatusThunk,
	ChangeProductStatusThunk,
	ChangeSpecialStatusThunk,
	DeleteAllDeleteProductsThunk,
	DeleteProductThunk,
	ImportedProductsThunk,
	ProductsThunk,
} from "../Thunk/ProductsThunk";

const initialState = {
	isProductOptionOpen: false, // to handle open product options
	loading: false,
	reload: false,

	storeProducts: [],
	storeProductsPageCount: 1,
	storeProductsCurrentPage: 1,

	souqOtlbhaProducts: [],
	souqOtlbhaCurrentPage: 1,
	souqOtlbhaPageCount: 1,

	error: "",
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
	extraReducers: (builder) => {
		builder
			// to get all products
			.addCase(ProductsThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ProductsThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.storeProductsPageCount = action.payload.data.page_count;
				state.storeProductsCurrentPage = action.payload.data.current_page;
				state.storeProducts = action?.payload?.data.products;
			})
			.addCase(ProductsThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})

			//ImportedProductsThunk
			.addCase(ImportedProductsThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ImportedProductsThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.souqOtlbhaPageCount = action.payload.data.page_count;
				state.souqOtlbhaCurrentPage = action.payload.data.current_page;
				state.souqOtlbhaProducts = action?.payload?.data.products;
			})
			.addCase(ImportedProductsThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			}) // DeleteProductThunk
			.addCase(DeleteProductThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(DeleteProductThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(DeleteProductThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			}) // DeleteAllDeleteProductsThunk
			.addCase(DeleteAllDeleteProductsThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(DeleteAllDeleteProductsThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(DeleteAllDeleteProductsThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			})

			//ChangeAllProductsStatusThunk
			.addCase(ChangeProductStatusThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ChangeProductStatusThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(ChangeProductStatusThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			})

			//ChangeAllProductsStatusThunk
			.addCase(ChangeAllProductsStatusThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ChangeAllProductsStatusThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(ChangeAllProductsStatusThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			})

			//ChangeSpecialStatusThunk
			.addCase(ChangeSpecialStatusThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ChangeSpecialStatusThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;
			})
			.addCase(ChangeSpecialStatusThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			});
	},
});

export const { openProductOptionModal, closeProductOptionModal } =
	ProductsSlice.actions;

export default ProductsSlice.reducer;
