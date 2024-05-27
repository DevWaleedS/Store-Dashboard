import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectShippingCompaniesApi = createApi({
	reducerPath: "selectShippingCompaniesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	endpoints: (builder) => ({
		getShippingCompanies: builder.query({
			query: () => ({ url: "shippingMethodsImport" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.shippingtypes,
		}),
	}),
});

export const { useGetShippingCompaniesQuery } = selectShippingCompaniesApi;
