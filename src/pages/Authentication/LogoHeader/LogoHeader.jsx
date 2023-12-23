import React from "react";
import { useLocation } from "react-router-dom";

import "./LogoHeader.css";
import { ArrowBack, LogoSvg } from "../../../data/Icons";

const LogoHeader = () => {
	const location = useLocation();

	const handleGoBack = () => {
		window.history.back();
	};

	const NavigateToHomePage = () => {
		window.open("http://atlbha.com", "_blank");
	};
	return (
		<>
			<div className='logo-header'>
				{location.pathname === "/RestorePassword" ||
				location.pathname === "/SendVerificationCode" ||
				location.pathname === "/VerificationPage" ||
				location.pathname === "/LogInVerificationCode" ||
				location.pathname === "/CreateNewPassword" ? (
					<div
						className='box-logo d-flex justify-content-start align-items-center'
						onClick={handleGoBack}>
						<ArrowBack />
						<span
							style={{
								color: "#1dbbbe",
								fontSize: "18px",
								fontWeight: "400",
								paddingRight: "10px",
							}}>
							العودة للخلف
						</span>
					</div>
				) : (
					<div className='box-logo' onClick={NavigateToHomePage}>
						<LogoSvg />
					</div>
				)}
			</div>
		</>
	);
};

export default LogoHeader;
