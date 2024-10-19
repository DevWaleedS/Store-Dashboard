import React, { useEffect, useState } from "react";
import Context from "./context";

import { v4 as uuidv4 } from "uuid";

const ContextProvider = (props) => {
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
					id: uuidv4(),
					title: "",
					color: "#000000",
					image: "",
					previewImage: "",
					defaultOption: false,
					price: "",
					period: "",
					discount_price: "",
				},
			],
		},
	]);

	// services options
	const [serviceHasOptions, setServiceHasOptions] = useState(false);
	const [serviceAttributes, setServiceAttributes] = useState([]);

	const [serviceOptionsSection, setServiceOptionsSection] = useState([
		{
			name: "",
			select_value: "نص",
			values: [
				{
					id: uuidv4(),
					title: "",
					price: "",
					period: "",
					discount_price: "",
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
						id: uuidv4() + 1,
						title: "",
						color: "#000000",
						image: "",
						previewImage: "",
						defaultOption: false,
						price: "",
						period: "",
						discount_price: "",
					},
				],
			},
		]);
	};

	const clearServicesOptions = () => {
		setServiceHasOptions(false);

		setServiceAttributes([]);
		setServiceOptionsSection([
			{
				name: "",
				select_value: "نص",
				values: [
					{
						id: uuidv4() + 1,
						title: "",
						price: "",
						period: "",
						discount_price: "",
					},
				],
			},
		]);
	};

	/* ====================================================================== */

	useEffect(() => {
		if (title) {
			setTimeout(() => {
				setEndActionTitle(null);
				setActionWarning(false);
			}, 1000);
		}
	}, [title]);

	const context = {
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
		productHasOptions,
		setProductHasOptions,

		attributes,
		setAttributes,
		optionsSection,
		setOptionsSection,
		clearOptions,

		serviceAttributes,
		setServiceAttributes,
		serviceOptionsSection,
		setServiceOptionsSection,
		clearServicesOptions,
		serviceHasOptions,
		setServiceHasOptions,
	};

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default ContextProvider;
