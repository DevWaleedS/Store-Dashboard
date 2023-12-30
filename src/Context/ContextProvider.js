import React, { useEffect, useState } from "react";

import Context from "./context";

const ContextProvider = (props) => {
	const [access_token, setAccess_token] = useState();
	const [title, setEndActionTitle] = useState(null);
	const [subCategories, setSubCategories] = useState([]);
	const [productsData, setProductsData] = React.useState();
	const [actionWarning, setActionWarning] = useState(false);
	const [navbarZindex, setNavbarZindex] = useState(false);
	// to handle CoursesTraining and Explain in Academy Section
	const [togglePage, setTogglePag] = useState(1);
	const [email, setEmail] = useState(null);
	const [resendButtonDisabled, setResendButtonDisabled] = useState(false);
	const [disapledBtn, setDisabledBtn] = useState(false);
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [message, setMessage] = useState("");

	useEffect(() => {
		if (title) {
			setTimeout(() => {
				setEndActionTitle(null);
				setActionWarning(false);
			}, 1000);
		}
	}, [title]);

	const context = {
		access_token,
		setAccess_token,
		title,
		setEndActionTitle,
		actionWarning,
		setActionWarning,
		setSubCategories,
		subCategories,
		setProductsData,
		productsData,
		navbarZindex,
		setNavbarZindex,
		togglePage,
		setTogglePag,
		email,
		setEmail,
		resendButtonDisabled,
		setResendButtonDisabled,
		disapledBtn,
		setDisabledBtn,
		showAlertModal,
		setShowAlertModal,
		message,
		setMessage,
	};

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default ContextProvider;
