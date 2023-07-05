import React, { useContext, useState } from 'react';
import { Helmet } from "react-helmet";
import axios from 'axios';
import Context from '../../Context/context';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
// import Dropzone Library
import { useDropzone } from 'react-dropzone';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
// icons
import { ReactComponent as Message } from '../../data/Icons/icon-24-email.svg';
import { ReactComponent as User } from '../../data/Icons/icon-24-user.svg';
import { ReactComponent as Password } from '../../data/Icons/icon-24-invisible.svg';
import { ReactComponent as Mobile } from '../../data/Icons/mobile-icon-24.svg';

import { AiOutlineEyeInvisible } from 'react-icons/ai';
import { IoIosArrowDown } from 'react-icons/io';
import useFetch from '../../Hooks/UseFetch';
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from '../../Context/LoadingProvider';

const style = {
	position: 'fixed',
	top: '80px',
	left: '0%',
	transform: 'translate(0%, 0%)',
	width: '81%',
	height: '100%',
	overflow: 'auto',
	bgcolor: '#fff',
	paddingBottom: '80px',

	'@media(max-width:768px)': {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		backgroundColor: '#F6F6F6',
		paddingBottom: 0,
	},
};
const AddNewUser = () => {
	const { fetchedData: roles } = useFetch('https://backend.atlbha.com/api/Store/selector/roles');
	const navigate = useNavigate();
	const [reload, setReload] = useState(false);
	const [cookies] = useCookies(['access_token']);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const { register, handleSubmit, control, formState: { errors } } = useForm({
		mode: "onBlur",
		defaultValues: {
			name: '',
			user_name: '',
			user_type: '',
			email: '',
			password: '',
			phonenumber: '',
			image: '',
			status: 'active',
		}
	});
	const [images, setImages] = useState([]);
	const [userError, setUserError] = useState({
		name: '',
		user_name: '',
		user_type: '',
		email: '',
		password: '',
		phonenumber: '',
		image: '',
		status: '',
	});

	const resetCouponError = () => {
		setUserError({
			name: '',
			user_name: '',
			user_type: '',
			email: '',
			password: '',
			phonenumber: '',
			image: '',
			status: '',
		});
	};

	// Show and hidden password function
	const [passwordType, setPasswordType] = useState('password');
	const [showPasswordIcon, setShowPasswordIcon] = useState(<Password />);

	const showPasswordToggle = () => {
		if (passwordType === 'password') {
			setPasswordType('text');
			setShowPasswordIcon(<AiOutlineEyeInvisible />);
		} else {
			setPasswordType('password');
			setShowPasswordIcon(<Password />);
		}
	};

	//  use dropzone to get personal image
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: 'image/*',
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
		setLoadingTitle('جاري اضافة المستخدم');
		resetCouponError();
		let formData = new FormData();
		formData.append('name', data?.name);
		formData.append('user_name', data?.user_name);
		formData.append('role', data?.user_type);
		formData.append('email', data?.email);
		formData.append('password', data?.password);
		formData.append('phonenumber', data?.phonenumber);
		formData.append('status', data?.status);
		formData.append('image', images[0]);
		axios
			.post(`https://backend.atlbha.com/api/Store/user`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Management');
					setReload(!reload);
				} else {
					setLoadingTitle('');
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
				<Modal open={true} onClose={() => navigate('/Management')} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
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
												الإسم الكامل
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
												{...register('name', {
													required: "The name field is required",
													pattern: {
														value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
														message: "The name must be a string"
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'><span className='fs-6 text-danger'>{userError?.name}{errors?.name && errors.name.message}</span></div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='user-name' className=''>
												اسم المستخدم
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
												{...register('user_name', {
													required: "The username field is required",
													pattern: {
														value: /^[^-\s][a-zA-Z0-9_]+$/,
														message: "The username must be a English letter and number"
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'><span className='fs-6 text-danger'>{userError?.user_name}{errors?.user_name && errors.user_name.message}</span></div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='job-title' className=''>
												الدور الوظيفي
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<FormControl sx={{ m: 0, width: '100%' }}>
												<Controller
													name={"user_type"}
													control={control}
													rules={{ required: "The user type field is required" }}
													render={({ field: { onChange, value } }) => (
														<Select
															name='user_type'
															value={value}
															onChange={(e) => { onChange(e) }}
															sx={{
																fontSize: '18px',
																backgroundColor: '#ededed',
																'& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
																{
																	paddingRight: '20px',
																},
																'& .MuiOutlinedInput-root': {
																	'& :hover': {
																		border: 'none',
																	},
																},
																'& .MuiOutlinedInput-notchedOutline': {
																	border: 'none',
																},
																'& .MuiSelect-icon.MuiSelect-iconOutlined': {
																	right: '95% !important',
																},
																'& .MuiSelect-nativeInput': {
																	display: 'none',
																},
															}}
															IconComponent={IoIosArrowDown}
															displayEmpty
															inputProps={{ 'aria-label': 'Without label' }}
															renderValue={(selected) => {
																if (!selected) {
																	return <p className='text-[#ADB5B9]'>اختر الدور الوظيفي</p>;
																}
																return selected;
															}}
														>
															{roles?.data?.roles?.map((cat, index) => {
																return (
																	<MenuItem
																		key={index}
																		className='souq_storge_category_filter_items'
																		sx={{
																			backgroundColor: 'rgba(211, 211, 211, 1)',
																			height: '3rem',
																			'&:hover': {},
																		}}
																		value={cat?.name}
																	>
																		{cat?.name}
																	</MenuItem>
																);
															})}
														</Select>
													)} />
											</FormControl>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'><span className='fs-6 text-danger'>{userError?.user_type}{errors?.user_type && errors.user_type.message}</span></div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='password' className=''>
												كلمة المرور
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div className='input-icons password-icon' onClick={showPasswordToggle}>
												{showPasswordIcon}
											</div>
											<input
												name='password'
												type={passwordType}
												id='password'
												{...register('password', {
													required: "The password field is required",
													minLength: {
														value: 6,
														message: "The password must be at least 6 characters"
													},
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'><span className='fs-6 text-danger'>{userError?.password}{errors?.password && errors.password.message}</span></div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='email' className=''>
												البريد الإلكتروني
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
												{...register('email', {
													required: "The email field is required",
													pattern: {
														value: /\S+@\S+\.\S+/,
														message: "Entered value does not match email format"
													}
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'><span className='fs-6 text-danger'>{userError?.email}{errors?.email && errors.email.message}</span></div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='phone-number' className=''>
												رقم الهاتف
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div className='input-icons'>
												<Mobile />
											</div>
											<input
												name='phonenumber'
												type='number'
												id='phonenumber'
												placeholder='0096654845613'
												className='direction-ltr'
												{...register('phonenumber', {
													required: "The phonenumber field is required",
													pattern: {
														value: /^[0-9+]+$/i,
														message: "The price must be a number"
													},
													minLength: {
														value: 13,
														message: "min length is 13"
													},
													maxLength: {
														value: 14,
														message: "max length is 14"
													}
												})}
											/>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'><span className='fs-6 text-danger'>{userError?.phonenumber}{errors?.phonenumber && errors.phonenumber.message}</span></div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='personal-image' className=''>
												الصورة الشخصية
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<div {...getRootProps({ className: 'upload-personal-image d-flex justify-content-between' })}>
												<input {...getInputProps()} id='personal-image' name='personal-image' />
												{files.length <= 0 ? <p className='helper'>اختر صورة PNG أو JPG فقط </p> : <p className='d-none'>اختر صورة PNG أو JPG فقط </p>}

												<span> استعراض</span>
												<ul>{files}</ul>
											</div>
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'>{userError?.image && <span className='fs-6 text-danger'>{userError?.image}</span>}</div>
									</div>
									<div className='row mb-lg-4 mb-3'>
										<div className='col-lg-2 col-12'>
											<label htmlFor='status' className=''>
												الحالة
											</label>
										</div>
										<div className='col-lg-9 col-12'>
											<Controller
												name={"status"}
												control={control}
												rules={{ required: "The status field is required" }}
												render={({ field: { onChange, value } }) => (
													<select
														className='form-select'
														id='status'
														value={value}
														onChange={onChange}
													>
														<option selected value='active'>مفعل</option>
														<option value='not_active'>غير مفعل</option>
													</select>
												)} />
										</div>
										<div className='col-lg-2 col-12'></div>
										<div className='col-lg-9 col-12'><span className='fs-6 text-danger'>{userError?.status}{errors?.status && errors.status.message}</span></div>
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
											<button onClick={() => navigate('/Management')} className='close-btn'>
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