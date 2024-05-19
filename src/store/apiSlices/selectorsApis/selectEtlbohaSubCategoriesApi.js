import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

export const selectEtlbohaSubCategoriesApi = createApi({
	reducerPath: "selectEtlbohaSubCategoriesApi",

	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	endpoints: (builder) => ({
		getEtlobhaSubCategoriesCategories: builder.query({
			query: (mainCategoriesIds) =>
				`selector/subcategories?${mainCategoriesIds}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
		}),
	}),
});

export const { useGetEtlobhaSubCategoriesCategoriesQuery } =
	selectEtlbohaSubCategoriesApi;
