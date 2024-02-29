import React, { useEffect, useState } from "react";
import Context from "./context";

const ContextProvider = (props) => {
	const [access_token, setAccess_token] = useState();
	const [storeLogo, setStoreLogo] = useState(null);
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
	//product Options
	const [productHasOptions, setProductHasOptions] = useState(false);

	const [attributes, setAttributes] = useState([]);
	const [optionsSection, setOptionsSection] = useState([
		{
			name: "",
			select_value: "نص",
			values: [
				{
					id: 9828394,
					title: "",
					color: "#000000",
					image: "",
					previewImage: "",
					defaultOption: false,
				},
			],
		},
	]);

	const clearOptions = () => {
		setProductHasOptions(false);

		setAttributes([]);
		setOptionsSection([
			{
				name: "",
				select_value: "نص",
				values: [
					{
						id: 9828394,
						title: "",
						color: "#000000",
						image: "",
						previewImage: "",
						defaultOption: false,
					},
				],
			},
		]);
	};

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
		storeLogo,
		setStoreLogo,
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
		//product Options
		productHasOptions,
		setProductHasOptions,

		attributes,
		setAttributes,
		optionsSection,
		setOptionsSection,
		clearOptions,
	};

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default ContextProvider;
