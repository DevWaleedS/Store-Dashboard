import { createSlice } from "@reduxjs/toolkit";
import { ProductsThunk } from "../Thunk/ProductsThunk";

const initialState = {
	isProductOptionOpen: false, // to handle open product options
	loading: false,
	reload: false,
	Products: [],
	currentPage: 1,
	etlobhaCurrentPage: 1,
	etlobhaPageCount: 2,
	pageCount: 1,
	error: "",
	storeProducts: [],
	SouqOtlbhaProducts: [],
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

				state.currentPage = action.payload.data.current_page;
				state.etlobhaCurrentPage = action.payload.data.etlobha_current_page;
				state.etlobhaPageCount = action.payload.data.etlobha_page_count;
				state.pageCount = action.payload.data.page_count;
				state.Products = action.payload.data;
				state.storeProducts = action?.payload?.data.categories;
				state.SouqOtlbhaProducts = action?.payload?.data?.etlobha_categories;
			})
			.addCase(ProductsThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			});

		//add new Product
		// .addCase(addCategoryThunk.pending, (state, action) => {
		// 	state.reload = true;
		// 	state.loading = true;
		// })
		// .addCase(addCategoryThunk.fulfilled, (state, action) => {
		// 	state.reload = false;
		// 	state.loading = false;
		// })
		// .addCase(addCategoryThunk.rejected, (state, action) => {
		// 	state.error = action.payload.message;
		// });
	},
});

export const { openProductOptionModal, closeProductOptionModal } =
	ProductsSlice.actions;

export default ProductsSlice.reducer;
