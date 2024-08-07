import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const checkoutPackagesApi = createApi({
	reducerPath: "checkoutPackagesApi",
	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// handle Checkout
		checkOutPackage: builder.mutation({
			query: ({ body }) => {
				return {
					url: `Store/package_payment`,
					method: "POST",
					data: body,
				};
			},
		}),

		// checkout with madfu payment method
		loginMadfuWithPaymentPackage: builder.mutation({
			query: ({ body }) => {
				return {
					url: `madfu/login`,
					method: "POST",
					data: body,
				};
			},
		}),

		// handle create order with madfu payment method
		CreateMadfuPaymentPackageOrder: builder.mutation({
			query: ({ body }) => {
				return {
					url: `madfu/create-order`,
					method: "POST",
					data: body,
				};
			},
		}),
	}),
});

// Export endpoints and hooks
export const {
	useCheckOutPackageMutation,
	useLoginMadfuWithPaymentPackageMutation,
	useCreateMadfuPaymentPackageOrderMutation,
} = checkoutPackagesApi;
