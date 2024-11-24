import React, { useState, useEffect, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { useDropzone } from "react-dropzone";
import { Link, useNavigate } from "react-router-dom";

// Context
import { LoadingContext } from "../../Context/LoadingProvider";

// Helpers
import { CircularLoading } from "../../HelperComponents";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Icons
import {
	Message,
	Mobile,
	Phone,
	UploadUserImageIcon,
	Eye,
} from "../../data/Icons";
import { AiOutlineEyeInvisible } from "react-icons/ai";

// RTK Query
import {
	useEditUserProfileDataMutation,
	useGetUserProfileDataQuery,
} from "../../store/apiSlices/editUserDetailsApi";
import { removeWhiteSpace } from "../../HelperComponents";

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
	// get user profile data from api...
	const { data: userProfileData, isFetching } = useGetUserProfileDataQuery();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

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

	// Show and hidden confirm password function
	const [passwordConfirmType, setPasswordConfirmType] = useState("password");
	const [showPasswordConfirmIcon, setShowPasswordConfirmIcon] = useState(
		<Eye />
	);
	const showPasswordConfirmToggle = () => {
		if (passwordConfirmType === "password") {
			setPasswordConfirmType("text");
			setShowPasswordConfirmIcon(<AiOutlineEyeInvisible />);
		} else {
			setPasswordConfirmType("password");
			setShowPasswordConfirmIcon(<Eye />);
		}
	};

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
		if (userProfileData) {
			setUser({
				...user,
				name: userProfileData?.name,
				user_name: userProfileData?.user_name,
				email: userProfileData?.email,
				phonenumber: userProfileData?.phonenumber?.startsWith("+966")
					? userProfileData?.phonenumber?.slice(4)
					: userProfileData?.phonenumber?.startsWith("00966")
					? userProfileData?.phonenumber.slice(5)
					: userProfileData?.phonenumber,
			});

			localStorage.setItem(
				"name",
				userProfileData?.name + userProfileData?.lastname
			);
			localStorage.setItem("userName", userProfileData?.user_name);
			localStorage.setItem("userImage", userProfileData?.image);
		}
	}, [userProfileData]);

	useEffect(() => {
		reset(user);
	}, [user, reset]);

	/** ============================================================ */

	// handle images size
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	// Use state with useDropzone library to set banners
	const [userImage, setUserImage] = React.useState([]);

	// Get some methods form useDropZone
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/jpeg": [],
			"image/jpg": [],
			"image/png": [],
			"image/webp": [],
		},

		onDrop: (acceptedFiles) => {
			const updatedIcons = acceptedFiles?.map((file) => {
				const isSizeValid = file.size <= maxFileSize;
				const errorMessage = "حجم الصورة يجب أن لا يزيد عن 1 ميجابايت.";

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
	/** ============================================================ */

	/** get banners */
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

	const [editUserProfileData] = useEditUserProfileDataMutation();
	const handleUpdateUser = async (data) => {
		setLoadingTitle("جاري تعديل بيانات المستخدم ");
		resetDataError();

		// data that send to ap...
		let formData = new FormData();
		formData.append("name", data?.name);
		formData.append("user_name", data?.user_name);

		if (data?.password !== "") {
			formData.append("password", data?.password);
		}
		if (data?.confirm_password !== "") {
			formData.append("confirm_password", data?.confirm_password);
		}
		if (userImage?.length !== 0) {
			formData.append("image", userImage[0]);
		}

		// make request...
		try {
			const response = await editUserProfileData({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");

				localStorage.setItem(
					"name",
					response?.data?.data?.users?.name +
						response?.data?.data?.users?.lastname
				);
				localStorage.setItem(
					"userName",
					response?.data?.data?.users?.user_name
				);
				localStorage.setItem("userImage", response?.data?.data?.users?.image);

				navigate("/");
			} else {
				setLoadingTitle("");
				setDataError({
					...dataError,
					user_name: response?.data?.message?.en?.user_name?.[0],
					email: response?.data?.message?.en?.email?.[0],
					password: response?.data?.message?.en?.password?.[0],
					confirm_password: response?.data?.message?.en?.confirm_password?.[0],
					phonenumber: response?.data?.message?.en?.phonenumber?.[0],
					image: response?.data?.message?.en?.image?.[0],
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
			console.error("Error changing editUserProfileData:", error);
		}
	};
	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تعديل حسابي</title>
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
														<Link to='/'>الرئيسية</Link>
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
							{isFetching ? (
								<div className='mt-5'>
									<CircularLoading />
								</div>
							) : (
								<form onSubmit={handleSubmit(handleUpdateUser)}>
									<div className='user-details-body edit-user-body'>
										<div className='row mb-5'>
											<div className='col-lg-2 col-12 d-flex justify-content-center'>
												{/** preview banner here */}
												<div className=' banners-preview'>
													{bannersImage.length === 0 ? (
														<img
															className='img-fluid'
															src={userProfileData?.image}
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
														{userProfileData?.name === null
															? userProfileData?.user_name
															: userProfileData?.name}
													</span>
													<div className='contact-info mb-2'>
														<Message />
														<span className='me-3'>
															{userProfileData?.email}
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
															{userProfileData?.phonenumber}
														</span>
													</div>
												</div>
											</div>

											<div className='col-lg-4 col-12 d-flex justify-content-center order-md-last order-first'>
												<div className='job-title'>
													{userProfileData?.role === null
														? "الدور الوظيفي"
														: userProfileData?.role?.name}
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
												</label>
												<input
													style={{
														direction: "ltr",
														textAlign: "left",
														cursor: "auto",
													}}
													name='email'
													type='email'
													placeholder='Omar.sample@sa.com'
													{...register("email", {})}
													disabled
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
												<div className='password-type'>
													<input
														name='password'
														type={passwordType}
														className='d-block'
														{...register("password", {})}
													/>
													<div
														className='input-icons password-icon'
														onClick={showPasswordToggle}>
														{showPasswordIcon}
													</div>
												</div>
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
											<div className='col-lg-4 col-12 mb-md-0 mb-3'>
												<label
													className='d-block mb-2'
													htmlFor='upload-user-image'>
													الصورة الشخصية{" "}
													<span className='tax-text '>
														(الحد الأقصى للصورة 1MB)
													</span>
												</label>
												<div
													{...getRootProps({
														className:
															"upload-user-image d-flex align-items-center justify-content-between",
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
															اختر صورة PNG أو JPG أو WEBP{" "}
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
												<div className='password-type'>
													<input
														name='confirm_password'
														type={passwordConfirmType}
														className='d-block'
														{...register("confirm_password", {})}
													/>
													<div
														className='input-icons password-icon'
														onClick={showPasswordConfirmToggle}>
														{showPasswordConfirmIcon}
													</div>
												</div>
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
													رقم الهاتف
												</label>
												<span className='Country_Key'>+966</span>
												<input
													maxLength={9}
													className='phone-input direction-ltr'
													name='phonenumber'
													type='tel'
													onPaste={(e) => {
														removeWhiteSpace(e);
													}}
													placeholder={500000000}
													{...register("phonenumber", {})}
													style={{ cursor: "auto" }}
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
