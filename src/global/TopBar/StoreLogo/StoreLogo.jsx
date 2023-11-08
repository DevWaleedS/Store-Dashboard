import React from "react";

// Third Party
import useFetch from "../../../Hooks/UseFetch";

// images and icons
import demoLogo from "../../../data/Icons/logo.png";

const StoreLogo = () => {
	const { fetchedData: store_Setting } = useFetch(
		"https://backend.atlbha.com/api/Store/setting_store_show"
	);

	// to set the store logo to local storage
	localStorage.setItem("storeLogo", store_Setting?.data?.setting_store?.logo);
	return (
		<div
			className='navbar-brand d-md-flex d-none'
			style={{ width: "70px", height: "65.59px" }}>
			<img
				className=' img-fluid'
				style={{ objectFit: "contain" }}
				src={
					localStorage.getItem("storeLogo")
						? localStorage.getItem("storeLogo")
						: demoLogo
				}
				alt=''
			/>
		</div>
	);
};

export default StoreLogo;
