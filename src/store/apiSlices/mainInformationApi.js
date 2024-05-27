import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const mainInformationApi = createApi({
	reducerPath: "mainInformationApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["MainInformation"],

	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getMainInformation: builder.query({
			query: () => ({ url: `setting_store_show` }),
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
					data: body,
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
