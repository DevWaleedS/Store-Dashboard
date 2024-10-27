import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const categoriesApi = createApi({
	reducerPath: "categoriesApi",

	// Base URL
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	tagTypes: ["Categories", "SelectCategories"],

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
			invalidatesTags: ["Categories"],
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
			invalidatesTags: ["Categories", "SelectCategories"],
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
			invalidatesTags: ["Categories", "SelectCategories"],
		}),

		// Select Categories
		selectCategories: builder.query({
			query: (arg) => ({
				url: arg?.is_service
					? `selector/mainCategories?is_service=${arg?.is_service}`
					: `selector/mainCategories`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
			providesTags: ["SelectCategories"],
		}),

		// get SubCategories
		selectSubCategoriesByCategoriesIds: builder.query({
			query: ({ categoriesIds }) => ({
				url: `selector/subcategories?${categoriesIds}`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.categories,
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
	useSelectCategoriesQuery,
	useSelectSubCategoriesByCategoriesIdsQuery,
} = categoriesApi;
