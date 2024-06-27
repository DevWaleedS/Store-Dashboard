import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const notificationsApi = createApi({
	reducerPath: "notificationsApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["Notifications"],

	endpoints: (builder) => ({
		// get store Notifications endpoint..
		GetNotifications: builder.query({
			query: (arg) => ({
				url: `NotificationIndex?page=${arg.page}&number=${arg.number}`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
			providesTags: ["Notifications"],
		}),

		// delete Notifications
		deleteNotifications: builder.mutation({
			query: ({ notificationId }) => ({
				url: `NotificationDelete/${notificationId}`,
				method: "GET",
			}),
			invalidatesTags: ["Notifications"],
		}),

		// delete all Notifications
		deleteAllNotifications: builder.mutation({
			query: ({ selected }) => ({
				url: `NotificationDeleteAll?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Notifications"],
		}),

		// mark Single Notification As Read
		markSingleNotificationAsRead: builder.mutation({
			query: ({ notificationId }) => ({
				url: `NotificationRead?id[]=${notificationId}`,
				method: "GET",
			}),
			invalidatesTags: ["Notifications"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetNotificationsQuery,
	useDeleteNotificationsMutation,
	useDeleteAllNotificationsMutation,
	useMarkSingleNotificationAsReadMutation,
} = notificationsApi;
