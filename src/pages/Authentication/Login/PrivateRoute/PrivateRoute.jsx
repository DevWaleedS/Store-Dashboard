import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const location = useLocation();

	// Simplified token retrieval from cookies only.
	const store_token = localStorage.getItem("store_token");

	// Redirect if no token is found. No need to modify the cookie here.
	return store_token ? (
		children
	) : (
		<Navigate to='/auth/login' state={{ from: location }} replace />
	);
};

export default PrivateRoute;
