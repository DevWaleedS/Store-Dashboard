import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectCategoriesApi = createApi({
	reducerPath: "selectCategoriesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => ({ url: "/mainCategories" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),

		// get SubCategories
		getSubCategoriesByCategoriesIds: builder.query({
			query: ({ categoriesIds }) => ({
				url: `selector/subcategories?${categoriesIds}`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),
	}),
});

export const {
	useGetCategoriesQuery,
	useGetSubCategoriesByCategoriesIdsQuery,
} = selectCategoriesApi;
