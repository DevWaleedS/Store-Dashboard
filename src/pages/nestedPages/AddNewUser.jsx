import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../../Context/context";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
// import Dropzone Library
import { useDropzone } from "react-dropzone";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
// icons
import { ReactComponent as Message } from "../../data/Icons/icon-24-email.svg";
import { ReactComponent as User } from "../../data/Icons/icon-24-user.svg";
import { ReactComponent as Password } from "../../data/Icons/icon-24-invisible.svg";
import { ReactComponent as Mobile } from "../../data/Icons/mobile-icon-24.svg";

import { AiOutlineEyeInvisible } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import useFetch from "../../Hooks/UseFetch";
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from "../../Context/LoadingProvider";

const style = {
	position: "fixed",
	top: "80px",
	left: "0%",
	transform: "translate(0%, 0%)",
	width: "81%",
	height: "100%",
	overflow: "auto",
	bgcolor: "#fff",
	paddingBottom: "80px",

	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		backgroundColor: "#F6F6F6",
		paddingBottom: 0,
	},
};
const AddNewUser = () => {
	const { fetchedData: roles } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/roles"
	);
	const navigate = useNavigate();
	const [reload, setReload] = useState(false);
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			name: "",
			user_name: "",
			user_type: "",
			email: "",
			password: "",
			phonenumber: "",
			image: "",
			status: "active",
		},
	});
	const [images, setImages] = useState([]);
	const [userError, setUserError] = useState({
		name: "",
		user_name: "",
		user_type: "",
		email: "",
		password: "",
		phonenumber: "",
		image: "",
		status: "",
	});

	const resetCouponError = () => {
		setUserError({
			name: "",
			user_name: "",
			user_type: "",
			email: "",
			password: "",
			phonenumber: "",
			image: "",
			status: "",
		});
	};

	// Show and hidden password function
	const [passwordType, setPasswordType] = useState("password");
	const [showPasswordIcon, setShowPasswordIcon] = useState(<Password />);

	const showPasswordToggle = () => {
		if (passwordType === "password") {
			setPasswordType("text");
			setShowPasswordIcon(<AiOutlineEyeInvisible />);
		} else {
			setPasswordType("password");
			setShowPasswordIcon(<Password />);
		}
	};

	//  use dropzone to get personal image
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: "image/*",
		onDrop: (acceptedFiles) => {
			setImages(
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
			{file.path} - {file.size} bytes
		</li>
	));

	const addNewUser = (data) => {
		setLoadingTitle("جاري اضافة المستخدم");
		resetCouponError();
		let formData = new FormData();
		formData.append("name", data?.name);
		formData.append("user_name", data?.user_name);
		formData.append("role", data?.user_type);
		formData.append("email", data?.email);
		formData.append("password", data?.password);

		formData.append(
			"phonenumber",
			data?.phonenumber?.startsWith("+966") ||
				data?.phonenumber?.startsWith("00966")
				? data?.phonenumber
				: `+966${data?.phonenumber}`
		);
		formData.append("status", data?.status);
		formData.append("image", images[0]);
		axios
			.post(`https://backend.atlbha.com/api/Store/user`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Management");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setReload(!reload);
					setUserError({
						name: res?.data?.message?.en?.name?.[0],
						user_name: res?.data?.message?.en?.user_name?.[0],
						user_type: res?.data?.message?.en?.user_type?.[0],
						email: res?.data?.message?.en?.email?.[0],
						password: res?.data?.message?.en?.password?.[0],
						phonenumber: res?.data?.message?.en?.phonenumber?.[0],
						image: res?.data?.message?.en?.image?.[0],
						status: res?.data?.message?.en?.status?.[0],
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | اضافة مستخدم</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Management")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='add-form-wrapper add-user-form'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> اضافة مستخدم جديد</h5>
										<p> اضافة مستخدم لفريق إدارة المتجر </p>
									</div>
								</div>
							</div>

							<form onSubmit={handleSubmit(addNewUser)}>
								<div className='form-body'>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='full-name' className=''>
												الإسم الكامل<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div className='input-icons'>
												<User />
											</div>
											<input
												type='text'
												id='full-name'
												name='name'
												{...register("name", {
													required: "حقل الاسم مطلوب",
													pattern: {
														value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
														message: "يجب على الحقل الاسم أن يكون نصاّّ",
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											<span className='fs-6 text-danger'>
												{userError?.name}
												{errors?.name && errors.name.message}
											</span>
										</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='user-name' className=''>
												اسم المستخدم<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div className='input-icons'>
												<User />
											</div>
											<input
												type='text'
												id='user-name'
												name='user_name'
												{...register("user_name", {
													required: "حقل اسم المُستخدم مطلوب",
													pattern: {
														value: /^[^-\s][a-zA-Z0-9_]+$/,
														message:
															"اسم المُستخدم يجب ان يكون باللغه الانجليزية",
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											<span className='fs-6 text-danger'>
												{userError?.user_name}
												{errors?.user_name && errors.user_name.message}
											</span>
										</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='job-title' className=''>
												الدور الوظيفي<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<FormControl sx={{ m: 0, width: "100%" }}>
												<Controller
													name={"user_type"}
													control={control}
													rules={{ required: "حقل الدور مطلوب" }}
													render={({ field: { onChange, value } }) => (
														<Select
															name='user_type'
															value={value}
															onChange={(e) => {
																onChange(e);
															}}
															sx={{
																fontSize: "18px",
																backgroundColor: "#ededed",
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
																"& .MuiSelect-icon.MuiSelect-iconOutlined": {
																	right: "96%",
																},
																"& .MuiSelect-nativeInput": {
																	display: "none",
																},
															}}
															IconComponent={IoIosArrowDown}
															displayEmpty
															inputProps={{ "aria-label": "Without label" }}
															renderValue={(selected) => {
																if (!selected) {
																	return (
																		<p className='text-[#ADB5B9]'>
																			اختر الدور الوظيفي
																		</p>
																	);
																}
																return selected;
															}}>
															{roles?.data?.roles?.map((cat, index) => {
																return (
																	<MenuItem
																		key={index}
																		className='souq_storge_category_filter_items'
																		sx={{
																			backgroundColor: "#fff",
																			height: "3rem",
																			"&:hover": {},
																		}}
																		value={cat?.name}>
																		{cat?.name}
																	</MenuItem>
																);
															})}
														</Select>
													)}
												/>
											</FormControl>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											<span className='fs-6 text-danger'>
												{userError?.user_type}
												{errors?.user_type && errors.user_type.message}
											</span>
										</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='password' className=''>
												كلمة المرور<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div
												className='input-icons password-icon'
												onClick={showPasswordToggle}>
												{showPasswordIcon}
											</div>
											<input
												name='password'
												type={passwordType}
												id='password'
												{...register("password", {
													required: "حقل كلمة المرور مطلوب",
													minLength: {
														value: 8,
														message:
															"يجب أن يكون طول نص كلمة المرور على الأقل 8 حروفٍ",
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											<span className='fs-6 text-danger'>
												{userError?.password}
												{errors?.password && errors.password.message}
											</span>
										</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='email' className=''>
												البريد الإلكتروني<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div className='input-icons'>
												<Message />
											</div>
											<input
												name='email'
												type='email'
												id='email'
												{...register("email", {
													required: "حقل البريد الالكتروني مطلوب",
													pattern: {
														value: /\S+@\S+\.\S+/,
														message:
															"يجب أن يكون البريد الالكتروني عنوان بريد إلكتروني صحيح البُنية",
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											<span className='fs-6 text-danger'>
												{userError?.email}
												{errors?.email && errors.email.message}
											</span>
										</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='phone-number' className=''>
												رقم الهاتف<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div className='input-icons'>
												<Mobile />
											</div>
											<input
												maxLength={9}
												name='phonenumber'
												type='tel'
												id='phonenumber'
												placeholder='0096654845613'
												className='direction-ltr'
												{...register("phonenumber", {
													required: "حقل  رقم الجوال مطلوب",
													pattern: {
														value: /^[0-9+]+$/i,
														message: "يجب على الحقل  رقم الجوال أن يكون رقمًا",
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											<span className='fs-6 text-danger'>
												{userError?.phonenumber}
												{errors?.phonenumber && errors.phonenumber.message}
											</span>
										</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='personal-image' className=''>
												الصورة الشخصية<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div
												{...getRootProps({
													className:
														"upload-personal-image d-flex justify-content-between",
												})}>
												<input
													{...getInputProps()}
													id='personal-image'
													name='personal-image'
												/>
												{files.length <= 0 ? (
													<p className='helper'>اختر صورة PNG أو JPG فقط </p>
												) : (
													<p className='d-none'>اختر صورة PNG أو JPG فقط </p>
												)}

												<span> استعراض</span>
												<ul>{files}</ul>
											</div>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											{userError?.image && (
												<span className='fs-6 text-danger'>
													{userError?.image}
												</span>
											)}
										</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='status' className=''>
												الحالة<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<Controller
												name={"status"}
												control={control}
												rules={{ required: "حقل الحالة مطلوب" }}
												render={({ field: { onChange, value } }) => (
													<select
														className='form-select'
														id='status'
														value={value}
														onChange={onChange}>
														<option selected value='active'>
															مفعل
														</option>
														<option value='not_active'>غير مفعل</option>
													</select>
												)}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>
											<span className='fs-6 text-danger'>
												{userError?.status}
												{errors?.status && errors.status.message}
											</span>
										</div>
									</div>
								</div>
								<div className='form-footer'>
									<div className='row d-flex justify-content-center align-items-center'>
										<div className='col-lg-4 col-6'>
											<button className='save-btn' type='submit'>
												حفظ
											</button>
										</div>
										<div className='col-lg-4 col-6'>
											<button
												onClick={() => navigate("/Management")}
												className='close-btn'>
												إلغاء
											</button>
										</div>
									</div>
								</div>
							</form>
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default AddNewUser;
