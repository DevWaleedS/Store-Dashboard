import React, { useState, useEffect, useContext, Fragment } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useFetch from "../../Hooks/UseFetch";
import Context from "../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import CircularLoading from "../../HelperComponents/CircularLoading";
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
	const [images, setImages] = useState([]);

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

	// Show and hidden password function
	const [passwordType, setPasswordType] = useState("password");
	const [showPasswordIcon, setShowPasswordIcon] = useState(<Password />);
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
		accept: {
			"image/jpeg": [],
			"image/png": [],
		},
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

	const handleOnChange = (e) => {
		setUser({ ...user, [e.target.name]: e.target.value });
	};

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
																		"& .MuiSelect-icon.MuiSelect-iconOutlined":
																			{
																				right: "92% !important",
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
														value={user?.password}
														onChange={(e) => {
															handleOnChange(e);
														}}
														type={passwordType}
														id='password'
													/>
												</div>
												<div className='col-lg-2 col-12'></div>
												<div className='col-lg-9 col-12'>
													{userError?.password && (
														<span className='fs-6 text-danger'>
															{userError?.password}
														</span>
													)}
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
													<Controller
														name={"status"}
														control={control}
														rules={{ required: "The status field is required" }}
														render={({ field: { onChange, value } }) => (
															<select
																name='status'
																value={value}
																onChange={onChange}
																className='form-select'
																id='status'>
																<option defaultValue='active'>مفعل</option>
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
