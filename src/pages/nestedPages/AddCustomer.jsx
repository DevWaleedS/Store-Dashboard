import React, { useContext, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { closeCustomerDataModal } from '../../store/slices/CustomerDataModal-slice';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import Context from '../../Context/context';
import useFetch from '../../Hooks/UseFetch';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';

import Modal from '@mui/material/Modal';
import ImageUploading from 'react-images-uploading';

// icons
import { IoIosArrowDown } from 'react-icons/io';
import { ReactComponent as ImageIcon } from '../../data/Icons/icon-24-image.svg';
import { ReactComponent as AddImageIcon } from '../../data/Icons/icon-24-action-add.svg';
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from '../../Context/LoadingProvider';

const style = {
	position: 'fixed',
	top: '80px',
	left: '0%',
	transform: 'translate(0%, 0%)',
	width: '70%',
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

const AddCustomer = ({ reload, setReload }) => {
	const { isOpen } = useSelector((state) => state.customerDataModal);
	const dispatch = useDispatch(false);
	// to get selectors from api
	const { fetchedData: countryList } = useFetch('https://backend.atlbha.com/api/Store/selector/countries');
	const { fetchedData: citiesList } = useFetch('https://backend.atlbha.com/api/Store/selector/cities');
	const gender = [
		{ id: 1, name: 'ذكر', name_en: 'male' },
		{ id: 2, name: 'أنثي', name_en: 'female' },
	];

	const [cookies] = useCookies(['access_token']);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [customerImage, setCustomerImage] = useState([]);
	const handleAddCustomerImage = (imageList, addUpdateIndex) => {
		// data for submit
		setCustomerImage(imageList);
	};

	const { register, handleSubmit, control, formState: { errors } } = useForm({
		mode: "onBlur",
		defaultValues: {
			ID_number: '',
			first_name: '',
			last_name: '',
			email: '',
			gender: '',
			phonenumber: '',
			city_id: '',
			country_id: '',
		}
	});

	const [customerError, setCustomerError] = useState({
		ID_number: '',
		first_name: '',
		last_name: '',
		email: '',
		gender: '',
		phonenumber: '',
		city_id: '',
		country_id: '',
		image: '',
	});

	const resetCouponError = () => {
		setCustomerError({
			ID_number: '',
			first_name: '',
			last_name: '',
			email: '',
			gender: '',
			phonenumber: '',
			city_id: '',
			country_id: '',
			image: '',
		});
	};

	// to update UpdateMaintenanceMode values
	const addNewCustomer = (data) => {
		setLoadingTitle('جاري حفظ العميل');
		resetCouponError();
		let formData = new FormData();
		formData.append('ID_number', data?.ID_number);
		formData.append('first_name', data?.first_name);
		formData.append('last_name', data?.last_name);
		formData.append('email', data?.email);
		formData.append('phonenumber', data?.phonenumber);
		formData.append('image', customerImage[0]?.file || null);
		formData.append('city_id', data?.city_id);
		formData.append('country_id', data?.country_id);
		formData.append('gender', data?.gender);
		axios
			.post(`https://backend.atlbha.com/api/Store/client`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					dispatch(closeCustomerDataModal());
					setReload(!reload);
				} else {
					setLoadingTitle('');
					setReload(!reload);
					setCustomerError({
						ID_number: res?.data?.message?.en?.ID_number?.[0],
						first_name: res?.data?.message?.en?.first_name?.[0],
						last_name: res?.data?.message?.en?.last_name?.[0],
						email: res?.data?.message?.en?.email?.[0],
						gender: res?.data?.message?.en?.gender?.[0],
						phonenumber: res?.data?.message?.en?.phonenumber?.[0],
						city_id: res?.data?.message?.en?.city_id?.[0],
						country_id: res?.data?.message?.en?.country_id?.[0],
						image: res?.data?.message?.en?.image?.[0],
					});
				}
			});
	};

	return (
		<div className='add-category-form' open={isOpen}>
			<Modal open={isOpen} onClose={() => dispatch(closeCustomerDataModal())} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
				<Box sx={style}>
					<div className='add-form-wrapper add-customer-form'>
						<div className='d-flex'>
							<div className='col-12'>
								<div className='form-title'>
									<h5 className='mb-3'> اضافة عميل</h5>
									<p> قم بإدخال بيانات العميل لتسجيل حسابه في المتجر </p>
								</div>
							</div>
						</div>

						<form onSubmit={handleSubmit(addNewCustomer)}>
							<div className='form-body'>
								<div className='row mb-md-4 mb-3 d-flex flex-row-reverse justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-0'>
										<ImageUploading value={customerImage} onChange={handleAddCustomerImage} dataURLKey='data_url' acceptType={['jpg', 'png', 'jpeg']}>
											{({ imageList, onImageUpload, dragProps }) => (
												// Ui For Upload Log
												<Fragment>
													{/** Preview Image Box */}
													<div className='banners-preview-container mx-md-0 mx-auto mb-md-0 mb-3'>
														{customerImage[0] ? <img src={customerImage[0].data_url} alt='' className='img-fluid' /> : <ImageIcon className='image-icon' />}
													</div>

													{/** upload btn */}
													<div className='add-image-btn-bx d-flex justify-content-between align-items-center mx-md-0 mx-auto  mt-2'>
														<label htmlFor='add-image'> اضف صورة</label>
														<div className='add-image-btn'>
															<AddImageIcon onClick={onImageUpload} {...dragProps} />
														</div>
													</div>
												</Fragment>
											)}
										</ImageUploading>
										<div className='col-12'>{customerError?.image && <span className='fs-6 text-danger'>{customerError?.image}</span>}</div>
									</div>
									<div className='col-md-4 col-12'>
										<label htmlFor='id-number' className='d-block mb-2'>
											الرقم ID
										</label>
										<input
											name='ID_number'
											type='text'
											id='id-number'
											placeholder='DA88'
											{...register('ID_number', {
												required: "The ID number field is required",
												pattern: {
													value: /^[^-\s][a-zA-Z0-9_]+$/,
													message: "The ID number must be a English letter and number"
												},
											})}
										/>
										<div className='col-12'><span className='fs-6 text-danger'>{customerError?.ID_number}{errors?.ID_number && errors.ID_number.message}</span></div>
										<div className='row mt-4'>
											<div className='col-12'>
												<label htmlFor='first-name' className='d-block mb-2'>
													الاسم الأول
												</label>
												<input
													name='first_name'
													type='text'
													id='first-name'
													placeholder='الاسم الأول'
													{...register('first_name', {
														required: "The first name field is required",
														pattern: {
															value: /^[^-\s][\u0600-\u06FF-A-Za-z ]+$/i,
															message: "The first name must be a string"
														},
													})}
												/>
											</div>
											<div className='col-12'><span className='fs-6 text-danger'>{customerError?.first_name}{errors?.first_name && errors.first_name.message}</span></div>
										</div>
									</div>
								</div>

								<div className='row mb-md-4 mb-3 d-flex flex-row-reverse justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-3'>
										<label htmlFor='city' className='d-block mb-2'>
											الدولة
										</label>
										<Controller
											name={"country_id"}
											control={control}
											rules={{ required: "The country field is required" }}
											render={({ field: { onChange, value } }) => (
												<Select
													name='country_id'
													value={value}
													onChange={onChange}
													MenuProps={{
														sx: {
															'& .MuiPaper-root ': {
																height: '350px',
															},
														},
													}}
													sx={{
														width: '100%',
														fontSize: '18px',
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
															border: '1px solid #ededed',
														},
														'& .MuiSelect-icon': {
															right: '90% !important',
														},
													}}
													IconComponent={IoIosArrowDown}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													renderValue={(selected) => {
														if (!selected) {
															return <span>اختر الدولة</span>;
														}
														const result = countryList?.data?.countries?.filter((item) => item?.id === parseInt(selected));
														return result[0]?.name;
													}}
												>
													{countryList?.data?.countries?.map((item, idx) => {
														return (
															<MenuItem
																key={idx}
																className='souq_storge_category_filter_items'
																sx={{
																	backgroundColor: 'inherit',
																	height: '3rem',
																	'&:hover': {},
																}}
																value={`${item?.id}`}
															>
																{item?.name}
															</MenuItem>
														);
													})}
												</Select>
											)}
										/>
										<div className='col-12'><span className='fs-6 text-danger'>{customerError?.country_id}{errors?.country_id && errors.country_id.message}</span></div>
									</div>
									<div className='col-md-4 col-12'>
										<label htmlFor='last-name' className='d-block mb-2'>
											الاسم الثاني
										</label>
										<input
											name='last_name'
											type='text'
											id='last-name'
											placeholder='الاسم الثاني'
											{...register('last_name', {
												required: "The last name field is required",
												pattern: {
													value: /^[^-\s][\u0600-\u06FF-A-Za-z ]+$/i,
													message: "The last name must be a string"
												},
											})}
										/>
										<div className='col-12'><span className='fs-6 text-danger'>{customerError?.last_name}{errors?.last_name && errors.last_name.message}</span></div>
									</div>
								</div>

								<div className='row mb-md-4 mb-3 d-flex justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-0'>
										<label htmlFor='email' className='d-block mb-2'>
											البريد الالكتروني
										</label>
										<input
											name='email'
											type='email'
											id='email'
											placeholder='sample@gmail.com'
											{...register('email', {
												required: "The email field is required",
												pattern: {
													value: /\S+@\S+\.\S+/,
													message: "Entered value does not match email format"
												}
											})}
										/>
										<div className='col-12'><span className='fs-6 text-danger'>{customerError?.email}{errors?.email && errors.email.message}</span></div>
									</div>

									<div className='col-md-4 col-12'>
										<label htmlFor='city' className='d-block mb-2'>
											المدينة
										</label>
										<Controller
											name={"city_id"}
											control={control}
											rules={{ required: "The city field is required" }}
											render={({ field: { onChange, value } }) => (
												<Select
													value={value}
													onChange={onChange}
													MenuProps={{
														sx: {
															'& .MuiPaper-root ': {
																height: '350px',
															},
														},
													}}
													sx={{
														width: '100%',
														fontSize: '18px',

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
															border: '1px solid #ededed',
														},
														'& .MuiSelect-icon': {
															right: '90% !important',
														},
													}}
													IconComponent={IoIosArrowDown}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													renderValue={(selected) => {
														if (!selected) {
															return <span>اختر المدينة</span>;
														}
														const result = citiesList?.data?.cities?.filter((item) => item?.id === parseInt(selected));
														return result[0]?.name;
													}}
												>
													{citiesList?.data?.cities?.map((item, idx) => {
														return (
															<MenuItem
																key={idx}
																className='souq_storge_category_filter_items'
																sx={{
																	backgroundColor: 'inherit',
																	height: '3rem',
																	'&:hover': {},
																}}
																value={`${item?.id}`}
															>
																{item?.name}
															</MenuItem>
														);
													})}
												</Select>
											)}
										/>
										<div className='col-12'><span className='fs-6 text-danger'>{customerError?.city_id}{errors?.city_id && errors.city_id.message}</span></div>
									</div>
								</div>

								<div className='row mb-md-4 mb-3 justify-content-between'>
									<div className='col-md-4 col-12 mb-3 mb-md-0'>
										<label htmlFor='phone-number' className='d-block mb-2'>
											رقم الجوال
										</label>
										<input
											name='phonenumber'
											type='text'
											id='phone-number'
											placeholder='رقم الجوال'
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
										<div className='col-12'><span className='fs-6 text-danger'>{customerError?.phonenumber}{errors?.phonenumber && errors.phonenumber.message}</span></div>
									</div>

									<div className='col-md-4 col-12'>
										<label htmlFor='gender' className='d-block mb-2'>
											الجنس
										</label>
										<Controller
											name={"gender"}
											control={control}
											rules={{ required: "The gender field is required" }}
											render={({ field: { onChange, value } }) => (
												<Select
													value={value}
													onChange={onChange}
													sx={{
														width: '100%',
														fontSize: '18px',
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
															border: '1px solid #ededed',
														},
														'& .MuiSelect-icon': {
															right: '90% !important',
														},
													}}
													IconComponent={IoIosArrowDown}
													displayEmpty
													inputProps={{ 'aria-label': 'Without label' }}
													renderValue={(selected) => {
														if (!selected) {
															return <span> الجنس</span>;
														}
														const result = gender?.filter((item) => item?.name_en === selected);
														return result[0]?.name;
													}}
												>
													{gender?.map((item, idx) => {
														return (
															<MenuItem
																key={idx}
																className='souq_storge_category_filter_items'
																sx={{
																	backgroundColor: 'inherit',
																	height: '3rem',
																	'&:hover': {},
																}}
																value={item?.name_en}
															>
																{item?.name}
															</MenuItem>
														);
													})}
												</Select>
											)}
										/>
										<div className='col-12'><span className='fs-6 text-danger'>{customerError?.gender}{errors?.gender && errors.gender.message}</span></div>
									</div>
								</div>
							</div>

							<div className='form-footer'>
								<div className='row d-flex justify-content-center align-items-center'>
									<div className='col-md-4 col-6'>
										<button className='save-btn' type='submit'>
											حفظ
										</button>
									</div>
									<div className='col-md-4 col-6'>
										<button className='close-btn' onClick={() => dispatch(closeCustomerDataModal())}>
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
	);
};

export default AddCustomer;
