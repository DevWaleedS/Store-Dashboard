import React from "react";

// components
import LogoHeader from "../Authentication/LogoHeader/LogoHeader";

// Icons
import { ArrowBack } from "../../data/Icons";

const CompareNavigate = () => {
	const handleGoBack = () => {
		window.history.back();
	};
	return (
		<>
			<div>
				<LogoHeader />
				<div className='py-4'>
					<div
						className='box-logo d-flex justify-content-start align-items-center '
						style={{ cursor: "pointer" }}
						onClick={handleGoBack}>
						<ArrowBack />
						<span
							style={{
								color: "#1dbbbe",
								fontSize: "24px",
								fontWeight: "500",
								paddingRight: "10px",
							}}>
							مقارنة الباقات
						</span>
					</div>
				</div>
			</div>
		</>
	);
};

export default CompareNavigate;
