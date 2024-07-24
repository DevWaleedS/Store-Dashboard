import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

// Create API slice
export const ordersApi = createApi({
	reducerPath: "ordersApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Orders"],

	endpoints: (builder) => ({
		// get store Orders endpoint..
		getOrders: builder.query({
			query: (arg) => ({ url: `orders?page=${arg.page}&number=${arg.number}` }),

			providesTags: ["Orders"],
		}),

		// search in store Orders
		searchInOrders: builder.mutation({
			query: (arg) => ({
				url: `searchOrder?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// filter Orders by status
		filterOrdersByStatus: builder.mutation({
			query: (arg) => ({
				url: `orders?order_status=${arg.orderStatus}`,
				method: "GET",
			}),
		}),

		// get order by id
		getOrderById: builder.query({
			query: (id) => ({ url: `orders/${id}` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: (result, error, id) => [{ type: "Orders", id }],
		}),

		// update Order Status
		updateOrderStatus: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `orders/${id}`,
					method: "PUT",
					data: body,
				};
			},

			invalidatesTags: ["Orders"],
		}),

		// Refund order
		refundOrder: builder.mutation({
			query: ({ id, price }) => {
				return {
					url: `refundOrder/${id}?price=${price}`,
					method: "GET",
				};
			},

			invalidatesTags: ["Orders"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetOrdersQuery,
	useGetOrderByIdQuery,
	useRefundOrderMutation,
	useSearchInOrdersMutation,
	useUpdateOrderStatusMutation,
	useFilterOrdersByStatusMutation,
} = ordersApi;
