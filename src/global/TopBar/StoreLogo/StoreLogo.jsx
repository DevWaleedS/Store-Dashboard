import React, { useContext } from "react";
// Context
import Context from "../../../Context/context";
// images and icons
import { DefaultLogo } from "../../../data/images";

const StoreLogo = () => {
	const storeContext = useContext(Context);
	const { storeLogo } = storeContext;
	return (
		<div
			className='navbar-brand d-md-flex d-none'
			style={{ width: "70px", height: "65.59px" }}>
			<img
				className=' img-fluid'
				style={{ objectFit: "contain" }}
				src={storeLogo || localStorage.getItem("storeLogo")}
				alt=''
			/>
		</div>
	);
};

export default StoreLogo;
