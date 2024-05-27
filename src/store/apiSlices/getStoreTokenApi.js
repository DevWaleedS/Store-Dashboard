import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const getStoreTokenApi = createApi({
	reducerPath: "getStoreTokenApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// get store token endpoint..
		storeToken: builder.query({
			query: () => ({ url: `store_token` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response,
			providesTags: ["StoreToken"],
		}),
	}),
});

// Export endpoints and hooks
export const { useStoreTokenQuery } = getStoreTokenApi;
