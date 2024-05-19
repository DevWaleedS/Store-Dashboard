import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const reportsApi = createApi({
	reducerPath: "reportsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Reports"],
	endpoints: (builder) => ({
		// get Maintenance mode data endpoint..
		getReportsByDate: builder.query({
			query: (arg) =>
				`reports?startDate=${arg.startDate}&endDate=${arg.endDate}`,

			providesTags: ["Reports"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),
	}),
});

// Export endpoints and hooks
export const { useGetReportsByDateQuery } = reportsApi;
