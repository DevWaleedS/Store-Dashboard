import React, { useState, useEffect, useContext, Fragment } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useFetch from "../../Hooks/UseFetch";
import Context from "../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { FormControlLabel, Switch } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// icons
import { ReactComponent as DateIcon } from "../../data/Icons/icon-date.svg";
import { ReactComponent as SearchIcon } from "../../data/Icons/icon_24_search.svg";
import { IoIosArrowDown } from "react-icons/io";
import { useCookies } from "react-cookie";
import moment from "moment";
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from "../../Context/LoadingProvider";

// Modal Style
const style = {
	position: "fixed",
	top: "80px",
	left: "0%",
	transform: "translate(0%, 0%)",
	width: "80%",
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

const EditCoupon = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const currentDate = new Date();
	const [cookies] = useCookies(["access_token"]);
	const { fetchedData: categories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);
	const { fetchedData: payments } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/payment_types"
	);
	const { fetchedData: products } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/productImportproduct"
	);
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/coupons/${id}`
	);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [coupon_apply, setCoupon_apply] = useState("");
	const [fixed_serach, setFixed_serach] = useState("");
	const [fixed_products, setFixed_products] = useState([]);
	const [select_product_id, setSelect_product_id] = useState([]);
	const [select_category_id, setSelect_category_id] = useState("");
	const [select_payment_id, setSelect_payment_id] = useState("");
	const [isEnable, setIsEnable] = React.useState();
	const [startDate, setStartDate] = useState();
	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			code: "",
			discount_type: "",
			total_price: "",
			discount: "",
			total_redemptions: "",
			user_redemptions: "",
			free_shipping: 1,
			exception_discount_product: 1,
		},
	});

	const [coupon, setCoupon] = useState({
		code: "",
		discount_type: "",
		total_price: "",
		discount: "",
		total_redemptions: "",
		user_redemptions: "",
		free_shipping: 1,
		exception_discount_product: 1,
	});

	// Errors
	const [startDateError, setStartDateError] = useState("");

	const [couponError, setCouponError] = useState({
		code: "",
		discount_type: "",
		total_price: "",
		discount: "",
		total_redemptions: "",
		user_redemptions: "",
		coupon_apply: "",
	});
	const resetCouponError = () => {
		setStartDateError("");
		setCouponError({
			code: "",
			discount_type: "",
			total_price: "",
			discount: "",
			total_redemptions: "",
			user_redemptions: "",
			coupon_apply: "",
		});
	};
	// --------------------------------------------------------------------------------

	const fixed_products_selected = products?.data?.products?.filter(
		(product) => {
			return select_product_id?.some((ele) => {
				return ele === product?.id;
			});
		}
	);

	// create product search function
	const fixedSearchItems = (value) => {
		setFixed_serach(value);
		const filteredData = products?.data?.products?.filter((item) => {
			return item?.name.includes(value);
		});
		setFixed_products(filteredData);
	};
	// -----------------------------------------------------------------------------

	useEffect(() => {
		setCoupon({
			...coupon,
			code: fetchedData?.data?.Coupons?.code,
			discount_type:
				fetchedData?.data?.Coupons?.discount_type === "مبلغ ثابت"
					? "fixed"
					: "percent",
			total_price: fetchedData?.data?.Coupons?.total_price,
			discount: fetchedData?.data?.Coupons?.discount,
			total_redemptions: fetchedData?.data?.Coupons?.total_redemptions,
			user_redemptions: fetchedData?.data?.Coupons?.user_redemptions,
			free_shipping: +fetchedData?.data?.Coupons?.free_shipping,
			exception_discount_product:
				+fetchedData?.data?.Coupons?.exception_discount_product,
		});

		if (fetchedData?.data?.Coupons?.expire_date) {
			setStartDate(
				moment(fetchedData?.data?.Coupons?.expire_date, "YYYY-MM-DD").toDate()
			);
		} else {
			setStartDate("");
		}

		setCoupon_apply(
			fetchedData?.data?.Coupons?.coupon_apply === "selected_product"
				? "selected_product"
				: fetchedData?.data?.Coupons?.coupon_apply === "selected_category"
				? "selected_category"
				: fetchedData?.data?.Coupons?.coupon_apply === "selected_payment"
				? "selected_payment"
				: fetchedData?.data?.Coupons?.coupon_apply === "all"
				? "all"
				: null
		);
		setIsEnable(fetchedData?.data?.Coupons?.status);
		setSelect_product_id(
			fetchedData?.data?.Coupons?.selected_product?.map(
				(product) => product?.id
			)
		);
		setSelect_category_id(
			fetchedData?.data?.Coupons?.selected_category?.[0]?.id
		);
		setSelect_payment_id(fetchedData?.data?.Coupons?.selected_payment?.[0]?.id);
	}, [fetchedData?.data?.Coupons]);

	useEffect(() => {
		reset(coupon);
	}, [coupon, reset]);

	const changeCouponStatus = () => {
		setLoadingTitle("جاري تغير حالة الكوبون");
		axios
			.get(
				`https://backend.atlbha.com/api/Store/couponchangeSatusall?id[]=${fetchedData?.data?.Coupons?.id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				}
			});
	};

	const updateCoupon = (data) => {
		setLoadingTitle("جاري تعديل الكوبون");
		resetCouponError();
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("code", data?.code);
		formData.append("discount_type", data?.discount_type);
		formData.append("discount", data?.discount);
		formData.append("total_price", data?.total_price);
		formData.append("expire_date", moment(startDate).format("YYYY-MM-DD"));
		formData.append("total_redemptions", data?.total_redemptions);
		formData.append("user_redemptions", data?.user_redemptions);
		formData.append("free_shipping", data?.free_shipping);
		formData.append(
			"exception_discount_product",
			data?.exception_discount_product
		);
		formData.append("coupon_apply", coupon_apply);
		formData.append(
			"select_category_id",
			coupon_apply === "selected_category" ? select_category_id : ""
		);
		formData.append(
			"select_payment_id",
			coupon_apply === "selected_payment" ? select_payment_id : ""
		);

		for (var i = 0; i < fixed_products_selected?.length; i++) {
			formData.append(
				`select_product_id[${i}]`,
				coupon_apply === "selected_product" ? select_product_id?.[i] : ""
			);
		}
		formData.append("status", isEnable === true ? "active" : "not_active");
		axios
			.post(
				`https://backend.atlbha.com/api/Store/coupons/${fetchedData?.data?.Coupons?.id}`,
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
					navigate("/Coupon");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setReload(!reload);
					setCouponError({
						...couponError,
						code: res?.data?.message?.en?.code?.[0],
						discount_type: res?.data?.message?.en?.discount_type?.[0],
						total_price: res?.data?.message?.en?.total_price?.[0],
						discount: res?.data?.message?.en?.discount?.[0],
						total_redemptions: res?.data?.message?.en?.total_redemptions?.[0],
						user_redemptions: res?.data?.message?.en?.user_redemptions?.[0],
						coupon_apply: res?.data?.message?.en?.coupon_apply?.[0],
					});
					setStartDateError(res?.data?.message?.en?.expire_date?.[0]);
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل كوبون</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Coupon")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='add-form-wrapper add-coupon-form coupon-details'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title  '>
										<h5 className='mb-3'>تفاصيل الكوبون</h5>
										<p> تعديل واستعراض بيانات الكوبون</p>
									</div>
								</div>
							</div>
							{loading ? (
								<div className='pt-md-5'>
									<CircularLoading />
								</div>
							) : (
								<>
									<div className='coupon-status-wrapper pt-md-5 d-flex justify-content-md-start justify-content-center'>
										<div className='col-md-5 col-12'>
											{isEnable === "نشط" ? (
												<div className='coupon-status active'>{isEnable}</div>
											) : isEnable === "غير نشط" ? (
												<Fragment>
													<div className='coupon-status pending'>
														{isEnable}
													</div>
													<button
														type='button'
														className='enable-coupon-btn'
														onClick={() => changeCouponStatus()}>
														إعادة تفعيل الكوبون
													</button>
												</Fragment>
											) : moment(
													fetchedData?.data?.Coupons?.expire_date,
													"YYYY-MM-DD"
											  ).toDate() < currentDate ? (
												<Fragment>
													<div className='coupon-status disabled'>منتهي</div>
												</Fragment>
											) : (
												""
											)}
										</div>
									</div>
									<form
										onSubmit={handleSubmit(updateCoupon)}
										className={isEnable === "غير نشط" ? "disabled" : ""}>
										<div className='form-body'>
											<div className='row mb-md-5 d-flex  justify-content-evenly'>
												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label htmlFor='coupon-name' className='d-block mb-1'>
														كود الكوبون<span className='text-danger'>*</span>
													</label>
													<input
														type='text'
														id='coupon-code'
														placeholder='ادخل كود الكوبون'
														name='code'
														disabled={isEnable === "نشط" ? false : true}
														{...register("code", {
															required: "حقل الكود مطلوب",
															pattern: {
																value: /^[A-Za-z0-9]+$/i,
																message:
																	"صيغة الحقل الكود غير صحيحة(يجب ان يكون من حروف انجليزيه او حروف انجليزيه وارقام او ارقام)",
															},
														})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.code}
															{errors?.code && errors.code.message}
														</span>
													</div>
												</div>
												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label htmlFor='uses-count' className='d-block mb-1'>
														عدد مرات الاستخدام للجميع
														<span className='text-danger'>*</span>
													</label>
													<input
														type='number'
														id='uses-count'
														placeholder='  عدد مرات استخدام الكوبون لجميع العملاء'
														name='total_redemptions'
														disabled={isEnable === "نشط" ? false : true}
														{...register("total_redemptions", {
															required: "حقل عدد مرات الاستخدام للجميع مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message:
																	"يجب على الحقل عدد مرات الاستخدام للجميع أن يكون رقمًا",
															},
															min: {
																value: 1,
																message:
																	"  عدد مرات الاستخدام للجميع يجب ان يكون اكبر من 0",
															},
														})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.total_redemptions}
															{errors?.total_redemptions &&
																errors.total_redemptions.message}
														</span>
													</div>
												</div>
											</div>
											<div className='row mb-md-5 d-flex justify-content-evenly align-items-end'>
												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label
														htmlFor='coupon-name '
														className='d-block mb-1'>
														نوع الخصم<span className='text-danger'>*</span>
													</label>
													<Controller
														name={"discount_type"}
														control={control}
														rules={{ required: "حقل نوع الخصم مطلوب" }}
														render={({ field: { onChange, value } }) => (
															<RadioGroup
																className='d-flex flex-row mb-1'
																aria-labelledby='demo-controlled-radio-buttons-group'
																value={value}
																onChange={onChange}
																name='discount_type'
																disabled={isEnable === "نشط" ? false : true}>
																<div className='radio-box'>
																	<FormControlLabel
																		value='percent'
																		id='percent-price'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			value === "percent"
																				? "me-3"
																				: "disabled me-3"
																		}
																		htmlFor='percent-price'>
																		نسبة مئوية %
																	</label>
																</div>
																<div className='radio-box'>
																	<FormControlLabel
																		value='fixed'
																		id='fixed-price'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			value === "fixed"
																				? "me-3"
																				: "disabled me-3"
																		}
																		htmlFor='fixed-price'>
																		مبلغ ثابت
																	</label>
																</div>

																<div className='col-12'>
																	<span className='fs-6 text-danger'>
																		{couponError?.discount_type}
																		{errors?.discount_type &&
																			errors.discount_type.message}
																	</span>
																</div>
															</RadioGroup>
														)}
													/>
													<div>
														<input
															type='number'
															id='add-ptice'
															placeholder=' ادخل المبلغ او الخصم'
															name='discount'
															disabled={isEnable === "نشط" ? false : true}
															{...register("discount", {
																required: "حقل الخصم مطلوب",
																pattern: {
																	value: /^[0-9]+$/i,
																	message: "يجب على الحقل الخصم أن يكون رقمًا",
																},
																min: {
																	value: 1,
																	message: "  الخصم يجب ان يكون اكبر من 0",
																},
															})}
														/>
													</div>

													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.discount}
															{errors?.discount && errors.discount.message}
														</span>
													</div>
												</div>

												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label htmlFor='user-count' className='d-block mb-1'>
														عدد مرات الاستخدام للزبون الواحد
														<span className='text-danger'>*</span>
													</label>
													<input
														type='number'
														name='user_redemptions'
														id='user-count'
														placeholder='  عدد مرات استخدام الكوبون للعميل الواحد'
														disabled={isEnable === "نشط" ? false : true}
														{...register("user_redemptions", {
															required:
																"حقل عدد مرات الاستخدام للعميل الواحد مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message:
																	"   عدد مرات الاستخدام للعميل الواحد يجب أن يكون رقمًا",
															},
															min: {
																value: 1,
																message:
																	"  عدد مرات الاستخدام للعميل الواحد يجب ان يكون اكبر من 0",
															},
														})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.user_redemptions}
															{errors?.user_redemptions &&
																errors.user_redemptions.message}
														</span>
													</div>
												</div>
											</div>
											<div className='row mb-md-5 d-flex justify-content-evenly'>
												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label
														htmlFor='coupon-name '
														className='d-block mb-1'>
														تاريخ الانتهاء<span className='text-danger'>*</span>
													</label>
													<div className='date-icon'>
														<DateIcon />
													</div>
													<DatePicker
														minDate={moment().toDate()}
														selected={startDate}
														placeholderText='30/Sep/2022'
														onChange={(date) => setStartDate(date)}
														dateFormat='yyyy-MM-dd'
														disabled={isEnable === "نشط" ? false : true}
													/>
												</div>
												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label htmlFor='user-count' className='d-block mb-1'>
														شحن مجاني<span className='text-danger'>*</span>
													</label>
													<Controller
														name={"free_shipping"}
														control={control}
														rules={{ required: "حقل شحن مجاني مطلوب" }}
														render={({ field: { onChange, value } }) => (
															<RadioGroup
																className='d-flex flex-row'
																aria-labelledby='demo-controlled-radio-buttons-group'
																value={value}
																onChange={onChange}
																name='free_shipping'
																disabled={isEnable === "نشط" ? false : true}>
																<div className='radio-box '>
																	<FormControlLabel
																		value={1}
																		id='accept-free-shipping'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			value === "1" ? "me-3" : "disabled me-3"
																		}
																		htmlFor='accept-free-shipping'>
																		نعم
																	</label>
																</div>
																<div className='radio-box '>
																	<FormControlLabel
																		value={0}
																		id='no-free-shipping'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			value === "0" ? "me-3" : "disabled me-3"
																		}
																		htmlFor='no-free-shipping'>
																		لا
																	</label>
																</div>
															</RadioGroup>
														)}
													/>
												</div>
											</div>
											<div className='row mb-md-5 d-flex justify-content-evenly'>
												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label
														htmlFor='coupon-name '
														className='d-block mb-1'>
														الحد الأدنى من المشتريات
														<span className='text-danger'>*</span>
													</label>
													<input
														type='number'
														name='total_price'
														id='add-ptice'
														placeholder=' ادخل مبلغ الحد الأدني من المشتريات'
														disabled={isEnable === "نشط" ? false : true}
														{...register("total_price", {
															required: "حقل المبلغ مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message: "يجب على الحقل المبلغ أن يكون رقمًا",
															},
															min: {
																value: 1,
																message: "  المبلغ يجب ان يكون اكبر من 0",
															},
														})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.total_price}
															{errors?.total_price &&
																errors.total_price.message}
														</span>
													</div>
												</div>

												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<label htmlFor='user-count' className='d-block mb-1'>
														استثناء المنتجات المخفضة
														<span className='text-danger'>*</span>
													</label>
													<Controller
														name={"exception_discount_product"}
														control={control}
														rules={{
															required: "حقل استثناء المنتجات المخفضة مطلوب",
														}}
														render={({ field: { onChange, value } }) => (
															<RadioGroup
																className='d-flex flex-row'
																aria-labelledby='demo-controlled-radio-buttons-group'
																value={value}
																onChange={onChange}
																name='exception_discount_product'
																disabled={isEnable === "نشط" ? false : true}>
																<div className='radio-box '>
																	<FormControlLabel
																		value={1}
																		id='accept-lower-product'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			value === "1" ? "me-3" : "disabled me-3"
																		}
																		htmlFor='accept-lower-product'>
																		المنتجات المخفضة
																	</label>
																</div>
																<div className='radio-box '>
																	<FormControlLabel
																		value={0}
																		id='no-lower-product'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			value === "0" ? "me-3" : "disabled me-3"
																		}
																		htmlFor='no-lower-product'>
																		المنتجات الغير مخفضة
																	</label>
																</div>
															</RadioGroup>
														)}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.exception_discount_product}
															{errors?.code && errors.code.message}
														</span>
													</div>
												</div>
											</div>
											<div className='row mb-md-5 d-flex justify-content-evenly'>
												<div className='col-md-5 col-12 mb-md-0 mb-3'>
													<div className='row mb-md-4 mb-3 d-flex justify-content-evenly'>
														<div className='col-12'>
															<div className='row-title mb-2'>
																<h4 className='mb-2'>
																	يتم تطبيق العرض على
																	<span className='text-danger'>*</span>
																</h4>
																<p>اختر واحد من الخيارات التالية</p>
															</div>
															<RadioGroup
																disabled={isEnable === "نشط" ? false : true}
																aria-labelledby='demo-controlled-radio-buttons-group'
																name='coupon_apply'
																value={coupon_apply}
																onChange={(e) => {
																	setCoupon_apply(e.target.value);
																}}>
																<div className='radio-box'>
																	<FormControlLabel
																		value='all'
																		id='all'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			coupon_apply === "all"
																				? " me-3"
																				: "disabled me-3"
																		}
																		htmlFor='all'>
																		جميع المنتجات
																	</label>
																</div>
																<div className='radio-box select-apply-offer'>
																	<FormControlLabel
																		value='selected_product'
																		id='selected_product'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			coupon_apply === "selected_product"
																				? " me-3"
																				: "disabled me-3"
																		}
																		htmlFor='selected_product'>
																		منتجات مختارة
																	</label>
																</div>
																<div className='radio-box select-apply-offer'>
																	<FormControlLabel
																		value='selected_category'
																		id='selected_category'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			coupon_apply === "selected_category"
																				? " me-3"
																				: "disabled me-3"
																		}
																		htmlFor='selected_category'>
																		تصنيفات مختارة
																	</label>
																</div>
																<div className='radio-box select-apply-offer'>
																	<FormControlLabel
																		value='selected_payment'
																		id='selected_payment'
																		control={<Radio />}
																		disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			coupon_apply === "selected_payment"
																				? " me-3"
																				: "disabled me-3"
																		}
																		htmlFor='selected_payment'>
																		طرق دفع مختارة
																	</label>
																</div>
															</RadioGroup>
															<div className='col-12'>
																{couponError?.coupon_apply && (
																	<span className='fs-6 text-danger'>
																		{couponError?.coupon_apply}
																	</span>
																)}
															</div>
														</div>
													</div>
													{coupon_apply === "selected_product" && (
														<div className=''>
															<div className='col-12'>
																<div className='input-icon'>
																	<SearchIcon className='search-icon' />
																</div>
																<input
																	disabled={isEnable === "نشط" ? false : true}
																	style={{ paddingRight: "38px" }}
																	value={fixed_serach}
																	onChange={(e) =>
																		fixedSearchItems(e.target.value)
																	}
																	type='text'
																	placeholder='البحث في المنتجات'
																/>
																<div className='col-12'>
																	{couponError?.select_product_id && (
																		<span className='fs-6 text-danger'>
																			{couponError?.select_product_id}
																		</span>
																	)}
																</div>
															</div>
															{fixed_serach !== "" && (
																<ul className='purchase_serach'>
																	{fixed_products?.map((item, index) => (
																		<li
																			key={index}
																			value={select_product_id}
																			onClick={() => {
																				if (
																					!select_product_id.includes(item?.id)
																				) {
																					setSelect_product_id([
																						...select_product_id,
																						item?.id,
																					]);
																				}
																				fixedSearchItems("");
																			}}>
																			{item?.name}
																		</li>
																	))}
																</ul>
															)}
															{fixed_products_selected?.length !== 0 && (
																<ul className='purchase_products_selected'>
																	{fixed_products_selected?.map(
																		(item, index) => (
																			<li key={index}>_ {item?.name}</li>
																		)
																	)}
																</ul>
															)}
														</div>
													)}
													{coupon_apply === "selected_category" && (
														<div className='col-12 mb-4'>
															<FormControl sx={{ m: 0, width: "100%" }}>
																<Select
																	disabled={isEnable === "نشط" ? false : true}
																	name='select_category_id'
																	value={select_category_id}
																	onChange={(e) => {
																		setSelect_category_id(e.target.value);
																	}}
																	sx={{
																		fontSize: "18px",
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
																			border: "1px solid #eeeeee",
																		},
																		"& .MuiSelect-icon": {
																			right: "95%",
																		},
																	}}
																	IconComponent={IoIosArrowDown}
																	displayEmpty
																	inputProps={{ "aria-label": "Without label" }}
																	renderValue={(selected) => {
																		if (select_category_id === undefined) {
																			return (
																				<p className='text-[#ADB5B9]'>
																					اختر التصنيف
																				</p>
																			);
																		}
																		const result =
																			categories?.data?.categories?.filter(
																				(item) =>
																					item?.id === parseInt(selected)
																			) || "";
																		return result[0]?.name;
																	}}>
																	{categories?.data?.categories?.map(
																		(cat, index) => {
																			return (
																				<MenuItem
																					key={index}
																					className='souq_storge_category_filter_items'
																					sx={{
																						backgroundColor: "#fff",
																						height: "3rem",
																						"&:hover": {},
																					}}
																					value={cat?.id}>
																					{cat?.name}
																				</MenuItem>
																			);
																		}
																	)}
																</Select>
															</FormControl>
															<div className='col-12'>
																{couponError?.select_category_id && (
																	<span className='fs-6 text-danger'>
																		{couponError?.select_category_id}
																	</span>
																)}
															</div>
														</div>
													)}
													{coupon_apply === "selected_payment" && (
														<div className='col-12 mb-4'>
															<FormControl sx={{ m: 0, width: "100%" }}>
																<Select
																	disabled={isEnable === "نشط" ? false : true}
																	name='select_payment_id'
																	value={select_payment_id}
																	onChange={(e) => {
																		setSelect_payment_id(e.target.value);
																	}}
																	sx={{
																		fontSize: "18px",
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
																			border: "1px solid #eeeeee",
																		},
																		"& .MuiSelect-icon": {
																			right: "95%",
																		},
																	}}
																	IconComponent={IoIosArrowDown}
																	displayEmpty
																	inputProps={{ "aria-label": "Without label" }}
																	renderValue={(selected) => {
																		if (select_payment_id === undefined) {
																			return (
																				<p className='text-[#ADB5B9]'>
																					اختر طريقة الدفع
																				</p>
																			);
																		}
																		const result =
																			payments?.data?.payment_types?.filter(
																				(item) =>
																					item?.id === parseInt(selected)
																			) || "";
																		return result[0]?.name;
																	}}>
																	{payments?.data?.payment_types?.map(
																		(payment, index) => {
																			return (
																				<MenuItem
																					key={index}
																					className='souq_storge_category_filter_items'
																					sx={{
																						backgroundColor: "#fff",
																						height: "3rem",
																						"&:hover": {},
																					}}
																					value={payment?.id}>
																					{payment?.name}
																				</MenuItem>
																			);
																		}
																	)}
																</Select>
															</FormControl>
															<div className='col-12'>
																{couponError?.select_payment_id && (
																	<span className='fs-6 text-danger'>
																		{couponError?.select_payment_id}
																	</span>
																)}
															</div>
														</div>
													)}
												</div>
												<div className='col-md-5 col-12 mb-md-0 mb-3 enable-switches'>
													<label htmlFor='user-count' className='d-block mb-1'>
														الحالة<span className='text-danger'>*</span>
													</label>
													<Switch
														onClick={() => setIsEnable(!isEnable)}
														checked={isEnable}
														disabled={isEnable === "نشط" ? false : true}
														sx={{
															width: "50px",
															"& .MuiSwitch-track": {
																width: 26,
																height: 14,
																opacity: 1,
																backgroundColor: "rgba(0,0,0,.25)",
																boxSizing: "border-box",
															},
															"& .MuiSwitch-thumb": {
																boxShadow: "none",
																width: 10,
																height: 10,
																borderRadius: 5,
																transform: "translate(6px,6px)",
																color: "#fff",
															},

															"&:hover": {
																"& .MuiSwitch-thumb": {
																	boxShadow: "none",
																},
															},

															"& .MuiSwitch-switchBase": {
																padding: 1,
																"&.Mui-checked": {
																	transform: "translateX(11px)",
																	color: "#fff",
																	"& + .MuiSwitch-track": {
																		opacity: 1,
																		backgroundColor: "#3AE374",
																	},
																},
															},
														}}
													/>
													<span
														className={`${isEnable ? "" : "disabled"} me-2`}>
														تفعيل /{" "}
													</span>
													<span className={isEnable ? "disabled" : ""}>
														{" "}
														تعطيل
													</span>
												</div>
											</div>
										</div>

										<div className='form-footer'>
											<div className='row d-flex justify-content-center align-items-center'>
												<div
													className={
														isEnable === "غير نشط"
															? "d-none "
															: "col-md-4 col-6"
													}>
													<button className='save-btn' type='submit'>
														حفظ
													</button>
												</div>
												<div className='col-md-4 col-6'>
													<button
														type='button'
														className='close-btn'
														onClick={() => navigate("/Coupon")}>
														إغلاق
													</button>
												</div>
											</div>
										</div>
									</form>
								</>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default EditCoupon;
