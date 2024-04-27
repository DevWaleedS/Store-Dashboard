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
export const walletApi = createApi({
	reducerPath: "walletApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Wallet"],
	endpoints: (builder) => ({
		// get store Wallet endpoint..
		getWalletData: builder.query({
			query: () => `showSupplierDashboard`,
			providesTags: ["Wallet", "CurrentBankAccount", "Billing"],
		}),

		// get store Wallet endpoint..
		getCurrentBankAccount: builder.query({
			query: () => `indexSupplier`,
			providesTags: ["CurrentBankAccount"],
		}),

		// get store Wallet endpoint..
		getBillingData: builder.query({
			query: () => `showSupplierDashboard`,
			providesTags: ["Billing"],
		}),

		// add new coupon
		addBankAccount: builder.mutation({
			query: ({ body }) => {
				return {
					url: `Wallet`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Wallet"],
		}),

		// edit coupon by id
		editBankAccount: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `Wallet/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Wallet"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetWalletDataQuery,
	useGetCurrentBankAccountQuery,
	useGetBillingDataQuery,
} = walletApi;
