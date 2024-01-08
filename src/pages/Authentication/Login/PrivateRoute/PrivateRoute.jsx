import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const location = useLocation();

	const store_token =
		document.cookie
			?.split("; ")
			?.find((cookie) => cookie.startsWith("store_token="))
			?.split("=")[1] ||
		new URLSearchParams(window.location.search).get("ddsdgsfdv");

	useEffect(() => {
		if (store_token) document.cookie = `store_token=${store_token};   path=/`;
	}, [store_token]);

	return store_token ? (
		children
	) : (
		<Navigate state={{ from: location }} replace to='/auth/login' />
	);
};

export default PrivateRoute;
