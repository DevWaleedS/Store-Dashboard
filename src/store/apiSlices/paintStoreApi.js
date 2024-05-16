import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const paintStoreApi = createApi({
	reducerPath: "paintStoreApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["PaintStore"],
	endpoints: (builder) => ({
		// get store PaintStore endpoint..
		getPaintStoreTheme: builder.query({
			query: () => `theme`,
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
					body: body,
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
					body: body,
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
					body: body,
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
					body: body,
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
					body: body,
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
					body: body,
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
					body: body,
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
