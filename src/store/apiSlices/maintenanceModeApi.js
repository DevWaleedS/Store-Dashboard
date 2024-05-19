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
export const maintenanceModeApi = createApi({
	reducerPath: "maintenanceModeApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["MaintenanceMode"],
	endpoints: (builder) => ({
		// get Maintenance mode data endpoint..
		getMaintenanceModeData: builder.query({
			query: () => `maintenance`,
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
					body: body,
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
