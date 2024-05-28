import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectCitiesApi = createApi({
	reducerPath: "selectCitiesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getCities: builder.query({
			query: () => ({ url: "/cities" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.cities,
		}),
	}),
});

export const { useGetCitiesQuery } = selectCitiesApi;
