import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const location = useLocation();

	const storeToken = localStorage.getItem("storeToken");

	// Redirect if no token is found. No need to modify the cookie here.
	return storeToken ? (
		children
	) : (
		<Navigate to='/auth/login' state={{ from: location }} replace />
	);
};

export default PrivateRoute;
