import React from "react";
import { Switch } from "@mui/material";

const StoreDataWidget = ({ data, image, changeStatus, checked }) => {
	return (
		<div className='data-widget'>
			<div className='data'>
				<div className='shipping-image-box'>
					<img src={image} alt='' loading='lazy' />
				</div>
			</div>
			<div className='switch-box'>
				<Switch
					onChange={changeStatus}
					checked={checked}
					sx={{
						"& .MuiSwitch-track": {
							width: 36,
							height: 22,
							opacity: 1,
							backgroundColor: "rgba(0,0,0,.25)",
							boxSizing: "border-box",
							borderRadius: 20,
						},
						"& .MuiSwitch-thumb": {
							boxShadow: "none",
							backgroundColor: "#EBEBEB",
							width: 16,
							height: 16,
							borderRadius: 4,
							transform: "translate(6px,7px)",
						},
						"&:hover": {
							"& .MuiSwitch-thumb": {
								boxShadow: "none",
							},
						},

						"& .MuiSwitch-switchBase": {
							"&:hover": {
								boxShadow: "none",
								backgroundColor: "none",
							},
							padding: 1,
							"&.Mui-checked": {
								transform: "translateX(12px)",
								color: "#fff",
								"& + .MuiSwitch-track": {
									opacity: 1,
									backgroundColor: "#3AE374",
								},
								"&:hover": {
									boxShadow: "none",
									backgroundColor: "none",
								},
							},
						},
					}}
				/>
			</div>
		</div>
	);
};

export default StoreDataWidget;
