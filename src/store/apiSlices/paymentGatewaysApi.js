import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const paymentGatewaysApi = createApi({
	reducerPath: "paymentGatewaysApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),
	tagTypes: ["PaymentGateways"],

	endpoints: (builder) => ({
		// get Payment Gateways endpoint..
		getPaymentGateways: builder.query({
			query: () => ({ url: `Store/paymenttype` }),

			providesTags: (result, error, id) => [{ type: "PaymentGateways", id }],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.paymenttypes,
		}),

		// change Payment Status
		changePaymentStatus: builder.mutation({
			query: (id) => {
				return {
					url: `Store/changePaymenttypeStatus/${id}`,
					method: "GET",
				};
			},
			invalidatesTags: ["PaymentGateways"],
		}),

		madfuAuth: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `madfu-auth/${id}`,
					method: "POST",
					data: body,
				};
			},

			invalidatesTags: ["PaymentGateways"],
		}),

		sendStoresInfoToMadfu: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `madfu/sendStoresInfo`,
					method: "POST",
					data: body,
				};
			},

			invalidatesTags: ["PaymentGateways"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useMadfuAuthMutation,
	useGetPaymentGatewaysQuery,
	useChangePaymentStatusMutation,
	useSendStoresInfoToMadfuMutation,
} = paymentGatewaysApi;
