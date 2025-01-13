import React from "react";
import { Switch } from "@mui/material";

const switchStyle = {
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
};

const ShippingCompaniesData = ({
	currentShippingOverPrice,
	currentShippingPrice,
	currentShippingTime,
	currentShippingCodPrice,
	changeStatus,
	checked,
	image,
	hideSwitch,
}) => {
	const daysDefinition = (time) => {
		let timeValue = Number(time);
		if (timeValue === 1) {
			return "يوم واحد";
		} else if (timeValue === 2) {
			return "يومين";
		} else if (timeValue <= 10 && timeValue >= 3) {
			return `${timeValue} أيام`;
		} else {
			return `${timeValue} يوم`;
		}
	};

	return (
		<div className='data-widget'>
			<div className='data'>
				<div className='w-100 h-100  d-flex flex-md-column flex-row justify-content-md-center justify-content-start gap-md-0 gap-2 align-items-center shipping-image-box px-3'>
					<img
						src={image}
						alt=''
						loading='lazy'
						style={{
							width: hideSwitch ? "120px" : "",
							marginTop: "26px",
							maxWidth: "100%",
							maxHight: "100%",
						}}
					/>

					<div className='d-flex flex-column justify-content-start align-items-start'>
						{currentShippingPrice ? (
							<div className='current-price mt-1 w-100 d-flex justify-content-start'>
								تكلفة الشحن :
								{currentShippingPrice === "" ||
								currentShippingPrice === "0" ||
								currentShippingPrice === 0 ? (
									<span> شحن مجاني </span>
								) : (
									<span> {currentShippingPrice} ر.س </span>
								)}
							</div>
						) : null}
						{Number(currentShippingTime) !== 0 && (
							<div className='current-price mt-1 w-100 d-flex justify-content-start'>
								مدة التوصيل الحالية :{" "}
								<span>{daysDefinition(currentShippingTime)}</span>
							</div>
						)}
						{currentShippingOverPrice && (
							<div className='current-price mt-1 w-100 d-flex justify-content-start'>
								تكلفة الوزن الزائد : <span>{currentShippingOverPrice} ر.س</span>
							</div>
						)}
						{currentShippingCodPrice && (
							<div className='current-price mt-1 w-100 d-flex justify-content-start'>
								الدفع عند الاستلام : <span>{currentShippingCodPrice} ر.س</span>
							</div>
						)}
					</div>
				</div>
			</div>
			{!hideSwitch && (
				<div className='switch-box'>
					<Switch onChange={changeStatus} checked={checked} sx={switchStyle} />
				</div>
			)}
		</div>
	);
};

export default ShippingCompaniesData;
