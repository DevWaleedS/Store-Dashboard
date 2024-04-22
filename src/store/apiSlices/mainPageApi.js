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
