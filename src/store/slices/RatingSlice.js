import { createSlice } from "@reduxjs/toolkit";
import { RatingThunk } from "../Thunk/RatingThunk";

const initialState = {
	loading: false,
	reload: false,
	RatingData: [],

	currentPage: 1,
	pageCount: 1,
	error: "",
};

const RatingSlice = createSlice({
	name: "Rating",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Empty Carts
			.addCase(RatingThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(RatingThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.RatingData = action.payload.data;
			})
			.addCase(RatingThunk.rejected, (state, action) => {
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

export default RatingSlice.reducer;
