import React, { useState, useEffect, useContext, Fragment } from "react";

// Third party
import moment from "moment";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

// Helpers
import { CircularLoading } from "../../HelperComponents";

// Context
import { LoadingContext } from "../../Context/LoadingProvider";

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import { FormControlLabel, Switch } from "@mui/material";

// icons
import { IoIosArrowDown } from "react-icons/io";
import { ReactComponent as DateIcon } from "../../data/Icons/icon-date.svg";
import { ReactComponent as SearchIcon } from "../../data/Icons/icon_24_search.svg";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

// Rtk query
import {
	useGetCouponByIdQuery,
	useEditCouponByIdMutation,
	useChangeCouponStatusMutation,
} from "../../store/apiSlices/couponApi";
import { useGetPaymentsTypesQuery } from "../../store/apiSlices/selectorsApis/selectPaymentsTypesApi";
import { useGetImportProductsQuery } from "../../store/apiSlices/selectorsApis/selectImportProductsApi";
import { useSelectCategoriesQuery } from "../../store/apiSlices/categoriesApi";

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

const switchStyle = {
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
};

const selectStyle = {
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
};

const EditCoupon = () => {
	// Selectors Rtk
	const { id } = useParams();
	const { data: selectCategories } = useSelectCategoriesQuery({
		is_service: 0,
	});
	const { data: selectPayments } = useGetPaymentsTypesQuery();
	const { data: selectProducts } = useGetImportProductsQuery();

	// get current coupon by id
	const { data: currentCoupon, isFetching } = useGetCouponByIdQuery(id);

	const navigate = useNavigate();
	const currentDate = new Date();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [coupon_apply, setCoupon_apply] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [filteredProducts, setFilteredProducts] = useState([]);
	const [selectedProductIds, setSelectProductId] = useState([]);
	const [selectedProducts, setSelectedProducts] = useState([]);
	const [select_category_id, setSelect_category_id] = useState("");
	const [select_payment_id, setSelect_payment_id] = useState("");
	const [isEnable, setIsEnable] = useState(true);
	const [startDate, setStartDate] = useState("");
	const [activeCoupon, setActiveCoupon] = useState(false);

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

	/**
	 * ---------------------------------------------------------------------------------
	 * Errors
	 * ---------------------------------------------------------------------------------
	 */
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

	useEffect(() => {
		reset(coupon);
	}, [coupon, reset]);

	/**
	 * ---------------------------------------------------------------------------------
	 * get products
	 * ---------------------------------------------------------------------------------
	 */

	const handleSearch = (event) => {
		const value = event.target.value;
		setSearchTerm(value);

		const filtered = selectProducts.filter((product) =>
			product.name.toLowerCase().includes(value.toLowerCase())
		);
		setFilteredProducts(filtered);
	};

	const handleProductSelect = (productId) => {
		setSelectProductId((prevSelectedIds) =>
			prevSelectedIds?.includes(productId)
				? prevSelectedIds?.filter((id) => id !== productId)
				: [...prevSelectedIds, productId]
		);

		// Add the selected product to the list of selected products
		const selectedProduct = selectProducts?.find(
			(product) => product?.id === productId
		);
		setSelectedProducts((prevSelectedProducts) =>
			prevSelectedProducts?.some(
				(product) => product?.id === selectedProduct?.id
			)
				? prevSelectedProducts
				: [...prevSelectedProducts, selectedProduct]
		);
	};

	/**
	 * ---------------------------------------------------------------------------------
	 * to add coupon data to inputs
	 * ---------------------------------------------------------------------------------
	 */
	useEffect(() => {
		setCoupon({
			...coupon,
			code: currentCoupon?.code,
			discount_type:
				currentCoupon?.discount_type === "مبلغ ثابت" ? "fixed" : "percent",
			total_price: currentCoupon?.total_price,
			discount: currentCoupon?.discount,
			total_redemptions: currentCoupon?.total_redemptions,
			user_redemptions: currentCoupon?.user_redemptions,
			free_shipping: +currentCoupon?.free_shipping,
			exception_discount_product: +currentCoupon?.exception_discount_product,
		});

		if (currentCoupon?.expire_date) {
			setStartDate(moment(currentCoupon?.expire_date, "YYYY-MM-DD").toDate());
		} else {
			setStartDate("");
		}

		setCoupon_apply(
			currentCoupon?.coupon_apply === "selected_product"
				? "selected_product"
				: currentCoupon?.coupon_apply === "selected_category"
				? "selected_category"
				: currentCoupon?.coupon_apply === "selected_payment"
				? "selected_payment"
				: currentCoupon?.coupon_apply === "all"
				? "all"
				: null
		);

		setSelectedProducts(currentCoupon?.selected_product?.data || []);

		setSelect_category_id(currentCoupon?.selected_category?.[0]?.id);

		setIsEnable(currentCoupon?.status);

		setSelect_payment_id(currentCoupon?.selected_payment?.[0]?.id);
	}, [currentCoupon]);

	/** change Coupon Status Function  */
	const [changeCouponStatus] = useChangeCouponStatusMutation();
	const handleChangeCouponStatus = async () => {
		try {
			await changeCouponStatus({ couponId: currentCoupon?.id })
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					}
				});
		} catch (err) {
			console.error("Failed to delete the changeCouponStatus", err);
		}
	};

	/**
	 * ---------------------------------------------------------------------------------
	 * update Coupon Function
	 * ---------------------------------------------------------------------------------
	 */

	const [editCouponById] = useEditCouponByIdMutation();
	const handleEditCoupon = async (data) => {
		setLoadingTitle("جاري تعديل كود الخصم");
		resetCouponError();

		// data that send to api...
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("code", data?.code);
		formData.append("discount_type", data?.discount_type);
		formData.append("discount", data?.discount);
		formData.append("total_price", data?.total_price);
		formData.append(
			"expire_date",
			startDate ? moment(startDate).format("YYYY-MM-DD") : ""
		);
		formData.append("total_redemptions", data?.total_redemptions);
		formData.append("user_redemptions", data?.user_redemptions);
		formData.append("free_shipping", data?.free_shipping);
		// formData.append(
		// 	"exception_discount_product",
		// 	data?.exception_discount_product
		// );

		formData.append("coupon_apply", coupon_apply);
		// formData.append(
		// 	"select_category_id",
		// 	coupon_apply === "selected_category" ? select_category_id : ""
		// );
		// formData.append(
		// 	"select_payment_id",
		// 	coupon_apply === "selected_payment" ? select_payment_id : ""
		// );

		selectedProducts?.forEach((product, idx) => {
			formData.append(
				`select_product_id[${idx}]`,
				coupon_apply === "selected_product" ? product?.id : ""
			);
		});

		formData.append("status", isEnable === "نشط" ? "active" : "not_active");

		// make request...
		try {
			const response = await editCouponById({
				id: currentCoupon?.id,
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");

				navigate("/Coupon");
			} else {
				setLoadingTitle("");
				setCouponError({
					...couponError,
					code: response?.data?.message?.en?.code?.[0],
					discount_type: response?.data?.message?.en?.discount_type?.[0],
					total_price: response?.data?.message?.en?.total_price?.[0],
					discount: response?.data?.message?.en?.discount?.[0],
					total_redemptions:
						response?.data?.message?.en?.total_redemptions?.[0],
					user_redemptions: response?.data?.message?.en?.user_redemptions?.[0],
					coupon_apply: response?.data?.message?.en?.coupon_apply?.[0],
				});
				setStartDateError(response?.data?.message?.en?.expire_date?.[0]);

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
			console.error("Error changing editCouponById:", error);
		}
	};

	const deleteItemFromSelectedProduct = (id) => {
		const newLists = selectedProducts?.filter(
			(__product, index) => index !== id
		);
		setSelectedProducts(newLists);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تعديل كود خصم</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Coupon")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style}>
						<div className='add-form-wrapper add-coupon-form coupon-details'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title  '>
										<h5 className='mb-3'>تفاصيل كود الخصم</h5>
										<p> تعديل واستعراض بيانات كود الخصم</p>
									</div>
								</div>
							</div>
							{isFetching ? (
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
														onClick={() => handleChangeCouponStatus()}>
														إعادة تفعيل كود الخصم
													</button>
												</Fragment>
											) : moment(
													currentCoupon?.expire_date,
													"YYYY-MM-DD"
											  ).toDate() < currentDate ? (
												<Fragment>
													<div className='coupon-status disabled'>منتهي</div>

													<button
														type='button'
														className='enable-coupon-btn'
														onClick={() => {
															setActiveCoupon(true);
														}}>
														إعادة تفعيل كود الخصم
													</button>
													{activeCoupon && (
														<div style={{ fontSize: "16px", color: "red" }}>
															يرجى تحديث تاريخ الانتهاء لكي يتم إعادة تفعيل كود
															الخصم
														</div>
													)}
												</Fragment>
											) : (
												""
											)}
										</div>
									</div>
									<form
										onSubmit={handleSubmit(handleEditCoupon)}
										className={isEnable === "غير نشط" ? "disabled" : ""}>
										<div className='form-body'>
											<div className='row mb-md-5 d-flex  justify-content-evenly'>
												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label htmlFor='coupon-name' className='d-block mb-1'>
														كود الخصم<span className='important-hint'>*</span>
													</label>
													<input
														type='text'
														id='coupon-code'
														placeholder='ادخل كود الخصم'
														name='code'
														// disabled={isEnable === "نشط" ? false : true}
														{...register("code", {
															required: "حقل الكود مطلوب",
															pattern: {
																value: /^[A-Za-z0-9]+$/i,
																message:
																	"صيغة الحقل الكود غير صحيحة(يجب ان يكون من حروف انجليزيه او حروف انجليزيه وارقام)",
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
												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label htmlFor='uses-count' className='d-block mb-1'>
														عدد مرات الاستخدام للجميع
														<span className='important-hint'>*</span>
													</label>
													<Controller
														name={"total_redemptions"}
														control={control}
														rules={{
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
														}}
														render={({ field: { onChange, value } }) => (
															<input
																type='text'
																id='uses-count'
																placeholder='  عدد مرات استخدام كود الخصم لجميع العملاء'
																name='total_redemptions'
																// disabled={isEnable === "نشط" ? false : true}
																value={value}
																onChange={(e) =>
																	onChange(
																		e.target.value.replace(/[^0-9]/g, "")
																	)
																}
															/>
														)}
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
												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label
														htmlFor='coupon-name '
														className='d-block mb-1'>
														نوع الخصم<span className='important-hint'>*</span>
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
																// disabled={isEnable === "نشط" ? false : true}
															>
																<div className='radio-box'>
																	<FormControlLabel
																		value='percent'
																		id='percent-price'
																		control={<Radio />}
																		// disabled={isEnable === "نشط" ? false : true}
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
																		// disabled={isEnable === "نشط" ? false : true}
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
														<Controller
															name={"discount"}
															control={control}
															rules={{
																required: "حقل الخصم مطلوب",
																pattern: {
																	value: /^[0-9]+$/i,
																	message: "يجب على الحقل الخصم أن يكون رقمًا",
																},
																min: {
																	value: 1,
																	message: "  الخصم يجب ان يكون اكبر من 0",
																},
															}}
															render={({ field: { onChange, value } }) => (
																<input
																	type='text'
																	id='add-ptice'
																	placeholder=' ادخل المبلغ او الخصم'
																	name='discount'
																	// disabled={isEnable === "نشط" ? false : true}
																	value={value}
																	onChange={(e) =>
																		onChange(
																			e.target.value.replace(
																				/[^\d.]|\.(?=.*\.)/g,
																				""
																			)
																		)
																	}
																/>
															)}
														/>
													</div>

													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.discount}
															{errors?.discount && errors.discount.message}
														</span>
													</div>
												</div>

												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label htmlFor='user-count' className='d-block mb-1'>
														عدد مرات الاستخدام للزبون الواحد
														<span className='important-hint'>*</span>
													</label>
													<Controller
														name={"user_redemptions"}
														control={control}
														rules={{
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
														}}
														render={({ field: { onChange, value } }) => (
															<input
																type='text'
																name='user_redemptions'
																id='user-count'
																placeholder='  عدد مرات استخدام كود الخصم للعميل الواحد'
																// disabled={isEnable === "نشط" ? false : true}
																value={value}
																onChange={(e) =>
																	onChange(
																		e.target.value.replace(/[^0-9]/g, "")
																	)
																}
															/>
														)}
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
												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label
														htmlFor='coupon-name '
														className='d-block mb-1'>
														تاريخ الانتهاء
														<span className='important-hint'>*</span>
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
														disabled={
															isEnable === "نشط" || "منتهي" ? false : true
														}
													/>
													{startDateError && (
														<div className='col-12'>
															<span className='fs-6 text-danger'>
																{startDateError}
															</span>
														</div>
													)}
												</div>

												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label htmlFor='user-count' className='d-block mb-1'>
														شحن مجاني<span className='important-hint'>*</span>
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
																// disabled={isEnable === "نشط" ? false : true}
															>
																<div className='radio-box '>
																	<FormControlLabel
																		value={1}
																		id='accept-free-shipping'
																		control={<Radio />}
																		// disabled={isEnable === "نشط" ? false : true}
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
																		// disabled={isEnable === "نشط" ? false : true}
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
												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label
														htmlFor='coupon-name '
														className='d-block mb-1'>
														الحد الأدنى من المشتريات
														<span className='important-hint'>*</span>
													</label>
													<Controller
														name={"total_price"}
														control={control}
														rules={{
															required: "حقل المبلغ مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message: "يجب على الحقل المبلغ أن يكون رقمًا",
															},
															min: {
																value: 1,
																message: "  المبلغ يجب ان يكون اكبر من 0",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																type='text'
																name='total_price'
																id='add-ptice'
																placeholder=' ادخل مبلغ الحد الأدنى من المشتريات'
																// disabled={isEnable === "نشط" ? false : true}
																value={value}
																onChange={(e) =>
																	onChange(
																		e.target.value.replace(
																			/[^\d.]|\.(?=.*\.)/g,
																			""
																		)
																	)
																}
															/>
														)}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{couponError?.total_price}
															{errors?.total_price &&
																errors.total_price.message}
														</span>
													</div>
												</div>
												<div className='col-lg-5 col-12 mb-lg-0 mb-3'></div>
												{/*<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<label htmlFor='user-count' className='d-block mb-1'>
														استثناء المنتجات المخفضة
														<span className='important-hint'>*</span> 
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
																// disabled={isEnable === "نشط" ? false : true}
																>
																<div className='radio-box '>
																	<FormControlLabel
																		value={1}
																		id='accept-lower-product'
																		control={<Radio />}
																		// disabled={isEnable === "نشط" ? false : true}
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
																		// disabled={isEnable === "نشط" ? false : true}
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
																	</div>*/}
											</div>
											<div className='row mb-md-5 d-flex justify-content-evenly'>
												<div className='col-lg-5 col-12 mb-lg-0 mb-3'>
													<div className='row mb-md-4 mb-3 d-flex justify-content-evenly'>
														<div className='col-12'>
															<div className='row-title mb-2'>
																<h4 className='mb-2'>
																	يتم تطبيق العرض على
																	<span className='important-hint'>*</span>
																</h4>
																<p>اختر واحد من الخيارات التالية</p>
															</div>
															<RadioGroup
																// disabled={isEnable === "نشط" ? false : true}
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
																		// disabled={isEnable === "نشط" ? false : true}
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
																		// disabled={isEnable === "نشط" ? false : true}
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
																{/*<div className='radio-box select-apply-offer'>
																	<FormControlLabel
																		value='selected_category'
																		id='selected_category'
																		control={<Radio />}
																		// disabled={isEnable === "نشط" ? false : true}
																	/>
																	<label
																		className={
																			coupon_apply === "selected_category"
																				? " me-3"
																				: "disabled me-3"
																		}
																		htmlFor='selected_category'>
																		أنشطة مختارة
																	</label>
																	</div>
																<div className='radio-box select-apply-offer'>
																	<FormControlLabel
																		value='selected_payment'
																		id='selected_payment'
																		control={<Radio />}
																		// disabled={isEnable === "نشط" ? false : true}
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
																</div>*/}
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
																	// disabled={isEnable === "نشط" ? false : true}
																	style={{ paddingRight: "38px" }}
																	value={searchTerm}
																	onChange={handleSearch}
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
															{searchTerm !== "" && (
																<ul className='purchase_serach'>
																	{filteredProducts?.map((product) => (
																		<li
																			key={product.id}
																			onClick={() => {
																				handleProductSelect(product?.id);
																				setSearchTerm("");
																			}}>
																			{product?.name}
																		</li>
																	))}
																</ul>
															)}

															<ul className='purchase_products_selected'>
																{selectedProducts?.map((product, index) => (
																	<li
																		className='d-flex flex-row align-items-center gap-2'
																		key={product?.id}>
																		<span>_ {product?.name}</span>
																		<CloseOutlinedIcon
																			style={{
																				fontSize: "1.2rem",
																				color: "#ff0000",
																				cursor: "pointer",
																			}}
																			onClick={() =>
																				deleteItemFromSelectedProduct(index)
																			}
																		/>
																	</li>
																))}
															</ul>
														</div>
													)}
													{coupon_apply === "selected_category" && (
														<div className='col-12 mb-4'>
															<FormControl sx={{ m: 0, width: "100%" }}>
																<Select
																	name='select_category_id'
																	value={select_category_id}
																	onChange={(e) => {
																		setSelect_category_id(e.target.value);
																	}}
																	sx={selectStyle}
																	IconComponent={IoIosArrowDown}
																	displayEmpty
																	inputProps={{ "aria-label": "Without label" }}
																	renderValue={(selected) => {
																		if (select_category_id === undefined) {
																			return (
																				<p className='text-[#ADB5B9]'>
																					اختر النشاط
																				</p>
																			);
																		}
																		const result =
																			selectCategories?.filter(
																				(item) =>
																					item?.id === parseInt(selected)
																			) || "";
																		return result[0]?.name;
																	}}>
																	{selectCategories?.map((cat, index) => {
																		return (
																			<MenuItem
																				key={index}
																				className='souq_storge_category_filter_items'
																				sx={{
																					backgroundColor:
																						cat?.store === null
																							? " #dfe2aa"
																							: " rgba(211, 211, 211, 1)",
																					height: "3rem",
																					"&:hover": {},
																				}}
																				value={cat?.id}>
																				{cat?.name}
																			</MenuItem>
																		);
																	})}
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
																	// disabled={isEnable === "نشط" ? false : true}
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
																			selectPayments?.filter(
																				(item) =>
																					item?.id === parseInt(selected)
																			) || "";
																		return result[0]?.name;
																	}}>
																	{selectPayments?.map((payment, index) => {
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
																	})}
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
												<div className='col-lg-5 col-12 mb-lg-0 mb-3 enable-switches'>
													<label htmlFor='user-count' className='d-block mb-1'>
														الحالة<span className='important-hint'>*</span>
													</label>
													<Switch
														checked={isEnable}
														sx={switchStyle}
														onClick={(e) => {
															setIsEnable(!isEnable);
														}}
														// disabled={isEnable === "نشط" ? false : true}
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
