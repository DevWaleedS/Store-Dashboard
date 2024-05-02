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
export const souqOtlobhaProductsApi = createApi({
	reducerPath: "souqOtlobhaProductsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["SouqOtlobhaProducts, CartMenuData"],
	endpoints: (builder) => ({
		// get store souq otlboha products endpoint..
		getSouqOtlobhaProducts: builder.query({
			query: (arg) => `etlobhaShow?page=${arg.page}&number=${arg.number}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["SouqOtlobhaProducts"],
		}),

		// get show Import Cart
		showImportProductsCartData: builder.query({
			query: (arg) => `showImportCart`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.cart,
			providesTags: ["CartMenuData"],
		}),

		// get Product by id
		showSouqOtlobhaProductById: builder.query({
			query: (id) => `etlobhaProductShow/${id}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.products,
			providesTags: (result, error, id) => [
				{ type: "SouqOtlobhaProducts", id },
			],
		}),

		// filter products by categories
		filterSouqOtlobhaProductsByCategories: builder.mutation({
			query: ({ mainCategoryId, subCategoriesSelectedIds, page, number }) => ({
				url: `etlobhaShow?&number=${number}&category_id=${mainCategoryId}&${subCategoriesSelectedIds}&page=${page}`,
				method: "GET",
			}),
		}),

		//add new Product
		importProductToStoreProducts: builder.mutation({
			query: ({ body }) => {
				return {
					url: `addImportCart`,
					method: "POST",
					body: body,
				};
			},

			invalidatesTags: ["CartMenuData"],
		}),

		// edit Product by id
		editProductById: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `product/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Products"],
		}),

		// delete Item From Cart
		deleteItemFromCart: builder.mutation({
			query: ({ id }) => ({
				url: `deleteImportCart/${id}`,
				method: "GET",
			}),
			invalidatesTags: ["CartMenuData"],
		}),

		// update Cart

		// edit Product by id
		updateCart: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `product/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Products"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetSouqOtlobhaProductsQuery,
	useShowImportProductsCartDataQuery,
	useFilterSouqOtlobhaProductsByCategoriesMutation,
	useShowSouqOtlobhaProductByIdQuery,
	useImportProductToStoreProductsMutation,
	useUpdateCartMutation,
	useDeleteItemFromCartMutation,
} = souqOtlobhaProductsApi;
