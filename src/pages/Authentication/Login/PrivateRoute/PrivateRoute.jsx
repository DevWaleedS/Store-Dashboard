import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }) => {
	const location = useLocation();
	const store_token = localStorage.getItem("store_token");

	return store_token ? (
		children
	) : (
		<Navigate state={{ from: location }} replace to='/auth/login' />
	);
};

export default PrivateRoute;
