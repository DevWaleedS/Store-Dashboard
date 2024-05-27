import { createApi } from "@reduxjs/toolkit/query/react";
import axiosBaseQuery from "../../API/axiosBaseQuery";

// Create API slice
export const shippingCompaniesApi = createApi({
	reducerPath: "shippingCompaniesApi",

	// base url
	baseQuery: axiosBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
	}),
	tagTypes: ["ShippingCompanies"],

	endpoints: (builder) => ({
		// get Shipping Companies endpoint..
		getShippingCompanies: builder.query({
			query: () => ({ url: `shippingtype` }),
			providesTags: (result, error, id) => [{ type: "ShippingCompanies", id }],

			// Pick out data and prevent nested properties in a hook or selector
			transformResponse: (response, meta, arg) => response.data?.shippingtypes,
		}),

		// change Shipping Compony Status
		changeShippingComponyStatus: builder.mutation({
			query: (id) => {
				return {
					url: `changeShippingtypeStatus/${id}`,
					method: "GET",
				};
			},
			invalidatesTags: ["ShippingCompanies"],
		}),

		// change Shipping Compony Status
		changeOtherShippingCompanyStatusAndAddPrice: builder.mutation({
			query: ({
				otherShipCompanyId,
				otherShipCompanyPrice,
				otherShipCompanyDuration,
			}) => {
				return {
					url: `changeShippingtypeStatus/${otherShipCompanyId}?price=${otherShipCompanyPrice}&time=${otherShipCompanyDuration}`,
					method: "GET",
				};
			},
			invalidatesTags: ["ShippingCompanies"],
		}),

		//update Price for Other Shipping Company
		updatePriceForOtherShippingCompany: builder.mutation({
			query: ({ otherShipCompanyId, body }) => {
				return {
					url: `updatePrice/${otherShipCompanyId}`,
					method: "POST",
					data: body,
				};
			},
			invalidatesTags: ["ShippingCompanies"],
		}),
	}),
});

// Export endpoints and hooks
export const {
	useGetShippingCompaniesQuery,
	useChangeShippingComponyStatusMutation,
	useChangeOtherShippingCompanyStatusAndAddPriceMutation,
	useUpdatePriceForOtherShippingCompanyMutation,
} = shippingCompaniesApi;
