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
export const walletApi = createApi({
	reducerPath: "walletApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Wallet", "CurrentBankAccount", "Billing"],
	endpoints: (builder) => ({
		// get store Wallet endpoint..
		getWalletData: builder.query({
			query: () => `showSupplierDashboard`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) =>
				response.data?.SupplierDashboard,
			providesTags: ["Wallet"],
		}),

		// get store Wallet endpoint..
		getCurrentBankAccount: builder.query({
			query: () => `indexSupplier`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["CurrentBankAccount"],
		}),

		// show current bank account
		showBankAccount: builder.query({
			query: () => `showSupplier`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["CurrentBankAccount"],
		}),

		// get store Wallet endpoint..
		getBillingData: builder.query({
			query: (arg) => `billing?page=${arg.page}&number=${arg.number}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["Billing"],
		}),

		// show current bank account
		showBillingById: builder.query({
			query: ({ billingId }) => `showBilling/${billingId}`,

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
					body: body,
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
					body: body,
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
