import React, { useEffect } from "react";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Icons
import { IoIosArrowDown } from "react-icons/io";

//  DatePicker
import { DatePicker } from "rsuite";

const selectStyle = {
	fontSize: "18px",
	width: "100%",
	backgroundColor: "#cce4ff38",
	boxShadow: "0 0 5px 0px #eded",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "20px",
		},
	"& .MuiOutlinedInput-root": {
		"& :hover": {
			border: "none",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "none",
	},
	"& .MuiSelect-icon": {
		right: "95%",
	},
};

const AddStoreAddress = ({
	error,
	shipping,
	currentOrder,
	setShipping,
	removeDuplicates,
	shippingCitiesData,
	getCityFromProvince,
	translateProvinceName,
}) => {
	// To handle the shipping information
	useEffect(() => {
		if (currentOrder?.orders?.shipping) {
			setShipping({
				...shipping,
				district: currentOrder?.orders?.shipping?.district,
				city: currentOrder?.orders?.shipping?.city,
				address: currentOrder?.orders?.shipping?.street_address,
				weight: currentOrder?.orders?.shipping?.weight,
			});
		}
	}, [currentOrder?.orders?.shipping]);

	return (
		<div className='order-details-box'>
			<div className='title mb-5'>
				<h5>اضافة بيانات الشحنة</h5>
			</div>
			<div className='px-md-3'>
				<div className='row mb-md-5 mb-3'>
					<div className='col-lg-3 col-md-3 col-12'>
						<label htmlFor='product-category'>
							المنطقة<span className='important-hint'>*</span>
						</label>
					</div>
					<div className='col-lg-9 col-md-9 col-12'>
						<Select
							name='district'
							value={shipping?.district}
							onChange={(e) => {
								setShipping({
									...shipping,
									district: e.target.value,
								});
							}}
							sx={selectStyle}
							IconComponent={IoIosArrowDown}
							displayEmpty
							disabled={
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
									? true
									: false
							}
							inputProps={{ "aria-label": "Without label" }}
							renderValue={(selected) => {
								if (!selected || shipping?.district === "") {
									return <p className='text-[#ADB5B9]'>اختر المنطقة</p>;
								}
								return translateProvinceName(selected);
							}}>
							{removeDuplicates(shippingCitiesData?.cities)?.map(
								(district, index) => {
									return (
										<MenuItem
											key={index}
											className='souq_storge_category_filter_items'
											sx={{
												backgroundColor: "rgba(211, 211, 211, 1)",
												height: "3rem",
												"&:hover": {},
											}}
											value={district?.region?.name_en}>
											{district?.region?.name}
										</MenuItem>
									);
								}
							)}
						</Select>
					</div>
					<div className='col-lg-3 col-md-3 col-12'></div>
					<div className='col-lg-9 col-md-9 col-12'>
						<span className='fs-6 text-danger'>{error?.district}</span>
					</div>
				</div>
				<div className='row mb-md-5 mb-3'>
					<div className='col-lg-3 col-md-3 col-12'>
						<label htmlFor='product-category'>
							المدينة<span className='important-hint'>*</span>
						</label>
					</div>
					<div className='col-lg-9 col-md-9 col-12'>
						<Select
							name='category_id'
							value={shipping?.city}
							onChange={(e) => {
								setShipping({
									...shipping,
									city: e.target.value,
								});
							}}
							sx={selectStyle}
							IconComponent={IoIosArrowDown}
							displayEmpty
							disabled={
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
									? true
									: false
							}
							inputProps={{ "aria-label": "Without label" }}
							renderValue={(selected) => {
								if (!selected || shipping?.city === "") {
									return <p className='text-[#ADB5B9]'>اختر المدينة</p>;
								}
								const result =
									getCityFromProvince?.filter(
										(district) => district?.name_en === selected
									) || "";
								return result[0]?.name;
							}}>
							{getCityFromProvince?.map((city, index) => {
								return (
									<MenuItem
										key={index}
										className='souq_storge_category_filter_items'
										sx={{
											backgroundColor: "rgba(211, 211, 211, 1)",
											height: "3rem",
											"&:hover": {},
										}}
										value={city?.name_en}>
										{city?.name}
									</MenuItem>
								);
							})}
						</Select>
					</div>
					<div className='col-lg-3 col-md-3 col-12'></div>
					<div className='col-lg-9 col-md-9 col-12'>
						<span className='fs-6 text-danger'>{error?.city}</span>
					</div>
				</div>
				<div className='row mb-md-5 mb-3'>
					<div className='col-lg-3 col-md-3 col-12'>
						<label htmlFor='product-name'>
							العنوان<span className='important-hint'>*</span>
						</label>
					</div>
					<div className='col-lg-9 col-md-9 col-12'>
						<input
							className='shipping-address-input'
							disabled={
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
									? true
									: false
							}
							type='text'
							placeholder='عنوان الشحنة'
							name='name'
							value={shipping?.address}
							onChange={(e) =>
								setShipping({
									...shipping,
									address: e.target.value,
								})
							}
						/>
					</div>
					<div className='col-lg-3 col-md-3 col-12'></div>
					<div className='col-lg-9 col-md-9 col-12'>
						<span className='fs-6 text-danger'>{error?.address}</span>
					</div>
				</div>
			</div>
		</div>
	);
};

export default AddStoreAddress;
