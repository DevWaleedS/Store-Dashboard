import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const logOutApi = createApi({
	reducerPath: "logOutApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
		prepareHeaders,
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
