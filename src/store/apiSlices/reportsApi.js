import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const reportsApi = createApi({
	reducerPath: "reportsApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Reports"],

	endpoints: (builder) => ({
		// get Maintenance mode data endpoint..
		getReportsByDate: builder.query({
			query: (arg) => ({
				url: `reports?startDate=${arg.startDate}&endDate=${arg.endDate}`,
			}),

			providesTags: ["Reports"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),
	}),
});

// Export endpoints and hooks
export const { useGetReportsByDateQuery } = reportsApi;
