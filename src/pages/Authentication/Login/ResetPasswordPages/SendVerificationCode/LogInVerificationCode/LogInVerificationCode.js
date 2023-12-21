import React, { useState, useContext, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ReactComponent as SvgComponent } from "../../../../../../data/Icons/Component 59 – 11.svg";
import { ReactComponent as SvgRepeat } from "../../../../../../data/Icons/Repeat.svg";
import OtpInput from "react-otp-input";

import { ResetPasswordContext } from "../../../../../../Context/ResetPasswordProvider";

import "../SendVerificationCode.css";

import LogoHeader from "../../../../LogoHeader/LogoHeader";
import { AlertModal } from "../../AlertModal";

const LogInVerificationCode = () => {
	const navigate = useNavigate();

	const ResetPasswordInfo = useContext(ResetPasswordContext);
	const {
		email,
		disapledBtn,
		resendButtonDisabled,
		setResendButtonDisabled,
		setDisabledBtn,
		showAlertModal,
		setShowAlertModal,
		message,
		setMessage,
		setResetPasswordToken,
	} = ResetPasswordInfo;

	const [codeValue, setCodeValue] = useState("");
	const [setReSendVerificationCodeByEmailDisabled] = useState(false);

	const [currentTime, setCurrentTime] = useState(new Date());
	const [countdown, setCountdown] = useState(60);
	const [errMessage, setErrMessage] = useState("");

	const [verError, setVerError] = useState("");

	// to resend by email
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
				setReSendVerificationCodeByEmailDisabled(false);
			}

			// Clean up the countdown timer when the component unmounts
			return () => {
				clearInterval(countdownTimer);
			};
		}
	}, [resendButtonDisabled, countdown]);

	// -------------------------------------------------------------------------------------------------- //

	// SEND VERIFY CODE BY EMAIL AND CODE
	const verifyCode = () => {
		setVerError("");
		const formData = new FormData();
		formData.append("user_name", email);
		formData.append("code", codeValue);

		axios
			.post("https://backend.atlbha.com/api/verify-user", formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setResetPasswordToken(res?.data?.data?.token);
					if (res?.data?.message?.ar === "تم التحقق") {
						navigate("/auth/login");
					} else {
						setVerError(res?.data?.message?.ar);
					}
				} else {
					setVerError(
						res?.data?.message?.en?.code?.[0] || res?.data?.message?.ar
					);
				}
			});
	};

	//  RE-SEND VERIFY CODE BY PHONE
	const reSendVerificationCodeByPhone = () => {
		setErrMessage("");
		const formData = new FormData();
		formData.append("user_name", email);
		axios
			.post("https://backend.atlbha.com/api/send-verify-message", formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setMessage("تم إرسال الكود إلى هاتفك");
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

	// to create circle timer
	useEffect(() => {
		// Update the current time every second
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		// Clean up the timer when the component unmounts
		return () => {
			clearInterval(timer);
		};
	}, []);

	return (
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

export default LogInVerificationCode;
