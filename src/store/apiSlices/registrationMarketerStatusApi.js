import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Create API slice
export const registrationMarketerStatusApi = createApi({
	reducerPath: "registrationMarketerStatusApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.sa/api/selector/",
	}),

	endpoints: (builder) => ({
		// show registration marketer status endpoint..
		showRegistrationMarketerStatus: builder.query({
			query: () => `registrationMarketer`,

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
