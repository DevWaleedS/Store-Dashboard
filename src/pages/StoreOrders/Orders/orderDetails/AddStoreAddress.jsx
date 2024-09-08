import React, { useEffect } from "react";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Icons
import { IoIosArrowDown } from "react-icons/io";

//  DatePicker
import { DatePicker } from "rsuite";
import moment from "moment";

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
	value,
	setValue,
	shipping,
	resetError,
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
				district: translateProvinceName(
					currentOrder?.orders?.shipping?.district
				),
				city: currentOrder?.orders?.shipping?.city,
				address: currentOrder?.orders?.shipping?.street_address,
				weight: currentOrder?.orders?.shipping?.weight,
			});
			const pickupDate = new Date(currentOrder?.orders?.shipping?.pickup_date);
			setValue(pickupDate);
		}
	}, [currentOrder?.orders?.shipping]);

	return (
		<div className='order-details-box'>
			<div className='title mb-5'>
				<h5>اضافة بيانات الشحنة</h5>
			</div>
			<div className='px-md-3'>
				<div className='row mb-md-5 mb-3'>
					<div className='col-12'>
						<h6>
							المنطقة<span className='important-hint'>*</span>
						</h6>
					</div>
					<div className=' col-12'>
						<Select
							name='district'
							value={shipping?.district}
							onChange={(e) => {
								setShipping({
									...shipping,
									district: e.target.value,
								});
								resetError();
							}}
							sx={selectStyle}
							IconComponent={IoIosArrowDown}
							displayEmpty
							readOnly={
								currentOrder?.orders?.status === "طلب مندوب لتسليم الشحنة" ||
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
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

					{error?.district ? (
						<div className='col-12'>
							<span className='fs-6 text-danger'>{error?.district}</span>
						</div>
					) : null}
				</div>
				<div className='row mb-md-5 mb-3'>
					<div className='col-lg-3 col-md-3 col-12'>
						<h6>
							المدينة<span className='important-hint'>*</span>
						</h6>
					</div>
					<div className='col-12'>
						<Select
							name='category_id'
							value={shipping?.city}
							onChange={(e) => {
								setShipping({
									...shipping,
									city: e.target.value,
								});
								resetError();
							}}
							sx={selectStyle}
							IconComponent={IoIosArrowDown}
							displayEmpty
							disabled={
								currentOrder?.orders?.status === "طلب مندوب لتسليم الشحنة" ||
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
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
					{error?.city ? (
						<div className='col-12'>
							<span className='fs-6 text-danger'>{error?.city}</span>
						</div>
					) : null}
				</div>
				<div className='row mb-md-5 mb-3'>
					<div className='col-12'>
						<h6>
							العنوان<span className='important-hint'>*</span>
						</h6>
					</div>
					<div className=' col-12'>
						<input
							className='shipping-address-input'
							readOnly={
								currentOrder?.orders?.status === "طلب مندوب لتسليم الشحنة" ||
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
							}
							type='text'
							placeholder='عنوان الشحنة'
							name='name'
							value={shipping?.address}
							onChange={(e) => {
								setShipping({
									...shipping,
									address: e.target.value,
								});
								resetError();
							}}
						/>
					</div>
					{error?.address ? (
						<div className=' col-12'>
							<span className='fs-6 text-danger'>{error?.address}</span>
						</div>
					) : null}
				</div>

				<div className='row mb-md-5 mb-3'>
					<div className='col-12'>
						<h6>
							تاريخ تسليم الشحنة للمندوب
							<span className='important-hint'>*</span>
						</h6>
					</div>
					<div className='col-12 '>
						<DatePicker
							block
							size='lg'
							showMeridian
							format='yyyy-MM-dd HH:mm:aa'
							placeholder='حدد تاريخ ووقت تسليم الشحنة'
							className='select_pickup_date_picker'
							value={value}
							onChange={(e) => {
								setValue(e);
								resetError();
							}}
							disabledDate={(date) => {
								const today = new Date();
								today.setHours(0, 0, 0, 0);
								return date < today || date?.getTime() === today?.getTime();
							}}
							readOnly={
								currentOrder?.orders?.status === "طلب مندوب لتسليم الشحنة" ||
								currentOrder?.orders?.status === "تم الشحن" ||
								currentOrder?.orders?.status === "ملغي" ||
								currentOrder?.orders?.status === "مكتمل"
							}
						/>
					</div>

					{error?.pickup_date ? (
						<div className=' mt-1 col-12'>
							<span className='fs-6 text-danger'>{error?.pickup_date}</span>
						</div>
					) : null}
				</div>
			</div>
		</div>
	);
};

export default AddStoreAddress;
