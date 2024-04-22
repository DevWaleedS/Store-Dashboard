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
export const pagesApi = createApi({
	reducerPath: "pagesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Pages"],
	endpoints: (builder) => ({
		// get store Pages endpoint..
		getPages: builder.query({
			query: (arg) => `page?page=${arg.page}&number=${arg.number}`,
			providesTags: ["Pages"],
		}),

		// delete Pages
		deletePage: builder.mutation({
			query: ({ pageId }) => ({
				url: `pagedeleteall?id[]=${pageId}`,
				method: "GET",
			}),
			invalidatesTags: ["Pages"],
		}),

		// delete all Pages
		deleteAllPages: builder.mutation({
			query: ({ selected }) => ({
				url: `pagedeleteall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Pages"],
		}),

		// change Pages status
		changePagesStatus: builder.mutation({
			query: ({ pageId }) => ({
				url: `pagechangeSatusall?id[]=${pageId}`,
				method: "GET",
			}),
			invalidatesTags: ["Pages"],
		}),

		// change status for all Pages
		changeAllPagesStatus: builder.mutation({
			query: ({ selected }) => ({
				url: `pagechangeSatusall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Pages"],
		}),

		// search in store Pages
		searchInPages: builder.mutation({
			query: (arg) => ({
				url: `searchPageName?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
		}),

		// filter Pages by select type
		filterPagesByStatus: builder.mutation({
			query: (arg) => ({
				url:
					arg.select === "all"
						? `page?page=${arg.page}&number=${arg.number}`
						: `page?page=${arg.page}&number=${arg.number}&status=${arg.select}`,

				method: "GET",
			}),
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetPagesQuery,
	useDeletePageMutation,
	useDeleteAllPagesMutation,
	useChangePagesStatusMutation,
	useChangeAllPagesStatusMutation,
	useSearchInPagesMutation,
	useFilterPagesByStatusMutation,
} = pagesApi;
