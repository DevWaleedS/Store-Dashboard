import { Navigate, useLocation } from "react-router-dom";
import GetStoreTokenFromLocalStorage from "../../../../API/GetStoreTokenFromLocalStorage";

const PrivateRoute = ({ children }) => {
	const location = useLocation();

	// Simplified token retrieval from cookies only.
	const storeToken = GetStoreTokenFromLocalStorage();

	// Redirect if no token is found. No need to modify the cookie here.
	return storeToken ? (
		children
	) : (
		<Navigate to='/auth/login' state={{ from: location }} replace />
	);
};

export default PrivateRoute;
