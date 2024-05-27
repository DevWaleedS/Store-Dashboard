import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const importPaymentMethodApi = createApi({
	reducerPath: "importPaymentMethodApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	endpoints: (builder) => ({
		// get store Orders endpoint..
		importPaymentMethods: builder.query({
			query: () => ({ url: `paymentmethodsImport` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.payment_types,
		}),
	}),
});

// Export endpoints and hooks
export const { useImportPaymentMethodsQuery } = importPaymentMethodApi;
