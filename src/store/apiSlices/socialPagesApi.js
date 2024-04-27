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

	return headers;
};

// Create API slice
export const socialPagesApi = createApi({
	reducerPath: "socialPagesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["SocialMedia"],
	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getSocialMediaData: builder.query({
			query: () => `socialMedia_store_show`,
			providesTags: ["SocialMedia"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),

		// get academy explain video by id
		updateSocialMediaData: builder.mutation({
			query: ({ body }) => {
				return {
					url: `socialMedia_store_update`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["SocialMedia"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetSocialMediaDataQuery, useUpdateSocialMediaDataMutation } =
	socialPagesApi;
