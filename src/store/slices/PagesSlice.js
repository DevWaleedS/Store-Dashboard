import { createSlice } from "@reduxjs/toolkit";
import { PagesThunk, searchPageNameThunk } from "../Thunk/PagesThunk";

const initialState = {
	loading: false,
	reload: false,
	PagesData: [],
	currentPage: 1,
	pageCount: 1,
	error: "",
};

const PagesSlice = createSlice({
	name: "Pages",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Empty Carts
			.addCase(PagesThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(PagesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.PagesData = action.payload.data;
			})
			.addCase(PagesThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})

			// searchPageNameThunk
			.addCase(searchPageNameThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(searchPageNameThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.PagesData = action.payload.data;
			})
			.addCase(searchPageNameThunk.rejected, (state, action) => {
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

export default PagesSlice.reducer;
