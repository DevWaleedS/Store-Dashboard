import React from "react";
import { Avatar, Skeleton } from "@mui/material";

const StoreLogo = () => {
	return localStorage.getItem("logo") ? (
		<div
			className='navbar-brand d-md-flex d-none'
			style={{ width: "70px", height: "65.59px" }}>
			<img
				className=' img-fluid'
				style={{ objectFit: "contain" }}
				src={localStorage.getItem("logo")}
				alt=''
			/>
		</div>
	) : (
		<Skeleton variant='circular'>
			<Avatar />
		</Skeleton>
	);
};

export default StoreLogo;
