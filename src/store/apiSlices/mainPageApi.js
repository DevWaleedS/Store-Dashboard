import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	// Use the custom hook to get the token
	const storeToken = localStorage.getItem("storeToken");

	if (storeToken) {
		headers.set("Authorization", `Bearer ${storeToken}`);
	}

	return headers;
};

export const mainPageApi = createApi({
	reducerPath: "mainPageApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getMainPageData: builder.query({ query: () => "index" }),
	}),
});

export const { useGetMainPageDataQuery } = mainPageApi;
