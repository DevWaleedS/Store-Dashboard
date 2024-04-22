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
import OrdersSlice from "./slices/OrdersSlice";
import CouponsSlice from "./slices/CouponsSlice";
import EmptyCartsSlice from "./slices/EmptyCartsSlice";
import PostalSubscriptionsSlice from "./slices/PostalSubscriptionsSlice";
import RatingSlice from "./slices/RatingSlice";
import PagesSlice from "./slices/PagesSlice";
import AcademySlice from "./slices/AcademySlice";
import TechnicalSupportSlice from "./slices/TechnicalSupportSlice";
import SouqOtlobhaSlice from "./slices/SouqOtlobhaSlice";
import NotificationsSlice from "./slices/NotificationsSlice";
import CategoriesSelectSlice from "./slices/CategoriesSelectSlice";
import { mainPageApi } from "./apiSlices/mainPageApi";
import { categoriesApi } from "./apiSlices/categoriesApi";
import { selectCategoriesApi } from "./apiSlices/selectCategoriesApi";
import { productsApi } from "./apiSlices/productsApi";
import ChangeCategoriesForSomeSelectedProductsSlice from "./slices/ChangeCategoriesForSomeSelectedProducts";
import { ordersApi } from "./apiSlices/ordersApi";
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
import { getShippingCitiesApi } from "./apiSlices/getShippingCitiesApi";
import { platformServicesApi } from "./apiSlices/platformServicesApi";

// store
export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(
			pagesApi.middleware,
			loginApi.middleware,
			ordersApi.middleware,
			couponApi.middleware,
			ratingApi.middleware,
			AcademyApi.middleware,
			mainPageApi.middleware,
			productsApi.middleware,
			categoriesApi.middleware,
			emptyCartsApi.middleware,
			notificationsApi.middleware,
			technicalSupportApi.middleware,
			platformServicesApi.middleware,
			selectCategoriesApi.middleware,
			getShippingCitiesApi.middleware,
			postalSubscriptionsApi.middleware
		),
	reducer: {
		[pagesApi.reducerPath]: pagesApi.reducer,
		[loginApi.reducerPath]: loginApi.reducer,
		[ordersApi.reducerPath]: ordersApi.reducer,
		[ratingApi.reducerPath]: ratingApi.reducer,
		[couponApi.reducerPath]: couponApi.reducer,
		[AcademyApi.reducerPath]: AcademyApi.reducer,
		[mainPageApi.reducerPath]: mainPageApi.reducer,
		[productsApi.reducerPath]: productsApi.reducer,
		[categoriesApi.reducerPath]: categoriesApi.reducer,
		[emptyCartsApi.reducerPath]: emptyCartsApi.reducer,
		[notificationsApi.reducerPath]: notificationsApi.reducer,
		[technicalSupportApi.reducerPath]: technicalSupportApi.reducer,
		[selectCategoriesApi.reducerPath]: selectCategoriesApi.reducer,
		[platformServicesApi.reducerPath]: platformServicesApi.reducer,
		[getShippingCitiesApi.reducerPath]: getShippingCitiesApi.reducer,
		[postalSubscriptionsApi.reducerPath]: postalSubscriptionsApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [platformServicesApi.reducerPath]: platformServicesApi.reducer,
		// [categoriesSlice.reducerPath]: categoriesSlice.reducer,
		AddActivity: AddActivity,
		ReplyModal: ReplyModalSlice,
		VideoModal: VideoModalSlice,
		AddSubActivity: AddSubActivity,
		VerifyModal: VerifyStoreModalSlice,
		CategoriesSelect: CategoriesSelectSlice,
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
		OrdersSlice,
		CouponsSlice,
		EmptyCartsSlice,
		PostalSubscriptionsSlice,
		RatingSlice,
		PagesSlice,
		AcademySlice,
		TechnicalSupportSlice,
		SouqOtlobhaSlice,
		NotificationsSlice,

		ChangeCategoriesForSomeSelectedProductsSlice,
	},
});

setupListeners(store.dispatch);
