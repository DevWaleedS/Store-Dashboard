import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const logOutApi = createApi({
	reducerPath: "logOutApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// create login endpoint
		logOut: builder.mutation({
			query: () => ({
				url: `logout`,
				method: "get",
			}),
		}),
	}),
});

// Export endpoints and hooks
export const { useLogOutMutation } = logOutApi;
