import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const maintenanceModeApi = createApi({
	reducerPath: "maintenanceModeApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["MaintenanceMode"],

	endpoints: (builder) => ({
		// get Maintenance mode data endpoint..
		getMaintenanceModeData: builder.query({
			query: () => ({ url: `maintenance` }),
			providesTags: ["MaintenanceMode"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.Maintenances,
		}),

		// Update Maintenance Mode
		UpdateMaintenanceMode: builder.mutation({
			query: ({ body }) => {
				return {
					url: `updateMaintenance`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["MaintenanceMode"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetMaintenanceModeDataQuery,
	useUpdateMaintenanceModeMutation,
} = maintenanceModeApi;
