import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token =
		document.cookie
			?.split("; ")
			?.find((cookie) => cookie.startsWith("store_token="))
			?.split("=")[1] || null;

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

export const selectCategoriesApi = createApi({
	reducerPath: "selectCategoriesApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getCategories: builder.query({
			query: () => "selector/mainCategories",

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),

		// get SubCategories
		getSubCategoriesByCategoriesIds: builder.query({
			query: ({ categoriesIds }) => `selector/subcategories?${categoriesIds}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),
	}),
});

export const {
	useGetCategoriesQuery,
	useGetSubCategoriesByCategoriesIdsQuery,
} = selectCategoriesApi;
