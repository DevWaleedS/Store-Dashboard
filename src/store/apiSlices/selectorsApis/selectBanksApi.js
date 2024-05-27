import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectBanksApi = createApi({
	reducerPath: "selectBanksApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/selector/",
	}),

	endpoints: (builder) => ({
		getBanks: builder.query({
			query: () => ({ url: "banks" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.Banks,
		}),
	}),
});

export const { useGetBanksQuery } = selectBanksApi;
