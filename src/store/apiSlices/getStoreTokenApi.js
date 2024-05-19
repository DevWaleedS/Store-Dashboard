import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create API slice
export const getStoreTokenApi = createApi({
	reducerPath: "getStoreTokenApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// get store token endpoint..
		storeToken: builder.query({
			query: () => `store_token/411`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.token,
			providesTags: ["StoreToken"],
		}),
	}),
});

// Export endpoints and hooks
export const { useStoreTokenQuery } = getStoreTokenApi;
