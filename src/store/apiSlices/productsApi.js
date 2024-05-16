import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

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

		// change Categories For Some Selected Products
		changeCategoriesForSomeSelectedProducts: builder.mutation({
			query: ({ queryParams, category_id, subcategory_id }) => {
				const url = `updateCategory?${queryParams}`;
				const method = "POST";

				// Construct payload object
				let payload = { category_id };

				// If subcategory_id array is not empty, include it in the payload
				if (subcategory_id && subcategory_id.length > 0) {
					payload.subcategory_id = subcategory_id;
				}

				// Return URL, method, and payload
				return { url, method, body: JSON.stringify(payload) };
			},
			invalidatesTags: ["Products"],
		}),

		//add new Product
		addNewProduct: builder.mutation({
			query: ({ body }) => {
				return {
					url: `product`,
					method: "POST",
					body: body,
				};
			},

			invalidatesTags: ["Products"],
		}),

		// get Product by id
		getProductById: builder.query({
			query: (id) => `product/${id}`,

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
					body: body,
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
					body: body,
				};
			},
			invalidatesTags: ["Products"],
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
	useFilterStoreProductsByCategoriesMutation,
	useFilterImportedProductsByCategoriesMutation,
	useChangeCategoriesForSomeSelectedProductsMutation,
	useGetProductByIdQuery,
	useEditProductByIdMutation,
	useEditImportProductByIdMutation,
	useAddNewProductMutation,
} = productsApi;
