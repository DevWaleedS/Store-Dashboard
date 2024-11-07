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
		<div className='package-alert pt-3'>
			{showVerification?.left <= 30 && showVerification?.package_paid ? (
				showVerification?.left === 0 ? (
					<Message closable type='error' showIcon onClose={handleClose}>
						<strong>انتهت!</strong> مدة الاشتراك في باقة{" "}
						<strong>
							<span style={{ color: "#1dbbbe" }}>
								({showVerification?.package})
							</span>{" "}
						</strong>
						<Link to='/upgrade-packages' className='me-2' onClick={handleClose}>
							تجديد الاشتراك الآن
						</Link>
					</Message>
				) : showVerification?.left <= 30 ? (
					<Message closable type='warning' showIcon onClose={handleClose}>
						<strong>يرجي الانتباه!</strong> ستنتهي الباقة خلال{" "}
						<strong>
							{showVerification?.left === 1
								? "يوم !"
								: showVerification?.left === 2
								? "يومين !"
								: showVerification?.left > 2 &&
								  showVerification?.left + "أيام !"}
						</strong>
						<Link to='/upgrade-packages' className='me-2' onClick={handleClose}>
							جدد الاشتراك الآن
						</Link>
					</Message>
				) : null
			) : null}
		</div>
	);
};

export default PackagePeriodAlert;
