import React, { useEffect, useState } from "react";

import { Document } from "../../../data/Icons";

const StoreDescription = ({
	descriptionValue,
	setDescriptionValue,
	settingErr,
}) => {
	const [isMaxLength, setIsMaxLength] = useState(false);

	useEffect(() => {
		setIsMaxLength(descriptionValue.length >= 120);
	}, [descriptionValue]);

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
						placeholder='ادخل وصف للمتجر لا يتعدي الـ١٢٠ حرف'
						rows='3'
						maxLength={120}
					/>
				</div>
				{isMaxLength ? (
					<span className='fs-6 w-100 text-danger'>
						لقد تجاوزت الحد المسموح به من الحروف (١٢٠ حرف)
					</span>
				) : null}

				{settingErr?.description ? (
					<span className='fs-6 w-100 text-danger'>
						{settingErr?.description}
					</span>
				) : null}
			</div>
		</div>
	);
};

export default StoreDescription;
