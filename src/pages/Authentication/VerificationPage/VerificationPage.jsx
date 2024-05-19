import React, { useState, useContext, useEffect } from "react";
import Context from "../../../Context/context";
import { useLocation, Navigate, useNavigate } from "react-router-dom";
import LogoHeader from "../LogoHeader/LogoHeader";
import { ReactComponent as SvgComponent } from "../../../data/Icons/Component 59 – 11.svg";
import { ReactComponent as SvgRepeat } from "../../../data/Icons/Repeat.svg";
import OtpInput from "react-otp-input";
import axios from "axios";
import "./VerificationPage.css";
import AlertModal from "../Login/ResetPasswordPages/AlertModal/AlertModal";

const VerificationPage = () => {
	const location = useLocation();
	const navigate = useNavigate();

	// if user is verify his account
	// const NavigateToDashboardPage = () => {
	// 	window.location.href = "/auth/login";
	// };

	const contextStore = useContext(Context);
	const {
		email,
		resendButtonDisabled,
		setResendButtonDisabled,
		setDisabledBtn,
		disapledBtn,
		showAlertModal,
		setShowAlertModal,
		message,
		setMessage,
	} = contextStore;
	const [codeValue, setCodeValue] = useState("");
	const [countdown, setCountdown] = useState(60);
	const [errMessage, setErrMessage] = useState("");
	const [verError, setVerError] = useState("");

	useEffect(() => {
		// Start the countdown when resendButtonDisabled becomes true

		if (resendButtonDisabled) {
			const countdownTimer = setInterval(() => {
				setCountdown((prevCountdown) => prevCountdown - 1);
			}, 1000);

			// Clear the countdown timer when countdown reaches 0
			if (countdown === 0) {
				clearInterval(countdownTimer);
				setResendButtonDisabled(false);
			}

			// Clean up the countdown timer when the component unmounts
			return () => {
				clearInterval(countdownTimer);
			};
		}
	}, [resendButtonDisabled, countdown]);

	// SEND VERIFY CODE BY EMAIL AND CODE
	const verifyCode = () => {
		const formData = new FormData();
		formData.append("user_name", email);
		formData.append("code", codeValue);

		axios
			.post("https://backend.atlbha.com/api/verify-user", formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					if (res?.data?.message?.ar === "تم التحقق") {
						const token = res.data.data.token;
						document.cookie = `storeToken=${token}; path=/;`;
						// NavigateToDashboardPage();
						navigate("/");
					} else {
						setVerError(res?.data?.message?.ar);
					}
				} else {
					setErrMessage(res?.data?.message?.en?.code?.[0]);
				}
			});
	};

	//  RE-SEND VERIFY CODE BY PHONE
	const reSendVerificationCodeByPhone = () => {
		setErrMessage();
		const formData = new FormData();
		formData.append("user_name", email);
		axios
			.post("https://backend.atlbha.com/api/send-verify-message", formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setMessage(res?.data?.message?.ar);
					setShowAlertModal(true);
					setResendButtonDisabled(true);
					setDisabledBtn(true);
					setCountdown(60);
				} else {
					setErrMessage(res?.data?.message?.ar);
				}
			});
	};

	// to close Alert modal after timer end
	useEffect(() => {
		if (showAlertModal) {
			setTimeout(() => {
				setShowAlertModal(false);
			}, 3000);
		}
	}, [showAlertModal]);

	if (location.pathname === "/VerificationPage") {
		document.querySelector("body").style.overflow = "hidden";
	}

	return !email ? (
		<Navigate to='/auth/login' />
	) : (
		<>
			<div className='verificationBox-box' dir='ltr'>
				<div className='all-content' dir='rtl'>
					<div className='box-container-form'>
						<LogoHeader />
						<div className='all'>
							<h2>قمنا بإرسال كود التحقق لرقم جوالك</h2>

							<div className='box'>
								<OtpInput
									onChange={(e) => setCodeValue(e)}
									value={codeValue}
									numInputs={6}
									className={"input"}
									renderInput={(props) => <input {...props} />}
								/>
							</div>
							{verError && (
								<div
									className='text-danger  w-100'
									style={{ marginTop: "-35px", marginBottom: "10px" }}>
									{verError}
								</div>
							)}

							<button
								className='bt-main'
								onClick={verifyCode}
								disabled={!codeValue || codeValue?.length !== 6}>
								تسجيل الدخول
							</button>
							{errMessage && (
								<div
									className='text-danger text-center w-100'
									style={{ marginTop: "-22px" }}>
									{errMessage}
								</div>
							)}
							<button
								className='mb-2 resend-code-btn'
								disabled={resendButtonDisabled}
								onClick={reSendVerificationCodeByPhone}>
								<span>
									<SvgRepeat style={{ width: "20px", marginLeft: "3px" }} />
								</span>
								اعد ارسال الكود
								<span className={`${disapledBtn ? "d-inline" : "d-none"}`}>
									{" "}
									{countdown === 0 ? " " : countdown}{" "}
								</span>
							</button>
						</div>
					</div>

					<div className='box-form-banner'>
						<div className='info-svg'>
							<h4>كود التحقق</h4>
							<span>
								<SvgComponent />
							</span>
						</div>
					</div>
				</div>
			</div>

			<AlertModal show={showAlertModal} message={message} />
		</>
	);
};

export default VerificationPage;
