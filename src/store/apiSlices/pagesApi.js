import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const pagesApi = createApi({
	reducerPath: "pagesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Pages"],

	endpoints: (builder) => ({
		// get store Pages endpoint..
		getPages: builder.query({
			query: (arg) => ({ url: `page?page=${arg.page}&number=${arg.number}` }),
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
				url: `searchPageName?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// filter Pages by select type
		filterPagesByStatus: builder.mutation({
			query: (arg) => ({
				url:
					arg.select === "all"
						? `page?page=${arg.page}&number=${arg.number}`
						: `page?status=${arg.select}`,

				method: "GET",
			}),
		}),

		// create new Page
		createNewPage: builder.mutation({
			query: ({ body }) => {
				return {
					url: `page-publish`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["Pages"],
		}),

		// get Page by id
		getPageById: builder.query({
			query: (id) => ({ url: `page/${id}` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.pages,

			providesTags: (result, error, id) => [{ type: "Pages", id }],
		}),

		// edit Page by id
		editPageById: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `page/${id}`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["Pages"],
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
	useCreateNewPageMutation,
	useGetPageByIdQuery,
	useEditPageByIdMutation,
} = pagesApi;
