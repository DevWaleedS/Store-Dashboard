import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const location = useLocation();

	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];

	return store_token ? (
		children
	) : (
		<Navigate state={{ from: location }} replace to='/auth/login' />
	);
};

export default PrivateRoute;
