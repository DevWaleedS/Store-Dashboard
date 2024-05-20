import { configureStore } from "@reduxjs/toolkit";
import AddActivity from "./slices/AddActivity";
import AddSubActivity from "./slices/AddSubActivity";
import VideoModalSlice from "./slices/VideoModal-slice";
import ReplyModalSlice from "./slices/ReplyModal-slice";
import AddSubCategorySlice from "./slices/AddSubCategory-slice";
import MaintenanceModeModal from "./slices/MaintenanceModeModal";
import ImportProductHintModal from "./slices/ImportProductHintModal";
import VerifyStoreModalSlice from "./slices/VerifyStoreModal-slice";
import DelegateRequestAlert from "./slices/DelegateRequestAlert-slice";
import VerifyStoreAlertModalSlice from "./slices/VerifyStoreAlertModal-slice";
import VerifyStoreAlertAfterMainModalSlice from "./slices/VerifyStoreAlertAfterMainModal-slice";
import AddBankAccountModal from "./slices/AddBankAccountModal";
import EditBankAccountModal from "./slices/EditBankAccountModal";
import SuccessMessageModalSlice from "./slices/SuccessMessageModalSlice";
import BankAccStatusCommentModal from "./slices/BankAccStatusCommentModal";
import BankAccountAlert from "./slices/BankAccountAlert";
import CategoriesSlice from "./slices/CategoriesSlice";
import ProductsSlice from "./slices/ProductsSlice";

import { mainPageApi } from "./apiSlices/mainPageApi";
import { categoriesApi } from "./apiSlices/categoriesApi";

import { productsApi } from "./apiSlices/productsApi";
import ChangeCategoriesForSomeSelectedProductsSlice from "./slices/ChangeCategoriesForSomeSelectedProducts";
import { ordersApi } from "./apiSlices/ordersApiSlices/ordersApi";
import { returnOrdersApi } from "./apiSlices/ordersApiSlices/returnOrdersApi";
import { loginApi } from "./apiSlices/loginApi";
import { couponApi } from "./apiSlices/couponApi";
import { emptyCartsApi } from "./apiSlices/emptyCartsApi";
import { postalSubscriptionsApi } from "./apiSlices/postalSubscriptionsApi";
import { ratingApi } from "./apiSlices/ratingApi";
import { pagesApi } from "./apiSlices/pagesApi";
import { AcademyApi } from "./apiSlices/academyApi";
import { technicalSupportApi } from "./apiSlices/technicalSupportApi";
import { notificationsApi } from "./apiSlices/notificationsApi";
import { setupListeners } from "@reduxjs/toolkit/dist/query";
import { selectShippingCitiesApi } from "./apiSlices/selectorsApis/selectShippingCitiesApi";
import { platformServicesApi } from "./apiSlices/platformServicesApi";

// selector apis
import { selectCategoriesApi } from "./apiSlices/selectorsApis/selectCategoriesApi";
import { selectImportProductsApi } from "./apiSlices/selectorsApis/selectImportProductsApi";
import { selectPaymentsTypesApi } from "./apiSlices/selectorsApis/selectPaymentsTypesApi";
import { SEOImprovementsApi } from "./apiSlices/SEOImprovementsApi";
import { selectCitiesApi } from "./apiSlices/selectorsApis/selectCitiesApi";
import { requestDelegateApi } from "./apiSlices/requestDelegateApi";
import { selectPageCategoriesApi } from "./apiSlices/selectorsApis/selectPageCategoriesApi";
import { templateSettingApi } from "./apiSlices/templateSettingApi";
import { paintStoreApi } from "./apiSlices/paintStoreApi";
import { verifyStoreApi } from "./apiSlices/verifyStoreApi";
import { selectEtlobahCategoryApi } from "./apiSlices/selectorsApis/selectEtlobahCategoryApi";
import { selectEtlbohaSubCategoriesApi } from "./apiSlices/selectorsApis/selectEtlbohaSubCategoriesApi";
import { socialPagesApi } from "./apiSlices/socialPagesApi";
import { shippingCompaniesApi } from "./apiSlices/shippingCompaniesApi";
import { paymentGatewaysApi } from "./apiSlices/paymentGatewaysApi";
import { walletApi } from "./apiSlices/walletApi";
import { selectBanksApi } from "./apiSlices/selectorsApis/selectBanksApi";
import { mainInformationApi } from "./apiSlices/mainInformationApi";
import { selectCountriesApi } from "./apiSlices/selectorsApis/selectCountriesApi";
import { maintenanceModeApi } from "./apiSlices/maintenanceModeApi";
import { reportsApi } from "./apiSlices/reportsApi";
import { evaluationThePlatformApi } from "./apiSlices/evaluationThePlatformApi";
import { editUserDetailsApi } from "./apiSlices/editUserDetailsApi";
import { logOutApi } from "./apiSlices/logOutApi";
import { registrationMarketerStatusApi } from "./apiSlices/registrationMarketerStatusApi";
import { souqOtlobhaProductsApi } from "./apiSlices/souqOtlobhaProductsApi";
import { importPaymentMethodApi } from "./apiSlices/importPaymentMethodApi";
import { defaultAddressApi } from "./apiSlices/selectorsApis/defaultAddressApi";
import { selectShippingCompaniesApi } from "./apiSlices/selectorsApis/selectShippingCompaniesApi";
import { getStoreTokenApi } from "./apiSlices/getStoreTokenApi";

// store
export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			pagesApi.middleware,
			loginApi.middleware,
			logOutApi.middleware,
			walletApi.middleware,
			ordersApi.middleware,
			couponApi.middleware,
			ratingApi.middleware,
			reportsApi.middleware,
			AcademyApi.middleware,
			mainPageApi.middleware,
			productsApi.middleware,
			categoriesApi.middleware,
			emptyCartsApi.middleware,
			paintStoreApi.middleware,
			verifyStoreApi.middleware,
			socialPagesApi.middleware,
			selectBanksApi.middleware,
			returnOrdersApi.middleware,
			selectCitiesApi.middleware,
			getStoreTokenApi.middleware,
			notificationsApi.middleware,
			defaultAddressApi.middleware,
			editUserDetailsApi.middleware,
			mainInformationApi.middleware,
			selectCountriesApi.middleware,
			maintenanceModeApi.middleware,
			paymentGatewaysApi.middleware,
			templateSettingApi.middleware,
			requestDelegateApi.middleware,
			SEOImprovementsApi.middleware,
			technicalSupportApi.middleware,
			platformServicesApi.middleware,
			selectCategoriesApi.middleware,
			shippingCompaniesApi.middleware,
			importPaymentMethodApi.middleware,
			souqOtlobhaProductsApi.middleware,
			selectPaymentsTypesApi.middleware,
			postalSubscriptionsApi.middleware,
			selectShippingCitiesApi.middleware,
			selectPageCategoriesApi.middleware,
			selectImportProductsApi.middleware,
			selectEtlobahCategoryApi.middleware,
			evaluationThePlatformApi.middleware,
			selectShippingCompaniesApi.middleware,
			selectEtlbohaSubCategoriesApi.middleware,
			registrationMarketerStatusApi.middleware
		),
	reducer: {
		[selectEtlbohaSubCategoriesApi.reducerPath]:
			selectEtlbohaSubCategoriesApi.reducer,
		[registrationMarketerStatusApi.reducerPath]:
			registrationMarketerStatusApi.reducer,
		[pagesApi.reducerPath]: pagesApi.reducer,
		[loginApi.reducerPath]: loginApi.reducer,
		[logOutApi.reducerPath]: logOutApi.reducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
		[walletApi.reducerPath]: walletApi.reducer,
		[ratingApi.reducerPath]: ratingApi.reducer,
		[couponApi.reducerPath]: couponApi.reducer,
		[reportsApi.reducerPath]: reportsApi.reducer,
		[AcademyApi.reducerPath]: AcademyApi.reducer,
		[mainPageApi.reducerPath]: mainPageApi.reducer,
		[productsApi.reducerPath]: productsApi.reducer,
		[paintStoreApi.reducerPath]: paintStoreApi.reducer,
		[categoriesApi.reducerPath]: categoriesApi.reducer,
		[emptyCartsApi.reducerPath]: emptyCartsApi.reducer,
		[socialPagesApi.reducerPath]: socialPagesApi.reducer,
		[verifyStoreApi.reducerPath]: verifyStoreApi.reducer,
		[selectBanksApi.reducerPath]: selectBanksApi.reducer,
		[selectCitiesApi.reducerPath]: selectCitiesApi.reducer,
		[returnOrdersApi.reducerPath]: returnOrdersApi.reducer,
		[getStoreTokenApi.reducerPath]: getStoreTokenApi.reducer,
		[notificationsApi.reducerPath]: notificationsApi.reducer,
		[defaultAddressApi.reducerPath]: defaultAddressApi.reducer,
		[maintenanceModeApi.reducerPath]: maintenanceModeApi.reducer,
		[selectCountriesApi.reducerPath]: selectCountriesApi.reducer,
		[templateSettingApi.reducerPath]: templateSettingApi.reducer,
		[paymentGatewaysApi.reducerPath]: paymentGatewaysApi.reducer,
		[requestDelegateApi.reducerPath]: requestDelegateApi.reducer,
		[mainInformationApi.reducerPath]: mainInformationApi.reducer,
		[SEOImprovementsApi.reducerPath]: SEOImprovementsApi.reducer,
		[editUserDetailsApi.reducerPath]: editUserDetailsApi.reducer,
		[technicalSupportApi.reducerPath]: technicalSupportApi.reducer,
		[selectCategoriesApi.reducerPath]: selectCategoriesApi.reducer,
		[platformServicesApi.reducerPath]: platformServicesApi.reducer,
		[shippingCompaniesApi.reducerPath]: shippingCompaniesApi.reducer,
		[postalSubscriptionsApi.reducerPath]: postalSubscriptionsApi.reducer,
		[souqOtlobhaProductsApi.reducerPath]: souqOtlobhaProductsApi.reducer,
		[importPaymentMethodApi.reducerPath]: importPaymentMethodApi.reducer,
		[selectPaymentsTypesApi.reducerPath]: selectPaymentsTypesApi.reducer,
		[selectImportProductsApi.reducerPath]: selectImportProductsApi.reducer,
		[selectShippingCitiesApi.reducerPath]: selectShippingCitiesApi.reducer,
		[selectPageCategoriesApi.reducerPath]: selectPageCategoriesApi.reducer,
		[selectEtlobahCategoryApi.reducerPath]: selectEtlobahCategoryApi.reducer,
		[evaluationThePlatformApi.reducerPath]: evaluationThePlatformApi.reducer,
		[selectShippingCompaniesApi.reducerPath]:
			selectShippingCompaniesApi.reducer,

		AddActivity: AddActivity,
		ReplyModal: ReplyModalSlice,
		VideoModal: VideoModalSlice,
		AddSubActivity: AddSubActivity,
		VerifyModal: VerifyStoreModalSlice,
		AddSubCategorySlice: AddSubCategorySlice,
		MaintenanceModeModal: MaintenanceModeModal,
		DelegateRequestAlert: DelegateRequestAlert,
		AddBankAccountModal: AddBankAccountModal,
		EditBankAccountModal: EditBankAccountModal,
		ImportProductHintModal: ImportProductHintModal,
		VerifyStoreAlertModal: VerifyStoreAlertModalSlice,
		VerifyAfterMainModal: VerifyStoreAlertAfterMainModalSlice,
		SuccessMessage: SuccessMessageModalSlice,
		BankAccStatusCommentModal,
		BankAccountAlert,
		CategoriesSlice,
		ProductsSlice,

		ChangeCategoriesForSomeSelectedProductsSlice,
	},
});

setupListeners(store.dispatch);
