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
export const notificationsApi = createApi({
	reducerPath: "notificationsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Notifications"],
	endpoints: (builder) => ({
		// get store Notifications endpoint..
		GetNotifications: builder.query({
			query: (arg) => `NotificationIndex?page=${arg.page}&number=${arg.number}`,
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
	}),
});

// Export endpoints and hooks
export const {
	useGetNotificationsQuery,
	useDeleteNotificationsMutation,
	useDeleteAllNotificationsMutation,
} = notificationsApi;
