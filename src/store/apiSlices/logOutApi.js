import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create API slice
export const logOutApi = createApi({
	reducerPath: "logOutApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// create login endpoint
		logOut: builder.mutation({
			query: () => ({
				url: `logout`,
				method: "get",
			}),
		}),
	}),
});

// Export endpoints and hooks
export const { useLogOutMutation } = logOutApi;
