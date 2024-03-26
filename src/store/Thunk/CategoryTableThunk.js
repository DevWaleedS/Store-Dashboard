import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const categoriesThunk = createAsyncThunk(
	"Categories/categoriesDataThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `category?page=${arg.page}&number=${arg.number}`;
			let response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
