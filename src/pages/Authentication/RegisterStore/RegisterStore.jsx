import React, { useContext, useEffect, useState } from "react";

// Third party
import axios from "axios";
import Radium from "radium"; /** import this library to write media query with inline style */
import { Link, useNavigate } from "react-router-dom";

// Icons
import { MdErrorOutline } from "react-icons/md";
import { ReactComponent as SvgUser } from "../../../data/Icons/icon-24-user.svg";

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

/** -----------------------------------------------------------------------------------------------------------
 *  	=> TO HANDLE THE REG_EXPRESS <=
 *  ------------------------------------------------- */
const USER_REGEX = /^[A-Za-z0-9]+$/;
const PWD_REGEX = /^.{8,24}$/;
const PHONE_REGEX = /^(5\d{8})$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

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
	const [userNameFocus, setUserNameFocus] = useState(false);

	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

	const [validPssWord, setValidPssWord] = useState(false);
	const [pssWordFocus, setPssWordFocus] = useState(false);

	const [validConfirmPssWord, setValidConfirmPssWord] = useState(false);
	const [confirmPssWordFocus, setConfirmPssWordFocus] = useState(false);

	const [validEmail, setValidEmail] = useState(false);
	const [emailFocus, setEmailFocus] = useState(false);

	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [confirmPasswordError, setConfirmPasswordError] = useState("");
	const [phonenumberError, setPhonenumberError] = useState("");
	const [emailError, setEmailError] = useState("");
	const [checkboxError, setCheckboxError] = useState("");
	const [error, setError] = useState("");
	// to assign the owner info into state
	const [registerInfo, setRegisterInfo] = useState({
		user_name: "",
		email: "",
		phonenumber: "",
	});

	const handleRegisterInfo = (e) => {
		const { name, value } = e.target;
		setRegisterInfo((prevStoreInfo) => {
			return { ...prevStoreInfo, [name]: value };
		});
	};

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> THE SIDE EFFECTS <=
	 *  ------------------------------------------------- */

	// TO HANDLE VALIDATION FOR USER NAME
	useEffect(() => {
		const UserNameValidation = USER_REGEX.test(registerInfo?.user_name);
		setValidUserName(UserNameValidation);
	}, [registerInfo?.user_name]);

	// TO HANDLE VALIDATION FOR EMAIL
	useEffect(() => {
		const emailValidation = EMAIL_REGEX.test(registerInfo?.email);
		setValidEmail(emailValidation);
	}, [registerInfo?.email]);

	// TO HANDLE VALIDATION STORE PHONE NUMBER
	useEffect(() => {
		const phoneNumberValidation = PHONE_REGEX.test(registerInfo?.phonenumber);
		setValidPhoneNumber(phoneNumberValidation);
	}, [registerInfo?.phonenumber]);

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

		let formData = new FormData();
		formData.append("user_type", "store");
		formData.append("password", password);
		formData.append("email", registerInfo?.email);
		formData.append("user_name", registerInfo?.user_name);
		formData.append("phonenumber", "+966" + registerInfo?.phonenumber);
		formData.append("checkbox_field", isChecked);

		axios
			.post("https://backend.atlbha.com/api/registerapi", formData)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
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
							<div className='name'>
								<h5 className='d-flex flex-row'>
									اسم المستخدم <span style={{ color: "red" }}>*</span>
								</h5>
								<input
									style={{ paddingRight: "42px" }}
									type='text'
									name='user_name'
									value={registerInfo?.user_name}
									onChange={handleRegisterInfo}
									required
									placeholder='اسم المستخدم باللغة الانجليزية'
									aria-invalid={validUserName ? "false" : "true"}
									aria-describedby='uidnote'
									onFocus={() => setUserNameFocus(true)}
									onBlur={() => setUserNameFocus(true)}
								/>
								<div id='span-icon'>
									<SvgUser />
								</div>
							</div>
							<p
								id='uidnote'
								className={
									userNameFocus && registerInfo?.user_name && !validUserName
										? " d-block wrong-text "
										: "d-none"
								}
								style={{
									color: "red",
									marginTop: "-20px",
									direction: "rtl",
									padding: "10px 10px 10px 20px",
									borderRadius: "8px",
								}}>
								<MdErrorOutline className='ms-1' />
								يجب ان يكون اسم المستخدم حروف انجليزيه وارقام وبدون مسافات
							</p>

							{usernameError && (
								<p
									className={"wrong-text w-100"}
									style={{
										color: "red",
										marginTop: "-20px",
										direction: "rtl",
									}}>
									{usernameError}
								</p>
							)}
							<div>
								<h5 className='d-flex flex-row'>
									البريد الإلكتروني <span style={{ color: "red" }}>*</span>
								</h5>
								<input
									type='email'
									name='email'
									value={registerInfo?.email}
									onChange={handleRegisterInfo}
									placeholder='atlbha@gmail.com'
									required
									aria-invalid={validEmail ? "false" : "true"}
									aria-describedby='email'
									onFocus={() => setEmailFocus(true)}
									onBlur={() => setEmailFocus(true)}
								/>
								<p
									id='email'
									className={
										emailFocus && registerInfo?.email && !validEmail
											? " d-block wrong-text "
											: "d-none"
									}
									style={{
										color: "red",
										direction: "rtl",
										padding: "10px 10px 10px 20px",
										borderRadius: "8px",
									}}>
									<MdErrorOutline className='ms-1' />
									تأكد من ان البريد الالكتروني يتكون من حرف واحد او اكثر ويحتوي
									علي علامة الـ @
								</p>
								{emailError && (
									<span
										className='wrong-text w-100'
										style={{ color: "red", direction: "rtl" }}>
										{emailError}
									</span>
								)}
							</div>

							<div className='phone'>
								<h5 className='d-flex flex-row'>
									رقم الجوال <span style={{ color: "red" }}>*</span>
								</h5>
								<section className='d-flex align-items-center flex-row input_wrapper'>
									<input
										className='phone_input'
										style={{
											width: "100%",
											height: "100%",
											border: "none",
											outline: "none",
											boxShadow: "none",
											padding: " 0 25px 0 0",
											borderRadius: "none",
										}}
										type='tel'
										name='phonenumber'
										maxLength='9'
										minLength='9'
										value={registerInfo?.phonenumber}
										onChange={handleRegisterInfo}
										placeholder='500000000'
										required
										aria-invalid={validPhoneNumber ? "false" : "true"}
										aria-describedby='phoneNumber'
										onFocus={() => setPhoneNumberFocus(true)}
										onBlur={() => setPhoneNumberFocus(true)}
									/>
									<div className='country_key'>966</div>
								</section>

								<p
									id='phoneNumber'
									className={
										phoneNumberFocus &&
										registerInfo?.phonenumber &&
										!validPhoneNumber
											? " d-block wrong-text "
											: "d-none"
									}
									style={{
										color: "red",
										direction: "rtl",
										padding: "10px 10px 10px 20px",
										borderRadius: "8px",
									}}>
									<MdErrorOutline className='ms-1' />
									تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
								</p>
							</div>
							{phonenumberError && (
								<span
									className='wrong-text w-100 '
									style={{
										color: "red",
										marginTop: "-10px",
										direction: "rtl",
									}}>
									{phonenumberError}
								</span>
							)}

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
