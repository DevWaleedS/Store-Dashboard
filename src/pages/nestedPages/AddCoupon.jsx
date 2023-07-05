import React, { useContext, useState } from 'react';
import { Helmet } from "react-helmet";
import axios from 'axios';
import Context from '../../Context/context';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
// MUI
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import { FormControlLabel, Switch } from '@mui/material';
// Datepicker
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
// icons
import { ReactComponent as DateIcon } from '../../data/Icons/icon-date.svg';
// Modal Style
import moment from 'moment';
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from '../../Context/LoadingProvider';

const style = {
	position: 'fixed',
	top: '80px',
	left: '0%',
	transform: 'translate(0%, 0%)',
	width: '80%',
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

const AddCoupon = () => {
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
			code: '',
			discount_type: '',
			total_price: '',
			discount: '',
			total_redemptions: '',
			user_redemptions: '',
			free_shipping: 1,
			exception_discount_product: 1,
		}
	});
	const [isEnable, setIsEnable] = useState(true);
	const [couponError, setCouponError] = useState({
		code: '',
		discount_type: '',
		total_price: '',
		discount: '',
		total_redemptions: '',
		user_redemptions: '',
	});
	const [startDateError, setStartDateError] = useState('');

	//to set date
	const [startDate, setStartDate] = useState();

	const resetCouponError = () => {
		setCouponError({
			code: '',
			discount_type: '',
			total_price: '',
			discount: '',
			total_redemptions: '',
			user_redemptions: '',
		});
		setStartDateError('');
	};

	const addNewCoupon = (data) => {
		setLoadingTitle('جاري اضافة الكوبون');
		resetCouponError();
		let formData = new FormData();
		formData.append('code', data?.code);
		formData.append('discount_type', data?.discount_type);
		formData.append('discount', data?.discount);
		formData.append('total_price', data?.total_price);
		formData.append('expire_date', moment(startDate).format('YYYY-MM-DD'));
		formData.append('total_redemptions', data?.total_redemptions);
		formData.append('user_redemptions', data?.user_redemptions);
		formData.append('free_shipping', data?.free_shipping);
		formData.append('exception_discount_product', data?.exception_discount_product);
		formData.append('status', isEnable === true ? 'active' : 'not_active');
		axios
			.post(`https://backend.atlbha.com/api/Store/coupons`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Coupon');
					setReload(!reload);
				} else {
					setLoadingTitle('');
					setReload(!reload);
					setCouponError({
						...couponError,
						code: res?.data?.message?.en?.code?.[0],
						discount_type: res?.data?.message?.en?.discount_type?.[0],
						total_price: res?.data?.message?.en?.total_price?.[0],
						discount: res?.data?.message?.en?.discount?.[0],
						total_redemptions: res?.data?.message?.en?.total_redemptions?.[0],
						user_redemptions: res?.data?.message?.en?.user_redemptions?.[0],
					});
					setStartDateError(res?.data?.message?.en?.expire_date?.[0]);
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | اضافة كوبون</title>
			</Helmet>
			<div className='' open={true}>
				<Modal open={true} onClose={() => navigate('/Coupon')} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='add-form-wrapper add-coupon-form'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> تفاصيل الكوبون</h5>
										<p>اضافة كوبون جديد</p>
									</div>
								</div>
							</div>

							<form onSubmit={handleSubmit(addNewCoupon)}>
								<div className='form-body'>
									<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='coupon-name' className='d-block mb-1'>
												كود الكوبون
											</label>
											<input
												type='text'
												id='coupon-code'
												placeholder='ادخل كود الكوبون'
												name='code'
												{...register('code', {
													required: "The code field is required",
													pattern: {
														value: /^[A-Za-z0-9]+$/i,
														message: "The code must be a English letter and number"
													},
												})}
											/>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.code}{errors?.code && errors.code.message}</span></div>
										</div>
										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='uses-count' className='d-block mb-1'>
												عدد مرات الاستخدام للجميع
											</label>
											<input
												type='number'
												id='uses-count'
												placeholder='  عدد مرات استخدام الكوبون لجميع العملاء'
												name='total_redemptions'
												{...register('total_redemptions', {
													required: "The total redemptions field is required",
													pattern: {
														value: /^[0-9]+$/i,
														message: "The total redemptions must be a number"
													},
													min: {
														value: 1,
														message: "The total redemptions must be greater than 0"
													},
												})}
											/>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.total_redemptions}{errors?.total_redemptions && errors.total_redemptions.message}</span></div>
										</div>
									</div>
									<div className='row mb-md-5 mb-3 d-flex justify-content-evenly align-items-end'>
										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='coupon-name ' className='d-block mb-1'>
												نوع الخصم
											</label>
											<Controller
												name={"discount_type"}
												control={control}
												rules={{ required: "The discount type field is required" }}
												render={({ field: { onChange, value } }) => (
													<RadioGroup
														className='d-flex flex-row mb-1'
														aria-labelledby='demo-controlled-radio-buttons-group'
														value={value}
														onChange={onChange}
													>
														<div className='radio-box '>
															<FormControlLabel value='percent' id='percent-price' control={<Radio />} />
															<label className={value === 'percent' ? 'me-3' : 'disabled me-3'} htmlFor='percent-price'>
																نسبة مئوية %
															</label>
														</div>
														<div className='radio-box '>
															<FormControlLabel value='fixed' id='fixed-price' control={<Radio />} />
															<label className={value === 'fixed' ? 'me-3' : 'disabled me-3'} htmlFor='fixed-price'>
																مبلغ ثابت SAR
															</label>
														</div>
													</RadioGroup>
												)}
											/>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.discount_type}{errors?.discount_type && errors.discount_type.message}</span></div>
											<input
												type='number'
												id='add-ptice'
												placeholder=' ادخل النسبة او المبلغ'
												name='discount'
												{...register('discount', {
													required: "The discount field is required",
													pattern: {
														value: /^[0-9]+$/i,
														message: "The discount must be a number"
													},
													min: {
														value: 1,
														message: "The discount must be greater than 0"
													},
												})}
											/>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.discount}{errors?.discount && errors.discount.message}</span></div>
										</div>

										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='user-count' className='d-block mb-1'>
												عدد مرات الاستخدام للزبون الواحد
											</label>
											<input
												type='number'
												id='user-count'
												placeholder='  عدد مرات استخدام الكوبون للعميل الواحد'
												name='user_redemptions'
												{...register('user_redemptions', {
													required: "The user redemptions field is required",
													pattern: {
														value: /^[0-9]+$/i,
														message: "The user redemptions must be a number"
													},
													min: {
														value: 1,
														message: "The user redemptions must be greater than 0"
													},
												})}
											/>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.user_redemptions}{errors?.user_redemptions && errors.user_redemptions.message}</span></div>
										</div>
									</div>
									<div className='row row mb-md-5 mb-3 d-flex justify-content-evenly'>
										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='coupon-name ' className='d-block mb-1'>
												تاريخ الانتهاء
											</label>
											<div className='date-icon'>
												<DateIcon />
											</div>
											<DatePicker minDate={moment().toDate()} selected={startDate} placeholderText='30/Sep/2022' onChange={(date) => setStartDate(date)} dateFormat='yyyy-MM-dd' />
											<div className='col-12'>{startDateError && <span className='fs-6 text-danger'>{startDateError}</span>}</div>
										</div>

										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='user-count' className='d-block mb-1'>
												شحن مجاني
											</label>
											<Controller
												name={"free_shipping"}
												control={control}
												rules={{ required: "The free shipping field is required" }}
												render={({ field: { onChange, value } }) => (
													<RadioGroup
														className='d-flex flex-row'
														aria-labelledby='demo-controlled-radio-buttons-group'
														value={value}
														onChange={onChange}
													>
														<div className='radio-box '>
															<FormControlLabel value={1} id='accept-free-shipping' control={<Radio />} />
															<label className={value === '1' ? 'me-3' : 'disabled me-3'} htmlFor='accept-free-shipping'>
																نعم
															</label>
														</div>
														<div className='radio-box '>
															<FormControlLabel value={0} id='no-free-shipping' control={<Radio />} />
															<label className={value === '0' ? 'me-3' : 'disabled me-3'} htmlFor='no-free-shipping'>
																لا
															</label>
														</div>
													</RadioGroup>
												)}
											/>
										</div>
										<div className='col-12'><span className='fs-6 text-danger'>{couponError?.free_shipping}{errors?.free_shipping && errors.free_shipping.message}</span></div>
									</div>
									<div className='row row mb-md-5 d-flex justify-content-evenly'>
										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='coupon-name ' className='d-block mb-1'>
												الحد الأدنى من المشتريات SAR
											</label>
											<input
												type='number'
												id='add-ptice'
												placeholder='ادخل مبلغ الحد الأدني من المشتريات'
												name='total_price'
												{...register('total_price', {
													required: "The total price field is required",
													pattern: {
														value: /^[0-9]+$/i,
														message: "The total price must be a number"
													},
													min: {
														value: 1,
														message: "The total price must be greater than 0"
													},
												})}
											/>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.total_price}{errors?.total_price && errors.total_price.message}</span></div>
										</div>

										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<label htmlFor='user-count' className='d-block mb-1'>
												استثناء المنتجات المخفضة
											</label>
											<Controller
												name={"exception_discount_product"}
												control={control}
												rules={{ required: "The exception discount product field is required" }}
												render={({ field: { onChange, value } }) => (
													<RadioGroup
														className='d-flex flex-row'
														aria-labelledby='demo-controlled-radio-buttons-group'
														value={value}
														onChange={onChange}
													>
														<div className='radio-box '>
															<FormControlLabel value={1} id='accept-lower-product' control={<Radio />} />
															<label className={value === '1' ? 'me-3' : 'disabled me-3'} htmlFor='accept-lower-product'>
																نعم
															</label>
														</div>
														<div className='radio-box '>
															<FormControlLabel value={0} id='no-lower-product' control={<Radio />} />
															<label className={value === '0' ? 'me-3' : 'disabled me-3'} htmlFor='no-lower-product'>
																لا
															</label>
														</div>
													</RadioGroup>
												)}
											/>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.exception_discount_product}{errors?.exception_discount_product && errors.exception_discount_product.message}</span></div>
										</div>
									</div>
									<div className='row row mb-md-5 d-flex justify-content-evenly'>
										<div className='col-md-5 col-12 mb-md-0 mb-3'></div>
										<div className='col-md-5 col-12 mb-md-0 mb-3 enable-switches'>
											<label htmlFor='user-count' className='d-block mb-1'>
												الحالة
											</label>
											<Switch
												onClick={() => setIsEnable(!isEnable)}
												checked={isEnable}
												sx={{
													width: '50px',
													'& .MuiSwitch-track': {
														width: 26,
														height: 14,
														opacity: 1,
														backgroundColor: 'rgba(0,0,0,.25)',
														boxSizing: 'border-box',
													},
													'& .MuiSwitch-thumb': {
														boxShadow: 'none',
														width: 10,
														height: 10,
														borderRadius: 5,
														transform: 'translate(6px,6px)',
														color: '#fff',
													},

													'&:hover': {
														'& .MuiSwitch-thumb': {
															boxShadow: 'none',
														},
													},

													'& .MuiSwitch-switchBase': {
														padding: 1,
														'&.Mui-checked': {
															transform: 'translateX(11px)',
															color: '#fff',
															'& + .MuiSwitch-track': {
																opacity: 1,
																backgroundColor: '#3AE374',
															},
														},
													},
												}}
											/>
											<span className={`${isEnable ? '' : 'disabled'} me-2`}>تفعيل / </span>
											<span className={isEnable ? 'disabled' : ''}> تعطيل</span>
											<div className='col-12'><span className='fs-6 text-danger'>{couponError?.exception_discount_product}{errors?.exception_discount_product && errors.exception_discount_product.message}</span></div>
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
											<button className='close-btn' onClick={() => navigate('/Coupon')}>
												إغلاق
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

export default AddCoupon;
