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

// Create API slice
export const categoriesApi = createApi({
	reducerPath: "categoriesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Categories"],
	endpoints: (builder) => ({
		// get categories
		getCategoriesData: builder.query({
			query: (arg) => `category?page=${arg.page}&number=${arg.number}`,
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

		// search in  etlbha categories
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

		//add new category
		addNewCategory: builder.mutation({
			query: ({ body }) => {
				return {
					url: `category`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Categories"],
		}),

		// get category by id
		getCategoryById: builder.query({
			query: (id) => `category/${id}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["Categories"],
		}),
		// edit category by id
		editCategoryById: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `category/${id}`,
					method: "POST",
					body: body,
				};
			},
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
