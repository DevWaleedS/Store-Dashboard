import { createSlice } from "@reduxjs/toolkit";
import {
	CoursesThunk,
	ExplainVideosThunk,
	explainVideoNameThunk,
	searchCourseNameThunk,
} from "../Thunk/AcademyThunk";

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
			// to get all CoursesData
			.addCase(CoursesThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(CoursesThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.CoursesData = action.payload.data.courses;
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
				state.ExplainVideosData = action.payload.data.explainvideos;
			})
			.addCase(ExplainVideosThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})

			// search Course Name Thunk
			.addCase(searchCourseNameThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(searchCourseNameThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.CoursesData = action.payload.data.courses;
			})
			.addCase(searchCourseNameThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			})

			// search ExplainVideosData Name Thunk
			.addCase(explainVideoNameThunk.pending, (state) => {
				state.reload = true;
				state.loading = true;
			})
			.addCase(explainVideoNameThunk.fulfilled, (state, action) => {
				state.reload = false;
				state.loading = false;

				state.currentPage = action.payload.data.current_page;
				state.pageCount = action.payload.data.page_count;
				state.ExplainVideosData = action.payload.data.explainvideos;
			})
			.addCase(explainVideoNameThunk.rejected, (state, action) => {
				state.reload = false;
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default AcademySlice.reducer;
