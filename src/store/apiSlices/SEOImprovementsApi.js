import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const SEOImprovementsApi = createApi({
	reducerPath: "SEOImprovementsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["SEO"],
	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getSEOData: builder.query({
			query: () => `seo`,
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
					body: body,
				};
			},
			invalidatesTags: ["SEO"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetSEODataQuery, useUpdateSeoMutation } = SEOImprovementsApi;
