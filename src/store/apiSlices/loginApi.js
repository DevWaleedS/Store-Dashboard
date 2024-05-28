import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const loginApi = createApi({
	reducerPath: "loginApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// create login endpoint
		login: builder.mutation({
			query: (credentials) => ({
				url: `loginapi`,
				method: "POST",
				data: credentials,
			}),
		}),
	}),
});

// Export endpoints and hooks
export const { useLoginMutation } = loginApi;
