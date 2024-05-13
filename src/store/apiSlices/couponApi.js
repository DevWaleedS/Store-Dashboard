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
export const couponApi = createApi({
	reducerPath: "couponApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["Coupons"],
	endpoints: (builder) => ({
		// get store Coupons endpoint..
		getCoupons: builder.query({
			query: (arg) => `coupons?page=${arg.page}&number=${arg.number}`,
			providesTags: ["Coupons"],
		}),

		// delete Coupons
		deleteCoupon: builder.mutation({
			query: ({ couponId }) => ({
				url: `coupondeleteall?id[]=${couponId}`,
				method: "GET",
			}),
			invalidatesTags: ["Coupons"],
		}),

		// delete all Coupons
		deleteAllCoupons: builder.mutation({
			query: ({ selected }) => ({
				url: `coupondeleteall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Coupons"],
		}),

		// change Coupons status
		changeCouponStatus: builder.mutation({
			query: ({ couponId }) => ({
				url: `couponchangeSatusall?id[]=${couponId}`,
				method: "GET",
			}),
			invalidatesTags: ["Coupons"],
		}),

		// change status for all Coupons
		changeAllCouponsStatus: builder.mutation({
			query: ({ selected }) => ({
				url: `couponchangeSatusall?${selected}`,
				method: "GET",
			}),
			invalidatesTags: ["Coupons"],
		}),

		// search in store Coupons
		searchInCoupons: builder.mutation({
			query: (arg) => ({
				url: `searchCouponName?query=${arg.query}`,
				method: "GET",
			}),
		}),

		// filter Coupons by select type
		filterCouponsByStatus: builder.mutation({
			query: (arg) => ({
				url:
					arg.select === "all"
						? `coupons?page=${arg.page}&number=${arg.number}`
						: arg.select === "fixed" || arg.select === "percent"
						? `coupons?discount_type=${arg.select}`
						: `coupons?status=${arg.select}`,

				method: "GET",
			}),
		}),

		// add new coupon
		addNewCoupon: builder.mutation({
			query: ({ body }) => {
				return {
					url: `coupons`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Coupons"],
		}),

		// get coupon by id
		getCouponById: builder.query({
			query: (id) => `coupons/${id}`,

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.Coupons,
			providesTags: ["Coupons"],
		}),

		// edit coupon by id
		editCouponById: builder.mutation({
			query: ({ id, body }) => {
				return {
					url: `coupons/${id}`,
					method: "POST",
					body: body,
				};
			},
			invalidatesTags: ["Coupons"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetCouponsQuery,
	useDeleteCouponMutation,
	useDeleteAllCouponsMutation,
	useChangeCouponStatusMutation,
	useChangeAllCouponsStatusMutation,
	useSearchInCouponsMutation,
	useFilterCouponsByStatusMutation,
	useAddNewCouponMutation,
	useGetCouponByIdQuery,
	useEditCouponByIdMutation,
} = couponApi;
