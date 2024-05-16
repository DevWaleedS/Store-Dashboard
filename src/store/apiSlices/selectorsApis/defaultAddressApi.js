import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	// Set Content-Type header for JSON requests
	headers.set("Content-Type", "application/json");

	return headers;
};

// Create API slice
export const defaultAddressApi = createApi({
	reducerPath: "defaultAddressApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		// get default AddressApi endpoint..
		getDefaultAddress: builder.query({
			query: () => `show_default_address`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.orderAddress,
		}),
	}),
});

// Export endpoints and hooks
export const { useGetDefaultAddressQuery } = defaultAddressApi;
