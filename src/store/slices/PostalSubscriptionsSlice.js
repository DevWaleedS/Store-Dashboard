import { createSlice } from "@reduxjs/toolkit";
import { PostalSubscriptionsThunk } from "../Thunk/PostalSubscriptionsThunk";

const initialState = {
	loading: false,
	reload: false,
	PostalSubscriptionsData: [],
	currentPage: 1,
	pageCount: 1,
	error: "",
};

const PostalSubscriptionsSlice = createSlice({
	name: "PostalSubscriptions",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Empty Carts
			.addCase(PostalSubscriptionsThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(PostalSubscriptionsThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.PostalSubscriptionsData = action.payload.data;
			})
			.addCase(PostalSubscriptionsThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default PostalSubscriptionsSlice.reducer;
