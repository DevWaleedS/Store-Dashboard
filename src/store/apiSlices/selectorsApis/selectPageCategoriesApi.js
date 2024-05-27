import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectPageCategoriesApi = createApi({
	reducerPath: "selectPageCategoriesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getPagesCategories: builder.query({
			query: () => ({ url: "/page-categories" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.pagesCategory,
		}),
	}),
});

export const { useGetPagesCategoriesQuery } = selectPageCategoriesApi;
