import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const StoreVerificationThunk = createAsyncThunk(
	"data/StoreVerification",
	async (accessToken, thunkAPI) => {
		const { rejectWithValue } = thunkAPI;
		try {
			const response = await axios.get(
				"https://backend.atlbha.com/api/Store/verification_show",
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${accessToken}`,
					},
				}
			);

			return response.data;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
