import React, { useState } from "react";

export const UserAuth = React.createContext();

const UserAuthorProvider = ({ children }) => {
	const [userInfo, setUserInfo] = useState({});

	const [rememberMe, setRememberMe] = useState({
		username: "",
		remember_me: false,
	});

	const context = {
		userInfo,
		setUserInfo,
		rememberMe,
		setRememberMe,
	};

	return <UserAuth.Provider value={context}>{children}</UserAuth.Provider>;
};

export default UserAuthorProvider;
