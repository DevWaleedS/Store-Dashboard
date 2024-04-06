import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching categories
export const SouqOtlobhaThunk = createAsyncThunk(
	"SouqOtlobhaThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `etlobhaShow?page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

export const FilterProductsByCategoriesThunk = createAsyncThunk(
	"FilterProductsByCategoriesThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		const subCategoryParams = arg.subCategory
			.map((id, idx) => `subcategory_id[${idx}]=${id}`)
			.join("&");

		try {
			const url = `etlobhaShow?category_id=${arg.category_id}&${subCategoryParams}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// https://backend.atlbha.com/api/Store/etlobhaShow?category_id=332&subcategory_id[0]=335&subcategory_id[1]=334
