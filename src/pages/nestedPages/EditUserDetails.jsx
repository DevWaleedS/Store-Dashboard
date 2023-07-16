import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import useFetch from "../../Hooks/UseFetch";
import CircularLoading from "../../HelperComponents/CircularLoading";
import axios from "axios";
import Context from "../../Context/context";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// import Dropzone Library
import { useDropzone } from "react-dropzone";

// icons
import { ReactComponent as Message } from "../../data/Icons/icon-24-email.svg";
import { ReactComponent as Phone } from "../../data/Icons/icon-24- call.svg";
import { ReactComponent as Mobile } from "../../data/Icons/mobile-icon-24.svg";
import { ReactComponent as UploadIcon } from "../../data/Icons/icon-24-upload_outlined.svg";
import { useForm } from "react-hook-form";
import { UserAuth } from "../../Context/UserAuthorProvider";

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
	const [cookies] = useCookies(["access_token"]);
	const UserInfo = useContext(UserAuth);
	const contextStore = useContext(Context);
	const { setUserInfo } = UserInfo;
	const { setEndActionTitle } = contextStore;

	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/profile"
	);

	const navigate = useNavigate();
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
	const [user, setUser] = useState({
		name: "",
		user_name: "",
		email: "",
		password: "",
		confirm_password: "",
		phonenumber: "",
		image: "",
	});

	useEffect(() => {
		setUser({
			...user,
			name: fetchedData?.data?.users?.name,
			user_name: fetchedData?.data?.users?.user_name,
			email: fetchedData?.data?.users?.email,
			phonenumber: fetchedData?.data?.users?.phonenumber,
		});
	}, [fetchedData?.data?.users]);

	useEffect(() => {
		reset(user);
	}, [user, reset]);

	// Use state with useDropzone library to set banners
	const [userImage, setUserImage] = React.useState([]);

	const files = userImage.map((file) => (
		<li
			key={file.path}
			style={{
				width: "100%",
				overflow: "hidden",
				whiteSpace: "nowrap",
				textOverflow: "ellipsis",
			}}>
			{file.path} - {file.size} bytes
		</li>
	));

	// Get some methods form useDropZone
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/*": [],
		},

		onDrop: (acceptedFiles) => {
			setUserImage(
				acceptedFiles.map((image) =>
					Object.assign(image, {
						preview: URL.createObjectURL(image),
					})
				)
			);
		},
	});

	// get banners
	const bannersImage = userImage.map((image) => (
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

	/* UseEffects TO Handle memory leaks */
	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () =>
			userImage.forEach((image) => URL.revokeObjectURL(image.preview));
	}, []);

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
					setReload(!reload);
					setDataError({
						...dataError,
						user_name: res?.data?.message?.en?.user_name?.[0],
						email: res?.data?.message?.en?.email?.[0],
						password: res?.data?.message?.en?.password?.[0],
						confirm_password: res?.data?.message?.en?.confirm_password?.[0],
						phonenumber: res?.data?.message?.en?.phonenumber?.[0],
						image: res?.data?.message?.en?.image?.[0],
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
					<Box sx={style}>
						<div className='user-details'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='user-details-title'>
										<h5 className='mb-3'> تعديل بيانات حسابي</h5>
										<div className='row'>
											<nav aria-label='breadcrumb'>
												<ol className='breadcrumb'>
													<li className='breadcrumb-item text-bold'>
														حساب الادمن{" "}
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
														{fetchedData?.data?.users?.name === "null"
															? ""
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
													{fetchedData?.data?.users?.role?.name}
												</div>
											</div>
										</div>

										<div className='row mb-md-4 mb-3'>
											<div className='col-lg-4 col-md-5 col-12 mb-md-0 mb-3'>
												<label className='d-block mb-2' htmlFor='user-name'>
													اسم المستخدم<span className='text-danger'>*</span>
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
											<div className='col-md-2 col-0'></div>

											<div className='col-lg-4 col-md-5 col-12'>
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
											<div className='col-lg-4 col-md-5 col-12'>
												<label className='d-block mb-2' htmlFor='email'>
													البريد الالكتروني
													<span className='text-danger'>*</span>
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

											<div className='col-lg-4 col-md-5 col-12 order-md-last order-first mb-md-0 mb-3'>
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
										<div className='row mb-md-4 mb-3'>
											<div className='col-lg-4 col-12'>
												<label
													className='d-block mb-2'
													htmlFor='upload-user-image'>
													الصورة الشخصية
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
													<ul style={{ width: "80%" }}>{files}</ul>
													<span className='upload-icon'>
														<UploadIcon />
													</span>
												</div>
											</div>
											<br />
											<span className='fs-6 text-danger'>
												{dataError?.image}
											</span>
											<div className='col-lg-2 col-0'></div>
											<div className='col-lg-4 col-0'></div>
										</div>
										<div className='row mb-4'>
											<div className='col-lg-4 col-12'>
												<label className='d-block mb-2' htmlFor='phone-number'>
													رقم الهاتف<span className='text-danger'>*</span>
												</label>
												<input
													name='phonenumber'
													type='number'
													placeholder='0096654845613'
													className='phone-input direction-ltr'
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
