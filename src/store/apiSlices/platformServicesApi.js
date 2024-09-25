import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const platformServicesApi = createApi({
	reducerPath: "platformServicesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	tagTypes: ["PlatformServices", "ShowServiceOrder"],
	endpoints: (builder) => ({
		// get store Platform Services Data endpoint..
		getPlatformServicesData: builder.query({
			query: () => ({ url: `Store/etlobhaservice/show` }),
			providesTags: ["PlatformServices"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),

		// get platform  services selector
		getPlatformServicesSelector: builder.query({
			query: () => ({ url: `Store/selector/services` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data.services,
		}),

		// showServiceOrder
		showServiceOrder: builder.query({
			query: ({ id }) => ({ url: `showServiceOrder/${id}` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.websiteorder,
			providesTags: ["ShowServiceOrder"],
		}),

		// handle request new service
		requestNewService: builder.mutation({
			query: ({ body }) => {
				return {
					url: `Store/etlobhaservice`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PlatformServices"],
		}),

		// apply Services Coupon
		applyServicesCoupon: builder.mutation({
			query: ({ body }) => {
				return {
					url: `Store/etlobhaservice`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["ShowServiceOrder"],
		}),

		// removeServiceCoupon
		removeServiceCoupon: builder.mutation({
			query: ({ id }) => {
				return {
					url: `removeServiceCoupon/${id}`,
					method: "GET",
				};
			},
			invalidatesTags: ["ShowServiceOrder"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetPlatformServicesDataQuery,
	useGetPlatformServicesSelectorQuery,
	useShowServiceOrderQuery,
	useRequestNewServiceMutation,
	useApplyServicesCouponMutation,
	useRemoveServiceCouponMutation,
} = platformServicesApi;
