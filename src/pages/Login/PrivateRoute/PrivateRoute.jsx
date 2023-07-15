import { Navigate, useLocation } from "react-router-dom";
import { useCookies } from "react-cookie";

const PrivateRoute = ({ children }) => {
	const location = useLocation();
	const [cookies] = useCookies(["access_token"]);

	return cookies?.access_token ? (
		children
	) : (
		<Navigate state={{ from: location }} replace to='/login' />
	);
};

export default PrivateRoute;
