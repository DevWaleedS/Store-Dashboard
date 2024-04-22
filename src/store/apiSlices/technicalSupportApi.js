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

	return headers;
};

// Create API slice
export const technicalSupportApi = createApi({
	reducerPath: "technicalSupportApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),

	tagTypes: ["TechnicalSupport"],
	endpoints: (builder) => ({
		// get store Technical Support endpoint..
		getTechnicalSupport: builder.query({
			query: (arg) => `technicalSupport?page=${arg.page}&number=${arg.number}`,
			providesTags: ["TechnicalSupport"],
		}),

		// delete Technical Support
		deleteTechnicalSupportItem: builder.mutation({
			query: ({ technicalSupportId }) => ({
				url: `technicalSupportStoredeleteall?id[]=${technicalSupportId}`,
				method: "GET",
			}),
			invalidatesTags: ["TechnicalSupport"],
		}),

		// delete all Technical Support
		deleteAllTechnicalSupport: builder.mutation({
			query: ({ selected }) => ({
				url: `technicalSupportStoredeleteall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["TechnicalSupport"],
		}),

		// change Technical Support status
		changeTechnicalSupportStatus: builder.mutation({
			query: ({ technicalSupportId }) => ({
				url: `changeTechnicalSupportStatus/${technicalSupportId}`,
				method: "GET",
			}),
			invalidatesTags: ["TechnicalSupport"],
		}),

		// search in store Technical Support
		searchInTechnicalSupport: builder.mutation({
			query: (arg) => ({
				url: `searchTechnicalSupport?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
		}),

		// show Technical Support by id
		showTechnicalSupportById: builder.query({
			query: ({ id }) => `technicalSupport/${id}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: (result, error, id) => [{ type: "TechnicalSupport", id }],
		}),

		// send replay Technical Support
		sendReplayTechnicalSupport: builder.mutation({
			query: ({ replay_text, technical_support_id }) => {
				const url = `replayTechnicalSupport`;
				const method = "POST";

				// Construct payload object
				let payload = { technical_support_id, replay_text };

				// Return URL, method, and payload
				return { url, method, body: JSON.stringify(payload) };
			},
			invalidatesTags: ["TechnicalSupport"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetTechnicalSupportQuery,
	useShowTechnicalSupportByIdQuery,
	useDeleteTechnicalSupportItemMutation,
	useDeleteAllTechnicalSupportMutation,
	useChangeTechnicalSupportStatusMutation,
	useSearchInTechnicalSupportMutation,
	useSendReplayTechnicalSupportMutation,
} = technicalSupportApi;
