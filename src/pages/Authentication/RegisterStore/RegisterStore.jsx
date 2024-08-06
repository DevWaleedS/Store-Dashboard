import React, { useContext, useEffect, useState } from "react";

// Third party
import axios from "axios";
import Radium from "radium"; /** import this library to write media query with inline style */
import { Link, useNavigate } from "react-router-dom";

// Icons
import { MdErrorOutline } from "react-icons/md";

// MUI
import { Typography } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import "./RegisterStore.css";

// Context
import Context from "../../../Context/context";

// Password Component
import PasswordField from "../PasswordField/PasswordField";
import ConfirmPasswordField from "../ConfirmPasswordField/ConfirmPasswordField";

// Modal Components
import TermsModal from "../TermsModal/TermsModal";
import AlertModal from "../Login/ResetPasswordPages/AlertModal/AlertModal";
import SelectPackage from "./SelectPackage";
import UserNameInput from "./UserNameInput";
import UserEmailInput from "./UserEmailInput";
import UserPhoneNumberInput from "./UserPhoneNumberInput";

/** -----------------------------------------------------------------------------------------------------------
 *  	=> TO HANDLE THE REG_EXPRESS <=
 *  ------------------------------------------------- */

const PWD_REGEX = /^.{8,24}$/;

const RegisterBox = () => {
	const navigate = useNavigate();
	const contextStore = useContext(Context);
	const {
		message,
		setMessage,
		showAlertModal,
		setShowAlertModal,
		setEmail,
		setResendButtonDisabled,
		setDisabledBtn,
	} = contextStore;

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> TO OPEN THE TERMS AND CONDITIONS MODAL <=
	 *  ------------------------------------------------- */
	const [showTermsModal, setShowTermsModal] = useState(false);
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [isChecked, setIsChecked] = useState(0);

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> TO  CREATE THE VALIDATION AND ERRORS <=
	 *  ------------------------------------------------- */
	const [validUserName, setValidUserName] = useState(false);
	const [validPhoneNumber, setValidPhoneNumber] = useState(false);

	const [validPssWord, setValidPssWord] = useState(false);
	const [pssWordFocus, setPssWordFocus] = useState(false);

	const [validConfirmPssWord, setValidConfirmPssWord] = useState(false);
	const [confirmPssWordFocus, setConfirmPssWordFocus] = useState(false);

	const [validEmail, setValidEmail] = useState(false);

	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [phonenumberError, setPhonenumberError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [packageError, setPackageError] = useState(false);

	const [checkboxError, setCheckboxError] = useState("");
	const [error, setError] = useState("");

	// to assign the owner info into state
	const [registerInfo, setRegisterInfo] = useState({
		user_name: localStorage.getItem("user_name") || "",
		email: localStorage.getItem("email") || "",
		phonenumber: localStorage.getItem("phonenumber") || "",
		package_id: localStorage.getItem("package_id") || "",
	});

	const handleRegisterInfo = (e) => {
		const { name, value } = e.target;
		setRegisterInfo((prevStoreInfo) => {
			return { ...prevStoreInfo, [name]: value };
		});
		localStorage.setItem(`${name}`, value);
	};

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> THE SIDE EFFECTS <=
	 *  ------------------------------------------------- */

	// TO HANDLE VALIDATION PASSWORD
	useEffect(() => {
		const passwordValidation = PWD_REGEX.test(password);
		setValidPssWord(passwordValidation);
	}, [password]);

	useEffect(() => {
		const confirmPasswordValidation = PWD_REGEX.test(confirmPassword);
		setValidConfirmPssWord(confirmPasswordValidation);
	}, [confirmPassword]);

	useEffect(() => {
		if (confirmPassword !== "" && password !== confirmPassword) {
			setConfirmPasswordError("كلمة المرور غير متطابقة!");
		} else {
			setConfirmPasswordError("");
		}
	}, [password, confirmPassword]);

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> REGISTER FUNCTION  <=
	 *  ------------------------------------------------- */
	const register = () => {
		setError("");
		setUsernameError("");
		setPasswordError("");
		setConfirmPassword("");
		setPhonenumberError("");
		setEmailError("");
		setCheckboxError("");
		setPackageError("");

		let formData = new FormData();
		formData.append("user_type", "store");
		formData.append("password", password);
		formData.append("email", registerInfo?.email);
		formData.append("package_id", registerInfo?.package_id);
		formData.append("user_name", registerInfo?.user_name);
		formData.append("phonenumber", "+966" + registerInfo?.phonenumber);
		formData.append("checkbox_field", isChecked);

		axios
			.post("https://backend.atlbha.com/api/registerapi", formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					localStorage.setItem(
						"name",
						res.data?.data?.user?.lastname
							? `${res.data?.data?.user?.name} ${res.data?.data?.user?.lastname}`
							: `${res.data?.data?.user?.name}`
					);
					localStorage.setItem("userName", res.data?.data?.user?.user_name);
					localStorage.setItem("userImage", res.data?.data?.user?.image);

					setEmail(registerInfo?.email);
					setResendButtonDisabled(true);
					setDisabledBtn(true);
					navigate("/VerificationPage");
				} else {
					if (res?.data?.message.ar === "stop_registration") {
						setError(res?.data?.message.en);
					} else if (
						res?.data?.message.en === "waiting administration approval"
					) {
						setMessage(res?.data?.message?.ar);
						setShowAlertModal(true);
						setTimeout(() => {
							navigate("/auth/login");
						}, 3000);
					} else {
						setUsernameError(res?.data?.message?.en?.user_name?.[0]);
						setPasswordError(res?.data?.message?.en?.password?.[0]);
						setPhonenumberError(res?.data?.message?.en?.phonenumber?.[0]);
						setPackageError(res?.data?.message?.en?.package_id?.[0]);
						setEmailError(res?.data?.message?.en?.email?.[0]);
						setCheckboxError(res?.data?.message?.en?.checkbox_field?.[0]);
					}
				}
			});
	};

	const handleSubmit = (e) => {
		e.preventDefault();
	};

	return (
		<>
			<div className='register-form' dir='ltr'>
				<div className='user-form'>
					<h4 className='title'>بيانات المتجر</h4>
					<div className='content'>
						<form onSubmit={handleSubmit}>
							<UserNameInput
								registerInfo={registerInfo}
								usernameError={usernameError}
								validUserName={validUserName}
								setValidUserName={setValidUserName}
								handleRegisterInfo={handleRegisterInfo}
							/>

							<UserEmailInput
								validEmail={validEmail}
								emailError={emailError}
								registerInfo={registerInfo}
								setValidEmail={setValidEmail}
								handleRegisterInfo={handleRegisterInfo}
							/>

							<UserPhoneNumberInput
								registerInfo={registerInfo}
								phonenumberError={phonenumberError}
								validPhoneNumber={validPhoneNumber}
								handleRegisterInfo={handleRegisterInfo}
								setValidPhoneNumber={setValidPhoneNumber}
							/>

							<SelectPackage
								packageError={packageError}
								package_id={registerInfo?.package_id}
								handleRegisterInfo={handleRegisterInfo}
							/>

							<PasswordField
								name='password'
								password={password}
								setPassword={setPassword}
								passwordError={passwordError}
								required
								validPssWord={validPssWord}
								pssWordFocus={pssWordFocus}
								setPssWordFocus={setPssWordFocus}
							/>
							<ConfirmPasswordField
								name='password'
								password={confirmPassword}
								setPassword={setConfirmPassword}
								confirmPasswordError={confirmPasswordError}
								required
								validPssWord={validConfirmPssWord}
								pssWordFocus={confirmPssWordFocus}
								setPssWordFocus={setConfirmPssWordFocus}
							/>
						</form>
					</div>
				</div>
				{/*--------------------------------------------------------------------*/}
				{/*  owner info  form */}
				<div className='owner-form'>
					<div className='owner-form'>
						<div className='box-pay'>
							<div className='top'>
								<FormControlLabel
									sx={{
										width: "100%",
										height: "100%",
										display: "flex",
										alignItems: "flex-start",
									}}
									value={isChecked}
									control={
										<>
											<Checkbox
												className='form-check-input'
												id='flexCheckDefault'
												checked={isChecked}
												onChange={(e) => {
													if (e.target.checked) {
														setIsChecked(1);
													} else {
														setIsChecked(0);
													}
												}}
											/>

											<Typography
												sx={{
													ml: 0,
													mr: 1,
													fontSize: "15px",
													fontWeight: 400,
													color: "#67747B",
													marginTop: "-14px",
													whiteSpace: "break-spaces",
												}}>
												بتسجيلك فإنك توافق على سياسة
												<Link onClick={() => setShowTermsModal(true)}>
													{" "}
													الشروط والأحكام
												</Link>{" "}
												الخاصة بمنصة اطلبها
											</Typography>
										</>
									}
								/>

								{checkboxError && (
									<span
										className='wrong-text w-100'
										style={{ color: "red", direction: "rtl" }}>
										{checkboxError}
									</span>
								)}
							</div>

							<button
								disabled={
									!validUserName ||
									!validPssWord ||
									!validConfirmPssWord ||
									!validEmail ||
									isChecked === 0
										? true
										: false
								}
								className='bt-main'
								onClick={register}>
								تسجيل حساب جديد
							</button>
							{error && (
								<span
									className='wrong-text w-100 mb-3 text-center'
									style={{
										color: "red",
										direction: "rtl",
										marginTop: "-10px",
										fontSize: "18px",
									}}>
									{error}
								</span>
							)}
						</div>
					</div>
				</div>
			</div>
			{/** terms modal*/}
			<TermsModal
				show={showTermsModal}
				closeModal={() => setShowTermsModal(false)}
			/>
			<AlertModal show={showAlertModal} message={message} />
		</>
	);
};

export default Radium(RegisterBox);
