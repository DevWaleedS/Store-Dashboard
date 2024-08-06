import React, { useState } from "react";

// MUI
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

const SwitchPackagesPlan = () => {
	const [yearlyPlan, setYearlyPlan] = useState(false);
	return (
		<>
			{" "}
			<div className='row mb-5'>
				<div className='d-flex justify-content-center align-items-center '>
					<FormControlLabel
						sx={{
							width: "maxContent ",
							"& .MuiFormControlLabel-label ": {
								alignSelf: "end",
								fontSize: "20px",
								letterSpacing: "0.2px",
								color: " #011723",
								marginLeft: 1,
							},
						}}
						className='d-flex justify-content-center align-items-center flex-row-reverse'
						control={
							<Switch
								defaultChecked
								onClick={() => setYearlyPlan(!yearlyPlan)}
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
						}
						label='6 أشهر/12 شهر'
					/>
				</div>
			</div>
		</>
	);
};

export default SwitchPackagesPlan;
