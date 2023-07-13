import { Navigate } from "react-router-dom";

import { useContext } from "react";
import Context from "../../../Context/context";
import RootLayout from "../../RootLayout";
import { useCookies } from "react-cookie";

const PrivateRoute = ({ children }) => {
	const [cookies] = useCookies(["access_token"]);

	return cookies.access_token ? children : <Navigate to='/login' />;
};

export default PrivateRoute;
