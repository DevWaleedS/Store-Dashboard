import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const categoriesApi = createApi({
	reducerPath: "categoriesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	tagTypes: ["Categories"],
	endpoints: (builder) => ({
		// get categories
		getCategoriesData: builder.query({
			query: (arg) => ({
				url: `category?page=${arg.page}&number=${arg.number}`,
			}),
			providesTags: ["Categories"],
		}),

		// delete category
		deleteCategory: builder.mutation({
			query: ({ categoryId }) => ({
				url: `categoryStoredeleteall?id[]=${categoryId}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),

		// delete all categories
		deleteAllCategories: builder.mutation({
			query: ({ selected }) => ({
				url: `categoryStoredeleteall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),

		// change category status
		changeCategoryStatus: builder.mutation({
			query: ({ categoryId }) => ({
				url: `categoryStorechangeSatusall?id[]=${categoryId}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),

		// change status for all categories
		changeAllCategoriesStatus: builder.mutation({
			query: ({ selected }) => ({
				url: `categoryStorechangeSatusall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Categories"],
		}),

		// search in store categories
		searchInStoreCategories: builder.mutation({
			query: (arg) => ({
				url: `searchCategory?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// search in etlbha categories
		searchInEtlbohaCategories: builder.mutation({
			query: (arg) => ({
				url: `searchCategoryEtlobha?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// filter in categories by category id
		filterCategories: builder.mutation({
			query: (categoryId) => ({
				url: `category?category_id=${categoryId}`,
				method: "GET",
			}),
		}),

		// add new category
		addNewCategory: builder.mutation({
			query: ({ body }) => ({
				url: `category`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["Categories"],
		}),

		// get category by id
		getCategoryById: builder.query({
			query: (id) => ({ url: `category/${id}` }),
			transformResponse: (response) => response.data,
			providesTags: ["Categories"],
		}),

		// edit category by id
		editCategoryById: builder.mutation({
			query: ({ id, body }) => ({
				url: `category/${id}`,
				method: "POST",
				data: body,
			}),
			invalidatesTags: ["Categories"],
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
	useAddNewCategoryMutation,
	useGetCategoryByIdQuery,
	useEditCategoryByIdMutation,
} = categoriesApi;
