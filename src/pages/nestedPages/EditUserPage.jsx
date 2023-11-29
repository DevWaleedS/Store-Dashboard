import React, { useState, useEffect, useContext, Fragment } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// Components
import useFetch from "../../Hooks/UseFetch";
import CircularLoading from "../../HelperComponents/CircularLoading";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// Icons
import { IoIosArrowDown } from "react-icons/io";
import { AiOutlineEyeInvisible } from "react-icons/ai";
import { Message, Mobile, Eye, User } from "../../data/Icons";

// Styles this pagw
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

// Mui Select Style
const selectStyle = {
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
};

// Select User Status
const userStatusArray = [
	{ id: 1, nameAr: "مفعل", nameEn: "active" },
	{ id: 2, nameAr: "غير مفعل", nameEn: "not_active" },
];
const EditUserPage = () => {
	const { id } = useParams();
	const [cookies] = useCookies(["access_token"]);

	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/user/${id}`
	);
	const { fetchedData: roles } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/roles"
	);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const navigate = useNavigate();
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			name: "",
			user_name: "",
			role: "",
			email: "",
			password: "",
			phonenumber: "",
			status: "",
		},
	});
	const [user, setUser] = useState({
		name: "",
		user_name: "",
		role: "",
		email: "",
		password: "",
		phonenumber: "",
		image: "",
		status: "",
	});
	// --------------------------------------------------------------------------
	// Handle Errors
	const [userError, setUserError] = useState({
		name: "",
		user_name: "",
		role: "",
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
			role: "",
			email: "",
			password: "",
			phonenumber: "",
			image: "",
			status: "",
		});
	};

	// Show and hidden password function
	const [passwordType, setPasswordType] = useState("password");
	const [showPasswordIcon, setShowPasswordIcon] = useState(<Eye />);
	const showPasswordToggle = () => {
		if (passwordType === "password") {
			setPasswordType("text");
			setShowPasswordIcon(<AiOutlineEyeInvisible />);
		} else {
			setPasswordType("password");
			setShowPasswordIcon(<Eye />);
		}
	};
	// ------------------------------------------------------------------

	//  use dropzone to get personal image
	// handle images size
	const maxFileSize = 2 * 1024 * 1024; // 2 MB;
	const [images, setImages] = useState([]);
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/jpeg": [],
			"image/png": [],
			"image/jpg": [],
		},

		onDrop: (acceptedFiles) => {
			const updatedIcons = acceptedFiles?.map((file) => {
				const isSizeValid = file.size <= maxFileSize;
				const errorMessage = "حجم الصورة يجب أن لا يزيد عن 2 ميجابايت.";

				if (!isSizeValid) {
					setImages([]);
					toast.warning(errorMessage, {
						theme: "light",
					});
					setUserError({
						...userError,
						image: errorMessage,
					});
				} else {
					setUserError({
						...userError,
						image: null,
					});
				}

				return isSizeValid
					? Object.assign(file, { preview: URL.createObjectURL(file) })
					: null;
			});

			setImages(updatedIcons?.filter((icon) => icon !== null));
		},
	});

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>{file.path}</li>
	));
	// ---------------------------------------------------------------------

	// to set data that coming fro show api
	useEffect(() => {
		if (fetchedData?.data?.users) {
			setUser({
				...user,
				name: fetchedData?.data?.users?.name,
				user_name: fetchedData?.data?.users?.user_name,
				role: fetchedData?.data?.users?.role?.name,

				email: fetchedData?.data?.users?.email,
				image: fetchedData?.data?.users?.image,
				phonenumber: fetchedData?.data?.users?.phonenumber?.startsWith("+966")
					? fetchedData?.data?.users?.phonenumber?.slice(4)
					: fetchedData?.data?.users?.phonenumber?.startsWith("00966")
					? fetchedData?.data?.users?.phonenumber.slice(5)
					: fetchedData?.data?.users?.phonenumber,

				status:
					fetchedData?.data?.users?.status === "نشط" ? "active" : "not_active",
			});
		}
	}, [fetchedData?.data?.users]);

	useEffect(() => {
		reset(user);
	}, [user, reset]);
	// -------------------------------------------------------------------

	// Handle Update User Info
	const updateUser = (data) => {
		setLoadingTitle("جاري تعديل المستخدم");
		resetCouponError();
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("name", data?.name);
		formData.append("user_name", data?.user_name);
		formData.append("role", data?.role);
		formData.append("email", data?.email);
		if (data?.password !== "") {
			formData.append("password", data?.password);
		}
		formData.append(
			"phonenumber",
			data?.phonenumber?.startsWith("+966") ||
				data?.phonenumber?.startsWith("00966")
				? data?.phonenumber
				: `+966${data?.phonenumber}`
		);
		formData.append("status", data?.status);
		if (images?.length !== 0) {
			formData.append("image", images[0]);
		}
		axios
			.post(
				`https://backend.atlbha.com/api/Store/user/${fetchedData?.data?.users?.id}`,
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
					navigate("/Management");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setUserError({
						name: res?.data?.message?.en?.name?.[0],
						user_name: res?.data?.message?.en?.user_name?.[0],
						role: res?.data?.message?.en?.role?.[0],
						email: res?.data?.message?.en?.email?.[0],
						password: res?.data?.message?.en?.password?.[0],
						phonenumber: res?.data?.message?.en?.phonenumber?.[0],
						image: res?.data?.message?.en?.image?.[0],
						status: res?.data?.message?.en?.status?.[0],
					});
					toast.error(res?.data?.message?.en?.name?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.user_name?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.role?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.email?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.password?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.phonenumber?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.image?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.status?.[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل مستخدم</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Management")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style}>
						<div className='add-form-wrapper add-user-form'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> تعديل بيانات المستخدم </h5>
										<p> تعديل بيانات مستخدم في فريق إدارة المتجر </p>
									</div>
								</div>
							</div>
							<form onSubmit={handleSubmit(updateUser)}>
								{loading ? (
									<div className='pt-md-5'>
										<CircularLoading />
									</div>
								) : (
									<Fragment>
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
																message: "يجب أن يكون الاسم نصاّّ",
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
															required: "حقل اسم المستخدم مطلوب",
															pattern: {
																value: /^[^-\s][a-zA-Z0-9_]+$/,
																message:
																	"يجب أن يكون اسم المستخدم حروف باللغة الإنجليزية",
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
															name={"role"}
															control={control}
															rules={{ required: "حقل نوع المستخدم مطلوب" }}
															render={({ field: { onChange, value } }) => (
																<Select
																	value={value}
																	onChange={onChange}
																	sx={selectStyle}
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
																					backgroundColor:
																						"rgba(211, 211, 211, 1)",
																					height: "3rem",
																					"&:hover": {},
																				}}
																				value={`${cat?.name}`}>
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
														{userError?.role}
														{errors?.role && errors.role.message}
													</span>
												</div>
											</div>
											<div className='row mb-lg-4 mb-3'>
												<div className='col-lg-2 col-12'>
													<label htmlFor='password' className=''>
														كلمة المرور
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
														البريد الإلكتروني
														<span className='text-danger'>*</span>
													</label>
												</div>
												<div className='col-lg-9 col-12'>
													<div className='input-icons'>
														<Message />
													</div>
													<input
														style={{ direction: "ltr", textAlign: "left" }}
														name='email'
														type='email'
														id='email'
														{...register("email", {
															required: "حقل البريد الإلكتروني مطلوب",
															pattern: {
																value: /\S+@\S+\.\S+/,
																message:
																	"القيمة التي تم إدخالها لا تطابق تنسيق البريد الإلكتروني",
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
														className='direction-ltr'
														placeholder='0096654845613'
														{...register("phonenumber", {
															required: "حقل رقم الجوال مطلوب",
															pattern: {
																value: /^[0-9+]+$/i,
																message: "يجب أن رقم الجوال رقمًا",
															},
														})}
													/>
													<span className='Country_Key'>+966</span>
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
															<p className='helper'>
																اختر صورة PNG أو JPG فقط{" "}
															</p>
														) : (
															<p className='d-none'>
																اختر صورة PNG أو JPG فقط{" "}
															</p>
														)}

														<span> استعراض</span>
														<ul>{files}</ul>
													</div>
													<div className='col-2 mt-3'>
														<img
															width='100%'
															src={user?.image}
															alt={user?.name}
														/>
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
													<FormControl sx={{ m: 0, width: "100%" }}>
														<Controller
															name={"status"}
															control={control}
															rules={{ required: "حقل الحالة مطلوب" }}
															render={({ field: { onChange, value } }) => (
																<Select
																	name='status'
																	value={value}
																	onChange={(e) => {
																		onChange(e);
																	}}
																	sx={selectStyle}
																	IconComponent={IoIosArrowDown}
																	displayEmpty
																	inputProps={{ "aria-label": "Without label" }}
																	renderValue={(selected) => {
																		if (
																			value === "" ||
																			userStatusArray?.length === 0
																		) {
																			return (
																				<p
																					style={{
																						color: "#ADB5B9",
																						fontSize: "16px",
																					}}>
																					اختر الحالة
																				</p>
																			);
																		}

																		const result =
																			userStatusArray?.filter(
																				(item) => item?.nameEn === selected
																			) || "";
																		return result[0]?.nameAr;
																	}}>
																	{userStatusArray?.map((item, index) => {
																		return (
																			<MenuItem
																				key={index}
																				className='souq_storge_category_filter_items'
																				sx={{
																					backgroundColor: "#fff",
																					height: "3rem",
																					"&:hover": {},
																				}}
																				value={item?.nameEn}>
																				{item?.nameAr}
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
														className='close-btn'
														onClick={() => navigate("/Management")}>
														إلغاء
													</button>
												</div>
											</div>
										</div>
									</Fragment>
								)}
							</form>
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default EditUserPage;
