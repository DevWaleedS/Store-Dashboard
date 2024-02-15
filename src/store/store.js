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
import ProductOptionModal from "./slices/ProductOptionModal";
import AddBankAccountModal from "./slices/AddBankAccountModal";
import EditBankAccountModal from "./slices/EditBankAccountModal";
import SuccessMessageModalSlice from "./slices/SuccessMessageModalSlice";
import BankAccStatusCommentModal from "./slices/BankAccStatusCommentModal";

// store
export const store = configureStore({
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
	reducer: {
		AddActivity: AddActivity,
		ReplyModal: ReplyModalSlice,
		VideoModal: VideoModalSlice,
		AddSubActivity: AddSubActivity,
		VerifyModal: VerifyStoreModalSlice,
		ProductOptionModal: ProductOptionModal,
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
	},
});
