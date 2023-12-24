import React from "react";
import "./Loading.css";
import Logo from "../../data/images/main_logo.png";

function Loading() {
	return (
		<div className='loading'>
			<div className='logo'>
				<img width='100%' height='100%' src={Logo} alt='logo' />
			</div>
		</div>
	);
}

export default Loading;
