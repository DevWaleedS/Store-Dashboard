import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

// Create API slice
export const defaultAddressApi = createApi({
	reducerPath: "defaultAddressApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// get default AddressApi endpoint..
		getDefaultAddress: builder.query({
			query: () => ({ url: `show_default_address` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.orderAddress,
		}),
	}),
});

// Export endpoints and hooks
export const { useGetDefaultAddressQuery } = defaultAddressApi;
