import React from "react";

import "./LogoHeader.css";
import { LogoSvg } from "../../../data/Icons";

const LogoHeader = () => {
	const NavigateToHomePage = () => {
		window.open("http://atlbha.com", "_blank");
	};
	return (
		<>
			<div className='logo-header'>
				<div className='box-logo' onClick={NavigateToHomePage}>
					<LogoSvg />
				</div>
			</div>
		</>
	);
};

export default LogoHeader;
