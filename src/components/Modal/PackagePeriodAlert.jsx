import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Message } from "rsuite";

const PackagePeriodAlert = ({ showVerification }) => {
	const [isVisible, setIsVisible] = useState(true);

	const handleClose = () => {
		setIsVisible(false);
	};

	if (!isVisible) return null;

	return (
		<div className='package-alert'>
			{showVerification?.left <= 30 && showVerification?.package_paid ? (
				showVerification?.left === 0 ? (
					<Message closable type='error' showIcon onClose={handleClose}>
						الباقة منتهية <strong>انتبه!</strong>
					</Message>
				) : showVerification?.left <= 30 ? (
					<Message closable type='warning' showIcon onClose={handleClose}>
						<strong>يرجي الانتباه!</strong> الباقة ستنتهي خلال{" "}
						<strong>
							{showVerification?.left === 1
								? "يوم !"
								: showVerification?.left === 2
								? "يومين !"
								: showVerification?.left > 2 &&
								  showVerification?.left + "أيام !"}
						</strong>
						<Link to='/upgrade-packages' className='me-2' onClick={handleClose}>
							جدد الآن
						</Link>
					</Message>
				) : null
			) : null}
		</div>
	);
};

export default PackagePeriodAlert;
