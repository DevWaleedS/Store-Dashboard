import { createSlice } from "@reduxjs/toolkit";
import { EmptyCartsThunk, searchCartNameThunk } from "../Thunk/EmptyCartsThunk";

const initialState = {
	loading: false,
	reload: false,
	EmptyCartsData: [],
	currentPage: 1,
	pageCount: 1,
	error: "",
};

const EmptyCartsSlice = createSlice({
	name: "EmptyCarts",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Empty Carts
			.addCase(EmptyCartsThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(EmptyCartsThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.EmptyCartsData = action.payload.data?.carts;
			})
			.addCase(EmptyCartsThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})
			// searchOrderThunk
			.addCase(searchCartNameThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(searchCartNameThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.EmptyCartsData = action.payload.data;
			})
			.addCase(searchCartNameThunk.rejected, (state, action) => {
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

export default EmptyCartsSlice.reducer;
