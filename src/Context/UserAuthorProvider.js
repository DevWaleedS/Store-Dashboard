import React, { createContext, useState } from "react";

export const UserAuth = createContext({});

/**const [rememberUsername, setRememberUserName] = useState(null);
	const [rememberPassword, setRememberPassword] = useState(null);
	const [rememberStatus, setRememberStatus] = useState(false);

	const [userInfo, setUserInfo] = useState({});

	const context = {
		userAuthor,
		setUserAuthor,
		userInfo,
		setUserInfo,

		rememberUsername,
		setRememberUserName,
		rememberPassword,
		setRememberPassword,
		rememberStatus,
		setRememberStatus,
	}; */

const UserAuthorProvider = ({ children }) => {
	const [userAuthor, setUserAuthor] = useState(null);
	const [rememberMe, setRememberMe] = useState({
		username: "",
		password: "",
		remember_me: false,
	});
	const [userInfo, setUserInfo] = useState({});

	const context = {
		userAuthor,
		setUserAuthor,
		userInfo,
		setUserInfo,

		rememberMe,
		setRememberMe,
	};

	return <UserAuth.Provider value={context}>{children}</UserAuth.Provider>;
};

export default UserAuthorProvider;
