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
export const productsApi = createApi({
	reducerPath: "productsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Products"],
	endpoints: (builder) => ({
		// get store products endpoint..
		getStoreProducts: builder.query({
			query: (arg) => `product?page=${arg.page}&number=${arg.number}`,
			providesTags: ["Products"],
		}),

		// get souq otlbha  products endpoint..
		getImportedProducts: builder.query({
			query: (arg) => `importedProducts?page=${arg.page}&number=${arg.number}`,
			providesTags: ["Products"],
		}),

		// delete singe product
		deleteProduct: builder.mutation({
			query: ({ id }) => ({
				url: `productdeleteall?id[]=${id}`,
				method: "GET",
			}),
			invalidatesTags: ["Products"],
		}),

		// delete all products
		deleteAllProducts: builder.mutation({
			query: ({ selected }) => ({
				url: `productdeleteall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Products"],
		}),

		// change product status
		changeProductStatus: builder.mutation({
			query: ({ id }) => ({
				url: `productchangeSatusall?id[]=${id}`,
				method: "GET",
			}),
			invalidatesTags: ["Products"],
		}),

		// change status for all product
		changeAllProductsStatus: builder.mutation({
			query: ({ selected }) => ({
				url: `productchangeSatusall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Products"],
		}),

		// change special status for product
		changeSpecialStatus: builder.mutation({
			query: ({ id }) => ({
				url: `specialStatus/${id}`,
				method: "GET",
			}),
			invalidatesTags: ["Products"],
		}),

		// search in store products
		searchInStoreProducts: builder.mutation({
			query: (arg) => ({
				url: `searchProduct?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
			providesTags: ["Products"],
		}),

		// search in Imported products
		searchInImportedProducts: builder.mutation({
			query: (arg) => ({
				url: `searchImportProduct?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
			providesTags: ["Products"],
		}),

		// filter products by categories
		filterProductsByCategories: builder.mutation({
			query: (category_id) => ({
				url: `category?category_id=${category_id}`,
				method: "GET",
			}),

			providesTags: ["Products"],
		}),

		// change Categories For Some Selected Products
		changeCategoriesForSomeSelectedProducts: builder.mutation({
			query: ({ queryParams, body }) => ({
				url: `updateCategory?${queryParams}`,
				method: "POST",
				body,
			}),

			providesTags: ["Products"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetStoreProductsQuery,
	useGetImportedProductsQuery,
	useSearchInStoreProductsMutation,
	useSearchInImportedProductsMutation,
	useDeleteProductMutation,
	useDeleteAllProductsMutation,
	useChangeProductStatusMutation,
	useChangeAllProductsStatusMutation,
	useChangeSpecialStatusMutation,
	useFilterProductsByCategoriesMutation,
	useChangeCategoriesForSomeSelectedProductsMutation,
} = productsApi;
