import React from "react";

import { Address } from "../../../data/Icons";

const StoreAddress = ({ countryAddress, cityAddress, settingErr }) => {
	return (
		<div className='row d-flex justify-content-center align-items-center'>
			<div className='col-lg-8 col-12'>
				<div className='store_email'>
					<label htmlFor='address' className='setting_label d-block'>
						عنوان المتجر <span className='tax-text '>(تلقائي)</span>
					</label>

					<div className='select-country'>
						<div className='select-icon'>
							<Address className='edit-icon' />
						</div>
						<textarea
							disabled
							className='text-right form-control store-desc w-100'
							name='address'
							id='address'
							placeholder='عنوان المتجر يضاف تلقائي'
							value={
								countryAddress &&
								cityAddress &&
								`${countryAddress} -  ${cityAddress}
													`
							}
							onChange={() => console.log("test")}
							readOnly
							rows='3'
						/>
					</div>
				</div>
				{settingErr?.storeAddress && (
					<div className='d-flex flex-wrap'>
						<span className='fs-6 w-100 text-danger'>
							{settingErr?.storeAddress}
						</span>
					</div>
				)}
			</div>
		</div>
	);
};

export default StoreAddress;
