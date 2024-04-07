import { createSlice } from "@reduxjs/toolkit";
import { NotificationsThunk } from "../Thunk/NotificationsThunk";

const initialState = {
	loading: false,
	reload: false,
	NotificationsData: [],
	currentPage: 1,
	pageCount: 1,
	error: "",
};

const NotificationsSlice = createSlice({
	name: "Notifications",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Notifications
			.addCase(NotificationsThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(NotificationsThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.NotificationsData = action.payload.data?.notifications;
			})
			.addCase(NotificationsThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default NotificationsSlice.reducer;
