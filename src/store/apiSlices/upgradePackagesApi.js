import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

export const upgradePackagesApi = createApi({
	reducerPath: "upgradePackagesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	tagTypes: ["GetPackageId", "GetPackages"],

	endpoints: (builder) => ({
		// get packages data...
		getUpgradePackages: builder.query({
			query: () => ({ url: "Store/selector/packages" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.packages,

			providesTags: ["GetPackages"],
		}),

		// set package id
		setPackageIdPrePayment: builder.mutation({
			query: ({ body }) => {
				return {
					url: `Store/setPackage`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["GetPackageId"],
		}),

		// set package id
		getPackageId: builder.query({
			query: () => ({ url: "Store/getPackage" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data.package,

			providesTags: ["GetPackageId"],
		}),

		// handle Checkout
		checkOutPackage: builder.mutation({
			query: ({ body }) => {
				return {
					url: `Store/package_payment`,
					method: "POST",
					data: body,
				};
			},

			invalidatesTags: ["GetPackages"],
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

		// apply Package Coupon
		applyPackageCoupon: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `Store/applyPackageCoupon/${id}`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["GetPackageId", "GetPackages"],
		}),
	}),
});

export const {
	useGetPackageIdQuery,
	useGetUpgradePackagesQuery,
	useCheckOutPackageMutation,
	useApplyPackageCouponMutation,
	useSetPackageIdPrePaymentMutation,
	useLoginMadfuWithPaymentPackageMutation,
	useCreateMadfuPaymentPackageOrderMutation,
} = upgradePackagesApi;
