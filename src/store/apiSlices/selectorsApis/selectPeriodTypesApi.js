import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectPeriodTypesApi = createApi({
	reducerPath: "selectPeriodTypesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/selector/",
	}),

	endpoints: (builder) => ({
		getPeriodTypes: builder.query({
			query: () => ({ url: "periodTypes" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.periodTypes,
		}),
	}),
});

export const { useGetPeriodTypesQuery } = selectPeriodTypesApi;
