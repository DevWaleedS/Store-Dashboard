import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const SEOImprovementsApi = createApi({
	reducerPath: "SEOImprovementsApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["SEO"],

	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getSEOData: builder.query({
			query: () => ({ url: `seo` }),
			providesTags: ["SEO"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.Seo,
		}),

		// get academy explain video by id
		updateSeo: builder.mutation({
			query: ({ body }) => {
				return {
					url: `updateSeo`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["SEO"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetSEODataQuery, useUpdateSeoMutation } = SEOImprovementsApi;
