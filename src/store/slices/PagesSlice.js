import { createSlice } from "@reduxjs/toolkit";
import {
	PagesThunk,
	filterPagesByStatusThunk,
	searchPageNameThunk,
} from "../Thunk/PagesThunk";

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
				state.PagesData = action.payload.data.pages;
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
				state.PagesData = action.payload.data.pages;
			})
			.addCase(searchPageNameThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})
			// filter Pages By Status Thunk
			.addCase(filterPagesByStatusThunk.pending, (state, action) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(filterPagesByStatusThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.PagesData = action.payload.data.pages;
			})
			.addCase(filterPagesByStatusThunk.rejected, (state, action) => {
				state.error = action.payload.message;
			});
	},
});

export default PagesSlice.reducer;
