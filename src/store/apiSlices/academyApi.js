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
export const AcademyApi = createApi({
	reducerPath: "AcademyApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Academy"],
	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getAcademyCourses: builder.query({
			query: (arg) => `course?page=${arg.page}&number=${arg.number}`,
			providesTags: ["Academy"],
		}),

		// get store Academy explain videos endpoint..
		getAcademyExplainVideos: builder.query({
			query: (arg) => `explainVideos?page=${arg.page}&number=${arg.number}`,
			providesTags: ["Academy"],
		}),

		// search in Academy courses
		searchInAcademyCourses: builder.mutation({
			query: (arg) => ({
				url: `searchCourseName?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
		}),

		// search in Academy explain videos
		searchInAcademyExplainVideos: builder.mutation({
			query: (arg) => ({
				url: `explainVideoName?query=${arg.query}&page=${arg.page}&number=${arg.number}`,
				method: "GET",
			}),
		}),

		// get academy course by id
		getAcademyCourseById: builder.query({
			query: ({ courseId }) => `course/${courseId}`,
			providesTags: ["Academy"],
		}),

		// get academy explain video by id
		getAcademyExplainVideoById: builder.query({
			query: ({ videoId }) => `explainVideos/${videoId}`,
			providesTags: ["Academy"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetAcademyCoursesQuery,
	useGetAcademyCourseByIdQuery,
	useGetAcademyExplainVideoByIdQuery,
	useGetAcademyExplainVideosQuery,
	useSearchInAcademyCoursesMutation,
	useSearchInAcademyExplainVideosMutation,
} = AcademyApi;
