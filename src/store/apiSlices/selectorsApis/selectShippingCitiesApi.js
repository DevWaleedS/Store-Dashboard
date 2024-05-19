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
export const selectShippingCitiesApi = createApi({
	reducerPath: "selectShippingCitiesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/selector/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		// get store Orders endpoint..
		getShippingCities: builder.query({
			query: (shippingId) => `shippingcities/${shippingId}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),
	}),
});

// Export endpoints and hooks
export const { useGetShippingCitiesQuery } = selectShippingCitiesApi;
