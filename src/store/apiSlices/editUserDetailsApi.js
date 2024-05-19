import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("storeToken");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const editUserDetailsApi = createApi({
	reducerPath: "editUserDetailsApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["EditUserDetails"],
	endpoints: (builder) => ({
		// get User Profile data endpoint..
		getUserProfileData: builder.query({
			query: () => `profile`,

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
					body: body,
				};
			},
			invalidatesTags: ["EditUserDetails"],
		}),
	}),
});

// Export endpoints and hooks
export const { useGetUserProfileDataQuery, useEditUserProfileDataMutation } =
	editUserDetailsApi;
