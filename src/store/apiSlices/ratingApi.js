import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token =
		document.cookie
			?.split("; ")
			?.find((cookie) => cookie.startsWith("store_token="))
			?.split("=")[1] || null;

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	headers.set("Content-Type", "application/json");

	return headers;
};

// Create API slice
export const ratingApi = createApi({
	reducerPath: "ratingApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Rating"],
	endpoints: (builder) => ({
		// get store Rating endpoint..
		getRating: builder.query({
			query: (arg) => `comment?page=${arg.page}&number=${arg.number}`,
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
			query: ({ comment_text, comment_id }) => {
				const url = `replaycomment`;
				const method = "POST";

				// Construct payload object
				let payload = { comment_id, comment_text };

				// Return URL, method, and payload
				return { url, method, body: JSON.stringify(payload) };
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
