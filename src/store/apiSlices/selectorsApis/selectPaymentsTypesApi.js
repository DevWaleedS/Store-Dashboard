import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

export const selectPaymentsTypesApi = createApi({
	reducerPath: "selectPaymentsTypesApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getPaymentsTypes: builder.query({
			query: () => "selector/payment_types",

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.payment_types,
		}),
	}),
});

export const { useGetPaymentsTypesQuery } = selectPaymentsTypesApi;
