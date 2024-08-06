import React, { useEffect, useState } from "react";

// Icons
import { MdErrorOutline } from "react-icons/md";
import { SvgUser } from "../../../data/Icons";

const UserNameInput = ({
	registerInfo,
	validUserName,
	usernameError,
	setValidUserName,
	handleRegisterInfo,
}) => {
	// TO HANDLE VALIDATION FOR USER NAME

	const [userNameFocus, setUserNameFocus] = useState(false);
	const USER_REGEX = /^[A-Za-z0-9]+$/;
	useEffect(() => {
		const UserNameValidation = USER_REGEX.test(registerInfo?.user_name);
		setValidUserName(UserNameValidation);
	}, [registerInfo?.user_name]);
	return (
		<>
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
		</>
	);
};

export default UserNameInput;
