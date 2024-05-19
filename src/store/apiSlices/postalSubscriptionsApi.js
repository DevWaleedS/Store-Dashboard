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
export const postalSubscriptionsApi = createApi({
	reducerPath: "postalSubscriptionsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["PostalSubscriptions"],
	endpoints: (builder) => ({
		// get store PostalSubscriptions endpoint..
		getPostalSubscriptions: builder.query({
			query: (arg) => `subsicriptions?page=${arg.page}&number=${arg.number}`,
			providesTags: ["PostalSubscriptions"],
		}),

		// delete PostalSubscriptions
		deletePostalSubscriptions: builder.mutation({
			query: ({ postalSubscriptionId }) => ({
				url: `subsicriptionsdeleteall?id[]=${postalSubscriptionId}`,
				method: "GET",
			}),
			invalidatesTags: ["PostalSubscriptions"],
		}),

		// delete all PostalSubscriptions
		deleteAllPostalSubscriptions: builder.mutation({
			query: ({ selected }) => ({
				url: `subsicriptionsdeleteall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["PostalSubscriptions"],
		}),

		// search in store PostalSubscriptions
		searchInPostalSubscriptions: builder.mutation({
			query: (arg) => ({
				url: `searchSubscriptionEmail?query=${arg.query}`,
				method: "GET",
			}),
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetPostalSubscriptionsQuery,
	useDeletePostalSubscriptionsMutation,
	useDeleteAllPostalSubscriptionsMutation,
	useSearchInPostalSubscriptionsMutation,
} = postalSubscriptionsApi;
