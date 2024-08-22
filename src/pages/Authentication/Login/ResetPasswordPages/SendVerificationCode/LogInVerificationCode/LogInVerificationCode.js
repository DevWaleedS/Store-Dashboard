import React, { useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

import { ReactComponent as SvgComponent } from "../../../../../../data/Icons/Component 59 – 11.svg";
import { ReactComponent as SvgRepeat } from "../../../../../../data/Icons/Repeat.svg";
import OtpInput from "react-otp-input";

import { ResetPasswordContext } from "../../../../../../Context/ResetPasswordProvider";

import "../SendVerificationCode.css";

import LogoHeader from "../../../../LogoHeader/LogoHeader";
import { AlertModal } from "../../AlertModal";
import CircularLoading from "../../../../../../HelperComponents/CircularLoading";
import {
	useReSendVerificationCodeByPhoneMutation,
	useVerifyUserMutation,
} from "../../../../../../store/apiSlices/loginApi";

const LogInVerificationCode = () => {
	const navigate = useNavigate();
	const [btnLoading, setBtnLoading] = useState(false);
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

	const [verifyUser, { isLoading }] = useVerifyUserMutation();
	const verifyCode = async () => {
		setVerError("");
		setBtnLoading(true);
		const formData = new FormData();
		formData.append("user_name", email);
		formData.append("code", codeValue);

		// make request...
		try {
			const response = await verifyUser({
				body: formData,
			});

			// Handle response
			if (
				response?.data?.success === true &&
				response?.data?.data?.status === 200
			) {
				setBtnLoading(false);
				setResetPasswordToken(response?.data?.data?.token);
				if (response?.data?.message?.ar === "تم التحقق") {
					// navigate("/auth/login");
					localStorage.setItem("storeToken", response?.data?.data?.token);
					// NavigateToDashboardPage();
					navigate("/");
				} else {
					setVerError(response?.data?.message?.ar);
				}
			} else {
				setBtnLoading(false);
				setVerError(
					response?.data?.message?.en?.code?.[0] || response?.data?.message?.ar
				);
			}
		} catch (error) {
			console.error("Error verifyUser :", error);
		}
	};

	//  RE-SEND VERIFY CODE BY PHONE
	const [reSendVerificationCodeByPhone, { isLoading: resSendLoading }] =
		useReSendVerificationCodeByPhoneMutation();

	const handleReSendVerificationCodeByPhone = async () => {
		setErrMessage("");
		const formData = new FormData();
		formData.append("user_name", email);

		// make request...
		try {
			const response = await reSendVerificationCodeByPhone({
				body: formData,
			});

			// Handle response
			if (
				response?.data?.success === true &&
				response?.data?.data?.status === 200
			) {
				setMessage("تم إرسال الكود إلى هاتفك");
				setShowAlertModal(true);
				setResendButtonDisabled(true);
				setDisabledBtn(true);
				setCountdown(60);
			} else {
				setErrMessage(response?.data?.message?.ar);
			}
		} catch (error) {
			console.error("Error reSendVerificationCodeByPhone :", error);
		}
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
									onChange={(e) => {
										setCodeValue(e);
										setErrMessage("");
										setVerError("");
									}}
									value={codeValue}
									numInputs={6}
									inputType='number'
									shouldAutoFocus='true'
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
								disabled={!codeValue || codeValue?.length !== 6 || isLoading}>
								{btnLoading || isLoading ? <CircularLoading /> : "تسجيل الدخول"}
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
								disabled={resendButtonDisabled || resSendLoading}
								onClick={handleReSendVerificationCodeByPhone}>
								<span>
									<SvgRepeat style={{ width: "20px", marginLeft: "3px" }} />
								</span>
								اعد ارسال الكود
								<span
									className={`${
										disapledBtn || resSendLoading ? "d-inline" : "d-none"
									}`}>
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
