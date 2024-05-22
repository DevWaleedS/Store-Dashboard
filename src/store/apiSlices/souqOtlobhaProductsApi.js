import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const souqOtlobhaProductsApi = createApi({
	reducerPath: "souqOtlobhaProductsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
		prepareHeaders,
	}),
	tagTypes: ["SouqOtlobhaProducts", "CartMenuData", "CheckOutPage"],
	endpoints: (builder) => ({
		// get store souq otlboha products endpoint..
		getSouqOtlobhaProducts: builder.query({
			query: (arg) => `Store/etlobhaShow?page=${arg.page}&number=${arg.number}`,

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
			query: (id) => `Store/etlobhaProductShow/${id}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.products,
			providesTags: (result, error, id) => [
				{ type: "SouqOtlobhaProducts", id },
			],
		}),

		// show import Cart
		showImportCart: builder.query({
			query: () => `Store/showImportCart`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.cart,
			providesTags: ["CartMenuData"],
		}),

		// filter products by categories
		filterSouqOtlobhaProductsByCategories: builder.mutation({
			query: ({ mainCategoryId, subCategoriesSelectedIds, page, number }) => ({
				url: `Store/etlobhaShow?&number=${number}&category_id=${mainCategoryId}&${subCategoriesSelectedIds}&page=${page}`,
				method: "GET",
			}),
		}),

		//add new Product
		importProductToStoreProducts: builder.mutation({
			query: ({ body }) => {
				return {
					url: `Store/addImportCart`,
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
					url: `Store/product/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Products"],
		}),

		// delete Item From Cart
		deleteItemFromCart: builder.mutation({
			query: ({ id }) => ({
				url: `Store/deleteImportCart/${id}`,
				method: "GET",
			}),
			invalidatesTags: ["CartMenuData"],
		}),

		// update Cart
		updateCart: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `Store/product/${id}`,
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
					url: `Store/checkoutImport`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["SouqOtlobhaProducts", "CartMenuData", "CheckOutPage"],
		}),

		// checkout with madfu payment method
		loginWithMadfu: builder.mutation({
			query: ({ body }) => {
				return {
					url: `madfu/login`,
					method: "POST",
					body: body,
				};
			},
		}),

		// handle create order with madfu payment method
		createOrderWithMadfu: builder.mutation({
			query: ({ body }) => {
				return {
					url: `madfu/create-order`,
					method: "POST",
					body: body,
				};
			},
		}),

		// apply Discount Code
		appLyDiscountCoupon: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `Store/applyCoupon/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["CheckOutPage"],
		}),

		// re-calculate cart by shipping id
		reCalculateCartByShippingId: builder.mutation({
			query: ({ id }) => {
				return {
					url: `Store/shippingCalculation/${id}`,
					method: "GET",
				};
			},

			invalidatesTags: ["CartMenuData"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useUpdateCartMutation,
	useCheckOutCartMutation,
	useShowImportCartQuery,
	useLoginWithMadfuMutation,
	useDeleteItemFromCartMutation,
	useGetSouqOtlobhaProductsQuery,
	useAppLyDiscountCouponMutation,
	useCreateOrderWithMadfuMutation,
	useShowImportProductsCartDataQuery,
	useShowSouqOtlobhaProductByIdQuery,
	useReCalculateCartByShippingIdMutation,
	useImportProductToStoreProductsMutation,
	useFilterSouqOtlobhaProductsByCategoriesMutation,
} = souqOtlobhaProductsApi;
