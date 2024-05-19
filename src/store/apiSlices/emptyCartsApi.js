import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const emptyCartsApi = createApi({
	reducerPath: "emptyCartsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["EmptyCarts"],
	endpoints: (builder) => ({
		// get store EmptyCarts endpoint..
		getEmptyCarts: builder.query({
			query: (arg) => `admin?page=${arg.page}&number=${arg.number}`,
			providesTags: ["EmptyCarts"],
		}),

		// delete EmptyCarts
		deleteEmptyCarts: builder.mutation({
			query: ({ emptyCartId }) => ({
				url: `deleteCart?id[]=${emptyCartId}`,
				method: "GET",
			}),
			invalidatesTags: ["EmptyCarts"],
		}),

		// delete all EmptyCarts
		deleteAllEmptyCarts: builder.mutation({
			query: ({ selected }) => ({
				url: `deleteCart?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["EmptyCarts"],
		}),

		// search in store EmptyCarts
		searchInEmptyCarts: builder.mutation({
			query: (arg) => ({
				url: `searchCartName?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// get empty cart by id
		getEmptyCartById: builder.query({
			query: (id) => `cartShow/${id}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.cart,
			providesTags: ["EmptyCarts"],
		}),

		// edit coupon by id
		sendOfferToEmptyCart: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `sendOfferCart/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["EmptyCarts"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetEmptyCartsQuery,
	useDeleteEmptyCartsMutation,
	useDeleteAllEmptyCartsMutation,
	useSearchInEmptyCartsMutation,
	useGetEmptyCartByIdQuery,
	useSendOfferToEmptyCartMutation,
} = emptyCartsApi;
