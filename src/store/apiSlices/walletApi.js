import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const walletApi = createApi({
	reducerPath: "walletApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Wallet", "CurrentBankAccount", "Billing"],

	endpoints: (builder) => ({
		// get store Wallet endpoint..
		getWalletData: builder.query({
			query: () => ({ url: `showSupplierDashboard` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) =>
				response.data?.SupplierDashboard,
			providesTags: ["Wallet"],
		}),

		// get store Wallet endpoint..
		getCurrentBankAccount: builder.query({
			query: () => ({ url: `indexSupplier` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["CurrentBankAccount"],
		}),

		// show current bank account
		showBankAccount: builder.query({
			query: () => ({ url: `showSupplier` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["CurrentBankAccount"],
		}),

		// get store Wallet endpoint..
		getBillingData: builder.query({
			query: (arg) => ({
				url: `billing?page=${arg.page}&number=${arg.number}`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["Billing"],
		}),

		// show current bank account
		showBillingById: builder.query({
			query: ({ billingId }) => ({ url: `showBilling/${billingId}` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.billing,
			providesTags: ["Billing"],
		}),

		// add new coupon
		addBankAccount: builder.mutation({
			query: ({ body }) => {
				return {
					url: `createSupplier`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["CurrentBankAccount"],
		}),

		// edit coupon by id
		editBankAccount: builder.mutation({
			query: ({ body }) => {
				return {
					url: `updateSupplier`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["CurrentBankAccount"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetWalletDataQuery,
	useGetCurrentBankAccountQuery,
	useGetBillingDataQuery,
	useShowBillingByIdQuery,
	useAddBankAccountMutation,
	useShowBankAccountQuery,
	useEditBankAccountMutation,
} = walletApi;
