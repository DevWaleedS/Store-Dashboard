import { createSlice } from "@reduxjs/toolkit";
import { OrdersThunk } from "../Thunk/OrdersThunk";

const initialState = {
	loading: false,
	reload: false,
	ordersData: [],
	currentPage: 1,
	pageCount: 1,
	error: "",
};

const OrdersSlice = createSlice({
	name: "Orders",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all orders
			.addCase(OrdersThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(OrdersThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.ordersData = action.payload.data;
			})
			.addCase(OrdersThunk.rejected, (state, action) => {
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

export default OrdersSlice.reducer;
