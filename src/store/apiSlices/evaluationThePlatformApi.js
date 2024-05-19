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
export const evaluationThePlatformApi = createApi({
	reducerPath: "evaluationThePlatformApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["EvaluationThePlatformApi"],
	endpoints: (builder) => ({
		// update Store Main Information
		AddEvaluationThePlatformApi: builder.mutation({
			query: ({ body }) => {
				return {
					url: `etlobhaComment`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["EvaluationThePlatformApi"],
		}),
	}),
});

// Export endpoints and hooks
export const { useAddEvaluationThePlatformApiMutation } =
	evaluationThePlatformApi;
