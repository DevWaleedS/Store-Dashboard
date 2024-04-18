import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create API slice
export const loginApi = createApi({
	reducerPath: "loginApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// create login endpoint
		login: builder.mutation({
			query: (credentials) => ({
				url: `loginapi`,
				method: "POST",
				body: credentials,
			}),
		}),
	}),
});

// Export endpoints and hooks
export const { useLoginMutation } = loginApi;
