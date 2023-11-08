import React, { useState } from "react";

export const ResetPasswordContext = React.createContext();

const ResetPasswordProvider = (props) => {
	const [email, setEmail] = useState(null);
	const [userPhoneNumber, setUserPhoneNumber] = useState(null);
	const [resetPasswordToken, setResetPasswordToken] = useState(null);
	const [resendButtonDisabled, setResendButtonDisabled] = useState(false);
	const [disapledBtn, setDisabledBtn] = useState(false);
	const [showAlertModal, setShowAlertModal] = useState(false);
	const [message, setMessage] = useState("");

	const context = {
		email,
		setEmail,
		userPhoneNumber,
		setUserPhoneNumber,
		resetPasswordToken,
		setResetPasswordToken,
		resendButtonDisabled,
		setResendButtonDisabled,
		disapledBtn,
		setDisabledBtn,
		showAlertModal,
		setShowAlertModal,
		message,
		setMessage,
	};

	return (
		<ResetPasswordContext.Provider value={context}>
			{props.children}
		</ResetPasswordContext.Provider>
	);
};

export default ResetPasswordProvider;
