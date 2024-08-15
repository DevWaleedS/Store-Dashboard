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

	// This is modal verification Store Status message That is display after dashboard is open
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (
				!checkoutSuccess &&
				!failedSuccess &&
				showVerification &&
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
					!checkoutSuccess &&
					!failedSuccess &&
					showVerification?.setting_is_done &&
					showVerification?.verification_status !== "تم التوثيق" &&
					!showVerification?.package_paid &&
					showVerification?.package_id) ||
				(showVerification &&
					!checkoutSuccess &&
					!failedSuccess &&
					showVerification?.setting_is_done &&
					showVerification?.verification_status === "تم التوثيق" &&
					!showVerification?.package_paid)
			) {
				navigate("/");
				dispatchVerifyModal(openVerifyModal());
			}
		}, 0);

		return () => {
			clearTimeout(debounce);
			dispatchVerifyModal(closeVerifyModal());
		};
	}, [showVerification, dispatchVerifyModal, navigate]);
};

export default UseAccountVerification;
