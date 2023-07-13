import React from "react";
import { ReactComponent as LogoSvg } from "../../../data/Icons/logo svg.svg";
import "./LogoHeader.css";

const LogoHeader = () => {
	const NavigateToHomePage = () => {
		window.open("http://home.atlbha.com", "_blank");
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
