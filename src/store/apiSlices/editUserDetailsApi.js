import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const editUserDetailsApi = createApi({
	reducerPath: "editUserDetailsApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["EditUserDetails"],

	endpoints: (builder) => ({
		// get User Profile data endpoint..
		getUserProfileData: builder.query({
			query: () => ({ url: `profile` }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.users,
			providesTags: ["EditUserDetails"],
		}),

		// update Store Main Information
		editUserProfileData: builder.mutation({
			query: ({ body }) => {
				return {
					url: `profile`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["EditUserDetails"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetUserProfileDataQuery, useEditUserProfileDataMutation } =
	editUserDetailsApi;
