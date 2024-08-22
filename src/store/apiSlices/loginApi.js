import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const loginApi = createApi({
	reducerPath: "loginApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/",
	}),

	endpoints: (builder) => ({
		// create login endpoint
		login: builder.mutation({
			query: (credentials) => ({
				url: `loginapi`,
				method: "POST",
				data: credentials,
			}),
		}),

		// restore password
		restorePassWord: builder.mutation({
			query: ({ body }) => ({
				url: `password/create`,
				method: "POST",
				data: body,
			}),
		}),

		// restore by email
		reSendVerificationCodeByEmail: builder.mutation({
			query: ({ body }) => ({
				url: `password/create-by-email`,
				method: "POST",
				data: body,
			}),
		}),

		// verify user
		verifyUser: builder.mutation({
			query: ({ body }) => ({
				url: `verify-user`,
				method: "POST",
				data: body,
			}),
		}),

		// verify account
		verifyAccount: builder.mutation({
			query: ({ body }) => ({
				url: `password/verify`,
				method: "POST",
				data: body,
			}),
		}),

		// re-send verification code by phone number
		reSendVerificationCodeByPhone: builder.mutation({
			query: ({ body }) => ({
				url: `send-verify-message`,
				method: "POST",
				data: body,
			}),
		}),

		// re-create new Password
		reCreateNewPassword: builder.mutation({
			query: ({ body }) => ({
				url: `password/reset-password`,
				method: "POST",
				data: body,
			}),
		}),
	}),
});

// Export endpoints and hooks
export const {
	useLoginMutation,
	useVerifyUserMutation,
	useVerifyAccountMutation,
	useRestorePassWordMutation,
	useReCreateNewPasswordMutation,
	useReSendVerificationCodeByEmailMutation,
	useReSendVerificationCodeByPhoneMutation,
} = loginApi;
