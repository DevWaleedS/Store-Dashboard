import React from "react";
import { Avatar, Skeleton } from "@mui/material";

const StoreLogo = ({ storeLogo, isFetching }) => {
	return !isFetching ? (
		<div
			className='navbar-brand d-md-flex d-none'
			style={{ width: "70px", height: "65.59px" }}>
			<img
				className=' img-fluid'
				style={{ objectFit: "contain" }}
				src={storeLogo}
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
