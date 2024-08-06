import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../../API/axiosBaseQuery";

export const selectPackageApi = createApi({
	reducerPath: "selectPackageApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/selector/",
	}),

	endpoints: (builder) => ({
		getPackages: builder.query({
			query: () => ({ url: "packages" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.packages,
		}),
	}),
});

export const { useGetPackagesQuery } = selectPackageApi;
