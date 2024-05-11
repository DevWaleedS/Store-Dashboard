import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token =
		document.cookie
			?.split("; ")
			?.find((cookie) => cookie.startsWith("store_token="))
			?.split("=")[1] || null;

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

export const selectShippingCompaniesApi = createApi({
	reducerPath: "selectShippingCompaniesApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getShippingCompanies: builder.query({
			query: () => "shippingMethodsImport",

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.shippingtypes,
		}),
	}),
});

export const { useGetShippingCompaniesQuery } = selectShippingCompaniesApi;
