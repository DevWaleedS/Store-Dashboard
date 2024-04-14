import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching categories
export const ProductsThunk = createAsyncThunk(
	"Products/ProductsThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `product?page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

// ImportedProducts
export const ImportedProductsThunk = createAsyncThunk(
	"Products/ImportedProductsThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `importedProducts?page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

//Delete Thunk
export const DeleteAllDeleteProductsThunk = createAsyncThunk(
	"Products/DeleteAllDeleteProductsThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;

		const queryParams = arg.selected.map((id) => `id[]=${id}`).join("&");
		try {
			let res = await axios.get(`productdeleteall?${queryParams}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);
export const DeleteProductThunk = createAsyncThunk(
	"Products/DeleteProductThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`productdeleteall?id[]=${arg.id}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

// ChangeCategoriesStatusThunk
export const ChangeProductStatusThunk = createAsyncThunk(
	"Products/ChangeProductStatusThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`productchangeSatusall?id[]=${arg.id}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

export const ChangeAllProductsStatusThunk = createAsyncThunk(
	"Products/ChangeAllProductsStatusThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;

		const queryParams = arg.selected.map((id) => `id[]=${id}`).join("&");
		try {
			let res = await axios.get(`productchangeSatusall?${queryParams}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

// change Special Status
export const ChangeSpecialStatusThunk = createAsyncThunk(
	"Products/ChangeSpecialStatusThunk",

	async (arg, ThunkApi) => {
		let { rejectWithValue } = ThunkApi;
		try {
			let res = await axios.get(`specialStatus/${arg}`);

			return res.data;
		} catch (error) {
			return rejectWithValue(error.response.data.data);
		}
	}
);

//handle search in items
export const searchProductThunk = createAsyncThunk(
	"Products/searchProductThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `searchProduct?query=${arg.query}&page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
export const searchImportProductThunk = createAsyncThunk(
	"Products/searchImportProductThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `searchImportProduct?query=${arg.query}&page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

//filterCategoriesThunk
export const filterProductsThunk = createAsyncThunk(
	"Products/filterProductsThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `category?category_id=${arg.id}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
