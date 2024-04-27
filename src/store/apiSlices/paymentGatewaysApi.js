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
export const paymentGatewaysApi = createApi({
	reducerPath: "paymentGatewaysApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	tagTypes: ["PaymentGateways"],

	endpoints: (builder) => ({
		// get Payment Gateways endpoint..
		getPaymentGateways: builder.query({
			query: () => `paymenttype`,

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
