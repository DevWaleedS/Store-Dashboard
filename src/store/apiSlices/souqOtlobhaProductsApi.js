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
export const souqOtlobhaProductsApi = createApi({
	reducerPath: "souqOtlobhaProductsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["SouqOtlobhaProducts", "CartMenuData", "CheckOutPage"],
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
			query: () => `showImportCart`,

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

		// show import Cart
		showImportCart: builder.query({
			query: () => `showImportCart`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.cart,
			providesTags: ["CartMenuData"],
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

		// handleCheckout
		checkOutCart: builder.mutation({
			query: ({ body }) => {
				return {
					url: `checkoutImport`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["SouqOtlobhaProducts", "CartMenuData", "CheckOutPage"],
		}),

		// apply Discount Code
		appLyDiscountCoupon: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `applyCoupon/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["CheckOutPage"],
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
	useShowImportCartQuery,
	useCheckOutCartMutation,
	useAppLyDiscountCouponMutation,
} = souqOtlobhaProductsApi;
