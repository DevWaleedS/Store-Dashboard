import React, { useContext, useState, useEffect, Fragment } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../Context/context";
import useFetch from "../Hooks/UseFetch";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { useCookies } from "react-cookie";
import { LoadingContext } from "../Context/LoadingProvider";

// import ImageUploading library
import ImageUploading from "react-images-uploading";

// IMPORT ICON
import CircularLoading from "../HelperComponents/CircularLoading";
import { IoIosArrowDown } from "react-icons/io";
import howIcon from "../data/Icons/icon_24_home.svg";
import { MdFileUpload } from "react-icons/md";
import DemoImage from "../data/Icons/demo-logo.png";
import { ReactComponent as CountryIcon } from "../data/Icons/icon-24-country.svg";
import { ReactComponent as CitIcon } from "../data/Icons/icon-24-town.svg";
import { ReactComponent as EditIcon } from "../data/Icons/document_text_outlined.svg";
import { ReactComponent as Address } from "../data/Icons/address.svg";
import { ReactComponent as Timer } from "../data/Icons/timer.svg";
import { AiOutlineSearch } from "react-icons/ai";
import { AiOutlineCloseCircle } from "react-icons/ai";

const style = {
	position: "absolute",
	top: "55%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "900px",
	maxWidth: "90%",
	bgcolor: "#fff",
	border: "1px solid #707070",
	borderRadius: "16px",
	boxShadow: 24,
};

const contentStyle = {
	height: "500px",
	display: "flex",
	flexDirection: "column",
	gap: "18px",
	fontSize: "20px",
	fontWight: 400,
	letterSpacing: "0.2px",
	color: "#FFFFFF",
	padding: "30px 80px 20px",
	whiteSpace: "normal",
	overflowY: "auto",
	overflowX: "hidden",
};

const MainInformation = () => {
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [openHoursWork, setOpenHoursWork] = useState(false);

	const [openAlawys, setOpenAlawys] = useState();
	const [workDays, setWorkDays] = useState([
		{
			day: {
				id: "",
				name: "",
			},
			from: "",
			status: "",
			to: "",
		},
	]);

	// To show the store info that come from api
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/setting_store_show"
	);

	// to get selectors from api
	const { fetchedData: countryList } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/countries"
	);
	const { fetchedData: citiesList } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/cities"
	);
	// to get the user profile info
	// const { fetchedData: profile } = useFetch(
	// 	"https://backend.atlbha.com/api/Store/profile"
	// );

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> TO HANDLE THE REG_EXPRESS <=
	 *  ------------------------------------------------- */
	const USER_REGEX = /^[A-Za-z]+$/;
	const PHONE_REGEX = /^(5\d{8})$/;

	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
	const [domainNameFocus, setDomainNameFocus] = useState(false);
	const [domainNameValidFocus, setDomainNameValidFocus] = useState(false);
	const [validDomainName, setValidDomainName] = useState(false);

	// ---------------------------------------------------------------
	const [defaultStoreLogo, setDefaultStoreLogo] = useState(DemoImage);
	const [defaultStoreIcon, setDefaultStoreIcon] = useState(DemoImage);
	const [storeLogo, setStoreLogo] = useState([]);
	const [storeIcon, setStoreIcon] = useState([]);
	const [domain, setDomain] = useState("");
	const [country, setCountry] = useState("");
	const [city, setCity] = useState("");
	const [storeEmail, setStoreEmail] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [descriptionValue, setDescriptionValue] = useState("");

	// to set the store address to api
	const [countryAddress, setCountryAddress] = useState("");
	const [cityAddress, setCityAddress] = useState("");

	// ERRORS
	const [settingErr, setSettingErr] = useState({
		description: "",
		logo: "",
		icon: "",
		domain: "",
		city_id: "",
		country_id: "",
		phoneNumber: "",
		storeEmail: "",
		storeAddress: "",
	});

	// We use this effect to avoid the errors
	useEffect(() => {
		if (fetchedData?.data?.setting_store) {
			setDefaultStoreLogo(fetchedData?.data?.setting_store?.logo);
			setDefaultStoreIcon(fetchedData?.data?.setting_store?.icon);
			setDomain([fetchedData?.data?.setting_store?.domain]);
			setCountry([fetchedData?.data?.setting_store?.country?.id]);
			setCity([fetchedData?.data?.setting_store?.city?.id]);
			setStoreEmail(fetchedData?.data?.setting_store?.store_email);
			setPhoneNumber(
				fetchedData?.data?.setting_store?.phonenumber?.startsWith("+966")
					? fetchedData?.data?.setting_store?.phonenumber.slice(4)
					: fetchedData?.data?.setting_store?.phonenumber?.startsWith("00966")
					? fetchedData?.data?.setting_store?.phonenumber.slice(5)
					: fetchedData?.data?.setting_store?.phonenumber
			);
			setDescriptionValue(fetchedData?.data?.setting_store?.description);

			setOpenAlawys(
				fetchedData?.data?.setting_store?.working_status === "active"
					? true
					: false
			);
			setWorkDays(fetchedData?.data?.setting_store?.workDays);
		}
	}, [fetchedData?.data?.setting_store]);

	// ---------------------------
	const resetSettingError = () => {
		setSettingErr({
			description: "",
			logo: "",
			icon: "",
			domain: "",
			city_id: "",
			country_id: "",
			phoneNumber: "",
			storeEmail: "",
			storeAddress: "",
		});
	};

	// to upload the store logo
	const onChangeStoreLogo = (imageList, addUpdateIndex) => {
		// data for submit
		setStoreLogo(imageList);
	};

	// to upload the store icon
	const onChangeSelectIcon = (imageList, addUpdateIndex) => {
		// data for submit
		setStoreIcon(imageList);
	};

	// to update UpdateMaintenanceMode values
	const settingsStoreUpdate = () => {
		resetSettingError();
		setLoadingTitle("جاري تعديل بيانات المتجر الأساسية");

		let formData = new FormData();

		// Check if a new logo is uploaded, otherwise use the existing one
		if (storeLogo?.length !== 0) {
			formData.append("logo", storeLogo[0]?.file);
		}
		// Check if a new icon is uploaded, otherwise use the existing one
		if (storeIcon?.length !== 0) {
			formData.append("icon", storeIcon[0]?.file);
		}
		formData.append("domain", domain);
		formData.append("country_id", country);
		formData.append("city_id", city);
		formData.append(
			"store_address",
			`${countryAddress}  -  ${cityAddress}` || ""
		);

		formData.append("store_email", storeEmail || "");

		formData.append(
			"phonenumber",
			phoneNumber?.startsWith("+966") || phoneNumber?.startsWith("00966")
				? phoneNumber
				: `+966${phoneNumber}`
		);

		formData.append("description", descriptionValue);
		formData.append("working_status", openAlawys ? "active" : "not_active");
		for (let i = 0; i < workDays?.length; i++) {
			formData.append([`data[${i}][status]`], workDays?.[i]?.status);
			formData.append([`data[${i}][id]`], workDays?.[i]?.day?.id);
			formData.append(
				[`data[${i}][from]`],
				workDays?.[i]?.status === "active" ? workDays?.[i]?.from : null
			);
			formData.append(
				[`data[${i}][to]`],
				workDays?.[i]?.status === "active" ? workDays?.[i]?.to : null
			);
		}

		axios
			.post(
				`https://backend.atlbha.com/api/Store/setting_store_update`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
					window.location.reload();
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setSettingErr({
						logo: res?.data?.message?.en?.logo,
						icon: res?.data?.message?.en?.icon,
						domain: res?.data?.message?.en?.domain?.[0],
						country_id: res?.data?.message?.en?.country_id?.[0],
						city_id: res?.data?.message?.en?.city_id?.[0],
						storeAddress: res?.data?.message?.en?.store_address?.[0],
						storeEmail: res?.data?.message?.en?.store_email?.[0],
						phoneNumber: res?.data?.message?.en?.phonenumber?.[0],
						description: res?.data?.message?.en?.description?.[0],
					});
				}
			});
	};

	// TO HANDLE VALIDATION USER PHONE NUMBER
	useEffect(() => {
		const PhoneNumberValidation = PHONE_REGEX.test(phoneNumber);
		setValidPhoneNumber(PhoneNumberValidation);
	}, [phoneNumber]);

	// TO HANDLE VALIDATION FOR DOMAIN NAME
	useEffect(() => {
		const domainNameValidation = USER_REGEX.test(domain);
		setValidDomainName(domainNameValidation);
	}, [domain]);

	const updateState = (index) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, i) => {
				if (index === i) {
					return {
						...obj,
						status: obj?.status === "active" ? "not_active" : "active",
					};
				}
				return obj;
			});

			return newState;
		});
	};

	const updateFromTime = (index, value) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, i) => {
				if (index === i) {
					return { ...obj, from: value };
				}
				return obj;
			});
			return newState;
		});
	};

	const updateToTime = (index, value) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, i) => {
				if (index === i) {
					return { ...obj, to: value };
				}
				return obj;
			});
			return newState;
		});
	};

	const updateAll = (value) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, index) => {
				return {
					...obj,
					status: fetchedData?.data?.setting_store?.workDays?.[index]?.status,
					from: fetchedData?.data?.setting_store?.workDays?.[index]?.from,
					to: fetchedData?.data?.setting_store?.workDays?.[index]?.to,
				};
			});
			return newState;
		});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | بيانات المتجر الأساسية</title>
			</Helmet>
			<Modal
				open={openHoursWork}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div
						className='d-flex flex-row align-items-center justify-content-between p-4'
						style={{ backgroundColor: "#1DBBBE", borderRadius: "8px" }}>
						<h6 style={{ color: "#F7FCFF" }}>ساعات العمل</h6>
						<AiOutlineCloseCircle
							onClick={() => {
								setOpenHoursWork(false);
								setOpenAlawys(
									fetchedData?.data?.setting_store?.working_status === "active"
										? true
										: false
								);
								setWorkDays(fetchedData?.data?.setting_store?.workDays);
							}}
							style={{
								color: "#ffffff",
								width: "22px",
								height: "22px",
								cursor: "pointer",
							}}
						/>
					</div>
					<div
						className='delegate-request-alert text-center'
						style={contentStyle}>
						<div
							className='d-flex flex-row align-items-center justify-content-center gap-3'
							style={{
								backgroundColor: !openAlawys ? "#011723" : "#ADB5B9",
								borderRadius: "8px",
								fontSize: "20px",
								padding: "14px",
							}}>
							<Switch
								onChange={(e) => {
									setOpenAlawys(!openAlawys);
									updateAll(e.target.checked);
								}}
								checked={!openAlawys}
								sx={{
									width: "36px !important",
									height: "22px !important",
									padding: "0 !important",
									borderRadius: "20px !important",
									"& .MuiSwitch-track": {
										width: "36px !important",
										height: "22px !important",
										opacity: 1,
										backgroundColor: "rgba(0,0,0,.25)",
										boxSizing: "border-box",
										borderRadius: "20px !important",
									},
									"& .MuiSwitch-thumb": {
										boxShadow: "none",
										width: "16px !important",
										height: "16px !important",
										borderRadius: "50% !important",
										transform: "translate(3px,3px) !important",
										color: "#fff",
									},

									"&:hover": {
										"& .MuiSwitch-thumb": {
											boxShadow: "none !important",
										},
									},

									"& .MuiSwitch-switchBase": {
										padding: "0px !important",
										top: "0px !important",
										left:"0px !important",
										"&.Mui-checked": {
											transform: "translateX(12px) !important",
											color: "#fff",
											"& + .MuiSwitch-track": {
												opacity: 1,
												backgroundColor: "#3AE374",
											},
										},
									},
								}}
							/>
							مفتوح دائماً
						</div>
						{workDays?.map((day, index) => (
							<div
								key={index}
								className='work-day d-flex flex-sm-row flex-column align-items-center justify-content-between px-3 py-2 gap-3'
								style={{
									minWidth: "max-content",
									minHeight: "80px",
									backgroundColor: "#FFFFFF",
									boxShadow: "0px 3px 6px #0000000F",
									borderRadius: "8px",
								}}>
								<div className='d-flex flex-row align-items-center gap-3'>
									<span
										style={{
											minWidth: "100px",
											color: "#011723",
											fontSize: "18px",
											fontWeight: "500",
										}}>
										{day?.day?.name}
									</span>
									<button
										disabled={!openAlawys}
										onClick={() => updateState(index)}
										className='day-switch'
										style={{
											backgroundColor:
												day?.status === "active" ? "#3AE374" : "#ADB5B9",
										}}>
										{day?.status === "not_active" && <span>مغلق</span>}
										<p className='circle'></p>
										{day?.status === "active" && <span>مفتوح</span>}
									</button>
								</div>

								{day?.status === "active" && (
									<div className='choose-time'>
										<div className='time-input'>
											<input
												value={day?.from}
												onChange={(e) => updateFromTime(index, e.target.value)}
												type='time'
												style={{ color: "#000000" }}
												disabled={!openAlawys}
											/>
										</div>
										<div className='time-input'>
											<input
												value={day?.to}
												onChange={(e) => updateToTime(index, e.target.value)}
												type='time'
												style={{ color: "#000000" }}
												disabled={!openAlawys}
											/>
										</div>
									</div>
								)}
							</div>
						))}

						<button
							onClick={() => {
								setEndActionTitle("تم حفظ تحديث ساعات العمل");
								setOpenHoursWork(false);
							}}
							style={{
								minHeight: "56px",
								color: "#fff",
								fontSize: "20px",
								fontWight: 500,
								backgroundColor: "#1DBBBE",
								borderRadius: " 8px",
							}}
							className='w-100'>
							حفظ ساعات العمل
						</button>
					</div>
				</Box>
			</Modal>
			<section className='main-info-page p-lg-3'>
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
				<div className='head-category mb-md-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item ' aria-current='page'>
									الإعدادات
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									البيانات الأساسية
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='main-info-form'>
					{loading ? (
						<div
							className='d-flex justify-content-center align-items-center'
							style={{ height: "200px" }}>
							<CircularLoading />
						</div>
					) : (
						<div className='row'>
							<div className='col-12 mb-4'>
								{/** Upload Logo row */}
								<div className='row d-flex justify-content-center align-items-center mb-3'>
									<div className='col-lg-6 col-12'>
										{/** Image Perv Section */}
										<div className='upload-logo-set d-flex justify-content-center align-items-center flex-column'>
											{/** Upload Image  */}
											<ImageUploading
												value={storeLogo}
												onChange={onChangeStoreLogo}
												dataURLKey='data_url'
												acceptType={["jpg", "png", "jpeg"]}>
												{({ imageList, onImageUpload, dragProps }) => (
													// Ui For Upload Log
													<Fragment>
														{/** Preview Image Box */}
														<div className='upload-image-wrapper'>
															{storeLogo[0] ? (
																<div className='upload-image-bx mb-2'>
																	<img
																		src={storeLogo?.[0]?.data_url}
																		alt={""}
																		className='img-fluid'
																	/>
																</div>
															) : (
																<div className='upload-image-bx mb-2'>
																	<img
																		src={defaultStoreLogo}
																		alt={""}
																		className='img-fluid'
																	/>
																</div>
															)}
														</div>

														{/** upload btn */}
														<button
															className='upload-log-btn'
															onClick={onImageUpload}
															{...dragProps}>
															<span> رفع الشعار </span>
															<MdFileUpload />
														</button>
														{settingErr?.logo && (
															<>
																<span className='fs-6 w-100 text-danger'>
																	{settingErr?.logo[0]}
																</span>
																<span className='fs-6 w-100 text-danger'>
																	{settingErr?.logo[1]}
																</span>
															</>
														)}
													</Fragment>
												)}
											</ImageUploading>
										</div>
									</div>
								</div>
							</div>

							<div className='col-12 mb-4'>
								{/** Upload Icon row */}
								<div
									className='row d-flex justify-content-center align-items-center'
									style={{ cursor: "pointer" }}>
									<div className='col-lg-8 col-12'>
										<div className='select-country'>
											<label htmlFor='upload-icon' className='setting_label'>
												ايقونة تبويب المتجر في المتصفح
											</label>
											<div>
												<ImageUploading
													value={storeIcon}
													onChange={onChangeSelectIcon}
													dataURLKey='data_url'
													acceptType={["jpg", "png", "jpeg"]}>
													{({ onImageUpload, dragProps }) => (
														<div
															className='upload-icon-btn'
															onClick={() => {
																onImageUpload();
															}}
															{...dragProps}>
															<div style={{ width: "35px", height: "35px" }}>
																{storeIcon[0] ? (
																	<img
																		className='img-fluid'
																		src={storeIcon[0].data_url}
																		alt=''
																		style={{ objectFit: "contain" }}
																	/>
																) : (
																	<img
																		className='img-fluid'
																		src={defaultStoreIcon}
																		alt=''
																		style={{ objectFit: "contain" }}
																	/>
																)}
															</div>

															<MdFileUpload />
														</div>
													)}
												</ImageUploading>
											</div>

											<p className='upload-icon-hint'>
												المقاس الأنسب 32 بكسل عرض 32 بكسل الارتفاع
											</p>
										</div>
										{settingErr?.icon && (
											<div className='d-flex flex-wrap'>
												<span className='fs-6 w-100 text-danger'>
													{settingErr?.icon[0]}
												</span>
												<span className='fs-6 w-100 text-danger'>
													{settingErr?.icon[1]}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className='col-12 mb-4'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='store_email'>
											<label htmlFor='domain' className='setting_label d-block'>
												الدومين(رابط المتجر)
											</label>
										</div>
										<div className='domain-name direction-ltr d-flex align-content-center justify-content-between'>
											<div className='main-domain-hint'>atlbha.com/</div>
											<input
												type='text'
												name='domain'
												id='domain'
												value={domain}
												onChange={(e) => {
													setDomain(e.target.value);
													setDomainNameFocus(true);
												}}
												aria-describedby='domainName'
												onFocus={() => {
													setDomainNameFocus(true);
													setDomainNameValidFocus(true);
												}}
												onBlur={() => {
													setDomainNameFocus(false);
													setDomainNameValidFocus(true);
												}}
												aria-invalid={validDomainName ? "false" : "true"}
											/>
										</div>
										<div
											id='domainName'
											className={
												domainNameFocus && domain
													? " d-block important-hint me-1 "
													: "d-none"
											}
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											قد يؤدي تغيير الدومين إلى حدوث خلل في ظهور او عدم ظهور-
											المتجر الخاص بك.
										</div>

										<div
											id='domainName'
											className={
												domainNameValidFocus && domain && !validDomainName
													? " d-block important-hint me-1 "
													: "d-none"
											}
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											يجب أن يكون الدومين باللغة الانجليزية فقط.-
										</div>

										{settingErr?.domain && (
											<span className='fs-6 w-100 text-danger'>
												{settingErr?.domain}
											</span>
										)}
									</div>
								</div>
							</div>

							<div className='col-12 mb-4'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='store_email'>
											<label
												htmlFor='country_id'
												className='setting_label d-block'>
												الدولة
											</label>
										</div>
										<div className='select-country'>
											<div className='select-icon'>
												<CountryIcon />
											</div>

											<Select
												id='country_id'
												name='country_id'
												value={country}
												onChange={(e) => {
													setCountry(e.target.value);
												}}
												MenuProps={{
													sx: {
														"& .MuiPaper-root ": {
															height: "350px",
														},
													},
												}}
												sx={{
													width: "100%",
													fontSize: "18px",
													"& .MuiSelect-select.MuiSelect-outlined": {
														paddingRight: "50px !important",
													},
													"& .MuiOutlinedInput-root": {
														"& :hover": {
															border: "none",
														},
													},
													"& .MuiOutlinedInput-notchedOutline": {
														border: "1px solid #ededed",
													},
													"& .MuiSelect-icon": {
														right: "95%",
													},
												}}
												IconComponent={IoIosArrowDown}
												displayEmpty
												inputProps={{ "aria-label": "Without label" }}
												renderValue={(selected) => {
													if (country?.length === 0) {
														return <span>اختر الدولة</span>;
													}
													const result = countryList?.data?.countries?.filter(
														(item) => parseInt(item?.id) === parseInt(selected)
													);
													setCountryAddress(result?.[0]?.name);
													return result?.[0]?.name;
												}}>
												{countryList?.data?.countries?.map((item, idx) => {
													return (
														<MenuItem
															key={idx}
															className='souq_storge_category_filter_items'
															sx={{
																backgroundColor: "inherit",
																height: "3rem",
																"&:hover": {},
															}}
															value={`${item?.id}`}>
															{item?.name}
														</MenuItem>
													);
												})}
											</Select>
										</div>
										{settingErr?.country_id && (
											<span className='fs-6 w-100 text-danger'>
												{settingErr?.country_id}
											</span>
										)}
									</div>
								</div>
							</div>

							<div className='col-12 mb-4'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='store_email'>
											<label
												htmlFor='city_id'
												className='setting_label d-block'>
												المدينة
											</label>
										</div>
										<div className='select-country'>
											<div className='select-icon'>
												<CitIcon className='' />
											</div>

											<Select
												id='city_id'
												name='city_id'
												value={city}
												onChange={(e) => {
													setCity(e.target.value);
												}}
												MenuProps={{
													sx: {
														"& .MuiPaper-root ": {
															height: "350px",
														},
													},
												}}
												sx={{
													width: "100%",
													fontSize: "18px",

													"& .MuiSelect-select.MuiSelect-outlined": {
														paddingRight: "50px !important",
													},

													"& .MuiOutlinedInput-root": {
														"& :hover": {
															border: "none",
														},
													},
													"& .MuiOutlinedInput-notchedOutline": {
														border: "1px solid #ededed",
													},
													"& .MuiSelect-icon": {
														right: "95%",
													},
												}}
												IconComponent={IoIosArrowDown}
												displayEmpty
												inputProps={{ "aria-label": "Without label" }}
												renderValue={(selected) => {
													if (city?.length === 0) {
														return <span>اختر المدينة</span>;
													}
													const result = citiesList?.data?.cities?.filter(
														(item) => parseInt(item?.id) === parseInt(selected)
													);
													setCityAddress(result?.[0]?.name);

													return result?.[0]?.name;
												}}>
												{citiesList?.data?.cities?.map((item, idx) => {
													return (
														<MenuItem
															key={idx}
															className='souq_storge_category_filter_items'
															sx={{
																backgroundColor: "inherit",
																height: "3rem",
																"&:hover": {},
															}}
															value={`${item?.id}`}>
															{item?.name}
														</MenuItem>
													);
												})}
											</Select>
										</div>
										{settingErr?.city_id && (
											<span className='fs-6 w-100 text-danger'>
												{settingErr?.city_id}
											</span>
										)}
									</div>
								</div>
							</div>

							<div className=' col-12 mb-4'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='store_email'>
											<label
												htmlFor='address'
												className='setting_label d-block'>
												عنوان المتجر
											</label>

											<div className='select-country'>
												<div className='select-icon'>
													<Address className='edit-icon' />
												</div>
												<textarea
													disabled
													className='text-right form-control store-desc w-100'
													name='address'
													id='address'
													placeholder='قم بادخال عنوان المتجر '
													value={`${countryAddress} -  ${cityAddress}`}
													onChange={() => console.log("test")}
													rows='3'
													onResize='false'
												/>
											</div>
										</div>
										{settingErr?.storeAddress && (
											<div className='d-flex flex-wrap'>
												<span className='fs-6 w-100 text-danger'>
													{settingErr?.storeAddress}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className=' col-12 mb-4'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='store_email'>
											<label
												htmlFor='store_email'
												className='setting_label d-block'>
												البريد الالكتروني للمتجر
											</label>
											<input
												className='direction-ltr text-right store-email-input w-100'
												name='store_email'
												id='store_email'
												placeholder='البريد الالكتروني للمتجر'
												value={storeEmail}
												onChange={(e) => setStoreEmail(e.target.value)}
											/>
										</div>
										{settingErr?.storeEmail && (
											<div className='d-flex flex-wrap'>
												<span className='fs-6 w-100 text-danger'>
													{settingErr?.storeEmail}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className=' col-12 mb-4'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='store_email'>
											<label
												htmlFor='phonenumber'
												className='setting_label d-block'>
												رقم هاتف المتجر
											</label>

											<div className='store_phone_number domain-name direction-ltr d-flex align-content-center justify-content-between'>
												<div className='main-domain-hint'>+996</div>
												<input
													className='direction-ltr text-right store-email-input w-100'
													name='phonenumber'
													id='phonenumber'
													placeholder='رقم هاتف المتجر'
													value={phoneNumber}
													onChange={(e) => setPhoneNumber(e.target.value)}
													maxLength='9'
													required
													aria-invalid={validPhoneNumber ? "false" : "true"}
													aria-describedby='phoneNumber'
													onFocus={() => setPhoneNumberFocus(true)}
													onBlur={() => setPhoneNumberFocus(true)}
												/>
											</div>
										</div>
										<div
											id='phoneNumber'
											className={
												phoneNumberFocus && phoneNumber && !validPhoneNumber
													? " d-block important-hint me-1 "
													: "d-none"
											}
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
										</div>
										{settingErr?.phoneNumber && (
											<div className='d-flex flex-wrap'>
												<span className='fs-6 w-100 text-danger'>
													{settingErr?.phoneNumber}
												</span>
											</div>
										)}
									</div>
								</div>
							</div>

							<div className='col-12 mb-5'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<label htmlFor='address' className='setting_label d-block'>
											وصف المتجر
										</label>
										<div className='select-country'>
											<div className='select-icon'>
												<EditIcon className='edit-icon' />
											</div>
											<textarea
												name='descriptionValue'
												value={descriptionValue}
												onChange={(e) => setDescriptionValue(e.target.value)}
												className='form-control store-desc'
												placeholder='وصف المتجر'
												rows='3'
												onResize='false'></textarea>
										</div>
										{settingErr?.description && (
											<span className='fs-6 w-100 text-danger'>
												{settingErr?.description}
											</span>
										)}
									</div>
								</div>
							</div>

							<div className='col-12 mb-3 d-flex flex-column align-items-center justify-content-center'>
								<div className='col-lg-8 col-12 mb-4'>
									<Button
										className='flex align-items-center gap-1'
										variant='outlined'
										style={{
											width: "100%",
											height: "56px",
											backgroundColor: "transparent",
											border: "1px solid #02466A",
										}}
										onClick={() => setOpenHoursWork(true)}>
										<Timer />
										ساعات العمل
									</Button>
								</div>
								<div className='col-lg-8 col-12'>
									<Button
										variant='contained'
										style={{
											width: "100%",
											height: "56px",
											backgroundColor: "#1dbbbe",
										}}
										onClick={settingsStoreUpdate}>
										حفظ
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default MainInformation;
