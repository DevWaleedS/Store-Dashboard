import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching categories
export const RatingThunk = createAsyncThunk(
	"Rating/RatingThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `comment?page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const ChangeCommentActivationThunk = createAsyncThunk(
	"Rating/ChangeCommentActivationThunk",

	async (_, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`commentActivation`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

export const ChangeCommentStatusThunk = createAsyncThunk(
	"Rating/ChangeCommentStatusThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`changeCommentStatus/${arg.id}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

export const DeleteCommentThunk = createAsyncThunk(
	"Rating/DeleteCommentThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.delete(`comment/${arg.id}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

// New thunk for adding a new category
// export const addNewProductThunk = createAsyncThunk(
// 	"Categories/addNewProductThunk",
// 	async (categoryData, thunkAPI) => {
// 		const { rejectWithValue } = thunkAPI;

// 		try {
// 			// Adjust this URL according to your API endpoint for adding categories
// 			const url = `category`;
// 			const response = await axios.post(url, categoryData);

// 			return response.data;
// 		} catch (error) {
// 			console.log(error.message);
// 			return rejectWithValue(error.message);
// 		}
// 	}
// );
