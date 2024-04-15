import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching categories
export const GetIndexThunk = createAsyncThunk(
	"Index/GetIndexThunk",
	async (ـ, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `index`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
