import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const verifyStoreApi = createApi({
	reducerPath: "verifyStoreApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Verification"],

	endpoints: (builder) => ({
		// get store Coupons endpoint..
		showVerification: builder.query({
			query: () => ({ url: `verification_show` }),

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
					data: body,
				};
			},
			invalidatesTags: ["Verification"],
		}),
	}),
});

// Export endpoints and hooks
export const { useUpdateVerificationMutation, useShowVerificationQuery } =
	verifyStoreApi;
