import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

// Create API slice
export const selectShippingCitiesApi = createApi({
	reducerPath: "selectShippingCitiesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/selector/",
	}),

	endpoints: (builder) => ({
		// get store Orders endpoint..
		getShippingCities: builder.query({
			query: (shippingId) => ({ url: `shippingcities/${shippingId}` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),
	}),
});

// Export endpoints and hooks
export const { useGetShippingCitiesQuery } = selectShippingCitiesApi;
