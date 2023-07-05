import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export let categoriesThunk = createAsyncThunk('categories/categoriesDataThunk', async (_, thunkAPI) => {
	let { rejectWithValue } = thunkAPI;
	const token = localStorage.getItem('token');
	try {
		const response = await axios.get('https://backend.atlbha.com/api/Store/category', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${token}`,
			},
		});

		return response.data;
	} catch (error) {
		return rejectWithValue(error.message);
	}
});
