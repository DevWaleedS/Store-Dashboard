import React, { useContext, useState, useEffect, Fragment } from "react";

// Third party

import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// MUI
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// Redux
import { useDispatch } from "react-redux";
import { openVerifyAfterMainModal } from "../../store/slices/VerifyStoreAlertAfterMainModal-slice";

// Components
import HoursWorks from "./HoursWorks/HoursWorks";
import { TopBarSearchInput } from "../../global";
import UploadStoreLogo from "./UploadStoreLogo/UploadStoreLogo";
import UploadStoreIcon from "./UploadStoreIcon/UploadStoreIcon";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Redux
import { useSelector } from "react-redux";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import {
	Address,
	CityIcon,
	CountryIcon,
	Document,
	HomeIcon,
	Timer,
} from "../../data/Icons";

// RTK Query
import {
	useGetMainInformationQuery,
	useUpdateStoreMainInformationMutation,
} from "../../store/apiSlices/mainInformationApi";
import { useGetCitiesQuery } from "../../store/apiSlices/selectorsApis/selectCitiesApi";
import { useGetCountriesQuery } from "../../store/apiSlices/selectorsApis/selectCountriesApi";

// select style
const selectStyle = {
	width: "100%",
	fontSize: "18px",

	"& .MuiSelect-select.MuiSelect-outlined": {
		paddingRight: "50px !important",
	},

	"& .MuiOutlinedInput-root": {
		border: "none",
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
};

const MainInformation = () => {
	// To show the store info that come from api
	const { data: mainInformation, isFetching } = useGetMainInformationQuery();

	// to get selectors from api
	const { data: cities } = useGetCitiesQuery();
	const { data: countries } = useGetCountriesQuery();

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// Hours Works
	const [openHoursWork, setOpenHoursWork] = useState(false);
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

	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> TO HANDLE THE REG_EXPRESS <=
	 *  ------------------------------------------------- */
	const USER_REGEX = /^[A-Za-z0-9_]+$/;
	const PHONE_REGEX = /^(5\d{8})$/;

	const [validPhoneNumber, setValidPhoneNumber] = useState(false);
	const [phoneNumberFocus, setPhoneNumberFocus] = useState(false);
	const [domainNameFocus, setDomainNameFocus] = useState(false);
	const [domainNameValidFocus, setDomainNameValidFocus] = useState(false);
	const [validDomainName, setValidDomainName] = useState(false);
	const dispatchVerifyAfterMainAlert = useDispatch(false);

	// ---------------------------------------------------------------
	const [defaultStoreLogo, setDefaultStoreLogo] = useState("");
	const [defaultStoreIcon, setDefaultStoreIcon] = useState("");
	const [storeLogoUpdate, setStoreLogoUpdate] = useState([]);
	const [storeIcon, setStoreIcon] = useState([]);
	const [storeName, setStoreName] = useState("");
	const [domain, setDomain] = useState("");
	const [country, setCountry] = useState(1);
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
		store_name: "",
		domain: "",
		city_id: "",
		country_id: "",
		phoneNumber: "",
		storeEmail: "",
		storeAddress: "",
	});
	const resetSettingError = () => {
		setSettingErr({
			description: "",
			logo: "",
			icon: "",
			store_name: "",
			domain: "",
			city_id: "",
			country_id: "",
			phoneNumber: "",
			storeEmail: "",
			storeAddress: "",
		});
	};
	// ----------------------------------------

	// We use this effect to avoid the errors
	useEffect(() => {
		if (mainInformation) {
			setDefaultStoreLogo(mainInformation?.logo);
			setDefaultStoreIcon(mainInformation?.icon);
			setStoreName(mainInformation?.store_name);
			setDomain([mainInformation?.domain]);
			setCountry(mainInformation?.country?.id || 1);
			setCity(mainInformation?.city?.id);
			setStoreEmail(mainInformation?.user?.email);
			setPhoneNumber(
				mainInformation?.user?.phonenumber?.startsWith("+966")
					? mainInformation?.user?.phonenumber.slice(4)
					: mainInformation?.user?.phonenumber?.startsWith("00966")
					? mainInformation?.user?.phonenumber.slice(5)
					: mainInformation?.user?.phonenumber
			);
			setDescriptionValue(mainInformation?.description || "");

			setWorkDays(mainInformation?.workDays);
		}
	}, [mainInformation]);

	// ----------------------------------------------------------------------------

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
	// ------------------------------------------------------------------

	// to update UpdateMaintenanceMode values
	const [updateStoreMainInformation] = useUpdateStoreMainInformationMutation();
	const handleUpdateStoreMainInformation = async () => {
		resetSettingError();
		setLoadingTitle("جاري تعديل بيانات المتجر الأساسية");

		// data that send to api...
		let formData = new FormData();
		if (storeLogoUpdate?.length !== 0)
			formData.append("logo", storeLogoUpdate[0]?.file);
		if (storeIcon?.length !== 0) formData.append("icon", storeIcon[0]?.file);

		formData.append("store_name", storeName);
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

		// make request...
		try {
			const response = await updateStoreMainInformation({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");

				if (
					response?.data?.data?.setting_store?.verification_status ===
					"لم يتم الطلب"
				) {
					dispatchVerifyAfterMainAlert(openVerifyAfterMainModal());
				} else {
					setEndActionTitle(response?.data?.message?.ar);
				}
			} else {
				setLoadingTitle("");
				setSettingErr({
					logo: response?.data?.message?.en?.logo,
					icon: response?.data?.message?.en?.icon,
					store_name: response?.data?.message?.en?.store_name?.[0],
					domain: response?.data?.message?.en?.domain?.[0],
					country_id: response?.data?.message?.en?.country_id?.[0],
					city_id: response?.data?.message?.en?.city_id?.[0],
					storeAddress: response?.data?.message?.en?.store_address?.[0],
					storeEmail: response?.data?.message?.en?.store_email?.[0],
					phoneNumber: response?.data?.message?.en?.phonenumber?.[0],
					description: response?.data?.message?.en?.description?.[0],
				});

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);

				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error changing updateStoreMainInformation:", error);
		}
	};
	// -----------------------------------------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | بيانات المتجر الأساسية</title>
			</Helmet>

			<section className='main-info-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
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
					{isFetching ? (
						<div
							className='d-flex justify-content-center align-items-center'
							style={{ height: "200px" }}>
							<CircularLoading />
						</div>
					) : (
						<div className='row'>
							{/** Upload Logo row */}
							<div className='col-12 mb-4'>
								{/** Upload logo */}
								<UploadStoreLogo
									storeLogoUpdate={storeLogoUpdate}
									setStoreLogoUpdate={setStoreLogoUpdate}
									defaultStoreLogo={defaultStoreLogo}
									logoErrors={settingErr?.logo && settingErr?.logo}
								/>
							</div>

							{/** Upload Icon row */}
							<div className='col-12 mb-4'>
								<UploadStoreIcon
									storeIcon={storeIcon}
									setStoreIcon={setStoreIcon}
									iconErrors={settingErr?.icon && settingErr?.icon}
									defaultStoreIcon={defaultStoreIcon}
								/>
							</div>

							<div className=' col-12 mb-4'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-lg-8 col-12'>
										<div className='store_email'>
											<label
												htmlFor='storeName'
												className='setting_label d-block'>
												اسم المتجر <span className='important-hint'>*</span>
											</label>
											<input
												className='text-right store-email-input w-100 '
												type='text'
												name='storeName'
												id='storeName'
												value={storeName}
												onChange={(e) => setStoreName(e.target.value)}
												placeholder='قم بكتابة اسم المتجر الخاص بك'
											/>
										</div>
										{settingErr?.store_name && (
											<span className='fs-6 w-100 text-danger'>
												{settingErr?.store_name}
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
												htmlFor='domain'
												className='setting_label gap-0 mb-0'>
												الدومين
												<span className='important-hint ps-1'>*</span>
												<span className='tax-text ps-1'>(رابط المتجر)</span>
												<span
													style={{
														fontSize: "14px",
														color: "#ff3838",
													}}>
													(قم بكتابة اسم الدومين بدون com.)
												</span>
											</label>
										</div>
										<div className='domain-name direction-ltr d-flex align-content-center justify-content-between'>
											<div className='main-domain-hint'>
												template.atlbha.com/
											</div>
											<input
												type='text'
												name='domain'
												id='domain'
												value={domain}
												onChange={(e) => {
													setDomain(
														e.target.value
															.replace(/[^A-Za-z0-9_]/g, "")
															.toLowerCase()
													);
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
											يجب أن يكون الدومين حروف انجليزية وأرقام فقط.-
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
												className='setting_label gap-0 d-block'>
												الدولة
												<span className='important-hint ps-1'>*</span>
												<span className='tax-text '>(تلقائي)</span>
											</label>
										</div>
										<div className='select-country'>
											<div className='select-icon'>
												<CountryIcon />
											</div>

											<Select
												readOnly
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
														cursor: "auto",
													},

													"& .MuiOutlinedInput-root": {
														border: "none",
														"& :hover": {
															border: "none",
														},
													},
													"& .MuiOutlinedInput-notchedOutline": {
														border: "1px solid #ededed",
													},
													"& .MuiSelect-icon": {
														display: "none",
													},
												}}
												IconComponent={IoIosArrowDown}
												displayEmpty
												inputProps={{ "aria-label": "Without label" }}
												renderValue={(selected) => {
													if (
														country === "" ||
														!selected ||
														country === "undefined"
													) {
														return (
															<span style={{ color: "#7d7d7d" }}>
																اختر الدولة
															</span>
														);
													}
													const result = countries?.filter(
														(item) => parseInt(item?.id) === parseInt(selected)
													);
													setCountryAddress(result?.[0]?.name || "");
													return result?.[0]?.name;
												}}>
												{countries?.map((item, idx) => {
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
												المدينة<span className='important-hint'>*</span>
											</label>
										</div>
										<div className='select-country'>
											<div className='select-icon'>
												<CityIcon />
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
												sx={selectStyle}
												IconComponent={IoIosArrowDown}
												displayEmpty
												renderValue={(selected) => {
													if (
														city === "" ||
														city === "undefined" ||
														!selected
													) {
														return (
															<span style={{ color: "#7d7d7d" }}>
																اختر المدينة
															</span>
														);
													}
													const result = cities?.filter(
														(item) => parseInt(item?.id) === parseInt(selected)
													);
													setCityAddress(result?.[0]?.name || "");

													return result?.[0]?.name;
												}}>
												{cities?.map((item, idx) => {
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
												عنوان المتجر <span className='tax-text '>(تلقائي)</span>
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
													placeholder='عنوان المتجر يضاف تلقائي'
													value={
														countryAddress &&
														cityAddress &&
														`${countryAddress} -  ${cityAddress}
													`
													}
													onChange={() => console.log("test")}
													readOnly
													rows='3'
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
												البريد الالكتروني
												<span className='important-hint ps-1'>*</span>
											</label>
											<input
												className='direction-ltr text-right store-email-input w-100'
												name='store_email'
												id='store_email'
												placeholder=' البريد الالكتروني'
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
												رقم الهاتف
												<span className='important-hint ps-1'>*</span>
											</label>

											<div className='store_phone_number domain-name direction-ltr d-flex align-content-center justify-content-between'>
												<div className='main-domain-hint'>+966</div>
												<input
													className='direction-ltr text-right store-email-input w-100'
													name='phonenumber'
													id='phonenumber'
													placeholder='رقم الهاتف'
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
											<span className='important-hint ps-1'>*</span>
										</label>
										<div className='select-country'>
											<div className='select-icon'>
												<Document className='edit-icon' />
											</div>
											<textarea
												name='descriptionValue'
												value={descriptionValue}
												onChange={(e) => setDescriptionValue(e.target.value)}
												className='form-control store-desc'
												placeholder='وصف المتجر'
												rows='3'></textarea>
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
										onClick={handleUpdateStoreMainInformation}>
										حفظ
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Hours Works Modal */}
			<HoursWorks
				workDays={workDays}
				setWorkDays={setWorkDays}
				openHoursWork={openHoursWork}
				setOpenHoursWork={setOpenHoursWork}
			/>
		</>
	);
};

export default MainInformation;
