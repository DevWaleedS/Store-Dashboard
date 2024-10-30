import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";

// Components
import { Breadcrumb } from "../../components";
import { TopBarSearchInput } from "../../global/TopBar";
// Helpers
import { CircularLoading } from "../../HelperComponents";

// Context
import CheckoutServices from "./CheckoutServices/CheckoutServices";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";

// Icons
import { IoIosArrowDown } from "react-icons/io";

// RTK Query
import {
	useGetPlatformServicesDataQuery,
	useGetPlatformServicesSelectorQuery,
} from "../../store/apiSlices/platformServicesApi";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";

// Select Style
const selectStyle = {
	fontSize: "18px",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "20px",
			whiteSpace: "normal",
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
		"@media(max-width:768px)": {
			right: "90%",
		},
	},
};
// -----------------------------------------------------

const PlatformServices = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	// ------------------------------------------------------------
	// Get platform services data from api
	const { data: platformServices, isLoading } =
		useGetPlatformServicesDataQuery();

	// Get the Services Data Selector
	const { data: platformServicesSelector } =
		useGetPlatformServicesSelectorQuery();

	// -----------------------------------------------------------

	const [openCheckoutServices, setOpenCheckoutServices] = useState(false);
	const [data, setData] = useState({
		store_name: "",
		activity: [],
		services: [],
		paymentype_id: "",
	});

	const handleOnChangeData = (e) => {
		const { name, value } = e.target;
		setData((prevData) => {
			return { ...prevData, [name]: value };
		});
	};

	const [errors, setErrors] = useState({
		store_name: "",
		activity: "",
		services: "",
		paymentype_id: "",
	});

	const resetErrors = () => {
		setErrors({
			store_name: "",
			activity: "",
			services: "",

			paymentype_id: "",
		});
	};
	// ---------------------------------------------

	// To get Activity and store name
	useEffect(() => {
		setData({
			...data,
			store_name: platformServices?.stores?.store_name,
			activity: platformServices?.stores?.activity?.map(
				(active) => active?.name
			),
		});
	}, [platformServices]);

	// --------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | خدمات المنصة</title>
			</Helmet>
			<section className='PlatformServices-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<Breadcrumb mb={"mb-md-4 mb-3"} currentPage={"خدمات المنصة"} />

				<div className='delegate-request-form'>
					<h5 className='form-name mb-md-5 mb-3'>
						قم بتقديم طلب بالخدمات التي تحتاجها
					</h5>
					{isLoading ? (
						<div className=''>
							<CircularLoading />
						</div>
					) : (
						<>
							<div className='row align-items-center mb-md-4 mb-3'>
								<div className='col-md-4 col-12 d-flex justify-content-md-start mb-md-0 mb-2'>
									<label htmlFor='store-name'>
										اسم المتجر
										<span>(تلقائي)</span>
									</label>
								</div>
								<div className='col-md-7 col-12'>
									<input
										value={data?.store_name}
										onChange={(e) => console.log(e)}
										className='w-100'
										type='text'
										readOnly
									/>
								</div>
							</div>
							<div className='row align-items-center mb-md-4 mb-3'>
								<div className='col-md-4 col-12 d-flex justify-content-md-start mb-md-0 mb-2'>
									<label htmlFor='store-activity'>
										نشاط المتجر
										<span>(تلقائي)</span>
									</label>
								</div>
								<div className='col-md-7 col-12'>
									<div className='store-activity-input '>
										{data?.activity?.length > 0 ? (
											data.activity.map((activity, idx) => (
												<div key={idx} className='activity'>
													{activity}
												</div>
											))
										) : (
											<div style={{ fontSize: "16px" }}>
												لا يوجد نشاط لهذا المتجر
											</div>
										)}
									</div>
								</div>
							</div>

							<div className='row align-items-center mb-3'>
								<div className='col-md-4 col-12 d-flex justify-content-md-start mb-md-0 mb-2'>
									<label htmlFor='order-number'>
										نوع الخدمات المطلوبة
										<span className='important-hint'>*</span>
									</label>
								</div>
								<div className='col-md-7 col-12'>
									<FormControl sx={{ m: 0, width: "100%" }}>
										<Select
											multiple
											displayEmpty
											name='services'
											sx={selectStyle}
											className='bg-white'
											IconComponent={IoIosArrowDown}
											value={data?.services}
											onChange={handleOnChangeData}
											input={<OutlinedInput />}
											renderValue={(selected) => {
												if (data?.services?.length === 0) {
													return (
														<span
															style={{ color: "#011723", fontSize: "16px" }}>
															يمكنك اختيار خدمة أو أكثر
														</span>
													);
												}
												return (
													<div className=' d-flex justify-content-start flex-wrap gap-1'>
														{selected.map((item) => {
															const result = platformServicesSelector?.filter(
																(service) => service?.id === parseInt(item?.id)
															);
															return (
																<div className='multiple_select_items'>
																	{result[0]?.name}
																</div>
															);
														})}
													</div>
												);
											}}>
											{platformServicesSelector?.map((service, index) => (
												<MenuItem key={index} value={service}>
													<Checkbox
														checked={data?.services?.some(
															(item) => item.id === service.id
														)}
													/>
													<div className='w-100 d-flex justify-content-between'>
														<div
															style={{ whiteSpace: "normal" }}
															className='service-name'>
															{service?.name}
														</div>
														<div className='service-price'>
															{service?.price}{" "}
															<span style={{ fontSize: "16px" }}>ر.س</span>
														</div>
													</div>
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							</div>

							<div className='row align-items-center'>
								<div className='col-md-4 col-12 '></div>
								<div className='col-md-7 col-12'>
									<button
										className='w-100 upload-request-btn'
										onClick={() => setOpenCheckoutServices(true)}
										disabled={data?.services?.length === 0}>
										إرسال الطلب
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</section>

			{openCheckoutServices ? (
				<CheckoutServices
					data={data}
					errors={errors}
					setData={setData}
					setErrors={setErrors}
					resetErrors={resetErrors}
					handleOnChangeData={handleOnChangeData}
					openCheckoutServices={openCheckoutServices}
					setOpenCheckoutServices={setOpenCheckoutServices}
				/>
			) : null}
		</>
	);
};

export default PlatformServices;
