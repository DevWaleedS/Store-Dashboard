import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShowVerificationQuery } from "../store/apiSlices/verifyStoreApi";

const UseIsSubscribeInPackages = () => {
	const navigate = useNavigate();
	const { data: showVerification } = useShowVerificationQuery();

	useEffect(() => {
		if (showVerification) {
			if (!showVerification?.package_paid) {
				navigate("/checkout-packages");
			} else if (!showVerification?.package_id) {
				navigate("/upgrade-packages");
			}
		}
	}, [showVerification?.package_paid, showVerification?.package_id, navigate]);
};

export default UseIsSubscribeInPackages;
