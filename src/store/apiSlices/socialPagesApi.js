import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const socialPagesApi = createApi({
	reducerPath: "socialPagesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["SocialMedia"],

	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getSocialMediaData: builder.query({
			query: () => ({ url: `socialMedia_store_show` }),
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
					data: body,
				};
			},
			invalidatesTags: ["SocialMedia"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetSocialMediaDataQuery, useUpdateSocialMediaDataMutation } =
	socialPagesApi;
