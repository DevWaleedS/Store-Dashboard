import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShowVerificationQuery } from "../store/apiSlices/verifyStoreApi";
import { useDispatch } from "react-redux";

import {
	closeVerifyModal,
	openVerifyModal,
} from "../store/slices/VerifyStoreModal-slice";

const UseAccountVerification = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatchVerifyModal = useDispatch(false);
	const { data: showVerification } = useShowVerificationQuery();

	const checkoutSuccess =
		location.pathname === "/checkout-packages/success" ||
		location.pathname === "/Products/SouqOtlobha/success";
	const failedSuccess =
		location.pathname === "/checkout-packages/failed" ||
		location.pathname === "/Products/SouqOtlobha/failed";
	const checkoutPackagesURL = location.pathname === "/checkout-packages";

	// This is modal verification Store Status message That is display after dashboard is open
	useEffect(() => {
		if (
			showVerification &&
			!checkoutSuccess &&
			!failedSuccess &&
			!showVerification?.setting_is_done &&
			showVerification?.verification_status !== "تم التوثيق" &&
			!showVerification?.package_paid
		) {
			navigate("/MainInformation");
		} else if (
			(showVerification &&
				!checkoutSuccess &&
				!failedSuccess &&
				showVerification?.setting_is_done &&
				showVerification?.verification_status !== "تم التوثيق" &&
				showVerification?.package_paid &&
				showVerification?.package_id) ||
			(showVerification &&
				!checkoutPackagesURL &&
				!checkoutSuccess &&
				!failedSuccess &&
				showVerification?.setting_is_done &&
				showVerification?.verification_status !== "تم التوثيق" &&
				!showVerification?.package_paid &&
				showVerification?.package_id) ||
			(showVerification &&
				!checkoutPackagesURL &&
				!checkoutSuccess &&
				!failedSuccess &&
				showVerification?.setting_is_done &&
				showVerification?.verification_status === "تم التوثيق" &&
				!showVerification?.package_paid) ||
			(showVerification &&
				!checkoutPackagesURL &&
				!checkoutSuccess &&
				!failedSuccess &&
				showVerification?.setting_is_done &&
				showVerification?.verification_status !== "تم التوثيق" &&
				!showVerification?.package_paid &&
				!showVerification?.package_id)
		) {
			navigate("/");
			dispatchVerifyModal(openVerifyModal());
		}
	}, [showVerification, dispatchVerifyModal, navigate]);
};

export default UseAccountVerification;
