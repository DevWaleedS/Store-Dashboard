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
export const platformServicesApi = createApi({
	reducerPath: "platformServicesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["PlatformServices"],
	endpoints: (builder) => ({
		// get store Platform Services Data endpoint..
		getPlatformServicesData: builder.query({
			query: () => `etlobhaservice/show`,
			providesTags: ["PlatformServices"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),

		// get platform  services selector
		getPlatformServicesSelector: builder.query({
			query: () => `selector/services`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data.services,
		}),

		// handle request new service
		requestNewService: builder.mutation({
			query: ({ body }) => {
				return {
					url: `etlobhaservice`,
					method: "POST",

					body: body,
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
