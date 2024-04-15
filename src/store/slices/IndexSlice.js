import { createSlice } from "@reduxjs/toolkit";
import { GetIndexThunk } from "../Thunk/IndexThunk";

const initialState = {
	loading: false,
	indexData: [],

	error: "",
};

const IndexSlice = createSlice({
	name: "Index",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Get Index Thunk
			.addCase(GetIndexThunk.pending, (state) => {
				state.loading = true;
			})
			.addCase(GetIndexThunk.fulfilled, (state, action) => {
				state.loading = false;
				state.indexData = action.payload.data;
			})
			.addCase(GetIndexThunk.rejected, (state, action) => {
				state.loading = false;
				state.error = action.error.message;
			});
	},
});

export default IndexSlice.reducer;
