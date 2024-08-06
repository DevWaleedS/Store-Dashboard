import React, { useEffect, useState } from "react";

// Icons
import { MdErrorOutline } from "react-icons/md";

const UserPhoneNumberInput = ({
	phonenumberError,
	registerInfo,
	handleRegisterInfo,
	validPhoneNumber,
	setValidPhoneNumber,
}) => {
	// TO HANDLE VALIDATION STORE PHONE NUMBER
	const PHONE_REGEX = /^(5\d{8})$/;
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
	useEffect(() => {
		const phoneNumberValidation = PHONE_REGEX.test(registerInfo?.phonenumber);
		setValidPhoneNumber(phoneNumberValidation);
	}, [registerInfo?.phonenumber]);
	return (
		<>
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
						phoneNumberFocus && registerInfo?.phonenumber && !validPhoneNumber
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
		</>
	);
};

export default UserPhoneNumberInput;
