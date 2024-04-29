import React, { useState } from "react";

export const UserAuth = React.createContext();

const UserAuthorProvider = ({ children }) => {
	const [rememberMe, setRememberMe] = useState({
		username: "",
		password: "",
		remember_me: false,
	});

	const context = {
		rememberMe,
		setRememberMe,
	};

	return <UserAuth.Provider value={context}>{children}</UserAuth.Provider>;
};

export default UserAuthorProvider;
