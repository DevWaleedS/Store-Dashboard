import React, { useState, useContext } from "react";

// Third party
import { useNavigate } from "react-router-dom/dist";

// Context
import { UserAuth } from "../../../../../Context/UserAuthorProvider";
import { ResetPasswordContext } from "../../../../../Context/ResetPasswordProvider";

// Components
import LogoHeader from "../../../LogoHeader/LogoHeader";

// Icons
import { EyeClose, EyeOPen, SvgComponent } from "../../../../../data/Icons";

// Styles
import "./CreateNewPassword.css";
import { CircularLoading } from "../../../../../HelperComponents";
import { useReCreateNewPasswordMutation } from "../../../../../store/apiSlices/loginApi";

const CreateNewPassword = () => {
	let type = "password";
	const navigate = useNavigate();

	// if user is verify his account
	const NavigateToLogInPage = () => {
		navigate("/auth/login");
	};

	const ResetPasswordInfo = useContext(ResetPasswordContext);
	const { userPhoneNumber, resetPasswordToken } = ResetPasswordInfo;
	const [btnLoading, setBtnLoading] = useState(false);
	// to set remember me
	const RememberMe = useContext(UserAuth);
	const { rememberMe, setRememberMe } = RememberMe;
	const [password, setPassword] = useState(
		rememberMe.remember_me ? rememberMe.password : ""
	);

	const [confirmPassword, setConfirmPassword] = useState("");
	const [showPassword, setShowPassword] = useState(false);
	const [showConfirmPassword, setShowConfirmPassword] = useState(false);

	// to handle errors
	const [passwordError, setPasswordError] = useState("");
	const [messErr, stMessErr] = useState("");

	//Set password and remember_me status from context
	function setUserInfoToUserAuthContext() {
		setRememberMe({
			password,
			remember_me: true,
		});
	}

	//remove  password and remember_me status from context
	function removeUserInfoUserAuthContext() {
		setRememberMe({
			password: "",
			remember_me: false,
		});
	}

	const [reCreateNewPassword, { isLoading }] = useReCreateNewPasswordMutation();

	const handleReCreateNewPasswordFunction = async () => {
		setPasswordError("");
		stMessErr("");
		setBtnLoading(true);
		const formData = new FormData();
		formData.append("password", password);
		formData.append("password_confirmation", confirmPassword);
		formData.append("phonenumber", userPhoneNumber);
		formData.append("token", resetPasswordToken);

		// make request...
		try {
			const response = await reCreateNewPassword({
				body: formData,
			});

			// Handle response
			if (
				response?.data?.success === true &&
				response?.data?.data?.status === 200
			) {
				setBtnLoading(false);
				localStorage.setItem("storeToken", response?.data?.data?.token);
				if (
					!resetPasswordToken ||
					response?.data?.message?.en ===
						"This password reset token is invalid."
				) {
					navigate("/RestorePassword");
				}
				if (rememberMe) {
					//Set password and remember_me status from context
					setUserInfoToUserAuthContext();

					// Navigate the user to login page
					NavigateToLogInPage();
				} else {
					//remove password and remember_me status from context
					removeUserInfoUserAuthContext();
				}
			} else {
				setBtnLoading(false);
				stMessErr(response?.data?.message?.ar);
				setPasswordError(response?.data?.message?.en?.password?.[0]);
			}
		} catch (error) {
			console.error("Error reSendVerificationCodeByPhone :", error);
		}
	};

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			handleReCreateNewPasswordFunction();

			if (rememberMe) {
				//Set  password and remember_me status from context
				setUserInfoToUserAuthContext();
			} else {
				//remove password and remember_me status from context
				removeUserInfoUserAuthContext();
			}
		}
	};

	return (
		<div className='sign-in-box' dir='ltr'>
			<div className='all-content' dir='rtl'>
				<div className='box-container-form'>
					<LogoHeader />
					<div className='all'>
						<h2>قم بانشاء كلمة مرور جديدة</h2>
						<div className='box'>
							<div className='password-field'>
								{type === "password" ? (
									showPassword ? (
										<EyeOPen
											onClick={() => {
												setShowPassword((prev) => !prev);
											}}
											className='show-password-icon'
										/>
									) : (
										<EyeClose
											onClick={() => {
												setShowPassword((prev) => !prev);
											}}
											className='show-password-icon'
										/>
									)
								) : null}

								<h5>كلمة المرور</h5>
								<input
									style={{ textAlign: "right" }}
									autoComplete='off'
									value={password}
									placeholder=''
									maxLength={24}
									minLength={8}
									onChange={(e) => setPassword(e.target.value)}
									onKeyDown={handleKeyDown}
									type={
										!type === "password" ? type : showPassword ? "text" : type
									}
								/>

								{passwordError && (
									<span className='wrong-text text-danger w-100 d-flex justify-content-start'>
										{passwordError}
									</span>
								)}
							</div>

							<div className='password-field'>
								{type === "password" ? (
									showConfirmPassword ? (
										<EyeOPen
											onClick={() => {
												setShowConfirmPassword((prev) => !prev);
											}}
											className='show-password-icon'
										/>
									) : (
										<EyeClose
											onClick={() => {
												setShowConfirmPassword((prev) => !prev);
											}}
											className='show-password-icon'
										/>
									)
								) : null}

								<h5>تأكيد كلمة المرور</h5>
								<input
									style={{ textAlign: "right" }}
									autoComplete='off'
									value={confirmPassword}
									placeholder=''
									maxLength={24}
									minLength={8}
									onChange={(e) => setConfirmPassword(e.target.value)}
									onKeyDown={handleKeyDown}
									type={
										!type === "password"
											? type
											: showConfirmPassword
											? "text"
											: type
									}
								/>

								{passwordError && (
									<span className='wrong-text text-danger w-100 d-flex justify-content-start'>
										{passwordError}
									</span>
								)}

								{confirmPassword && confirmPassword !== password && (
									<span className='wrong-text text-danger w-100 d-flex justify-content-start'>
										كلمة المرور غير مطابقة!
									</span>
								)}
							</div>
						</div>
						<div className='top checkbox_row'>
							<div className='check'>
								<div className='form-check'>
									<input
										className='form-check-input'
										type='checkbox'
										id='flexCheckDefault'
										value={rememberMe}
										onChange={(e) => setRememberMe(e.target.checked)}
									/>
								</div>
								<h6>تذكرني</h6>
							</div>
						</div>
						<button
							className='bt-main'
							disabled={
								!confirmPassword || !password || btnLoading || isLoading
							}
							onClick={handleReCreateNewPasswordFunction}>
							{btnLoading || isLoading ? <CircularLoading /> : "تسجيل الدخول"}
						</button>
						{messErr && (
							<div
								className='text-danger text-center w-100'
								style={{ marginTop: "-16px", marginBottom: "16px" }}>
								{messErr}
							</div>
						)}
					</div>
				</div>

				<div className='box-form-banner'>
					<span className='over-info'>
						<SvgComponent />
					</span>
					<div className='info-svg'>
						<h4>منصة اطلبها للتجارة الإلكترونية</h4>
						<h1> مرحباً بعودتك</h1>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CreateNewPassword;
