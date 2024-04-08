import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching categories
export const CategoriesThunk = createAsyncThunk(
	"Categories/CategoriesThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `category?page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// New thunk for adding a new category
export const addCategoryThunk = createAsyncThunk(
	"Categories/addCategoryThunk",
	async (categoryData, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			// Adjust this URL according to your API endpoint for adding categories
			const url = `category`;
			const response = await axios.post(url, categoryData);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

//Delete Thunk
export const DeleteAllCategoriesThunk = createAsyncThunk(
	"Categories/DeleteAllCategoriesThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;

		const queryParams = arg.selected.map((id) => `id[]=${id}`).join("&");
		try {
			let res = await axios.get(`categoryStoredeleteall?${queryParams}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);
export const DeleteCategoriesThunk = createAsyncThunk(
	"Categories/DeleteCategoriesThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`categoryStoredeleteall?id[]=${arg.id}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

// ChangeCategoriesStatusThunk
export const ChangeCategoriesStatusThunk = createAsyncThunk(
	"Categories/ChangeCategoriesStatusThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`categoryStorechangeSatusall?id[]=${arg.id}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

export const ChangeAllCategoriesStatusThunk = createAsyncThunk(
	"Categories/ChangeAllCategoriesStatusThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;

		const queryParams = arg.selected.map((id) => `id[]=${id}`).join("&");
		try {
			let res = await axios.get(`categoryStorechangeSatusall?${queryParams}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

//handle search in items
export const searchCategoryThunk = createAsyncThunk(
	"Categories/searchCategoryThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `searchCategory?query=${arg.query}&page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
export const searchCategoryEtlobhaThunk = createAsyncThunk(
	"Categories/searchCategoryEtlobhaThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `searchCategoryEtlobha?query=${arg.query}&page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
