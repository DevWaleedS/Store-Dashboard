import React, { useEffect } from "react";

import { FormControlLabel, Radio, RadioGroup, Switch } from "@mui/material";
import { Dollar } from "../../../data/Icons";

// Switch style
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
		transform: "translate(7px,7px)",
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

const DiscountDetails = ({
	is_service,
	currentCartData,
	errors,
	setDiscount_total,
	setDiscount_value,
	setDiscount_type,
	setFree_shipping,
	setOpenPercentMenu,
	openPercentMenu,
	discount_type,
	free_shipping,
	discount_value,
	discountPercentValue,
}) => {
	// To set discount_total
	useEffect(() => {
		if (currentCartData) {
			setDiscount_total(currentCartData?.discount_total);
			setDiscount_value(currentCartData?.discount_value);
			setDiscount_type(currentCartData?.discount_type);
			setFree_shipping(currentCartData?.free_shipping === "0" ? false : true);
		}
	}, [currentCartData]);

	// to handle open discount_type inputs
	useEffect(() => {
		if (
			is_service &&
			currentCartData?.discount_type !== "" &&
			currentCartData?.discount_total !== 0 &&
			currentCartData?.discount_value !== 0
		) {
			setOpenPercentMenu(true);
		} else {
			setOpenPercentMenu(false);
		}
	}, [
		is_service,
		currentCartData?.discount_type,
		currentCartData?.discount_total,
		currentCartData?.discount_value,
	]);
	return (
		<div className='userData-container'>
			<div className='container-title'> تفاصيل الخصم</div>
			<div className='container-body' style={{ height: "100%" }}>
				<div className='row'>
					{!is_service ? (
						<>
							{" "}
							<div className='col-12 mb-4'>
								<Switch
									onChange={() => {
										setFree_shipping(!free_shipping);
										setOpenPercentMenu(false);
									}}
									checked={free_shipping}
									sx={switchStyle}
								/>

								<span
									className='d-inline-block'
									style={{ marginRight: "-6px", paddingTop: "10px" }}>
									شحن مجاني{" "}
								</span>
							</div>
							<div className='col-12 mb-4 d-flex align-items-center'>
								<Switch
									onChange={() => {
										setOpenPercentMenu(!openPercentMenu);
										setFree_shipping(false);
									}}
									checked={openPercentMenu}
									sx={switchStyle}
								/>

								<span
									className='d-inline-block '
									style={{ marginRight: "-6px", paddingTop: "10px" }}>
									خصم على السلة{" "}
								</span>
							</div>
						</>
					) : (
						<div className='col-12 mb-4 d-flex align-items-center'>
							<Switch
								readOnly={is_service}
								disabled={is_service}
								checked={is_service}
								onChange={() => {
									setOpenPercentMenu(is_service);
									setFree_shipping(false);
								}}
								sx={switchStyle}
							/>

							<span
								className='d-inline-block '
								style={{ marginRight: "-6px", paddingTop: "10px" }}>
								خصم على السلة{" "}
							</span>
						</div>
					)}

					<div className='col-12 '>
						{openPercentMenu && (
							<>
								<label htmlFor='coupon-name ' className='d-block mb-1'>
									نوع الخصم
									<span className='important-hint'>*</span>
								</label>
								<RadioGroup
									defaultValue='percent'
									className='d-flex flex-row discount-type-radio-group mb-1'
									aria-labelledby='demo-controlled-radio-buttons-group'
									value={discount_type}
									onClick={(e) => {
										setDiscount_type(e.target.value);
									}}>
									<div
										className='radio-box discount-radio-box'
										style={{ marginRight: "-30px" }}>
										<FormControlLabel
											value='percent'
											id='percent'
											control={
												<Radio
													sx={{
														".MuiSvgIcon-root": {
															width: "24px",
															height: "24px",
														},
													}}
												/>
											}
										/>

										<label
											className={
												discount_type === "percent" ? "me-3" : "disabled me-3"
											}
											htmlFor='percent-price'>
											نسبة من المشتريات
										</label>
									</div>
									<div className='radio-box last_one'>
										<FormControlLabel
											value='fixed'
											id='fixed'
											control={
												<Radio
													sx={{
														".MuiSvgIcon-root": {
															width: "24px",
															height: "24px",
														},
													}}
												/>
											}
										/>
										<label
											className={
												discount_type === "fixed" ? "me-3" : "disabled me-3"
											}
											htmlFor='fixed-price'>
											مبلغ ثابت من المشتريات
										</label>
									</div>
								</RadioGroup>

								<div>
									<div className='percent-input-wrapper my-1'>
										<Dollar />
										<input
											value={discount_value}
											onChange={(e) => setDiscount_value(e.target.value)}
											className='w-100 '
											type='text'
											placeholder={
												discount_type === "percent"
													? "أدخل نسبة الخصم  "
													: "أدخل قيمة المبلغ"
											}
										/>
										{discount_type === "percent" ? (
											<div className='percent-sign'> %</div>
										) : (
											<div className='percent-sign'>ر.س</div>
										)}
									</div>

									{discount_type === "fixed" &&
										discount_value > currentCartData?.total && (
											<div>
												<span className='fs-6 text-danger'>
													قيمة المبلغ اكبر من إجمالي السلة
												</span>
											</div>
										)}
									{discount_type === "fixed" &&
										discount_value == currentCartData?.total && (
											<div>
												<span className='fs-6 text-danger'>
													قيمة المبلغ متساوية من إجمالي السلة
												</span>
											</div>
										)}
									{discount_type === "percent" &&
										currentCartData?.total - discountPercentValue < 0 && (
											<div>
												<span className='fs-6 text-danger'>
													قيمة النسبة اكبر من إجمالي السلة
												</span>
											</div>
										)}
									{discount_type === "percent" &&
										currentCartData?.total - discountPercentValue === 0 && (
											<div>
												<span className='fs-6 text-danger'>
													قيمة النسبة متساوية من إجمالي السلة
												</span>
											</div>
										)}

									{errors?.discountValueErr && (
										<div>
											<span
												className='fs-6 text-danger'
												style={{ whiteSpace: "normal" }}>
												{errors?.discountValueErr}
											</span>
										</div>
									)}
								</div>
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default DiscountDetails;
