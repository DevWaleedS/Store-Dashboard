import { Navigate, useLocation } from "react-router-dom";

// import { useCookies } from "react-cookie";
import { useContext } from "react";
import { UserAuth } from "../../../Context/UserAuthorProvider";

const PrivateRoute = ({ children }) => {
	// const [cookies] = useCookies(["access_token"]);
	const location = useLocation();

	const userAuthored = useContext(UserAuth);
	const { userAuthor } = userAuthored;

	return userAuthor ? (
		children
	) : (
		<Navigate state={{ from: location }} replace to='/login' />
	);
};

export default PrivateRoute;
