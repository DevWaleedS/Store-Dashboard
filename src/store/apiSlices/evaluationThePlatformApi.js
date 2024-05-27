import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const evaluationThePlatformApi = createApi({
	reducerPath: "evaluationThePlatformApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	tagTypes: ["EvaluationThePlatformApi"],
	endpoints: (builder) => ({
		// update Store Main Information
		AddEvaluationThePlatformApi: builder.mutation({
			query: ({ body }) => {
				return {
					url: `etlobhaComment`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["EvaluationThePlatformApi"],
		}),
	}),
});

// Export endpoints and hooks
export const { useAddEvaluationThePlatformApiMutation } =
	evaluationThePlatformApi;
