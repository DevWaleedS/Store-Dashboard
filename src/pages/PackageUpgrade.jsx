import React, { useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// MUI
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";

// Components
import { Plans } from "../components";
import { TopBarSearchInput } from "../global";

// Icons
import { HomeIcon } from "../data/Icons";

const PackageUpgrade = () => {
	const [yearlyPlan, setYearlyPlan] = useState(false);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تطوير الباقة</title>
			</Helmet>
			<section className='carts-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-5'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item  ' aria-current='page'>
									بيانات المتجر
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									تطوير الباقة
								</li>
							</ol>
						</nav>
					</div>
				</div>

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

				<div className='row'>
					<Plans yearlyPlan={yearlyPlan} />
				</div>
			</section>
		</>
	);
};
export default PackageUpgrade;
