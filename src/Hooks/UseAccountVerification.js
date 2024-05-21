import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShowVerificationQuery } from "../store/apiSlices/verifyStoreApi";

const UseAccountVerification = () => {
	const navigate = useNavigate();
	const { data: showVerification } = useShowVerificationQuery();

	useEffect(() => {
		if (showVerification?.verification_status !== "تم التوثيق") {
			navigate("/");
		}
	}, [showVerification?.verification_status, navigate]);
};

export default UseAccountVerification;
