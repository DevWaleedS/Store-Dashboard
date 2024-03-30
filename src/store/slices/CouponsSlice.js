import { createSlice } from "@reduxjs/toolkit";
import { CouponsThunk } from "../Thunk/CouponsThunk";

const initialState = {
	loading: false,
	reload: false,
	CouponsData: [],
	currentPage: 1,
	pageCount: 1,
	error: "",
};

const CouponsSlice = createSlice({
	name: "Coupons",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Coupon
			.addCase(CouponsThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(CouponsThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.CouponsData = action.payload.data;
			})
			.addCase(CouponsThunk.rejected, (state, action) => {
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

export default CouponsSlice.reducer;
