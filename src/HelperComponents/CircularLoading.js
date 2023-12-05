import React from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

export default function CircularLoading() {
	return (
		<Box
			sx={{
				display: "flex",
				flexDirection: "row",
				alignItems: "center",
				justifyContent: "center",
				gap: "6px",
			}}>
			<span className='loading-text'>جاري التحميل</span>
			<CircularProgress size='22px' sx={{ color: "#108699" }} />
		</Box>
	);
}
