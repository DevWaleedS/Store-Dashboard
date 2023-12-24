import React, { useState } from 'react';
import './PasswordField.css';
import { ReactComponent as EyeOPen } from "../../../data/Icons/eye_open.svg";
import { ReactComponent as EyeClose } from "../../../data/Icons/eye_close.svg";
import { MdErrorOutline } from 'react-icons/md';

const PasswordField = ({
	password,
	setPassword,
	passwordError,
	setPasswordError,
	handleKeyDown,
	validPssWord,
	pssWordFocus,
	setPssWordFocus,
}) => {
	const [showPassword, setShowPassword] = useState(false);
	let type = "password";

	const handleOnChange = (e) => {
		setPassword(e.target.value);

		if (e.target.name === "password" && passwordError !== "") {
			setPasswordError("");
		}
	};
	return (
		<>
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

				<h5 className='d-flex flex-row'>
					كلمة المرور <span style={{ color: "red" }}>*</span>
				</h5>
				<input
					name='password'
					style={{ textAlign: "right" }}
					autoComplete='off'
					value={password}
					placeholder=''
					maxLength={24}
					minLength={8}
					onChange={handleOnChange}
					onKeyDown={handleKeyDown}
					type={!type === "password" ? type : showPassword ? "text" : type}
					aria-invalid={validPssWord ? "false" : "true"}
					aria-describedby='password'
					onFocus={() => setPssWordFocus(true)}
					onBlur={() => setPssWordFocus(true)}
				/>
				<p
					id='password'
					className={
						pssWordFocus && password && !validPssWord
							? " d-block wrong-text "
							: "d-none"
					}
					style={{
						color: "red",
						direction: "rtl",
						background: "#ffffff5e",
						padding: "10px 10px 10px 20px",
						borderRadius: "8px",
					}}>
					<MdErrorOutline className='ms-1' />
					يجب ان لا تقل عن 8 خانات
				</p>

				{passwordError && (
					<span
						className='wrong-text w-100 d-flex justify-content-start'
						style={{ color: "red" }}>
						{passwordError}
					</span>
				)}
			</div>
		</>
	);
};

export default PasswordField;
