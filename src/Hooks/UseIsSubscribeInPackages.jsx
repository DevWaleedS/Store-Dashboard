import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useShowVerificationQuery } from "../store/apiSlices/verifyStoreApi";

const UseIsSubscribeInPackages = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const { data: showVerification } = useShowVerificationQuery();

	const checkoutSuccess = location.pathname === "/checkout-packages/success";
	const failedSuccess = location.pathname === "/checkout-packages/failed";

	useEffect(() => {
		setTimeout(() => {
			if (
				showVerification &&
				!checkoutSuccess &&
				!failedSuccess &&
				showVerification?.verification_status === "تم التوثيق"
			) {
				if (!showVerification?.package_id) {
					navigate("/upgrade-packages");
				} else if (!showVerification?.package_paid) {
					navigate("/checkout-packages");
				}
			}
		}, 1000);
	}, [showVerification, checkoutSuccess, failedSuccess, navigate]);
};

export default UseIsSubscribeInPackages;
