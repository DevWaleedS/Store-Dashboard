import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

export const requestDelegateApi = createApi({
	reducerPath: "requestDelegateApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	endpoints: (builder) => ({
		getDelegateByCityId: builder.query({
			query: (arg) => ({
				url: `marketerRequest?id=${arg?.cityId}&page={arg?.page}&number=${arg.number}`,
			}),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data,
		}),
	}),
});

export const { useGetDelegateByCityIdQuery } = requestDelegateApi;
