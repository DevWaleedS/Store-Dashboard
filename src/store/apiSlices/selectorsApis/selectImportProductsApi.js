import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

export const selectImportProductsApi = createApi({
	reducerPath: "selectImportProductsApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getImportProducts: builder.query({
			query: () => "selector/productImportproduct",

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.products,
		}),
	}),
});

export const { useGetImportProductsQuery } = selectImportProductsApi;
