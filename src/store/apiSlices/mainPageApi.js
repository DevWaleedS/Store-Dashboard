import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

export const mainPageApi = createApi({
	reducerPath: "mainPageApi",

	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	endpoints: (builder) => ({
		getMainPageData: builder.query({ query: () => ({ url: "index" }) }),
	}),
});

export const { useGetMainPageDataQuery } = mainPageApi;
