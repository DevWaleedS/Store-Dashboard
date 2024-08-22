import React, { useState, useContext, useEffect } from "react";

import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ReactComponent as SvgComponent } from "../../../../../data/Icons/Component 59 – 11.svg";
import { ReactComponent as SvgRepeat } from "../../../../../data/Icons/Repeat.svg";
import OtpInput from "react-otp-input";

import LogoHeader from "../../../LogoHeader/LogoHeader";
import { ResetPasswordContext } from "../../../../../Context/ResetPasswordProvider";

import "./SendVerificationCode.css";
import { AlertModal } from "../AlertModal";
import CircularLoading from "../../../../../HelperComponents/CircularLoading";
import {
	useReSendVerificationCodeByEmailMutation,
	useRestorePassWordMutation,
	useVerifyAccountMutation,
} from "../../../../../store/apiSlices/loginApi";

const SendVerificationCode = () => {
	const navigate = useNavigate();

	const ResetPasswordInfo = useContext(ResetPasswordContext);
	const {
		userPhoneNumber,
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
	const [btnLoading, setBtnLoading] = useState(false);
	const [codeValue, setCodeValue] = useState("");
	const [
		reSendVerificationCodeByEmailDisabled,
		setReSendVerificationCodeByEmailDisabled,
	] = useState(false);

	const [currentTime, setCurrentTime] = useState(new Date());
	const [countdown, setCountdown] = useState(60);
	const [errMessage, setErrMessage] = useState("");
	const [errCodeByEmail, setErrCodeByEmail] = useState("");
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
	const [verifyAccount, { isloading: verifyAccountIsLoading }] =
		useVerifyAccountMutation();
	const verifyCode = async () => {
		setVerError("");
		setBtnLoading(true);
		const formData = new FormData();
		formData.append("phonenumber", userPhoneNumber);
		formData.append("code", codeValue);

		// make request...
		try {
			const response = await verifyAccount({
				body: formData,
			});

			// Handle response
			if (
				response?.data?.success === true &&
				response?.data?.data?.status === 200
			) {
				setResetPasswordToken(response?.data?.data?.token);
				setBtnLoading(false);

				if (response?.data?.message?.en === "not verified") {
					setVerError(
						".لم يتم التحقق! يرجى ادخال الكود بشكل صحيح أو قم باعاة الارسال مره اخرى"
					);
				} else if (
					response?.data?.message?.en ===
					"This password reset token is invalid."
				) {
					setMessage(response?.data?.message?.ar);
					navigate("/RestorePassword");
				} else if (response?.data?.message?.en === "verified") {
					setMessage(response?.data?.message?.ar);
					navigate("/CreateNewPassword");
				}
			} else {
				setVerError(response?.data?.message?.en?.code?.[0]);
				setBtnLoading(false);
			}
		} catch (error) {
			console.error("Error restore password :", error);
		}
	};

	//  RE-SEND VERIFY CODE BY PHONE
	const [restorePassWord, { isLoading: resendByPhoneIsLoading }] =
		useRestorePassWordMutation();
	const reSendVerificationCodeByPhone = async () => {
		setErrMessage("");

		const formData = new FormData();
		formData.append("phonenumber", userPhoneNumber);

		// make request...
		try {
			const response = await restorePassWord({
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
				setErrMessage("");
			} else {
				setErrMessage(response?.data?.message?.ar);
			}
		} catch (error) {
			console.error("Error restore password :", error);
		}
	};

	//  RE-SEND VERIFY CODE BY EMAIL
	const [reSendVerificationCodeByEmail, { isLoading: resendByEmailIsLoading }] =
		useReSendVerificationCodeByEmailMutation();
	const handleReSendVerificationCodeByEmail = async () => {
		setErrCodeByEmail("");
		setReSendVerificationCodeByEmailDisabled(true);
		const formData = new FormData();
		formData.append("user_name", localStorage.getItem("userEmail"));

		// make request...
		try {
			const response = await reSendVerificationCodeByEmail({
				body: formData,
			});

			// Handle response
			if (
				response?.data?.success === true &&
				response?.data?.data?.status === 200
			) {
				setMessage("تم إرسال الكود إلى البريد الإلكتروني");
				setShowAlertModal(true);
				setErrCodeByEmail("");
				setReSendVerificationCodeByEmailDisabled(false);
				setCountdown(60);
			} else {
				setReSendVerificationCodeByEmailDisabled(false);
				setErrCodeByEmail(response?.data?.message?.ar);
			}
		} catch (error) {
			console.error("Error restore password :", error);
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
							<h2>قم بإدخال كود التحقق </h2>
							<div className='box'>
								<OtpInput
									onChange={(e) => {
										setCodeValue(e);
										setErrMessage("");
										setErrCodeByEmail("");
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
								className='mb-2 resend-code-btn'
								disabled={resendButtonDisabled || resendByPhoneIsLoading}
								onClick={reSendVerificationCodeByPhone}>
								<span>
									<SvgRepeat style={{ width: "20px", marginLeft: "3px" }} />
								</span>
								اعد ارسال الكود عبر رقم الجوال
								<span
									className={`${
										disapledBtn || resendByPhoneIsLoading
											? "d-inline counter_wrapper"
											: "d-none"
									}`}>
									{" "}
									{countdown === 0 ? " " : countdown}{" "}
								</span>
							</button>
							{errMessage && (
								<div className='text-danger text-center w-100'>
									{errMessage}
								</div>
							)}
							<button
								className='send-by-email-btn'
								disabled={
									reSendVerificationCodeByEmailDisabled ||
									resendByEmailIsLoading
								}
								onClick={handleReSendVerificationCodeByEmail}>
								{reSendVerificationCodeByEmailDisabled ||
								resendByEmailIsLoading ? (
									<CircularLoading />
								) : (
									"ارسل الكود عبر البريد الالكتروني"
								)}
							</button>
							{errCodeByEmail && (
								<div
									className='text-danger text-center w-100'
									style={{ marginTop: "-22px" }}>
									{errCodeByEmail}
								</div>
							)}

							<button
								disabled={
									!codeValue ||
									btnLoading ||
									codeValue?.length !== 6 ||
									verifyAccountIsLoading
								}
								className='bt-main'
								onClick={verifyCode}>
								{btnLoading || verifyAccountIsLoading ? (
									<CircularLoading />
								) : (
									"تأكيد"
								)}
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

export default SendVerificationCode;
