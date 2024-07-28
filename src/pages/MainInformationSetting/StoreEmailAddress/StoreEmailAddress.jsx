import React from "react";

const StoreEmailAddress = ({ storeEmail, setStoreEmail, settingErr }) => {
	return (
		<div className='row d-flex justify-content-center align-items-center'>
			<div className='col-lg-8 col-12'>
				<div className='store_email'>
					<label htmlFor='store_email' className='setting_label d-block'>
						البريد الالكتروني
						<span className='important-hint ps-1'>*</span>
					</label>
					<input
						className='direction-ltr text-right store-email-input w-100'
						name='store_email'
						id='store_email'
						placeholder=' البريد الالكتروني'
						value={storeEmail}
						onChange={(e) => setStoreEmail(e.target.value)}
					/>
				</div>
				{settingErr?.storeEmail && (
					<div className='d-flex flex-wrap'>
						<span className='fs-6 w-100 text-danger'>
							{settingErr?.storeEmail}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default StoreEmailAddress;
