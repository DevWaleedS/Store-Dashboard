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
export const templateSettingApi = createApi({
	reducerPath: "templateSettingApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	tagTypes: ["TemplateSetting"],
	endpoints: (builder) => ({
		// get store Template setting endpoint..
		getTemplateSetting: builder.query({
			query: () => `homepage`,
			providesTags: ["TemplateSetting"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.Homepages,
		}),

		// update template Sliders
		updateTemplateSliders: builder.mutation({
			query: ({ body }) => {
				return {
					url: `sliderUpdate`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["TemplateSetting"],
		}),

		// update template Banners
		updateTemplateBanners: builder.mutation({
			query: ({ body }) => {
				return {
					url: `banarUpdate`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["TemplateSetting"],
		}),

		// update clients Comments
		updateClientsComments: builder.mutation({
			query: ({ body }) => {
				return {
					url: `commentUpdate`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["TemplateSetting"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetTemplateSettingQuery,
	useUpdateTemplateBannersMutation,
	useUpdateTemplateSlidersMutation,
	useUpdateClientsCommentsMutation,
} = templateSettingApi;
