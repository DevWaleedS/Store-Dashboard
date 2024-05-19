import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Function to prepare headers for HTTP requests
const prepareHeaders = (headers) => {
	const token = localStorage.getItem("store_token");

	if (token) {
		headers.set("Authorization", `Bearer ${token}`);
	}

	return headers;
};

// Create API slice
export const shippingCompaniesApi = createApi({
	reducerPath: "shippingCompaniesApi",
	baseQuery: fetchBaseQuery({
		baseUrl: "https://backend.atlbha.com/api/Store/",
		prepareHeaders,
	}),
	tagTypes: ["ShippingCompanies"],
	endpoints: (builder) => ({
		// get Shipping Companies endpoint..
		getShippingCompanies: builder.query({
			query: () => `shippingtype`,
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
					body: body,
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
