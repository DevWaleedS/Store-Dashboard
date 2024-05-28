import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const paymentGatewaysApi = createApi({
	reducerPath: "paymentGatewaysApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["PaymentGateways"],

	endpoints: (builder) => ({
		// get Payment Gateways endpoint..
		getPaymentGateways: builder.query({
			query: () => ({ url: `paymenttype` }),

			providesTags: (result, error, id) => [{ type: "PaymentGateways", id }],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.paymenttypes,
		}),

		// change Payment Status
		changePaymentStatus: builder.mutation({
			query: (id) => {
				return {
					url: `changePaymenttypeStatus/${id}`,
					method: "GET",
				};
			},
			invalidatesTags: ["PaymentGateways"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetPaymentGatewaysQuery, useChangePaymentStatusMutation } =
	paymentGatewaysApi;
