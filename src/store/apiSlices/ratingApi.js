import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const ratingApi = createApi({
	reducerPath: "ratingApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Rating"],

	endpoints: (builder) => ({
		// get store Rating endpoint..
		getRating: builder.query({
			query: (arg) => ({
				url: `comment?page=${arg.page}&number=${arg.number}`,
			}),
			providesTags: ["Rating"],
		}),

		// delete Rating
		deleteRating: builder.mutation({
			query: ({ commentId }) => ({
				url: `comment/${commentId}`,
				method: "DELETE",
			}),
			invalidatesTags: ["Rating"],
		}),

		// change Rating status
		changeRatingStatus: builder.mutation({
			query: ({ commentId }) => ({
				url: `changeCommentStatus/${commentId}`,
				method: "GET",
			}),
			invalidatesTags: ["Rating"],
		}),

		// change status for all Rating
		changeCommentActivation: builder.mutation({
			query: () => ({
				url: `commentActivation`,
				method: "GET",
			}),
			invalidatesTags: ["Rating"],
		}),

		// send Replay To Comment
		sendReplayToComment: builder.mutation({
			query: ({ body }) => {
				return {
					url: `replaycomment`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["Rating"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetRatingQuery,
	useDeleteRatingMutation,
	useChangeRatingStatusMutation,
	useChangeCommentActivationMutation,
	useSendReplayToCommentMutation,
} = ratingApi;
