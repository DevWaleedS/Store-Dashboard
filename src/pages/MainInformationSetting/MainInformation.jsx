import React, { useContext, useState, useEffect, Fragment } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// MUI
import Button from "@mui/material/Button";

// Context
import { LoadingContext } from "../../Context/LoadingProvider";

// Redux
import { useDispatch } from "react-redux";
import { openVerifyAfterMainModal } from "../../store/slices/VerifyStoreAlertAfterMainModal-slice";

// Components
import { Breadcrumb, PageHint } from "../../components";
import HoursWorks from "./HoursWorks/HoursWorks";
import DomainName from "./DomainName/DomainName";
import SelectCity from "./SelectCity/SelectCity";
import StoreAddress from "./StoreAddress/StoreAddress";
import { TopBarSearchInput } from "../../global/TopBar";
import SelectCountry from "./SelectCountry/SelectCountry";
import UploadStoreLogo from "./UploadStoreLogo/UploadStoreLogo";
import UploadStoreIcon from "./UploadStoreIcon/UploadStoreIcon";
import StorePhoneNumber from "./StorePhoneNumber/StorePhoneNumber";
import StoreDescription from "./StoreDescriprion/StoreDescription";
import CircularLoading from "../../HelperComponents/CircularLoading";
import StoreEmailAddress from "./StoreEmailAddress/StoreEmailAddress";

// Icons
import { Timer } from "../../data/Icons";

// RTK Query
import {
	useGetMainInformationQuery,
	useUpdateStoreMainInformationMutation,
} from "../../store/apiSlices/mainInformationApi";

const MainInformation = () => {
	// To show the store info that come from api
	const { data: mainInformation, isFetching } = useGetMainInformationQuery();

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

	const dispatchVerifyAfterMainAlert = useDispatch(false);

	// ---------------------------------------------------------------
	const [defaultStoreLogo, setDefaultStoreLogo] = useState("");
	const [defaultStoreIcon, setDefaultStoreIcon] = useState("");
	const [storeLogoUpdate, setStoreLogoUpdate] = useState([]);
	const [storeIcon, setStoreIcon] = useState([]);
	const [storeName, setStoreName] = useState("");
	const [domain, setDomain] = useState("");
	const [domainType, setDomainType] = useState("");
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
		domain_type: "",
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
			domain_type: "",
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
			setDomainType(mainInformation?.domain_type || "later_time");
			setDomain(mainInformation?.domain);
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

			if (domainType === "has_domain" || domainType === "pay_domain") {
				localStorage.setItem("domain", mainInformation?.domain);
			}
			localStorage.setItem("logo", mainInformation?.logo);
			localStorage.setItem("store_id", mainInformation?.id);
		}
	}, [mainInformation]);

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
		formData.append("domain_type", domainType);

		if (domainType === "has_domain" || domainType === "pay_domain") {
			formData.append("domain", domain);
		}
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
				localStorage.setItem("logo", mainInformation?.logo);
				localStorage.setItem("domain", mainInformation?.domain);

				if (
					response?.data?.data?.setting_store?.verification_status ===
					"لم يتم الطلب"
				) {
					dispatchVerifyAfterMainAlert(openVerifyAfterMainModal());
				}
			} else {
				setLoadingTitle("");
				setSettingErr({
					logo: response?.data?.message?.en?.logo,
					icon: response?.data?.message?.en?.icon,
					store_name: response?.data?.message?.en?.store_name?.[0],
					domain: response?.data?.message?.en?.domain?.[0],
					domain_type: response?.data?.message?.en?.domain_type?.[0],
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

				<Breadcrumb
					mb={"mb-md-4"}
					parentPage={"الإعدادات"}
					currentPage={"	البيانات الأساسية"}
				/>

				{!mainInformation?.setting_is_done && !isFetching && (
					<PageHint
						hint={`قم بوضع إعدادات المتجر الأساسية لكي تتمكن من إستكمال باقي خطوات تفعيل المتجر بنجاح.`}
						flex={"d-flex  justify-content-start align-items-center gap-2"}
					/>
				)}

				<div className='main-info-form'>
					{isFetching ? (
						<div
							className='d-flex justify-content-center align-items-center'
							style={{ height: "200px" }}>
							<CircularLoading />
						</div>
					) : (
						<div className='row'>
							{/** Upload Logo  */}
							<div className='col-12 mb-4'>
								<UploadStoreLogo
									storeLogoUpdate={storeLogoUpdate}
									setStoreLogoUpdate={setStoreLogoUpdate}
									defaultStoreLogo={defaultStoreLogo}
									logoErrors={settingErr?.logo && settingErr?.logo}
								/>
							</div>

							{/** Upload Icon  */}
							<div className='col-12 mb-4'>
								<UploadStoreIcon
									storeIcon={storeIcon}
									setStoreIcon={setStoreIcon}
									iconErrors={settingErr?.icon && settingErr?.icon}
									defaultStoreIcon={defaultStoreIcon}
								/>
							</div>

							{/* Store name */}
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

							{/* Domain name */}
							<div className='col-12 mb-4'>
								<DomainName
									isHasDomain={mainInformation?.domain}
									domain={domain}
									setDomain={setDomain}
									settingErr={settingErr}
									domainType={domainType}
									setDomainType={setDomainType}
								/>
							</div>

							{/* Select country */}
							<div className='col-12 mb-4'>
								<SelectCountry
									country={country}
									setCountry={setCountry}
									settingErr={settingErr}
									setCountryAddress={setCountryAddress}
								/>
							</div>

							{/*Select city*/}
							<div className='col-12 mb-4'>
								<SelectCity
									city={city}
									setCity={setCity}
									settingErr={settingErr}
									setCityAddress={setCityAddress}
								/>
							</div>

							{/* Store Address */}
							<div className=' col-12 mb-4'>
								<StoreAddress
									settingErr={settingErr}
									cityAddress={cityAddress}
									countryAddress={countryAddress}
								/>
							</div>

							{/* Store Email Address*/}
							<div className=' col-12 mb-4'>
								<StoreEmailAddress
									settingErr={settingErr}
									storeEmail={storeEmail}
									setStoreEmail={setStoreEmail}
								/>
							</div>

							{/* Store  Phone number */}
							<div className=' col-12 mb-4'>
								<StorePhoneNumber
									settingErr={settingErr}
									phoneNumber={phoneNumber}
									setPhoneNumber={setPhoneNumber}
								/>
							</div>

							{/* Store Description */}
							<div className='col-12 mb-5'>
								<StoreDescription
									settingErr={settingErr}
									descriptionValue={descriptionValue}
									setDescriptionValue={setDescriptionValue}
								/>
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
										{mainInformation?.setting_store?.verification_status ===
										"لم يتم الطلب"
											? "التالي"
											: "حفظ الإعدادت "}
									</Button>
								</div>
							</div>
						</div>
					)}
				</div>
			</section>

			{/* Hours Works Modal */}
			<HoursWorks
				worksDaysData={mainInformation?.workDays}
				workDays={workDays}
				setWorkDays={setWorkDays}
				openHoursWork={openHoursWork}
				setOpenHoursWork={setOpenHoursWork}
			/>
		</>
	);
};

export default MainInformation;
