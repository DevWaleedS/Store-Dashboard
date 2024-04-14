import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// this thunk for fetching Orders
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

// filterOrdersByStatusThunk
export const filterOrdersByStatusThunk = createAsyncThunk(
	"Orders/filterOrdersByStatusThunk",
	async (arg, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;

		try {
			const url = `orders?page=${arg.page}&number=${arg.number}&order_status=${arg.status}`;
			const response = await axios.get(url);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
