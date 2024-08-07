import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShowVerificationQuery } from "../store/apiSlices/verifyStoreApi";
import { useGetUpgradePackagesQuery } from "../store/apiSlices/upgradePackagesApi";

const UseIsSubscribeInPackages = () => {
	const navigate = useNavigate();
	const { data: showVerification } = useShowVerificationQuery();
	const { data: upgradePackages } = useGetUpgradePackagesQuery();

	useEffect(() => {
		if (!showVerification?.package_paid) {
			navigate("/checkout-packages");
		}
		if (!showVerification?.package_id) {
			navigate("/upgrade-packages");
		}
	}, [showVerification?.package_paid, showVerification?.package_id, navigate]);
};

export default UseIsSubscribeInPackages;
