import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectCountriesApi = createApi({
	reducerPath: "selectCountriesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getCountries: builder.query({
			query: () => ({ url: "/countries" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.countries,
		}),
	}),
});

export const { useGetCountriesQuery } = selectCountriesApi;
