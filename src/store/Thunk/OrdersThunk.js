import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching categories
export const OrdersThunk = createAsyncThunk(
	"Orders/OrdersThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `orders?page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);

//handle search in items
export const searchOrderThunk = createAsyncThunk(
	"Orders/searchOrderThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `searchOrder?query=${arg.query}&page=${arg.page}&number=${arg.number}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
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
