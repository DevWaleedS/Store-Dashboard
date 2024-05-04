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

	// Set Content-Type header for JSON requests
	headers.set("Content-Type", "application/json");

	return headers;
};

// Create API slice
export const returnOrdersApi = createApi({
	reducerPath: "returnOrdersApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["ReturnOrders"],
	endpoints: (builder) => ({
		// get return OrderIndex endpoint..
		getReturnOrders: builder.query({
			query: (arg) => `returnOrderIndex?page=${arg.page}&number=${arg.number}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["ReturnOrders"],
		}),

		// search in store Orders
		searchInReturnOrders: builder.mutation({
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

		// get order by id
		getOrderById: builder.query({
			query: (id) => `orders/${id}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: (result, error, id) => [{ type: "Orders", id }],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetReturnOrdersQuery, useSearchInReturnOrdersMutation } =
	returnOrdersApi;
