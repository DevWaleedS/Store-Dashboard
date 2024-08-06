import React, { useEffect, useState } from "react";

// Icons
import { MdErrorOutline } from "react-icons/md";

const UserEmailInput = ({
	emailError,
	registerInfo,
	handleRegisterInfo,
	setValidEmail,
	validEmail,
}) => {
	// TO HANDLE VALIDATION FOR EMAIL
	const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
	const [emailFocus, setEmailFocus] = useState(false);
	useEffect(() => {
		const emailValidation = EMAIL_REGEX.test(registerInfo?.email);
		setValidEmail(emailValidation);
	}, [registerInfo?.email]);

	return (
		<>
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
					تأكد من كتابة الايميل الصحيح
				</p>
				{emailError && (
					<span
						className='wrong-text w-100'
						style={{ color: "red", direction: "rtl" }}>
						{emailError}
					</span>
				)}
			</div>
		</>
	);
};

export default UserEmailInput;
