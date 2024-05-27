import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectEtlbohaSubCategoriesApi = createApi({
	reducerPath: "selectEtlbohaSubCategoriesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getEtlobhaSubCategoriesCategories: builder.query({
			query: (mainCategoriesIds) => ({
				url: `/subcategories?${mainCategoriesIds}`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),
	}),
});

export const { useGetEtlobhaSubCategoriesCategoriesQuery } =
	selectEtlbohaSubCategoriesApi;
