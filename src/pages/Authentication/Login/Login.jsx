import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ReactComponent as EyeOPen } from "../../../data/Icons/eye_open.svg";
import { ReactComponent as EyeClose } from "../../../data/Icons/eye_close.svg";
import "./Login.css";
import axios from "axios";
import { UserAuth } from "../../../Context/UserAuthorProvider";
import { ResetPasswordContext } from "../../../Context/ResetPasswordProvider";

/** -----------------------------------------------------------------------------------------------------------
 *  TO HANDLE THE REG_EXPRESS
 *  ---------------------------------------- */

const Login = () => {
	let type = "password";
	const navigate = useNavigate();
	// If user is not verify
	const ResetPasswordInfo = useContext(ResetPasswordContext);
	const { setEmail } = ResetPasswordInfo;

	// to set remember me
	const RememberMe = useContext(UserAuth);
	const { rememberMe, setRememberMe } = RememberMe;

	const [username, setUsername] = useState(
		rememberMe.remember_me ? rememberMe.username : ""
	);

	const [password, setPassword] = useState(
		rememberMe.remember_me ? rememberMe.password : ""
	);

	/**
	 * ---------------------------------------------------------------------------------------------------
	 * to handle errors
	 * ---------------------------------------------------------------------------------------------------
	 */
	const PWD_REGEX = /^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?\d)(?=.*?[\W_]).{8,24}$/;
	const [validPssWord, setValidPssWord] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [usernameError, setUsernameError] = useState("");
	const [passwordError, setPasswordError] = useState("");
	const [error, setError] = useState("");

	/**
	 * ----------------------------------------------
	 * All DASHBOARD NAVIGATORS
	 * ----------------------------------------------
	 */
	const NavigateToRestorePassword = () => {
		navigate("/RestorePassword");
	};

	//Set username, password and remember_me status from context
	function setUserInfoToUserAuthContext() {
		setRememberMe({
			username,
			password,
			remember_me: true,
		});
	}

	//remove username, password and remember_me status from context
	function removeUserInfoUserAuthContext() {
		setRememberMe({
			username: "",
			password: "",
			remember_me: false,
		});
	}

	/**
	 * ---------------------------------------------------------------------------------------------------
	 * Login Function
	 * ---------------------------------------------------------------------------------------------------
	 */
	const Login = () => {
		setError("");
		setUsernameError("");
		setPasswordError("");
		const data = {
			user_name: username,
			password: password,
		};
		axios.post("https://backend.atlbha.com/api/loginapi", data).then((res) => {
			if (res?.data?.success === true && res?.data?.data?.status === 200) {
				localStorage.setItem("store_token", res?.data?.data?.token);

				if (rememberMe?.remember_me) {
					//Set username, password and remember_me status to context
					setUserInfoToUserAuthContext();
				} else {
					//remove username, password and remember_me status from context
					removeUserInfoUserAuthContext();
				}

				// if the user is logged we will navigate him to dashboard
				navigate("/");
			} else {
				setUsernameError(res?.data?.message?.en?.user_name?.[0]);
				setPasswordError(res?.data?.message?.en?.password?.[0]);
				setError(res?.data?.message?.ar);
				if (res?.data?.message?.en === "User not verified") {
					setEmail(username);
					navigate("/LogInVerificationCode");
				}
			}
		});
	};

	/**
	 * ----------------------------------------------------------------------------------------------
	 * to handle press enter key on your keyboard
	 * -----------------------------------------------------------------------------------------------
	 */

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			Login();

			if (rememberMe?.remember_me) {
				//Set username , password and remember_me cookie to expire
				setUserInfoToUserAuthContext();
			} else {
				//remove username , password and remember_me cookie to expire
				removeUserInfoUserAuthContext();
			}
		}
	};

	/**
	 * ----------------------------------------------------------------------------------------------
	 * TO HANDLE VALIDATION PASSWORD
	 * ----------------------------------------------------------------------------------------------
	 */
	useEffect(() => {
		const passwordValidation = PWD_REGEX.test(password);
		setValidPssWord(passwordValidation);
	}, [password]);
	// --------------------------------------------------------------------------------------------------

	return (
		<div className='form'>
			<div className='box'>
				<div>
					<h5>الاسم</h5>
					<input
						type='text'
						placeholder='ادخل اسم المستخدم او البريد الالكتروني'
						value={username}
						onChange={(e) => setUsername(e.target.value)}
						onKeyDown={handleKeyDown}
					/>
					{usernameError && <span className='wrong-text'>{usernameError}</span>}
				</div>
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
						placeholder='********'
						maxLength={24}
						minLength={8}
						onChange={(e) => setPassword(e.target.value)}
						onKeyDown={handleKeyDown}
						type={!type === "password" ? type : showPassword ? "text" : type}
					/>

					{passwordError && (
						<span
							className='wrong-text w-100 d-flex justify-content-start'
							style={{ color: "red" }}>
							{passwordError}
						</span>
					)}
				</div>
			</div>
			<div className='wrong-text' style={{ color: "red" }}>
				{error}
			</div>
			<div className='top checkbox_row'>
				<div className='check'>
					<div className='form-check'>
						<input
							className='form-check-input'
							type='checkbox'
							id='flexCheckDefault'
							value={rememberMe?.remember_me}
							onChange={(e) =>
								setRememberMe({
									...rememberMe,
									remember_me: e.target.value,
								})
							}
						/>
					</div>
					<h6>تذكرني</h6>
				</div>
				<h5 onClick={NavigateToRestorePassword}>نسيت كلمة المرور ؟</h5>
			</div>
			<button className='bt-main' onClick={Login}>
				تسجيل الدخول
			</button>
		</div>
	);
};

export default Login;
