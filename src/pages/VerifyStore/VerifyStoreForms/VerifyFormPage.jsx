import React, {
	useContext,
	Fragment,
	useState,
	forwardRef,
	useImperativeHandle,
} from "react";

import { Skeleton } from "@mui/material";

// Components
import CircularLoading from "../../../HelperComponents/CircularLoading";

// Context
import { LoadingContext } from "../../../Context/LoadingProvider";

// redux
import { useDispatch, useSelector } from "react-redux";
import { resetActivity } from "../../../store/slices/AddActivity";
import { resetSubActivity } from "../../../store/slices/AddSubActivity";
import { openVerifyStoreAlertModal } from "../../../store/slices/VerifyStoreAlertModal-slice";

// RTK
import {
	useShowVerificationQuery,
	useUpdateVerificationMutation,
} from "../../../store/apiSlices/verifyStoreApi";
import { useGetCitiesQuery } from "../../../store/apiSlices/selectorsApis/selectCitiesApi";
import {
	useGetCategoriesQuery,
	useGetSubCategoriesByCategoriesIdsQuery,
} from "../../../store/apiSlices/selectorsApis/selectCategoriesApi";

// third party
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";

// MUI
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import FormControlLabel from "@mui/material/FormControlLabel";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import { UploadIcon, WebsiteIcon } from "../../../data/Icons";

const VerifyFormPage = forwardRef((props, ref) => {
	/** ----------------------------------------------------*/

	// Handle show Verification  data
	const { isFetching } = useShowVerificationQuery();

	// cities selector
	const { data: cities } = useGetCitiesQuery();

	// to open verify alert
	const dispatchVerifyAlert = useDispatch(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	/** ------------------------------------------------------------------------- */

	// handle add activity
	const { activity } = useSelector((state) => state.AddActivity);
	const { subActivities } = useSelector((state) => state.AddSubActivity);

	// categories and sub categories data
	const { data: selectCategories } = useGetCategoriesQuery();

	const selectedActivity = selectCategories?.filter((item) => {
		return activity?.some((ele) => {
			return ele === item?.id;
		});
	});

	const queryParams = selectedActivity
		?.map((sub) => `category_id[]=${sub?.id}`)
		.join("&");

	const { data: subCategories, isLoading } =
		useGetSubCategoriesByCategoriesIdsQuery({ categoriesIds: queryParams });

	const selectedSubActivities = subCategories?.filter((item) => {
		return subActivities?.some((ele) => {
			return ele === item?.id;
		});
	});
	/** ------------------------------------------------------------------------- */

	const [file, setFile] = useState([]);
	const [data, setData] = useState({
		verification_type: "",
		verification_code: "",
		owner_name: "",
		commercial_name: "",
		city_id: "",
		freelancing_city_id: "",
	});

	/** ------------------------------------------------------------------------- */

	// errors
	const [dataErrors, setDataErrors] = useState({
		verification_type: "",
		verification_code: "",
		owner_name: "",
		commercial_name: "",
		city_id: "",
		file: "",
	});

	const resetDataErrors = () => {
		setDataErrors({
			verification_type: "",
			verification_code: "",
			owner_name: "",
			commercial_name: "",
			city_id: "",
			file: "",
		});
	};

	/** ------------------------------------------------------------------------- */

	// to set radio input
	const [
		openCommercialRegisterInputGroup,
		setOpenCommercialRegisterInputGroup,
	] = React.useState(false);
	const [openFreeLaborDocumentInputGroup, setOpenFreeLaborDocumentInputGroup] =
		React.useState(false);
	/** ------------------------------------------------------------------------- */

	//  use dropzone to get personal image
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"file/*": [".pdf"],
		},

		onDrop: (acceptedFiles) => {
			const updatedFile = acceptedFiles?.map((file) => {
				const isSizeValid = file.size <= maxFileSize;
				const errorMessage = "حجم الملف يجب أن لا يزيد عن 1 ميجابايت.";
				setDataErrors({ ...dataErrors, file: "" });
				if (!isSizeValid) {
					toast.warning(errorMessage, {
						theme: "light",
					});
					setDataErrors({
						...dataErrors,
						file: errorMessage,
					});
					setFile([]);
				} else {
					setDataErrors({
						...dataErrors,
						file: null,
					});
				}

				return isSizeValid
					? Object.assign(file, { preview: URL.createObjectURL(file) })
					: null;
			});

			setFile(updatedFile?.filter((file) => file !== null));
		},
	});

	const handleOnChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	/** ------------------------------------------------------------------------- */

	/* handle upload Verify Store Order */
	const [verificationUpdate] = useUpdateVerificationMutation();
	const uploadVerifyStoreOrder = async () => {
		resetDataErrors();
		setLoadingTitle("جاري ارسال طلب التوثيق");
		let formData = new FormData();

		formData.append("verification_type", data?.verification_type);
		formData.append("verification_code", data.verification_code);
		formData.append("owner_name", data?.owner_name);

		formData.append(
			"commercial_name",
			data?.verification_type === "commercialregister"
				? data?.commercial_name
				: ""
		);

		formData.append(
			"city_id",
			data?.verification_type === "maeruf"
				? data?.freelancing_city_id
				: data?.city_id
		);

		if (file?.length !== 0) {
			formData.append("file", file[0]);
		}
		for (let i = 0; i < activity?.length; i++) {
			formData.append([`activity_id[${i}]`], activity[i]);
		}
		for (let i = 0; i < subActivities?.length; i++) {
			formData.append([`subcategory_id[${i}]`], subActivities[i]);
		}

		try {
			const response = await verificationUpdate({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				dispatchVerifyAlert(openVerifyStoreAlertModal());

				navigate("/");
				dispatch(resetActivity());
				dispatch(resetSubActivity());
			} else {
				setLoadingTitle("");
				setDataErrors({
					owner_name: response?.data?.message?.en?.owner_name?.[0],

					verification_type:
						response?.data?.message?.en?.verification_type?.[0],
					verification_code:
						response?.data?.message?.en?.verification_code?.[0],
					commercial_name: response?.data?.message?.en?.commercial_name?.[0],
					city_id: response?.data?.message?.en?.city_id?.[0],
					file: response?.data?.message?.en?.file?.[0],
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
			console.error("Error changing createNewPage:", error);
		}
	};

	// Expose the function to the parent component using useImperativeHandle
	useImperativeHandle(ref, () => ({
		uploadVerifyStoreOrder,
	}));

	return (
		<Fragment>
			{isFetching ? (
				<CircularLoading />
			) : (
				<Fragment>
					<div className='row d-flex justify-content-between align-items-center pt-md-1 mb-4'>
						<div
							className='important-hint d-flex justify-content-center align-content-center'
							style={{ fontSize: "18px", whiteSpace: "normal" }}>
							هذه البيانات خاصة فقط بتوثيق المتجر ولن يتم عرضها في أي مكان أخر.
						</div>
					</div>
					<div className='row d-flex justify-content-between align-items-center pt-md-4'>
						<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex '>
							<h5 className='label'>نوع النشاط الرئيسي</h5>
						</div>
						<div className='col-md-8 col-12 mb-md-0 mb-3 d-flex justify-content-start flex-wrap gap-1 gap-1'>
							<div className='main-categories w-100'>
								{selectedActivity?.map((activity, index) => (
									<div key={index} className='categories'>
										{activity?.name}
									</div>
								))}
							</div>
						</div>
					</div>
					<div className='row d-flex justify-content-between align-items-center pt-md-4'>
						<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex '>
							<h5 className='label'>نوع النشاط الفرعي</h5>
						</div>
						<div className='col-md-8 col-12 mb-md-0 mb-3 d-flex justify-content-start flex-wrap gap-1 gap-1'>
							{isLoading ? (
								<div className='main-categories w-100'>
									<Skeleton width={100} height={32} variant='rounded' />
									<Skeleton width={150} height={32} variant='rounded' />
									<Skeleton width={100} height={32} variant='rounded' />
									<Skeleton width={150} height={32} variant='rounded' />
								</div>
							) : selectedSubActivities?.length === 0 ? (
								<div style={{ fontSize: "16px", color: "#1dbbbe" }}>
									لا توجد أنشطة فرعية
								</div>
							) : (
								<div className='main-categories w-100'>
									{selectedSubActivities?.map((sub, index) => (
										<div key={index} className='categories'>
											{sub?.name}
										</div>
									))}
								</div>
							)}
						</div>
					</div>

					<div className='row d-flex justify-content-between align-items-center pt-4'>
						<div className='col-4 d-flex justify-content-start gap-3 align-items-center'>
							<RadioGroup
								aria-labelledby='demo-radio-buttons-group-label'
								name='verification_type'
								value={data?.verification_type}
								onChange={(e) => {
									handleOnChange(e);
								}}>
								<FormControlLabel
									sx={{
										marginRight: -1,
									}}
									value={"commercialregister"}
									checked={data?.verification_type === "commercialregister"}
									className='label'
									control={
										<Radio
											onClick={() => {
												setOpenCommercialRegisterInputGroup(
													!openCommercialRegisterInputGroup
												);
												setOpenFreeLaborDocumentInputGroup(false);
											}}
											sx={{
												"& .MuiSvgIcon-root": {
													fontSize: 18,
													marginLeft: "10px",
												},
											}}
										/>
									}
									label='السجل التجاري'
								/>
								{dataErrors?.verification_type && (
									<div
										className='important-hint me-1'
										style={{ fontSize: "14px", whiteSpace: "normal" }}>
										{dataErrors?.verification_type}
									</div>
								)}
							</RadioGroup>
							<WebsiteIcon className='mx-3' />
						</div>

						{/** radio input group */}
						<div
							className={
								openCommercialRegisterInputGroup
									? "row-input-group CommercialRegisterInputGroup "
									: "d-none"
							}
							style={{
								top: dataErrors?.verification_type ? "10px" : "10px",
							}}>
							<div className='row  d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12 mb-md-0 mb-3'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										اسم التاجر<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<input
										type='text'
										name='owner_name'
										value={data?.owner_name}
										onChange={(e) => {
											handleOnChange(e);
										}}
										placeholder='قم بكتابة اسم التاجر كما هو موضح في السجل التجاري'
										style={{
											width: "100%",
											height: "50px",
											padding: "18px",
											background: "#FAFAFA",
											color: "#00000",
											fontSize: "16px",
											fontWeight: "400",
											borderRadius: "4px",
										}}
									/>

									{dataErrors?.owner_name && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.owner_name}
										</div>
									)}
								</div>
							</div>
							<div className='row  d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12 mb-md-0 mb-3'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										الاسم التجاري<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<div className='tax-text '>
										{" "}
										يلزم يكون اسم المتجر مطابق لأسم السجل التجاري{" "}
									</div>

									<input
										type='text'
										name='commercial_name'
										value={data?.commercial_name}
										onChange={(e) => {
											handleOnChange(e);
										}}
										placeholder='قم بكتابة الاسم التجاري كما هو موضح في السجل التجاري'
										style={{
											width: "100%",
											height: "50px",
											padding: "18px",
											background: "#FAFAFA",
											color: "#00000",
											fontSize: "16px",
											fontWeight: "400",
											borderRadius: "4px",
										}}
									/>

									{dataErrors?.commercial_name && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.commercial_name}
										</div>
									)}
								</div>
							</div>

							<div className='row  d-flex justify-content-between align-items-center mb-3 city_wrapper'>
								<div className='col-md-4 col-12'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										المدينة<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<FormControl sx={{ width: "100%" }}>
										<Select
											MenuProps={{
												sx: {
													"& .MuiMenu-paper ": {
														height: "350px",
													},
													"& .MuiPaper-root ": {
														height: "350px",
													},
													"& .MuiPaper-elevation": {
														height: "350px",
													},

													"& .MuiPopover-paper": {
														height: "350px",
													},
													"& .MuiPaper-elevation8": {
														height: "350px",
													},
													"& .MuiPaper-elevation1": {
														height: "350px",
													},

													"& .MuiPaper-root": {
														height: "350px",
													},
													"& .css-1poimk-MuiPaper-root-MuiMenu-paper-MuiPaper-root-MuiPopover-paper":
														{
															height: "350px",
														},
												},
											}}
											sx={{
												height: "50px",
												background: "#FAFAFA",
												color: "#00000",
												fontSize: "16px",
												fontWeight: "400",
												borderRadius: "4px",
											}}
											name='city_id'
											value={data?.city_id}
											onChange={(e) => {
												handleOnChange(e);
											}}
											IconComponent={IoIosArrowDown}
											displayEmpty
											input={<OutlinedInput />}
											renderValue={(selected) => {
												if (data?.city_id === "") {
													return <p className='text-[#ADB5B9]'>اختر المدينة</p>;
												}
												const result =
													cities?.filter(
														(city) => city?.id === parseInt(selected)
													) || "";
												return result[0]?.name;
											}}>
											{cities?.map((city, index) => (
												<MenuItem
													value={city?.id}
													key={index}
													sx={{
														fontSize: "18px",
													}}>
													{city?.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									{dataErrors?.city_id && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.city_id}
										</div>
									)}
								</div>
							</div>

							<div className='row d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex '>
									<h5 className='label upload-docs-label'>
										رفع السجل التجاري <span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<div className='tax-text '>الحد الأقصى للملف 1MB</div>

									<div
										style={{
											width: "100%",
											height: "56px",
											background: "#FAFAFA",
											borderRadius: "4px",
											color: "#00000",
											padding: "20px",
											fontSize: "16px",
											fontWeight: "400",
										}}
										{...getRootProps({
											className:
												"upload-doc-input mb-1 d-flex justify-content-between",
										})}>
										<input
											{...getInputProps()}
											id='upload-docs-input'
											name='upload-docs-input'
										/>
										<p className={file?.length <= 0 ? "helper" : "d-none"}>
											قم رفع السجل التجاري{" "}
										</p>
										<span
											style={{
												position: "absolute",
												left: "16px",
												top: "16px",
											}}>
											<UploadIcon className='upload-docs-icon' />
										</span>
										<ul>{file[0]?.name}</ul>
									</div>
									{dataErrors?.file && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "1٤px", whiteSpace: "normal" }}>
											{dataErrors?.file}
										</div>
									)}
									{!dataErrors?.file && (
										<div className='important-hint'>
											يجب ان تكون صيغة الملف pdf
										</div>
									)}
								</div>
							</div>

							<div className='row d-flex justify-content-between align-items-center'>
								<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex '>
									<h5 className='label upload-docs-label'>
										رقم السجل التجاري <span className='important-hint'>*</span>
									</h5>
								</div>

								<div className='col-md-8 col-12'>
									<div className='tax-text '>
										رقم السجل التجاري مكون من 10 أرقام
									</div>
									<input
										name='verification_code'
										type='text'
										value={data?.verification_code}
										onChange={(e) => {
											setData({
												...data,
												verification_code: e?.target?.value
													?.replace(/[^0-9]/g, "")
													?.slice(0, 10),
											});
										}}
										placeholder='قم بكتابة رقم السجل التجاري كما هو موضح في السجل التجاري'
										style={{
											width: "100%",
											height: "50px",
											padding: "18px",
											background: "#FAFAFA",
											color: "#00000",
											fontSize: "16px",
											fontWeight: "400",
											borderRadius: "4px",
										}}
									/>

									{dataErrors?.verification_code && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.verification_code}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
					<div className='row d-flex justify-content-between align-items-center pt-4'>
						<div className='col-4 d-flex justify-content-start gap-3 align-items-center'>
							<RadioGroup
								aria-labelledby='demo-radio-buttons-group-label'
								name='verification_type'
								value={data?.verification_type}
								onChange={(e) => {
									handleOnChange(e);
								}}>
								<FormControlLabel
									sx={{
										marginRight: -1,
									}}
									value={"maeruf"}
									checked={data?.verification_type === "maeruf"}
									className='label'
									control={
										<Radio
											onClick={() => {
												setOpenFreeLaborDocumentInputGroup(
													!openFreeLaborDocumentInputGroup
												);
												setOpenCommercialRegisterInputGroup(false);
											}}
											sx={{
												"& .MuiSvgIcon-root": {
													fontSize: 18,
													marginLeft: "10px",
												},
											}}
										/>
									}
									label='وثيقة العمل الحر'
								/>
							</RadioGroup>
							<WebsiteIcon className='mx-3' />
						</div>
						{dataErrors?.verification_type && (
							<div
								className='important-hint me-1'
								style={{ fontSize: "14px", whiteSpace: "normal" }}>
								{dataErrors?.verification_type}
							</div>
						)}

						{/** radio input group */}

						<div
							className={
								openFreeLaborDocumentInputGroup
									? "row-input-group FreeLaborDocumentInputGroup "
									: " d-none "
							}
							style={{
								top: dataErrors?.verification_type ? "10px" : "10px",
							}}>
							<div className='row  d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12 mb-md-0 mb-3'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										اسم مالك الوثيقة <span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<input
										type='text'
										name='owner_name'
										value={data?.owner_name}
										onChange={(e) => {
											handleOnChange(e);
										}}
										placeholder='قم بكتابة الاسم كما هو موضح في الوثيقة'
										style={{
											width: "100%",
											height: "50px",
											padding: "18px",
											background: "#FAFAFA",
											color: "#00000",
											fontSize: "16px",
											fontWeight: "400",
											borderRadius: "4px",
										}}
									/>
									{dataErrors?.owner_name && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.owner_name}
										</div>
									)}
								</div>
							</div>

							<div className='row  d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										المدينة<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<FormControl sx={{ width: "100%" }}>
										<Select
											sx={{
												height: "50px",

												background: "#FAFAFA",
												color: "#00000",
												fontSize: "16px",
												fontWeight: "400",
												borderRadius: "4px",
											}}
											IconComponent={IoIosArrowDown}
											displayEmpty
											name='freelancing_city_id'
											value={data?.freelancing_city_id}
											onChange={(e) => {
												handleOnChange(e);
											}}
											input={<OutlinedInput />}
											renderValue={(selected) => {
												if (data?.freelancing_city_id === "") {
													return <p className='text-[#ADB5B9]'>اختر المدينة</p>;
												}
												const result =
													cities?.filter(
														(city) => city?.id === parseInt(selected)
													) || "";
												return result[0]?.name;
											}}>
											{cities?.map((city, index) => (
												<MenuItem
													value={city?.id}
													key={index}
													sx={{
														fontSize: "18px",
													}}>
													{city?.name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
									{dataErrors?.city_id && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "14px", whiteSpace: "normal" }}>
											{dataErrors?.city_id}
										</div>
									)}
								</div>
							</div>
							<div className='row d-flex justify-content-between align-items-center mb-3'>
								<div className='col-4 col-md-4 col-12 mb-md-0 mb-3 d-flex '>
									<h5 className='label upload-docs-label'>
										رفع وثيقة العمل الحر
										<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<div className='tax-text '>الحد الأقصى للملف 1MB</div>
									<div
										style={{
											width: "100%",
											height: "56px",
											background: "#FAFAFA",
											borderRadius: "4px",
											color: "#00000",
											padding: "20px",
											fontSize: "16px",
											fontWeight: "400",
										}}
										{...getRootProps({
											className:
												"upload-doc-input mb-1 d-flex justify-content-between",
										})}>
										<input
											{...getInputProps()}
											id='upload-docs-input'
											name='upload-docs-input'
										/>
										<p className={file.length <= 0 ? "helper" : "d-none"}>
											قم برفع الوثيقة
										</p>

										<span
											style={{
												position: "absolute",
												left: "16px",
												top: "16px",
											}}>
											<UploadIcon className='upload-docs-icon' />
										</span>
										<ul>{file[0]?.name}</ul>
									</div>
									{dataErrors?.file && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "14px", whiteSpace: "normal" }}>
											{dataErrors?.file}
										</div>
									)}
									{!dataErrors?.file && (
										<div className='important-hint'>
											يجب ان تكون صيغة الملف pdf
										</div>
									)}
								</div>
							</div>

							<div className='row d-flex justify-content-between align-items-center'>
								<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex '>
									<h5 className='label upload-docs-label'>
										رقم الوثيقة <span className='important-hint'>*</span>
									</h5>
								</div>

								<div className='col-md-8 col-12'>
									<div className='tax-text '>الرقم المسجل في الوثيقة</div>
									<input
										name='verification_code'
										value={data?.verification_code}
										type='text'
										onChange={(e) => {
											handleOnChange(e);
										}}
										placeholder='FL-000000000'
										style={{
											width: "100%",
											height: "50px",
											padding: "18px",
											background: "#FAFAFA",
											color: "#00000",
											fontSize: "16px",
											fontWeight: "400",
											borderRadius: "4px",
										}}
									/>

									{dataErrors?.verification_code && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.verification_code}
										</div>
									)}
								</div>
							</div>
						</div>
					</div>
				</Fragment>
			)}
		</Fragment>
	);
});

export default VerifyFormPage;
