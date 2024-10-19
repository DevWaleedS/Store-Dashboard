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
			query: (is_service) => ({
				url: is_service
					? `/mainCategories?is_service=${is_service}`
					: `/mainCategories`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),

		// get SubCategories
		getSubCategoriesByCategoriesIds: builder.query({
			query: ({ categoriesIds }) => ({
				url: `/subcategories?${categoriesIds}`,
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
