import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

export const upgradePackagesApi = createApi({
	reducerPath: "upgradePackagesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/selector/",
	}),

	endpoints: (builder) => ({
		getUpgradePackages: builder.query({
			query: () => ({ url: "packages" }),

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.packages,
		}),
	}),
});

export const { useGetUpgradePackagesQuery } = upgradePackagesApi;
