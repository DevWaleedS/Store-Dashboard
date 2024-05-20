import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	headers.set("Accept", `application/json`);

	return headers;
};

// Create API slice
export const getStoreTokenApi = createApi({
	reducerPath: "getStoreTokenApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		// get store token endpoint..
		storeToken: builder.query({
			query: () => `store_token`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response,
			providesTags: ["StoreToken"],
		}),
	}),
});

// Export endpoints and hooks
export const { useStoreTokenQuery } = getStoreTokenApi;
