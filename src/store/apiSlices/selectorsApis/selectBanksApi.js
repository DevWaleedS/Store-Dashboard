import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

export const selectBanksApi = createApi({
	reducerPath: "selectBanksApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/selector",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getBanks: builder.query({
			query: () => "banks",

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.Banks,
		}),
	}),
});

export const { useGetBanksQuery } = selectBanksApi;
