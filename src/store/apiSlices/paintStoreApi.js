import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const paintStoreApi = createApi({
	reducerPath: "paintStoreApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["PaintStore"],

	endpoints: (builder) => ({
		// get store PaintStore endpoint..
		getPaintStoreTheme: builder.query({
			query: () => ({ url: `theme` }),
			providesTags: ["PaintStore"],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.Theme,
		}),

		// handle theme Primary Update
		themePrimaryUpdate: builder.mutation({
			query: ({ body }) => {
				return {
					url: `themePrimaryUpdate`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PaintStore"],
		}),

		// handle theme Secondary Update
		themeSecondaryUpdate: builder.mutation({
			query: ({ body }) => {
				return {
					url: `themeSecondaryUpdate`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PaintStore"],
		}),

		// handle theme Font Color Update
		themeFontColorUpdate: builder.mutation({
			query: ({ body }) => {
				return {
					url: `themeFontColorUpdate`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PaintStore"],
		}),

		// handle theme Header Update
		themeHeaderUpdate: builder.mutation({
			query: ({ body }) => {
				return {
					url: `themeHeaderUpdate`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PaintStore"],
		}),

		// handle theme LayoutUpdate
		themeLayoutUpdate: builder.mutation({
			query: ({ body }) => {
				return {
					url: `themeLayoutUpdate`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PaintStore"],
		}),

		// handle theme Icon Update
		themeIconUpdate: builder.mutation({
			query: ({ body }) => {
				return {
					url: `themeIconUpdate`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PaintStore"],
		}),

		// handle theme Footer Update
		themeFooterUpdate: builder.mutation({
			query: ({ body }) => {
				return {
					url: `themeFooterUpdate`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["PaintStore"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetPaintStoreThemeQuery,
	useThemePrimaryUpdateMutation,
	useThemeSecondaryUpdateMutation,
	useThemeFontColorUpdateMutation,
	useThemeHeaderUpdateMutation,
	useThemeLayoutUpdateMutation,
	useThemeIconUpdateMutation,
	useThemeFooterUpdateMutation,
} = paintStoreApi;
