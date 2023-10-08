import { configureStore } from "@reduxjs/toolkit";
import DetailsSlice from "./slices/Details.slice";
import OrdersTablesDataSlice from "./slices/OrdersTable-slice";
import salesProductsDataSlice from "./slices/Products-sales-slice";
import CategoriesTablesDataSlice from "./slices/CategoryData-slice";
import ordersDetails from "./slices/OdersDetails-slice";
import BigOrdersTableDataSlice from "./slices/BigOrdersTableData-slice";
import BigProductsTableDataSlice from "./slices/BigProductsTableData-slice";
import CouponTableDataSlice from "./slices/CouponTableData-slice";
import CartsTablesDataSlice from "./slices/CartsTableData-slice";
import VideoModalSlice from "./slices/VideoModal-slice";
import PagesTableDataSlice from "./slices/PagesTable-slice";
import VerifyStoreModalSlice from "./slices/VerifyStoreModal-slice";
import supportTablesDataSlice from "./slices/SupportTableData-slice";
import CustomerTableDataSlice from "./slices/CustomerTableData-slice";
import ManagementTableDataSlice from "./slices/UserAndManagementTable-slice.js";
import customerDataModalSlice from "./slices/CustomerDataModal-slice";
import EditProductPageModalSlice from "./slices/EditProductPage-slice";
import EditCategoryPageSlice from "./slices/EditCategoryPage-slice";
import AddNewUserSlice from "./slices/AddNewUser-slice";
import CommentsTableDataSlice from "./slices/CommentsTable-slice";
import jobTitleDataSlice from "./slices/jobTitle-slice";
import AddNewProductSlice from "./slices/AddNewProduct-slice";
import VerifyStoreAlertModalSlice from "./slices/VerifyStoreAlertModal-slice";
import VerifyStoreAlertAfterMainModalSlice from "./slices/VerifyStoreAlertAfterMainModal-slice";
import DelegateRequestAlert from "./slices/DelegateRequestAlert-slice";
import DelegateTableDataSlice from "./slices/DelagateTable-slice";
import AddActivity from "./slices/AddActivity";
import AddSubActivity from "./slices/AddSubActivity";
import AddSubCategorySlice from "./slices/AddSubCategory-slice";
import MaintenanceModeModal from "./slices/MaintenanceModeModal";
import CelebrityMarketingModal from "./slices/CelebrityMarketingModal";
import ImportProductHintModal from "./slices/ImportProductHintModal";
import ReplyModalSlice from "./slices/ReplyModal-slice";

// store
export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: {
		details: DetailsSlice,
		ordersTablesData: OrdersTablesDataSlice,
		salesTablesData: salesProductsDataSlice,
		CategoriesTablesData: CategoriesTablesDataSlice,
		ordersDetails: ordersDetails,
		BigOrdersTableData: BigOrdersTableDataSlice,
		BigProductsTableData: BigProductsTableDataSlice,
		CouponTableData: CouponTableDataSlice,
		CartsTablesData: CartsTablesDataSlice,
		VideoModal: VideoModalSlice,
		PagesTableData: PagesTableDataSlice,
		VerifyModal: VerifyStoreModalSlice,
		supportTablesData: supportTablesDataSlice,
		CustomerTableData: CustomerTableDataSlice,
		ManagementTableData: ManagementTableDataSlice,
		customerDataModal: customerDataModalSlice,
		editProductPageModal: EditProductPageModalSlice,
		editCategoryPageModal: EditCategoryPageSlice,
		AddNewUserModal: AddNewUserSlice,
		CommentsTable: CommentsTableDataSlice,
		jobTitleData: jobTitleDataSlice,
		AddNewProduct: AddNewProductSlice,
		VerifyStoreAlertModal: VerifyStoreAlertModalSlice,
		VerifyAfterMainModal:VerifyStoreAlertAfterMainModalSlice,
		DelegateRequestAlert: DelegateRequestAlert,
		DelegateTable: DelegateTableDataSlice,
		AddActivity: AddActivity,
		AddSubActivity: AddSubActivity,
		AddSubCategorySlice: AddSubCategorySlice,
		MaintenanceModeModal: MaintenanceModeModal,
		CelebrityMarketingModal: CelebrityMarketingModal,
		ImportProductHintModal: ImportProductHintModal,
		ReplyModal: ReplyModalSlice,
	},
});
