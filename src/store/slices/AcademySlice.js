import { createSlice } from "@reduxjs/toolkit";
import { CoursesThunk, ExplainVideosThunk } from "../Thunk/AcademyThunk";

const initialState = {
	loading: false,
	reload: false,

	CoursesData: [],
	ExplainVideosData: [],

	currentPage: 1,
	pageCount: 1,
	error: "",
};

const AcademySlice = createSlice({
	name: "Academy",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// to get all Empty Carts
			.addCase(CoursesThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(CoursesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.CoursesData = action.payload.data;
			})
			.addCase(CoursesThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})

			// to get all Empty ExplainVideos
			.addCase(ExplainVideosThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(ExplainVideosThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.ExplainVideosData = action.payload.data;
			})
			.addCase(ExplainVideosThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default AcademySlice.reducer;
