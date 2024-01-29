import React, { useEffect, useState, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Components
import useFetch from "../Hooks/UseFetch";
import { TopBarSearchInput } from "../global";
import CircularLoading from "../HelperComponents/CircularLoading";

// Context
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

// Icons
import { HomeIcon } from "../data/Icons";
import { IoIosArrowDown } from "react-icons/io";
// ---------------------------------------------

// Select Style
const selectStyle = {
	fontSize: "18px",
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
		"@media(max-width:768px)": {
			right: "90%",
		},
	},
};
// -----------------------------------------------------

const PlatformServices = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	// ------------------------------------------------------------

	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/etlobhaservice/show"
	);
	const { fetchedData: services } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/services"
	);
	// -----------------------------------------

	const [data, setData] = useState({
		store_name: "",
		activity: [],
		services: [],
		name: "",
		description: "",
	});
	// ---------------------------------------------

	// To get Activity and store name
	useEffect(() => {
		setData({
			...data,
			store_name: fetchedData?.data?.stores?.store_name,
			activity: fetchedData?.data?.stores?.activity?.map(
				(active) => active?.name
			),
		});
	}, [fetchedData]);
	// --------------------------------------------

	// Send Request Order
	const requestOrder = () => {
		setLoadingTitle("جاري ارسال الطلب");

		let formData = new FormData();
		formData.append("name", data?.name);
		for (let i = 0; i < data?.services?.length; i++) {
			formData.append([`service_id[${i}]`], data?.services[i]);
		}
		formData.append("description", data?.description);

		axios
			.post(`https://backend.atlbha.com/api/Store/etlobhaservice`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setReload(!reload);
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setData({ ...data, services: [], name: "", description: "" });
				} else {
					setLoadingTitle("");
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					setData({ ...data, services: [], name: "", description: "" });
				}
			});
	};
	// --------------------------------------

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
				<div className='head-category mb-md-4 mb-3'>
					<div className='row m-0'>
						<div className='col-md-6 col-12 align-self-center'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<HomeIcon />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>

									<li className='breadcrumb-item active ' aria-current='page'>
										خدمات المنصة
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>
				<div className='delegate-request-form'>
					<h5 className='form-name mb-md-5 mb-3'>
						قم بتقديم طلب بالخدمات التي تحتاجها
					</h5>
					{loading ? (
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
										className='w-100'
										type='text'
										disabled
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
										{data?.activity?.map((activity, idx) => (
											<div key={idx} className='activity'>
												{activity}
											</div>
										))}
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
											className='bg-white'
											sx={selectStyle}
											IconComponent={IoIosArrowDown}
											multiple
											displayEmpty
											inputProps={{ "aria-label": "Without label" }}
											value={data?.services}
											onChange={(e) =>
												setData({ ...data, services: e.target.value })
											}
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
												return selected.map((item) => {
													const result = services?.data?.services?.filter(
														(service) => service?.id === parseInt(item)
													);
													return `${result[0]?.name} , `;
												});
											}}>
											{services?.data?.services?.map((service, index) => (
												<MenuItem key={index} value={service?.id}>
													<Checkbox
														checked={data?.services?.indexOf(service?.id) > -1}
													/>
													<ListItemText primary={service?.name} />
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>
							</div>

							<div className='row align-items-center mb-4'>
								<div className='col-md-4 col-12 d-flex justify-content-md-start mb-md-0 mb-2'>
									<label htmlFor='order-number' className='d-block'>
										اضافة خدمة جديدة
										<span>(اختياري)</span>
									</label>
								</div>
								<div className='col-md-7 col-12'>
									<div className='new-service-hint'>
										يمكنك إضافه خدمة جديدة في حال لم تكن موجودة في قائمة الخدمات
										بالأعلى
									</div>
									<input
										type='text'
										value={data?.name}
										onChange={(e) => setData({ ...data, name: e.target.value })}
										className='w-100 new-service-input'
										placeholder='ادخل اسم الخدمة الجديدة'
									/>
								</div>
							</div>

							<div className='row align-items-center mb-4'>
								<div className='col-md-4 col-12 d-flex justify-content-md-start mb-md-0 mb-2'>
									<label htmlFor='order-number' className='d-block'>
										وصف الخدمة
										<span>(اختياري)</span>
									</label>
								</div>
								<div className='col-md-7 col-12'>
									<textarea
										rows={4}
										id='product-desc'
										name='description'
										className='w-100 new-service-input'
										placeholder='قم بكتابة وصف واضح للخدمة'
										value={data?.description}
										onChange={(e) =>
											setData({ ...data, description: e.target.value })
										}
									/>
								</div>
							</div>

							<div className='row align-items-center'>
								<div className='col-md-4 col-12 '></div>
								<div className='col-md-7 col-12'>
									<button
										className='w-100 upload-request-btn'
										onClick={() => requestOrder()}
										disabled={
											data?.services?.length === 0 && data?.name === ""
										}>
										إرسال
									</button>
								</div>
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
};

export default PlatformServices;
