import { Navigate, useLocation } from "react-router-dom";
import { useStoreTokenQuery } from "../../../../store/apiSlices/getStoreTokenApi";
import { useEffect } from "react";

const PrivateRoute = ({ children }) => {
	const location = useLocation();

	const { data } = useStoreTokenQuery();
	const storeToken = localStorage.getItem("storeToken");
	const isUseLoginFunction = localStorage.getItem("isUseLoginFunction");

	useEffect(() => {
		if (!data?.data && !isUseLoginFunction) {
			localStorage.clear();
		}
	}, [data?.data, isUseLoginFunction]);

	// Redirect if no token is found. No need to modify the cookie here.
	return storeToken || data?.data ? (
		children
	) : (
		<Navigate to='/auth/login' state={{ from: location }} replace />
	);
};

export default PrivateRoute;
