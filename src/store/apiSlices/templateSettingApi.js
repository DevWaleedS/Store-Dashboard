import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const templateSettingApi = createApi({
	reducerPath: "templateSettingApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["TemplateSetting"],

	endpoints: (builder) => ({
		// get store Template setting endpoint..
		getTemplateSetting: builder.query({
			query: () => ({ url: `homepage` }),
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
					data: body,
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
					data: body,
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
					data: body,
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
