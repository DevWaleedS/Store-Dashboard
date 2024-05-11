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
				url: `searchReturnOrder?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
		}),

		// filter Orders by status
		filterReturnOrdersByStatus: builder.mutation({
			query: (arg) => ({
				url: `returnOrderIndex?page=${arg.page}&number=${arg.number}&status=${arg.orderStatus}`,
				method: "GET",
			}),
		}),

		// get order by id
		getReturnOrderById: builder.query({
			query: (id) => `returnOrder/${id}`,

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
					body: body,
				};
			},

			invalidatesTags: ["ReturnOrders"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetReturnOrdersQuery,
	useSearchInReturnOrdersMutation,
	useGetReturnOrderByIdQuery,
	useFilterReturnOrdersByStatusMutation,
	useAcceptOrRejectReturnOrderMutation,
} = returnOrdersApi;
