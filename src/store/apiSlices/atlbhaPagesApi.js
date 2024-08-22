import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API Slice
export const atlbhaPagesApi = createApi({
	reducerPath: "atlbhaPagesApi",
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	tagTypes: ["AtlbhaHomePage"],

	endpoints: (builder) => ({
		// get atlbha home page data endpoint...

		getAtlhaPagesData: builder.query({
			query: (arg) => ({ url: `index?page` }),

			transformResponse: (response, meta, arg) => response.data?.footer,
			providesTags: ["AtlbhaHomePage"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetAtlhaPagesDataQuery } = atlbhaPagesApi;
