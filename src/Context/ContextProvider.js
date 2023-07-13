import React, { useEffect, useState } from "react";

import Context from "./context";

const ContextProvider = (props) => {
	// const [access_token, setAccess_token] = useState();
	const [title, setEndActionTitle] = useState(null);
	const [subCategories, setSubCategories] = useState([]);
	const [productsData, setProductsData] = React.useState();
	const [actionWarning, setActionWarning] = useState(false);

	const [email, setEmail] = useState(null);
	const [resetPasswordToken, setResetPasswordToken] = useState(null);
	const [resendButtonDisabled, setResendButtonDisabled] = useState(false);

	useEffect(() => {
		if (title) {
			setTimeout(() => {
				setEndActionTitle(null);
				setActionWarning(false);
			}, 3000);
		}
	}, [title]);

	const context = {
		// access_token,
		// setAccess_token,
		title,
		setEndActionTitle,
		actionWarning,
		setActionWarning,
		setSubCategories,
		subCategories,
		setProductsData,
		productsData,
		email,
		setEmail,
		resetPasswordToken,
		setResetPasswordToken,
		resendButtonDisabled,
		setResendButtonDisabled,
	};

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default ContextProvider;
