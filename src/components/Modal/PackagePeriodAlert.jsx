import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Message } from "rsuite";
import { DaysFormatter } from "../../utilities";

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
				) : showVerification?.left <= 30 &&
				  showVerification?.periodtype !== "14 يوم" ? (
					<Message closable type='warning' showIcon onClose={handleClose}>
						<strong>يرجي الانتباه!</strong> ستنتهي الباقة خلال{" "}
						<strong>{DaysFormatter(showVerification?.left)} !</strong>
						<Link to='/upgrade-packages' className='me-2' onClick={handleClose}>
							جدد الاشتراك الآن
						</Link>
					</Message>
				) : showVerification?.left <= 14 &&
				  showVerification?.periodtype === "14 يوم" ? (
					<Message closable type='warning' showIcon onClose={handleClose}>
						<strong>يرجي الانتباه!</strong> هذه الباقة <strong>تجريبية</strong>{" "}
						وستنتهي خلال
						<strong>{DaysFormatter(showVerification?.left)} !</strong>
						<Link to='/upgrade-packages' className='me-2' onClick={handleClose}>
							اشترك الآن
						</Link>
					</Message>
				) : null
			) : null}
		</div>
	);
};

export default PackagePeriodAlert;
