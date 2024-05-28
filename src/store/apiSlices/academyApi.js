import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const AcademyApi = createApi({
	reducerPath: "AcademyApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),

	tagTypes: ["Academy"],

	endpoints: (builder) => ({
		// get store Academy courses endpoint..
		getAcademyCourses: builder.query({
			query: (arg) => ({ url: `course?page=${arg.page}&number=${arg.number}` }),
			providesTags: ["Academy"],
		}),

		// get store Academy explain videos endpoint..
		getAcademyExplainVideos: builder.query({
			query: (arg) => ({
				url: `explainVideos?page=${arg.page}&number=${arg.number}`,
			}),
			providesTags: ["Academy"],
		}),

		// search in Academy courses
		searchInAcademyCourses: builder.mutation({
			query: (arg) => ({
				url: `searchCourseName?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// search in Academy explain videos
		searchInAcademyExplainVideos: builder.mutation({
			query: (arg) => ({
				url: `explainVideoName?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// get academy course by id
		getAcademyCourseById: builder.query({
			query: ({ courseId }) => ({ url: `course/${courseId}` }),
			providesTags: ["Academy"],
		}),

		// get academy explain video by id
		getAcademyExplainVideoById: builder.query({
			query: ({ videoId }) => ({ url: `explainVideos/${videoId}` }),
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
