import React from "react";

import { Document } from "../../../data/Icons";

const StoreDescription = ({
	descriptionValue,
	setDescriptionValue,
	settingErr,
}) => {
	return (
		<div className='row d-flex justify-content-center align-items-center'>
			<div className='col-lg-8 col-12'>
				<label htmlFor='address' className='setting_label d-block'>
					وصف المتجر
					<span className='important-hint ps-1'>*</span>
				</label>
				<div className='select-country'>
					<div className='select-icon'>
						<Document className='edit-icon' />
					</div>
					<textarea
						name='descriptionValue'
						value={descriptionValue}
						onChange={(e) => setDescriptionValue(e.target.value)}
						className='form-control store-desc'
						placeholder='وصف المتجر'
						rows='3'></textarea>
				</div>
				{settingErr?.description && (
					<span className='fs-6 w-100 text-danger'>
						{settingErr?.description}
					</span>
				)}
			</div>
		</div>
	);
};

export default StoreDescription;
