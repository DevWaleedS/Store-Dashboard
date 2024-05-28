import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

// Create API slice
export const returnOrdersApi = createApi({
	reducerPath: "returnOrdersApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	tagTypes: ["ReturnOrders"],

	endpoints: (builder) => ({
		// get return OrderIndex endpoint..
		getReturnOrders: builder.query({
			query: (arg) => ({
				url: `returnOrderIndex?page=${arg.page}&number=${arg.number}`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["ReturnOrders"],
		}),

		// search in store Orders
		searchInReturnOrders: builder.mutation({
			query: (arg) => ({
				url: `searchReturnOrder?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// filter Orders by status
		filterReturnOrdersByStatus: builder.mutation({
			query: (arg) => ({
				url: `returnOrderIndex?status=${arg.orderStatus}`,
				method: "GET",
			}),
		}),

		// get order by id
		getReturnOrderById: builder.query({
			query: (id) => ({ url: `returnOrder/${id}` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.ReturnOrder,
			providesTags: (result, error, id) => [{ type: "ReturnOrders", id }],
		}),

		// Accept or reject Return Order,
		acceptOrRejectReturnOrder: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `returnOrder/${id}`,
					method: "POST",
					data: body,
				};
			},

			invalidatesTags: ["ReturnOrders"],
		}),

		// Refund return order
		refundReturnOrder: builder.mutation({
			query: ({ id }) => {
				return { url: `refundReturnOrder/${id}`, method: "GET" };
			},
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetReturnOrdersQuery,
	useGetReturnOrderByIdQuery,
	useRefundReturnOrderMutation,
	useSearchInReturnOrdersMutation,
	useFilterReturnOrdersByStatusMutation,
	useAcceptOrRejectReturnOrderMutation,
} = returnOrdersApi;
