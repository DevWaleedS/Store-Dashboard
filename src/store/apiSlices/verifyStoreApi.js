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
export const verifyStoreApi = createApi({
	reducerPath: "verifyStoreApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Verification"],
	endpoints: (builder) => ({
		// get store Coupons endpoint..
		showVerification: builder.query({
			query: () => `verification_show`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.stores[0],
			providesTags: ["Verification"],
		}),

		// Handle verification Update
		updateVerification: builder.mutation({
			query: ({ body }) => {
				return {
					url: `verification_update`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Verification"],
		}),
	}),
});

// Export endpoints and hooks
export const { useUpdateVerificationMutation, useShowVerificationQuery } =
	verifyStoreApi;
