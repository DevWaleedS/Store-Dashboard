import React, { useEffect, useState } from "react";
import Context from "./context";
// Redux
import { useDispatch } from "react-redux";
import { closeProductOptionModal } from "../store/slices/ProductOptionModal";

const ContextProvider = (props) => {
	const [access_token, setAccess_token] = useState();
	const dispatch = useDispatch(false);
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
	const [quantityIsUnlimited, setQuantityIsUnlimited] = useState(true);
	const [attributes, setAttributes] = useState([]);
	const [optionsSection, setOptionsSection] = useState([
		{
			name: "",
			select_value: "نص",
			values: [{ id: 1, title: "", color: "#000000" }],
		},
	]);
	
	const clearOptions = () => {
		setProductHasOptions(false);
		setQuantityIsUnlimited(true);
		setAttributes([]);
		setOptionsSection([
			{
				name: "",
				select_value: "نص",
				values: [{ id: 1, title: "", color: "#000000" }],
			},
		]);
	}

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
		//product Options
		productHasOptions,
		setProductHasOptions,
		quantityIsUnlimited,
		setQuantityIsUnlimited,
		attributes,
		setAttributes,
		optionsSection,
		setOptionsSection,
		clearOptions,
	};

	return <Context.Provider value={context}>{props.children}</Context.Provider>;
};

export default ContextProvider;
