import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

export const requestDelegateApi = createApi({
	reducerPath: "requestDelegateApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getDelegateByCityId: builder.query({
			query: (arg) =>
				`marketerRequest?id=${arg?.cityId}&page={arg?.page}&number=${arg.number}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),
	}),
});

export const { useGetDelegateByCityIdQuery } = requestDelegateApi;
