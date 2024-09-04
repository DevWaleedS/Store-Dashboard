import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const productsApi = createApi({
	reducerPath: "productsApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Products"],
	endpoints: (builder) => ({
		// get store products endpoint..
		getStoreProducts: builder.query({
			query: (arg) => ({
				url: `product?page=${arg.page}&number=${arg.number}`,
			}),
			providesTags: ["Products"],
		}),

		// get souq otlbha  products endpoint..
		getImportedProducts: builder.query({
			query: (arg) => ({
				url: `importedProducts?page=${arg.page}&number=${arg.number}`,
			}),
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
				url: `searchProduct?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// search in Imported products
		searchInImportedProducts: builder.mutation({
			query: (arg) => ({
				url: `searchImportProduct?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// filter products by categories
		filterStoreProductsByCategories: builder.mutation({
			query: (arg) => ({
				url: `product?category_id=${arg.category_id}`,
				method: "GET",
			}),
		}),

		// filter products by categories
		filterImportedProductsByCategories: builder.mutation({
			query: (arg) => ({
				url: `importedProducts?category_id=${arg.category_id}`,
				method: "GET",
			}),
		}),

		// handle import products file
		importProductsFile: builder.mutation({
			query: ({ body }) => {
				return {
					url: `import-products`,
					method: "POST",
					data: body,
				};
			},

			invalidatesTags: ["Products"],
		}),

		// change Categories For Some Selected Products
		changeCategoriesForSomeSelectedProducts: builder.mutation({
			query: ({ queryParams, body }) => {
				return {
					url: `updateCategory?${queryParams}`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["Products"],
		}),

		//add new Product
		addNewProduct: builder.mutation({
			query: ({ body }) => {
				return {
					url: `product`,
					method: "POST",
					data: body,
				};
			},

			invalidatesTags: ["Products"],
		}),

		// get Product by id
		getProductById: builder.query({
			query: (id) => ({ url: `product/${id}` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.product,
			providesTags: (result, error, id) => [{ type: "Products", id }],
		}),
		// edit Product by id
		editProductById: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `product/${id}`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["Products"],
		}),

		// edit Product by id
		editImportProductById: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `updateimportproduct/${id}`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["Products"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useDeleteProductMutation,
	useGetStoreProductsQuery,
	useGetImportedProductsQuery,
	useSearchInStoreProductsMutation,
	useChangeSpecialStatusMutation,
	useDeleteAllProductsMutation,
	useChangeProductStatusMutation,
	useChangeAllProductsStatusMutation,
	useImportProductsFileMutation,
	useSearchInImportedProductsMutation,
	useFilterStoreProductsByCategoriesMutation,
	useFilterImportedProductsByCategoriesMutation,
	useChangeCategoriesForSomeSelectedProductsMutation,
	useGetProductByIdQuery,
	useEditProductByIdMutation,
	useEditImportProductByIdMutation,
	useAddNewProductMutation,
} = productsApi;
