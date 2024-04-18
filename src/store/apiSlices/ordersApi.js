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
				url: `searchOrder?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
		}),

		// filter Orders by status
		filterOrdersByStatus: builder.mutation({
			query: (arg) => ({
				url: `orders?page=${arg.page}&number=${arg.number}&order_status=${arg.orderStatus}`,
				method: "GET",
			}),
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetOrdersQuery,
	useSearchInOrdersMutation,
	useFilterOrdersByStatusMutation,
} = ordersApi;
