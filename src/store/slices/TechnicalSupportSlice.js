import { createSlice } from "@reduxjs/toolkit";
import { TechnicalSupportThunk } from "../Thunk/TechnicalSupportThunk";

const initialState = {
	loading: false,
	reload: false,
	TechnicalSupportData: [],
	currentPage: 1,
	pageCount: 1,
	error: "",
};

const TechnicalSupportSlice = createSlice({
	name: "TechnicalSupport",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Empty Carts
			.addCase(TechnicalSupportThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(TechnicalSupportThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.TechnicalSupportData = action.payload.data;
			})
			.addCase(TechnicalSupportThunk.rejected, (state, action) => {
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

export default TechnicalSupportSlice.reducer;
