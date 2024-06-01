import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const madfuApi = createApi({
	reducerPath: "madfuApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
        madfuAuth: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `Store/madfu-auth/${id}`,
					method: "POST",
					data: body,
				};
			},
		}),
	}),
});

// Export endpoints and hooks
export const { useMadfuAuthMutation } = madfuApi;
