import React, { useContext, useEffect, useState } from "react";

// Third party
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Components
import { AlertModal } from "../AlertModal";
import LogoHeader from "../../../LogoHeader/LogoHeader";

// Styles
import "./RestorePassword.css";

// Context
import { ResetPasswordContext } from "../../../../../Context/ResetPasswordProvider";

// Icons
import { SvgComponent, SvgKey } from "../../../../../data/Icons";

const RestorePassword = () => {
	const navigate = useNavigate();
	const ResetPasswordInfo = useContext(ResetPasswordContext);
	const {
		setUserPhoneNumber,
		setResendButtonDisabled,
		setDisabledBtn,
		showAlertModal,
		setShowAlertModal,
		message,
		setMessage,
	} = ResetPasswordInfo;

	// to send code on your email
	const [phoneNumber, setPhoneNumber] = useState("");
	const [phoneNumberError, setPhoneNumberError] = useState("");

	// phone number regex
	const PHONE_REGEX = /^(5\d{8})$/;
	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
	// TO HANDLE VALIDATION USER PHONE NUMBER
	useEffect(() => {
		const PhoneNumberValidation = PHONE_REGEX.test(phoneNumber);
		setValidPhoneNumber(PhoneNumberValidation);
	}, [phoneNumber]);

	// to close Alert modal after timer end
	useEffect(() => {
		if (showAlertModal) {
			setTimeout(() => {
				setShowAlertModal(false);
			}, 3000);
		}
	}, [showAlertModal]);

	// send password function on your email
	const sendPassWord = () => {
		setPhoneNumberError("");
		const formData = new FormData();
		formData.append(
			"phonenumber",
			phoneNumber?.startsWith("+966") || phoneNumber?.startsWith("00966")
				? phoneNumber
				: `+966${phoneNumber}`
		);

		axios
			.post("https://backend.atlbha.com/api/password/create", formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setMessage(res?.data?.message?.ar);
					setShowAlertModal(true);
					setUserPhoneNumber(
						phoneNumber?.startsWith("+966") || phoneNumber?.startsWith("00966")
							? phoneNumber
							: `+966${phoneNumber}`
					);
					localStorage.setItem("userEmail", res?.data?.data?.user?.email);

					setResendButtonDisabled(true);
					setDisabledBtn(true);
					navigate("/SendVerificationCode");
				} else {
					setPhoneNumberError(res?.data?.message?.ar);
				}
			});
	};

	return (
		<>
			<div className='password-back-box' dir='ltr'>
				<div className='all-content' dir='rtl'>
					<div className='box-container-form'>
						<LogoHeader />
						<div className='all'>
							<h2> قم بادخال رقم الجوال لاستعادة كلمة المرور </h2>
							<div className='box'>
								<h5>سيتم ارسال كود التحقق عبر رقم الجوال</h5>

								<div className='phone-number-wrapper'>
									<input
										value={phoneNumber}
										onChange={(e) => setPhoneNumber(e.target.value)}
										type='tel'
										name='phoneNumber'
										placeholder='ادخل رقم الجوال المستخدم في التسجيل '
										maxLength='9'
										required
										aria-invalid={validPhoneNumber ? "false" : "true"}
										aria-describedby='phoneNumber'
										onFocus={() => setPhoneNumberFocus(true)}
										onBlur={() => setPhoneNumberFocus(true)}
										style={{ direction: phoneNumber ? "ltr" : "rtl" }}
									/>

									<span>996+</span>
								</div>
							</div>

							<div
								id='phoneNumber'
								className={
									phoneNumberFocus && phoneNumber && !validPhoneNumber
										? " d-block important-hint me-1 "
										: "d-none"
								}
								style={{
									fontSize: "16px",
									whiteSpace: "normal",
									marginTop: "-28px",
									marginBottom: "10px",
								}}>
								تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
							</div>

							{phoneNumberError && (
								<p
									className={"wrong-text w-100"}
									style={{
										color: "red",
										marginTop: "-28px",
										marginBottom: "10px",
										direction: "rtl",
									}}>
									{phoneNumberError}
								</p>
							)}

							<button
								className='bt-main'
								onClick={sendPassWord}
								disabled={!phoneNumber}>
								ارسال
							</button>
						</div>
					</div>

					<div className='box-form-banner'>
						<span className='over-info'>
							<SvgComponent />
						</span>
						<div className='info-svg'>
							<h4>استعادة كلمة المرور</h4>
							<span>
								<SvgKey />
							</span>
						</div>
					</div>
				</div>
			</div>
			<AlertModal show={showAlertModal} message={message} />
		</>
	);
};

export default RestorePassword;
