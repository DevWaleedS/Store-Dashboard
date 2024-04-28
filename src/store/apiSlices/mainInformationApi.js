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
export const mainInformationApi = createApi({
	reducerPath: "mainInformationApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["MainInformation"],
	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getMainInformation: builder.query({
			query: () => `setting_store_show`,
			providesTags: ["MainInformation"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.setting_store,
		}),

		// update Store Main Information
		updateStoreMainInformation: builder.mutation({
			query: ({ body }) => {
				return {
					url: `setting_store_update`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["MainInformation"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetMainInformationQuery,
	useUpdateStoreMainInformationMutation,
} = mainInformationApi;
