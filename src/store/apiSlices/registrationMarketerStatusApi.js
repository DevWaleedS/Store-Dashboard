import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const registrationMarketerStatusApi = createApi({
	reducerPath: "registrationMarketerStatusApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/selector/",
	}),

	endpoints: (builder) => ({
		// show registration marketer status endpoint..
		showRegistrationMarketerStatus: builder.query({
			query: () => ({ url: `registrationMarketer` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) =>
				response.data?.registration_marketer,
			providesTags: ["Verification"],
		}),
	}),
});

// Export endpoints and hooks
export const { useShowRegistrationMarketerStatusQuery } =
	registrationMarketerStatusApi;
