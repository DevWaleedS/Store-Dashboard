import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const platformServicesApi = createApi({
	reducerPath: "platformServicesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	tagTypes: ["PlatformServices"],
	endpoints: (builder) => ({
		// get store Platform Services Data endpoint..
		getPlatformServicesData: builder.query({
			query: () => ({ url: `etlobhaservice/show` }),
			providesTags: ["PlatformServices"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),

		// get platform  services selector
		getPlatformServicesSelector: builder.query({
			query: () => ({ url: `selector/services` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data.services,
		}),

		// handle request new service
		requestNewService: builder.mutation({
			query: ({ body }) => {
				return {
					url: `etlobhaservice`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PlatformServices"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetPlatformServicesDataQuery,
	useGetPlatformServicesSelectorQuery,
	useRequestNewServiceMutation,
} = platformServicesApi;
