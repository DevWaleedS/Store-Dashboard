import React, { useState, useEffect, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useCookies } from "react-cookie";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { UserAuth } from "../../Context/UserAuthorProvider";

// Components
import useFetch from "../../Hooks/UseFetch";
import CircularLoading from "../../HelperComponents/CircularLoading";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Icons
import { Message, Mobile, Phone, UploadUserImageIcon } from "../../data/Icons";

const style = {
	position: "fixed",
	top: "80px",
	left: "0%",
	transform: "translate(0%, 0%)",
	width: "74%",
	height: "100%",
	overflow: "auto",
	bgcolor: "#F6F6F6",
	paddingBottom: "80px",
	"@media(max-width:992px)": {
		width: "80%",
	},
	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		paddingBottom: 0,
	},
};

const EditUserDetails = () => {
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);

	const UserInfo = useContext(UserAuth);
	const contextStore = useContext(Context);

	const { setUserInfo } = UserInfo;
	const { setEndActionTitle } = contextStore;

	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/profile"
	);

	const [user, setUser] = useState({
		name: "",
		user_name: "",
		email: "",
		password: "",
		confirm_password: "",
		phonenumber: "",
		image: "",
	});

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			name: "",
			user_name: "",
			email: "",
			password: "",
			confirm_password: "",
			phonenumber: "",
		},
	});

	// -----------------------------------------------
	// TO HANDLE ERRORS
	const [dataError, setDataError] = useState({
		name: "",
		user_name: "",
		email: "",
		password: "",
		confirm_password: "",
		phonenumber: "",
		image: "",
	});
	const resetDataError = () => {
		setDataError({
			name: "",
			user_name: "",
			email: "",
			password: "",
			confirm_password: "",
			phonenumber: "",
			image: "",
		});
	};

	useEffect(() => {
		if (fetchedData?.data?.users) {
			setUser({
				...user,
				name: fetchedData?.data?.users?.name,
				user_name: fetchedData?.data?.users?.user_name,
				email: fetchedData?.data?.users?.email,
				phonenumber: fetchedData?.data?.users?.phonenumber?.startsWith("+966")
					? fetchedData?.data?.users?.phonenumber?.slice(4)
					: fetchedData?.data?.users?.phonenumber?.startsWith("00966")
					? fetchedData?.data?.users?.phonenumber.slice(5)
					: fetchedData?.data?.users?.phonenumber,
			});
		}
	}, [fetchedData?.data?.users]);

	useEffect(() => {
		reset(user);
	}, [user, reset]);

	// ----------------------------------------------------

	// handle images size
	const maxFileSize = 2 * 1024 * 1024; // 2 MB;
	// Use state with useDropzone library to set banners
	const [userImage, setUserImage] = React.useState([]);

	// Get some methods form useDropZone
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
					setUserImage([]);
					toast.warning(errorMessage, {
						theme: "light",
					});
					setDataError({
						...dataError,
						image: errorMessage,
					});
				} else {
					setDataError({
						...dataError,
						image: null,
					});
				}

				return isSizeValid
					? Object.assign(file, { preview: URL.createObjectURL(file) })
					: null;
			});

			setUserImage(updatedIcons?.filter((image) => image !== null));
		},
	});

	const files = acceptedFiles?.map((file) => (
		<li
			key={file?.path}
			style={{
				width: "100%",
				overflow: "hidden",
				whiteSpace: "nowrap",
				textOverflow: "ellipsis",
			}}>
			{file?.path}
		</li>
	));
	// -----------------------------------------------------

	// get banners
	const bannersImage = acceptedFiles?.map((image) => (
		<div key={image.name}>
			<img
				key={image.path}
				src={image.preview}
				alt='upload banner'
				// Revoke data uri after image is loaded
				onLoad={() => {
					URL.revokeObjectURL(image.preview);
				}}
			/>
		</div>
	));
	// ---------------------------------------------------------------------------------

	const updateUser = (data) => {
		resetDataError();
		let formData = new FormData();
		formData.append("name", data?.name);
		formData.append("user_name", data?.user_name);
		formData.append("email", data?.email);
		formData.append("phonenumber", data?.phonenumber);

		if (data?.password !== "") {
			formData.append("password", data?.password);
		}
		if (data?.confirm_password !== "") {
			formData.append("confirm_password", data?.confirm_password);
		}
		if (userImage?.length !== 0) {
			formData.append("image", userImage[0]);
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/profile`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setUserInfo({ user_image: res?.data?.data?.users?.image });
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/");
					setReload(!reload);
					window.location.reload();
				} else {
					setDataError({
						...dataError,
						user_name: res?.data?.message?.en?.user_name?.[0],
						email: res?.data?.message?.en?.email?.[0],
						password: res?.data?.message?.en?.password?.[0],
						confirm_password: res?.data?.message?.en?.confirm_password?.[0],
						phonenumber: res?.data?.message?.en?.phonenumber?.[0],
						image: res?.data?.message?.en?.image?.[0],
					});
					toast.error(res?.data?.message?.en?.user_name?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.email?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.password?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.confirm_password?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.phonenumber?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.image?.[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل حسابي</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style}>
						<div className='user-details'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='user-details-title'>
										<h5 className='mb-3'> تعديل بيانات حسابي</h5>
										<div className='row'>
											<nav aria-label='breadcrumb'>
												<ol className='breadcrumb'>
													<li className='breadcrumb-item text-bold'>
														<Link to='/UserDetails'>حساب الادمن</Link>
													</li>

													<li
														className='breadcrumb-item active'
														aria-current='page'>
														تعديل بيانات الحساب
													</li>
												</ol>
											</nav>
										</div>
									</div>
								</div>
							</div>
							{loading ? (
								<div className='mt-5'>
									<CircularLoading />
								</div>
							) : (
								<form onSubmit={handleSubmit(updateUser)}>
									<div className='user-details-body edit-user-body'>
										<div className='row mb-5'>
											<div className='col-lg-2 col-12 d-flex justify-content-center'>
												{/** preview banner here */}
												<div className=' banners-preview'>
													{bannersImage.length === 0 ? (
														<img
															className='img-fluid'
															src={fetchedData?.data?.users?.image}
															alt='user'
														/>
													) : (
														bannersImage
													)}
												</div>
											</div>

											<div className='col-lg-4 col-12 d-flex justify-content-center'>
												<div className='user-info me-3'>
													<span className='user-name mb-3 d-block text-center'>
														{fetchedData?.data?.users?.name === null
															? fetchedData?.data?.users?.user_name
															: fetchedData?.data?.users?.name}
													</span>
													<div className='contact-info mb-2'>
														<Message />
														<span className='me-3'>
															{fetchedData?.data?.users?.email}
														</span>
													</div>
													<div
														className='contact-info'
														style={{
															direction: "ltr",
															display: "flex",
															flexDirection: "row-reverse",
														}}>
														<Phone />
														<span className='me-3'>
															{fetchedData?.data?.users?.phonenumber}
														</span>
													</div>
												</div>
											</div>

											<div className='col-lg-4 col-12 d-flex justify-content-center order-md-last order-first'>
												<div className='job-title'>
													{fetchedData?.data?.users?.role === null
														? "الدور الوظيفي"
														: fetchedData?.data?.users?.role?.name}
												</div>
											</div>
										</div>

										<div className='row mb-md-4 mb-3'>
											<div className='col-lg-4 col-md-5 col-12 mb-md-0 mb-3'>
												<label className='d-block mb-2' htmlFor='user-name'>
													الاسم <span className='important-hint'>*</span>
												</label>
												<input
													name='name'
													type='text'
													placeholder='Omar'
													{...register("name", {
														required: "حقل الاسم  مطلوب",
													})}
												/>
												<br />
												<span className='fs-6 text-danger'>
													{dataError?.name}
													{errors?.name && errors.name.message}
												</span>
											</div>

											<div className='col-md-2 col-0'></div>

											<div className='col-lg-4 col-md-5 col-12'>
												<label className='d-block mb-2' htmlFor='user-name'>
													اسم المستخدم<span className='important-hint'>*</span>
												</label>
												<input
													style={{ direction: "ltr", textAlign: "left" }}
													name='user_name'
													type='text'
													placeholder='Omar'
													{...register("user_name", {
														required: "حقل اسم المستخدم مطلوب",
														pattern: {
															value: /^[^-\s][a-zA-Z0-9_]+$/,
															message:
																"يجب أن يكون اسم المستخدم حروف باللغة الإنجليزية",
														},
													})}
												/>
												<br />
												<span className='fs-6 text-danger'>
													{dataError?.user_name}
													{errors?.user_name && errors.user_name.message}
												</span>
											</div>
										</div>

										<div className='row mb-md-4 mb-3'>
											<div className='col-lg-4 col-md-5 col-12'>
												<label className='d-block mb-2' htmlFor='email'>
													البريد الالكتروني
													<span className='important-hint'>*</span>
												</label>
												<input
													style={{ direction: "ltr", textAlign: "left" }}
													name='email'
													type='email'
													placeholder='Omar.sample@sa.com'
													{...register("email", {
														required: "حقل البريد الإلكتروني مطلوب",
														pattern: {
															value: /\S+@\S+\.\S+/,
															message:
																"القيمة التي تم إدخالها لا تطابق تنسيق البريد الإلكتروني",
														},
													})}
												/>
												<br />
												<span className='fs-6 text-danger'>
													{dataError?.email}
													{errors?.email && errors.email.message}
												</span>
											</div>
											<div className='col-md-2 col-0'></div>

											<div className=' col-lg-4 col-md-5 col-12 order-md-last order-first mb-md-0 mb-3'>
												<label className='d-block mb-2' htmlFor='password'>
													كلمة المرور
												</label>
												<input
													name='password'
													type='password'
													placeholder='********'
													className='d-block'
													{...register("password", {})}
												/>
												<span className='password-hint'>
													أدخل أرقام وحروف ورموز
												</span>
												<br />
												<span className='fs-6 text-danger'>
													{dataError?.password}
													{errors?.password && errors.password.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-4 mb-3'>
											<div className='col-lg-4 col-12'>
												<label
													className='d-block mb-2'
													htmlFor='upload-user-image'>
													الصورة الشخصية{" "}
													<span className='tax-text '>
														(الحد الأقصي للصورة 2MB)
													</span>
												</label>
												<div
													{...getRootProps({
														className:
															"upload-user-image d-flex justify-content-between",
													})}>
													<input
														{...getInputProps()}
														id='upload-user-image'
														name='upload-user-image'
													/>

													{files?.length !== 0 ? (
														<ul style={{ width: "80%" }}>{files}</ul>
													) : (
														<p className='helper' style={{ fontSize: "16px" }}>
															اختر صورة PNG أو JPG فقط{" "}
														</p>
													)}

													<span className='upload-icon'>
														<UploadUserImageIcon />
													</span>
												</div>

												<span className='fs-6 text-danger'>
													{dataError?.image}
												</span>
											</div>

											<div className='col-lg-2 col-0'></div>

											<div className='col-lg-4 col-12'>
												<label className='d-block mb-2' htmlFor='re-password'>
													تأكيد كلمة المرور
												</label>
												<input
													name='confirm_password'
													type='password'
													placeholder='********'
													className='d-block'
													{...register("confirm_password", {})}
												/>
												<span className='password-hint'>
													أدخل أرقام وحروف ورموز
												</span>
												<br />
												<span className='fs-6 text-danger'>
													{dataError?.confirm_password}
													{errors?.confirm_password &&
														errors.confirm_password.message}
												</span>
											</div>
										</div>
										<div className='row mb-4'>
											<div className='col-lg-4 col-12'>
												<label className='d-block mb-2' htmlFor='phone-number'>
													رقم الهاتف<span className='important-hint'>*</span>
												</label>
												<span className='Country_Key'>+966</span>
												<input
													maxLength={9}
													className='phone-input direction-ltr'
													name='phonenumber'
													type='tel'
													placeholder={500000000}
													{...register("phonenumber", {
														required: "حقل رقم الجوال مطلوب",

														pattern: {
															value: /^[0-9+]+$/i,
															message: "يجب أن رقم الجوال رقمًا",
														},
													})}
												/>

												<span className='input-icon'>
													<Mobile />
												</span>
												<br />

												<span className='fs-6 text-danger'>
													{dataError?.phonenumber}
													{errors?.phonenumber && errors.phonenumber.message}
												</span>
											</div>
											<div className='col-lg-2 col-0'></div>
											<div className='col-lg-4 col-0'></div>
										</div>
									</div>

									<div className='user-details-footer'>
										<div className='row d-flex justify-content-center align-items-center'>
											<div className='col-lg-3 col-md-6 col-12 mb-2'>
												<button type='submit' className='edit-btn w-100 mb-3'>
													حفظ
												</button>
											</div>
											<div className='col-lg-3 col-md-6 col-12'>
												<button
													type='button'
													onClick={() => navigate("/")}
													className='close-btn w-100 mb-3'>
													إغلاق
												</button>
											</div>
										</div>
									</div>
								</form>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default EditUserDetails;
