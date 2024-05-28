import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectPaymentsTypesApi = createApi({
	reducerPath: "selectPaymentsTypesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector",
	}),

	endpoints: (builder) => ({
		getPaymentsTypes: builder.query({
			query: () => ({ url: "/payment_types" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.payment_types,
		}),
	}),
});

export const { useGetPaymentsTypesQuery } = selectPaymentsTypesApi;
