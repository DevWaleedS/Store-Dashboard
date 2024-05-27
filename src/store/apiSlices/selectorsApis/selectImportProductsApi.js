import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectImportProductsApi = createApi({
	reducerPath: "selectImportProductsApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getImportProducts: builder.query({
			query: () => ({ url: "/productImportproduct" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.products,
		}),
	}),
});

export const { useGetImportProductsQuery } = selectImportProductsApi;
