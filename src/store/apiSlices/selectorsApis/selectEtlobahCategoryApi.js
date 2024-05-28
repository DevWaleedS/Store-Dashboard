import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectEtlobahCategoryApi = createApi({
	reducerPath: "selectEtlobahCategoryApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getEtlobhaCategories: builder.query({
			query: () => ({ url: "/etlobahCategory" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),
	}),
});

export const { useGetEtlobhaCategoriesQuery } = selectEtlobahCategoryApi;
