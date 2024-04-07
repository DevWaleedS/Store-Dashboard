import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching categories
export const TechnicalSupportThunk = createAsyncThunk(
	"TechnicalSupport/TechnicalSupportThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `technicalSupport?page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

//Delete Thunk
export const DeleteAllDeleteTechnicalSupportThunk = createAsyncThunk(
	"TechnicalSupport/DeleteAllDeleteTechnicalSupportThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;

		const queryParams = arg.selected.map((id) => `id[]=${id}`).join("&");
		try {
			let res = await axios.get(
				`technicalSupportStoredeleteall?${queryParams}`
			);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);
export const DeleteTechnicalSupportThunk = createAsyncThunk(
	"TechnicalSupport/DeleteTechnicalSupportThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(
				`technicalSupportStoredeleteall?id[]=${arg.id}`
			);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

export const ChangeTechnicalSupportThunk = createAsyncThunk(
	"TechnicalSupport/ChangeTechnicalSupportThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`changeTechnicalSupportStatus/${arg.id}`);

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
