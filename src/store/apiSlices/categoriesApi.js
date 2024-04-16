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

	headers.set("Content-Type", "application/json");

	return headers;
};

// Create API slice
export const categoriesApi = createApi({
	reducerPath: "categoriesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Categories"],
	endpoints: (builder) => ({
		getCategoriesData: builder.query({
			query: (arg) => `category?page=${arg.page}&number=${arg.number}`,
			providesTags: ["Categories"],
		}),
		deleteCategory: builder.mutation({
			query: ({ categoryId }) => ({
				url: `categoryStoredeleteall?id[]=${categoryId}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),
		deleteAllCategories: builder.mutation({
			query: ({ selected }) => ({
				url: `categoryStoredeleteall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),
		changeCategoryStatus: builder.mutation({
			query: ({ categoryId }) => ({
				url: `categoryStorechangeSatusall?id[]=${categoryId}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),
		changeAllCategoriesStatus: builder.mutation({
			query: ({ selected }) => ({
				url: `categoryStorechangeSatusall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),
		searchInStoreCategories: builder.mutation({
			query: (arg) => ({
				url: `searchCategory?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
			providesTags: ["Categories"],
		}),
		searchInEtlbohaCategories: builder.mutation({
			query: (arg) => ({
				url: `searchCategoryEtlobha?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
			providesTags: ["Categories"],
		}),
		filterCategories: builder.mutation({
			query: ({ categoryId }) => ({
				url: `category?category_id=${categoryId}`,
				method: "GET",
			}),
			providesTags: ["Categories"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetCategoriesDataQuery,
	useDeleteCategoryMutation,
	useDeleteAllCategoriesMutation,
	useChangeCategoryStatusMutation,
	useChangeAllCategoriesStatusMutation,
	useSearchInStoreCategoriesMutation,
	useSearchInEtlbohaCategoriesMutation,
	useFilterCategoriesMutation,
} = categoriesApi;
