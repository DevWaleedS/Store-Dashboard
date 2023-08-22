import React, {
	useContext,
	Fragment,
	useState,
	useEffect,
	forwardRef,
	useImperativeHandle,
} from "react";
import useFetch from "../../Hooks/UseFetch";
// redux
import { useDispatch, useSelector } from "react-redux";
import { openVerifyStoreAlertModal } from "../../store/slices/VerifyStoreAlertModal-slice";
import { resetActivity } from "../../store/slices/AddActivity";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
// import Dropzone Library
import { useDropzone } from "react-dropzone";

// ICONS
import { ReactComponent as WebsiteIcon } from "../../data/Icons/website.svg";
import { ReactComponent as UploadIcon } from "../../data/Icons/icon-24-upload_outlined.svg";
import { IoIosArrowDown } from "react-icons/io";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { LoadingContext } from "../../Context/LoadingProvider";

const inputStyle = {
	width: "100%",
	height: "56px",
	background: "#FFFFFF ",
	borderRadius: "4px",
	color: "#00000",
	padding: "20px",
	fontSize: "16px",
	fontWeight: "400",
};

const VerifayPage = forwardRef((props, ref) => {
	/** -----------------------------------------------------------------------------------------------------------
	 *  	=> TO HANDLE THE REG_EXPRESS <=
	 *  ------------------------------------------------- */
	const PHONE_REGEX = /^(5\d{8})$/;
	const [validUserPhoneNumber, setValidUserPhoneNumber] = useState(false);
	const [userPhoneNumberFocus, setUserPhoneNumberFocus] = useState(false);
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/verification_show"
	);

	const { fetchedData: activities } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/activities"
	);
	const { fetchedData: cities } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/cities"
	);
	const [cookies] = useCookies(["access_token"]);

	// to open verifay alert
	const dispatchVerifyAlert = useDispatch(false);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const { activity } = useSelector((state) => state.AddActivity);

	const selectedActivity = activities?.data?.activities?.filter((item) => {
		return activity?.some((ele) => {
			return ele === item?.id;
		});
	});

	// to handle data
	const [file, setFile] = useState([]);
	const [data, setData] = useState({
		name: "",
		phonenumber: "",
		commercialregistertype: "",
		store_name: "",
		city_id: "",
		maeruf_city_id: "",
		link: "",
	});

	// errors
	const [dataErrors, setDataErrors] = useState({
		name: "",
		phonenumber: "",
		commercialregistertype: "",
		store_name: "",
		city_id: "",
		file: "",
		link: "",
	});

	const resetDataErrors = (uploadVerifyStoreOrder) => {
		setDataErrors({
			name: "",
			phonenumber: "",
			commercialregistertype: "",
			store_name: "",
			city_id: "",
			file: "",
			link: "",
		});
	};
	// to set radio input
	const [
		openCommercialRegisterInputGroup,
		setOpenCommercialRegisterInputGroup,
	] = React.useState(false);
	const [openFreeLaborDocumentInputGroup, setOpenFreeLaborDocumentInputGroup] =
		React.useState(false);

	//  use dropzone to get personal image
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"file/*": [".pdf"],
		},
		onDrop: (acceptedFiles) => {
			setFile(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size}
		</li>
	));

	const handleOnChange = (e) => {
		setData({ ...data, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		setData({
			...data,
			name: fetchedData?.data?.username,
			phonenumber: fetchedData?.data?.phonenumber?.startsWith("+966")
				? fetchedData?.data?.phonenumber.slice(4)
				: fetchedData?.data?.phonenumber?.startsWith("00966")
				? fetchedData?.data?.phonenumber.slice(5)
				: fetchedData?.data?.phonenumber,
		});
	}, [fetchedData?.data]);

	// TO HANDLE VALIDATION USER PHONE NUMBER
	useEffect(() => {
		const userPhoneNumberValidation = PHONE_REGEX.test(data?.phonenumber);
		setValidUserPhoneNumber(userPhoneNumberValidation);
	}, [data?.phonenumber]);

	const uploadVerifyStoreOrder = () => {
		resetDataErrors();
		setLoadingTitle("جاري ارسال طلب التوثيق");

		let formData = new FormData();
		formData.append("name", data?.name);
		formData.append(
			"phonenumber",
			data?.phonenumber?.startsWith("+966") ||
				data?.phonenumber?.startsWith("00966")
				? data?.phonenumber
				: `+966${data?.phonenumber}`
		);
		formData.append("commercialregistertype", data?.commercialregistertype);
		formData.append("store_name", data?.store_name);
		formData.append(
			"link",
			data?.commercialregistertype === "maeruf" ? data?.link : ""
		);
		formData.append(
			"city_id",
			data?.commercialregistertype === "maeruf"
				? data?.maeruf_city_id
				: data?.city_id
		);
		if (file?.length !== 0) {
			formData.append("file", file[0]);
		}
		for (let i = 0; i < activity?.length; i++) {
			formData.append([`activity_id[${i}]`], activity[i]);
		}
		axios
			.post(
				`https://backend.atlbha.com/api/Store/verification_update`,
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
					dispatchVerifyAlert(openVerifyStoreAlertModal());
					setReload(!reload);
					navigate("/");
					dispatch(resetActivity());
				} else {
					setLoadingTitle("");
					setDataErrors({
						name: res?.data?.message?.en?.name?.[0],
						phonenumber: res?.data?.message?.en?.phonenumber?.[0],
						commercialregistertype:
							res?.data?.message?.en?.commercialregistertype?.[0],
						store_name: res?.data?.message?.en?.store_name?.[0],
						city_id: res?.data?.message?.en?.city_id?.[0],
						link: res?.data?.message?.en?.link?.[0],
						file: res?.data?.message?.en?.file?.[0],
					});
				}
			});
	};

	// Expose the function to the parent component using useImperativeHandle
	useImperativeHandle(ref, () => ({
		uploadVerifyStoreOrder,
	}));

	return (
		<Fragment>
			{loading ? (
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
						<div className='col-4 d-flex '>
							<h5 className='label'>نوع النشاط</h5>
						</div>
						<div className='col-8 d-flex justify-content-start flex-wrap'>
							{selectedActivity?.map((activity, index) => (
								<div
									key={index}
									style={{
										backgroundColor: "#bfc3c5",
										borderRadius: "18px",
										fontSize: "16px",
										fontWeight: "400",
										height: "40px",
										width: "max-content",
										padding: "0 16px",
										maxWidth: "120px",
										display: "flex",
										justifyContent: "center",
										alignItems: "center",
									}}>
									{activity?.name}
								</div>
							))}
						</div>
					</div>
					<div className='row d-flex justify-content-between align-items-center pt-md-4 pt-3'>
						<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex'>
							<h5 className='label'>
								اسم المالك <span className='important-hint mx-1'>(اجباري)</span>
							</h5>
						</div>
						<div className='col-md-8 col-12'>
							<input
								name='name'
								value={data?.name}
								onChange={(e) => {
									handleOnChange(e);
								}}
								type='text'
								placeholder='قم بكتابة اسم المالك'
								style={inputStyle}
							/>
							{dataErrors?.name && (
								<div
									className='important-hint me-1'
									style={{ fontSize: "16px", whiteSpace: "normal" }}>
									{dataErrors?.name}
								</div>
							)}
						</div>
					</div>
					<div className='row d-flex justify-content-between align-items-center pt-4'>
						<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex'>
							<h5 className='label'>
								رقم الجوال <span className='important-hint mx-1'>(اجباري)</span>
							</h5>
						</div>
						<div className='col-md-8 col-12'>
							<div
								style={{
									width: "100%",
									background: "#FFF",
									borderRadius: "4px",
									color: "#00000",
									fontSize: "16px",
									fontWeight: "400",
								}}>
								<input
									className='ps-5 '
									name='phonenumber'
									value={data?.phonenumber}
									onChange={(e) => {
										handleOnChange(e);
									}}
									type='text'
									style={inputStyle}
									dir='ltr'
									maxLength='9'
									required
									aria-invalid={validUserPhoneNumber ? "false" : "true"}
									aria-describedby='userPhoneNumber'
									onFocus={() => setUserPhoneNumberFocus(true)}
									onBlur={() => setUserPhoneNumberFocus(true)}
								/>

								<span className='Country_Key'>+966</span>
							</div>
							<div
								id='userPhoneNumber'
								className={
									userPhoneNumberFocus &&
									data?.phonenumber &&
									!validUserPhoneNumber
										? " d-block important-hint me-1 "
										: "d-none"
								}
								style={{ fontSize: "16px", whiteSpace: "normal" }}>
								تأكد ان رقم الجوال يبدأ برقم 5 ولا يقل عن 9 أرقام
							</div>

							{dataErrors?.phonenumber && (
								<div
									className=' important-hint me-1 '
									style={{ fontSize: "16px", whiteSpace: "normal" }}>
									{dataErrors?.phonenumber}
								</div>
							)}
						</div>
					</div>
					<div className='row d-flex justify-content-between align-items-center pt-4'>
						<div className='col-4 d-flex justify-content-start gap-3 align-items-center'>
							<RadioGroup
								aria-labelledby='demo-radio-buttons-group-label'
								name='commercialregistertype'
								value={data?.commercialregistertype}
								onChange={(e) => {
									handleOnChange(e);
								}}>
								<FormControlLabel
									sx={{
										marginRight: -1,
									}}
									value={"commercialregister"}
									checked={
										data?.commercialregistertype === "commercialregister"
									}
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
								{dataErrors?.commercialregistertype && (
									<div
										className='important-hint me-1'
										style={{ fontSize: "16px", whiteSpace: "normal" }}>
										{dataErrors?.commercialregistertype}
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
								top: dataErrors?.commercialregistertype ? "150px" : "130px",
							}}>
							<div className='row  d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12 mb-md-0 mb-3'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										الاسم التجاري<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<input
										name='store_name'
										value={data?.store_name}
										onChange={(e) => {
											handleOnChange(e);
										}}
										placeholder='قم بكتابة الاسم التجاري كما هو موجود في السجل التجاري'
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

									{dataErrors?.store_name && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.store_name}
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
													cities?.data?.cities?.filter(
														(city) => city?.id === parseInt(selected)
													) || "";
												return result[0]?.name;
											}}>
											{cities?.data?.cities?.map((city, index) => (
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

							<div className='row d-flex justify-content-between align-items-center '>
								<div className='col-md-4 col-12 mb-md-0 mb-3 d-flex '>
									<h5 className='label upload-docs-label'>
										رفع السجل التجاري <span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
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
										<p className={files?.length <= 0 ? "helper" : "d-none"}>
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
										<ul>{files}</ul>
									</div>

									{dataErrors?.file && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.file}
											وتأكد ان صيغة الملف pdf
										</div>
									)}

									{files?.length === 0 && (
										<div className='important-hint'>
											يجب ان تكون صيغة الملف pdf
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
								name='commercialregistertype'
								value={data?.commercialregistertype}
								onChange={(e) => {
									handleOnChange(e);
								}}>
								<FormControlLabel
									sx={{
										marginRight: -1,
									}}
									value={"maeruf"}
									checked={data?.commercialregistertype === "maeruf"}
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
									label=' معروف / وثيقة العمل الحر'
								/>
							</RadioGroup>
							<WebsiteIcon className='mx-3' />
						</div>
						{dataErrors?.commercialregistertype && (
							<div
								className='important-hint me-1'
								style={{ fontSize: "16px", whiteSpace: "normal" }}>
								{dataErrors?.commercialregistertype}
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
								top: dataErrors?.commercialregistertype ? "90px" : "70px",
							}}>
							<div className='row  d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12 mb-md-0 mb-3'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										اسم المتجر<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<input
										name='store_name'
										value={data?.store_name}
										onChange={(e) => {
											handleOnChange(e);
										}}
										placeholder='قم بكتابة اسم المتجر كما هو موجود في الوثيقة'
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
									{dataErrors?.store_name && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.store_name}
										</div>
									)}
								</div>
							</div>
							<div className='row  d-flex justify-content-between align-items-center mb-3'>
								<div className='col-md-4 col-12 mb-md-0 mb-3'>
									<h5 className='label' style={{ color: "#1DBBBE" }}>
										رابط معروف / وثيقة العمل الحر
										<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
									<input
										name='link'
										value={data?.link}
										onChange={(e) => {
											handleOnChange(e);
										}}
										placeholder='https//www.sample.com'
										style={{
											textAlign: "left",
											width: "100%",
											height: "50px",
											padding: "18px",
											background: "#FAFAFA",
											color: "#000000",
											fontSize: "16px",
											fontWeight: "400",
											borderRadius: "4px",
										}}
									/>
									{dataErrors?.link && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.link}
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
											name='maeruf_city_id'
											value={data?.maeruf_city_id}
											onChange={(e) => {
												handleOnChange(e);
											}}
											input={<OutlinedInput />}
											renderValue={(selected) => {
												if (data?.maeruf_city_id === "") {
													return <p className='text-[#ADB5B9]'>اختر المدينة</p>;
												}
												const result =
													cities?.data?.cities?.filter(
														(city) => city?.id === parseInt(selected)
													) || "";
												return result[0]?.name;
											}}>
											{cities?.data?.cities?.map((city, index) => (
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
							<div className='row d-flex justify-content-between align-items-center '>
								<div className='col-4 col-md-4 col-12 mb-md-0 mb-3 d-flex '>
									<h5 className='label upload-docs-label'>
										رفع الوثيقة<span className='important-hint'>*</span>
									</h5>
								</div>
								<div className='col-md-8 col-12'>
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
										<p className={files.length <= 0 ? "helper" : "d-none"}>
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
										<ul>{files}</ul>
									</div>
									{dataErrors?.file && (
										<div
											className='important-hint me-1'
											style={{ fontSize: "16px", whiteSpace: "normal" }}>
											{dataErrors?.file}
											وتأكد ان صيغة الملف pdf
										</div>
									)}
									{files?.length === 0 && (
										<div className='important-hint'>
											يجب ان تكون صيغة الملف pdf
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

export default VerifayPage;
