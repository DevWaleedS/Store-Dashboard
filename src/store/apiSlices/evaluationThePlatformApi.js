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
		// Add A New Evaluation The Platform Api
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

		// Get The The exist Comment
		GetExistComment: builder.query({
			query: () => {
				return {
					url: `existComment`,
					method: "GET",
				};
			},
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["EvaluationThePlatformApi"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useAddEvaluationThePlatformApiMutation,
	useGetExistCommentQuery,
} = evaluationThePlatformApi;
