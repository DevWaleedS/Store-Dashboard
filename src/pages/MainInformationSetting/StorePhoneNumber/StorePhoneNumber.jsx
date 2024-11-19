import React, { useEffect, useState } from "react";
import { removeWhiteSpace } from "../../../HelperComponents";

const StorePhoneNumber = ({ phoneNumber, setPhoneNumber, settingErr }) => {
	/*Phone number validation */
	const PHONE_REGEX = /^(5\d{8})$/;

	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

	// TO HANDLE VALIDATION USER PHONE NUMBER
	useEffect(() => {
		const PhoneNumberValidation = PHONE_REGEX.test(phoneNumber);
		setValidPhoneNumber(PhoneNumberValidation);
	}, [phoneNumber]);

	return (
		<div className='row d-flex justify-content-center align-items-center'>
			<div className='col-lg-8 col-12'>
				<div className='store_email'>
					<label htmlFor='phonenumber' className='setting_label d-block'>
						رقم الهاتف
						<span className='important-hint ps-1'>*</span>
					</label>

					<div className='store_phone_number domain-name direction-ltr d-flex align-content-center justify-content-between'>
						<div className='main-domain-hint'>+966</div>
						<input
							type='number'
							style={{
								direction: "ltr",
							}}
							className='direction-ltr text-right store-email-input w-100'
							name='phonenumber'
							id='phonenumber'
							placeholder='رقم الهاتف'
							value={phoneNumber}
							onPaste={(e) => {
								removeWhiteSpace(e);
							}}
							onChange={(e) => setPhoneNumber(e.target.value)}
							maxLength={9}
							required
							aria-invalid={validPhoneNumber ? "false" : "true"}
							aria-describedby='phoneNumber'
							onFocus={() => setPhoneNumberFocus(true)}
							onBlur={() => setPhoneNumberFocus(true)}
						/>
					</div>
				</div>
				<div
					id='phoneNumber'
					className={
						phoneNumberFocus && phoneNumber && !validPhoneNumber
							? " d-block important-hint me-1 "
							: "d-none"
					}
					style={{ fontSize: "16px", whiteSpace: "normal" }}>
					تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
				</div>
				{settingErr?.phoneNumber && (
					<div className='d-flex flex-wrap'>
						<span className='fs-6 w-100 text-danger'>
							{settingErr?.phoneNumber}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default StorePhoneNumber;
