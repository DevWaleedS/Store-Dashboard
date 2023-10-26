import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import useFetch from "../Hooks/UseFetch";
import CircularLoading from "../HelperComponents/CircularLoading";
import { useDispatch } from "react-redux";
import axios from "axios";
import Context from "../Context/context";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { openDelegateRequestAlert } from "../store/slices/DelegateRequestAlert-slice";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
// import { Button } from "@mui/material";
import { TagInput } from "evergreen-ui";
import { Link } from "react-router-dom";
import { DelegateRequestAlert } from "../components";

// ICONS
import { AiOutlineSearch } from "react-icons/ai";
import howIcon from "../data/Icons/icon_24_home.svg";
import { IoIosArrowDown } from "react-icons/io";
import { LoadingContext } from "../Context/LoadingProvider";

const PlatformServices = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/etlobhaservice/show"
	);
	const { fetchedData: services } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/services"
	);
	const [data, setData] = useState({
		store_name: "",
		activity: [],
		services: [],
	});
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// to open DelegateRequestAlert
	const dispatch = useDispatch(true);

	useEffect(() => {
		setData({
			...data,
			store_name: fetchedData?.data?.stores?.store_name,
			activity: fetchedData?.data?.stores?.activity?.map(
				(active) => active?.name
			),
		});
	}, [fetchedData?.data?.stores]);

	const requestOrder = () => {
		setLoadingTitle("جاري ارسال الطلب");
		let formData = new FormData();
		for (let i = 0; i < data?.services?.length; i++) {
			formData.append([`service_id[${i}]`], data?.services[i]);
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/etlobhaservice`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/PlatformServices");
					setReload(!reload);
					setData({ ...data, services: [] });
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/PlatformServices");
					setReload(!reload);
					setData({ ...data, services: [] });
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | خدمات المنصة</title>
			</Helmet>
			<section className='PlatformServices-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
					</div>
				</div>
				<div className='head-category mb-md-4 mb-3'>
					<div className='row m-0'>
						<div className='col-md-6 col-12 align-self-center'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<img src={howIcon} alt='' />
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

						<div className='col-md-6 col-12 d-flex justify-content-end p-0'>
							<button
								className='delegate-request-btn'
								onClick={() => dispatch(openDelegateRequestAlert())}>
								طلب مندوب
							</button>
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
						<form onSubmit={(e) => e.preventDefault()}>
							<div className='row align-items-center mb-md-4 mb-3'>
								<div className='col-md-4 col-12 d-flex justify-content-md-center mb-md-0 mb-2'>
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
								<div className='col-md-4 col-12 d-flex justify-content-md-center mb-md-0 mb-2'>
									<label htmlFor='store-activity'>
										نشاط أو تصنيف المتجر
										<span>(تلقائي)</span>
									</label>
								</div>
								<div className='col-md-7 col-12'>
									<TagInput
										className='store-activity-input w-100'
										values={data?.activity}
										disabled={true}
									/>
								</div>
							</div>
							<div
								className='row align-items-center'
								style={{ marginBottom: "100px" }}>
								<div className='col-md-4 col-12 d-flex justify-content-md-center mb-md-0 mb-2'>
									<label htmlFor='order-number'>نوع الخدمات المطلوبة</label>
								</div>
								<div className='col-md-7 col-12'>
									<FormControl sx={{ m: 0, width: "100%" }}>
										<Select
											className='bg-white'
											sx={{
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
											}}
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
												if (data?.services.length === 0) {
													return (
														<span style={{ color: "#011723" }}>
															اختر خدمة أو أكثر
														</span>
													);
												}
												return selected.map((item) => {
													const result = services?.data?.services?.filter(
														(service) => service?.id === parseInt(item)
													);
													return `${result[0]?.name} , `;
												});
											}}
										>
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
							<div className='row d-flex justify-content-center'>
								<div className='col-md-10 col-12 d-flex justify-content-center'>
									<button
										className='w-100 upload-request-btn'
										onClick={() => requestOrder()}
										disabled={data?.services?.length === 0}>
										رفع الطلب
									</button>
								</div>
							</div>
						</form>
					)}
				</div>
				{/** DelegateRequestAlert */}
				<DelegateRequestAlert />
			</section>
		</>
	);
};

export default PlatformServices;
