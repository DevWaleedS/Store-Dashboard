import React, { useContext, useState, useEffect, Fragment } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../Context/context";
import useFetch from "../Hooks/UseFetch";
import { Link } from "react-router-dom";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Button from "@mui/material/Button";
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
import { AiOutlineSearch } from "react-icons/ai";

const MainInformation = () => {
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

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

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> TO HANDLE THE REG_EXPRESS <=
	 *  ------------------------------------------------- */
	const PHONE_REGEX = /^(5\d{8})$/;
	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);

	// ---------------------------------------------------------------
	const [city, setCity] = useState("");
	const [domain, setDomain] = useState("");
	const [country, setCountry] = useState("");
	const [defaultStoreLogo, setDefaultStoreLogo] = useState(DemoImage);
	const [defaultStoreIcon, setDefaultStoreIcon] = useState(DemoImage);
	const [storeLogo, setStoreLogo] = useState([]);
	const [storeIcon, setStoreIcon] = useState([]);
	const [descriptionValue, setDescriptionValue] = useState("");
	const [phoneNumber, setPhoneNumber] = useState("");
	const [storeEmail, setStoreEmail] = useState("");

	const [settingErr, setSettingErr] = useState({
		description: "",
		logo: "",
		icon: "",
		domain: "",
		city_id: "",
		country_id: "",
		phoneNumber: "",
		storeEmail: "",
	});

	// We use this effect to avoid the errors
	useEffect(() => {
		if (fetchedData?.data?.setting_store) {
			setDescriptionValue(fetchedData?.data?.setting_store?.description);
			setDefaultStoreLogo(fetchedData?.data?.setting_store?.logo);
			setDefaultStoreIcon(fetchedData?.data?.setting_store?.icon);
			setDomain([fetchedData?.data?.setting_store?.domain]);
			setStoreEmail(fetchedData?.data?.setting_store?.store_email);
			setPhoneNumber(
				fetchedData?.data?.setting_store?.phonenumber?.startsWith("+966")
					? fetchedData?.data?.setting_store?.phonenumber.slice(4)
					: fetchedData?.data?.setting_store?.phonenumber?.startsWith("00966")
					? fetchedData?.data?.setting_store?.phonenumber.slice(5)
					: fetchedData?.data?.setting_store?.phonenumber
			);

			setCountry([fetchedData?.data?.setting_store?.country?.id]);
			setCity([fetchedData?.data?.setting_store?.city?.id]);
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
		setLoadingTitle("جاري تعديل البيانات الأساسية");
		resetSettingError();
		let formData = new FormData();
		formData.append("description", descriptionValue);

		// Check if a new logo is uploaded, otherwise use the existing one
		if (storeLogo?.length !== 0) {
			formData.append("logo", storeLogo[0]?.file);
		}

		// Check if a new icon is uploaded, otherwise use the existing one
		if (storeIcon?.length !== 0) {
			formData.append("icon", storeIcon[0]?.file);
		}
		formData.append("domain", domain);
		formData.append("city_id", city);
		formData.append("country_id", country);

		formData.append(
			"phonenumber",
			phoneNumber?.startsWith("+966") || phoneNumber?.startsWith("00966")
				? phoneNumber
				: `+966${phoneNumber}`
		);
		formData.append("store_email", storeEmail);

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
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
					setSettingErr({
						description: res?.data?.message?.en?.description?.[0],
						logo: res?.data?.message?.en?.logo,
						icon: res?.data?.message?.en?.icon,
						domain: res?.data?.message?.en?.domain?.[0],
						city_id: res?.data?.message?.en?.city_id?.[0],
						country_id: res?.data?.message?.en?.country_id?.[0],
						phoneNumber: res?.data?.message?.en?.phonenumber?.[0],
						store_email: res?.data?.message?.en?.store_email?.[0],
					});
				}
			});
	};

	// TO HANDLE VALIDATION USER PHONE NUMBER
	useEffect(() => {
		const PhoneNumberValidation = PHONE_REGEX.test(phoneNumber);
		setValidPhoneNumber(PhoneNumberValidation);
	}, [phoneNumber]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | البيانات الأساسية</title>
			</Helmet>
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
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='domain-name direction-ltr d-flex align-content-center justify-content-between'>
											<div className='main-domain-hint'>atlbha.com/</div>
											<input
												className=''
												type='text'
												name='domain'
												value={domain}
												onChange={(e) => setDomain(e.target.value)}
											/>
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
										<div className='select-country'>
											<div className='select-icon'>
												<CountryIcon />
											</div>

											<Select
												name='category_id'
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
										<div className='select-country'>
											<div className='select-icon'>
												<CitIcon className='' />
											</div>

											<Select
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

							<div className='col-12 mb-3 d-flex justify-content-center'>
								<Button
									variant='contained'
									style={{
										width: "180px",
										height: "56px",
										backgroundColor: "#1dbbbe",
									}}
									onClick={settingsStoreUpdate}>
									حفظ
								</Button>
							</div>
						</div>
					)}
				</div>
			</section>
		</>
	);
};

export default MainInformation;
