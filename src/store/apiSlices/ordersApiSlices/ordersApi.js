import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests

const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	// Set Content-Type header for JSON requests
	headers.set("Content-Type", "application/json");

	return headers;
};

// Create API slice
export const ordersApi = createApi({
	reducerPath: "ordersApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Orders"],
	endpoints: (builder) => ({
		// get store Orders endpoint..
		getOrders: builder.query({
			query: (arg) => `orders?page=${arg.page}&number=${arg.number}`,
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
			query: (id) => `orders/${id}`,

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
					body: body,
				};
			},

			invalidatesTags: ["Orders"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetOrdersQuery,
	useSearchInOrdersMutation,
	useFilterOrdersByStatusMutation,
	useGetOrderByIdQuery,
	useUpdateOrderStatusMutation,
} = ordersApi;
