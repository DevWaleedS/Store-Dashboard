import React, { useState, useContext } from "react";
import { Helmet } from "react-helmet";
import useFetch from "../../Hooks/UseFetch";
import { useDispatch } from "react-redux";
import { closeVerifyModal } from "../../store/slices/VerifyStoreModal-slice";
import { Link, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import moment from "moment";
import Context from "../../Context/context";
import axios from "axios";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { FormControlLabel } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import FormGroup from "@mui/material/FormGroup";
import Checkbox from "@mui/material/Checkbox";

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ICONS
import howIcon from "../../data/Icons/icon_24_home.svg";
import { ReactComponent as SearchIcon } from "../../data/Icons/icon_24_search.svg";
import { ReactComponent as OffersIcon } from "../../data/Icons/icon-24-offer.svg";
import { ReactComponent as GiftIcon } from "../../data/Icons/icon-offer gift.svg";
import { ReactComponent as ArrowIcon } from "../../data/Icons/icon-30-arrwos back.svg";
import { ReactComponent as ArrowIconDown } from "../../data/Icons/icon-24-chevron_down.svg";
import { ReactComponent as Quantity } from "../../data/Icons/icon-24-Quantity.svg";
import { ReactComponent as DateIcon } from "../../data/Icons/icon-date.svg";
import { ReactComponent as MultiDevices } from "../../data/Icons/laptop icon-24.svg";
import { ReactComponent as MobileIcon } from "../../data/Icons/mobile-icon-24.svg";
import { ReactComponent as LaptopIcon } from "../../data/Icons/laptop-icon-24.svg";
import { ReactComponent as Dollar } from "../../data/Icons/icon-6.svg";
import { IoIosArrowDown } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from "../../Context/LoadingProvider";

// Modal Style
const style = {
	position: "fixed",
	top: "80px",
	left: "-1%",
	transform: "translate(0%, 0%)",
	width: "85%",
	height: "100%",
	overflow: "auto",
	bgcolor: "#f8f9fa",
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

const CreateOffer = () => {
	const { fetchedData: categories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);
	const { fetchedData: payments } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/payment_types"
	);
	const { fetchedData: products } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/products"
	);
	const navigate = useNavigate();
	const dispatch = useDispatch(false);
	const [reload, setReload] = useState(false);
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			offer_title: "",
			purchase_quantity: "",
			get_quantity: "",
			offer1_type: "",
			discount_percent: "",
			discount_value_offer2: "",
			discount_value_offer3: "",
			maximum_discount: "",
			fixed_offer_type_minimum: "",
			offer_type_minimum: "",
		},
	});
	const [offer, setOffer] = useState({
		offer_type: "If_bought_gets",
		offer_view: "store_website",
		purchase_type: "",
		get_type: "",
		fixed_offer_apply: "",
		offer_apply: "",
		fixed_offer_amount_minimum: "",
		offer_amount_minimum: "",
		coupon_status: "",
		select_category_id: "",
		select_payment_id: "",
		category_id: "",
		get_category_id: "",
	});

	const [fixedCouponStatus, setFixedCouponStatus] = useState(0);
	const [couponStatus, setCouponStatus] = useState(0);
	const [productId, setProductId] = useState([]);
	const [getProductId, setGetProductId] = useState([]);
	const [fixedProduct, setFixedProduct] = useState([]);

	//to set date
	const [startDate, setStartDate] = React.useState();
	const [endDate, setEndDate] = React.useState();
	const [purchase_serach, setPurchase_serach] = useState("");
	const [purchase_products, setPurchase_products] = useState([]);
	const [get_serach, setGet_serach] = useState("");
	const [get_products, setGet_products] = useState([]);
	const [fixed_serach, setFixed_serach] = useState("");
	const [fixed_products, setFixed_products] = useState([]);

	const [offerError, setOfferError] = useState({
		offer_type: "",
		offer_title: "",
		offer_view: "",
		purchase_quantity: "",
		purchase_type: "",
		get_quantity: "",
		get_type: "",
		offer1_type: "",
		discount_percent: "",
		discount_value_offer2: "",
		fixed_offer_apply: "",
		offer_apply: "",
		fixed_offer_type_minimum: "",
		offer_type_minimum: "",
		fixed_offer_amount_minimum: "",
		offer_amount_minimum: "",
		coupon_status: "",
		discount_value_offer3: "",
		maximum_discount: "",
		select_category_id: "",
		select_payment_id: "",
		category_id: "",
		get_category_id: "",
		product_id: [],
		get_product_id: [],
	});

	// Errors
	const [startDateError, setStartDateError] = useState();
	const [endDateError, setEndDateError] = useState();

	const resetCouponError = () => {
		setOfferError({
			offer_type: "",
			offer_title: "",
			offer_view: "",
			purchase_quantity: "",
			purchase_type: "",
			get_quantity: "",
			get_type: "",
			offer1_type: "",
			discount_percent: "",
			discount_value_offer2: "",
			fixed_offer_apply: "",
			offer_apply: "",
			fixed_offer_type_minimum: "",
			offer_type_minimum: "",
			fixed_offer_amount_minimum: "",
			offer_amount_minimum: "",
			coupon_status: "",
			discount_value_offer3: "",
			maximum_discount: "",
			select_category_id: "",
			select_payment_id: "",
			category_id: "",
			get_category_id: "",
		});
		setStartDateError("");
		setEndDateError("");
	};
	// ---------------------------------------------------------------------------

	const purchaseSearchItems = (value) => {
		setPurchase_serach(value);
		const filteredData = products?.data?.products?.filter((item) => {
			return item?.name.includes(value);
		});
		setPurchase_products(filteredData);
	};

	const getSearchItems = (value) => {
		setGet_serach(value);
		const filteredData = products?.data?.products?.filter((item) => {
			return item?.name.includes(value);
		});
		setGet_products(filteredData);
	};

	const fixedSearchItems = (value) => {
		setFixed_serach(value);
		const filteredData = products?.data?.products?.filter((item) => {
			return item?.name.includes(value);
		});
		setFixed_products(filteredData);
	};

	const handleOnChange = (e) => {
		setOffer({ ...offer, [e.target.name]: e.target.value });
	};

	const purchase_products_selected = products?.data?.products?.filter(
		(product) => {
			return productId?.some((ele) => {
				return ele === product?.id;
			});
		}
	);

	const get_products_selected = products?.data?.products?.filter((product) => {
		return getProductId?.some((ele) => {
			return ele === product?.id;
		});
	});

	const fixed_products_selected = products?.data?.products?.filter(
		(product) => {
			return fixedProduct?.some((ele) => {
				return ele === product?.id;
			});
		}
	);

	const addNewOffer = (data) => {
		setLoadingTitle("جاري اضافة عرض خاص");
		resetCouponError();
		let formData = new FormData();
		formData.append("offer_type", offer?.offer_type);
		formData.append("offer_title", data?.offer_title);
		formData.append("offer_view", offer?.offer_view);
		formData.append("start_at", moment(startDate).format("YYYY-MM-DD"));
		formData.append("end_at", moment(endDate).format("YYYY-MM-DD"));
		formData.append(
			"purchase_type",
			offer?.offer_type === "If_bought_gets" ? offer?.purchase_type : ""
		);
		formData.append(
			"purchase_quantity",
			offer?.offer_type === "If_bought_gets" ? data?.purchase_quantity : ""
		);
		formData.append(
			"get_type",
			offer?.offer_type === "If_bought_gets" ? offer?.get_type : ""
		);
		formData.append(
			"get_quantity",
			offer?.offer_type === "If_bought_gets" ? data?.get_quantity : ""
		);
		formData.append(
			"category_id",
			offer?.offer_type === "If_bought_gets" ? offer?.category_id : ""
		);
		formData.append(
			"get_category_id",
			offer?.offer_type === "If_bought_gets" ? offer?.get_category_id : ""
		);
		for (var i = 0; i < purchase_products_selected?.length; i++) {
			formData.append(
				"product_id[]",
				offer?.offer_type === "If_bought_gets"
					? purchase_products_selected[i]?.id
					: ""
			);
		}
		for (var j = 0; j < get_products_selected?.length; j++) {
			formData.append(
				"get_product_id[]",
				offer?.offer_type === "If_bought_gets"
					? get_products_selected[j]?.id
					: ""
			);
		}
		formData.append(
			"offer1_type",
			offer?.offer_type === "If_bought_gets" ? data?.offer1_type : ""
		);
		formData.append(
			"discount_percent",
			offer?.offer_type === "If_bought_gets" ? data?.discount_percent : ""
		);
		formData.append(
			"discount_value_offer2",
			offer?.offer_type === "fixed_amount" ? data?.discount_value_offer2 : ""
		);
		formData.append(
			"offer_apply",
			offer?.offer_type === "fixed_amount"
				? offer?.fixed_offer_apply
				: offer?.offer_type === "percent"
				? offer?.offer_apply
				: ""
		);
		formData.append(
			"offer_type_minimum",
			offer?.offer_type === "fixed_amount"
				? data?.fixed_offer_type_minimum
				: offer?.offer_type === "percent"
				? data?.offer_type_minimum
				: ""
		);
		formData.append(
			"offer_amount_minimum",
			offer?.offer_type === "fixed_amount"
				? offer?.fixed_offer_amount_minimum
				: offer?.offer_type === "percent"
				? offer?.offer_amount_minimum
				: ""
		);
		formData.append(
			"coupon_status",
			offer?.offer_type === "fixed_amount"
				? fixedCouponStatus
				: offer?.offer_type === "percent"
				? couponStatus
				: ""
		);
		formData.append(
			"discount_value_offer3",
			offer?.offer_type === "percent" ? data?.discount_value_offer3 : ""
		);
		formData.append(
			"maximum_discount",
			offer?.offer_type === "percent" ? data?.maximum_discount : ""
		);
		axios
			.post(`https://backend.atlbha.com/api/Store/offer`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Offers");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setReload(!reload);
					setOfferError({
						offer_type: res?.data?.message?.en?.offer_type?.[0],
						offer_title: res?.data?.message?.en?.offer_title?.[0],
						offer_view: res?.data?.message?.en?.offer_view?.[0],
						purchase_quantity: res?.data?.message?.en?.purchase_quantity?.[0],
						purchase_type: res?.data?.message?.en?.purchase_type?.[0],
						get_quantity: res?.data?.message?.en?.get_quantity?.[0],
						get_type: res?.data?.message?.en?.get_type?.[0],
						offer1_type: res?.data?.message?.en?.offer1_type?.[0],
						discount_percent: res?.data?.message?.en?.discount_percent?.[0],
						discount_value_offer2:
							res?.data?.message?.en?.discount_value_offer2?.[0],
						fixed_offer_apply: res?.data?.message?.en?.fixed_offer_apply?.[0],
						offer_apply: res?.data?.message?.en?.offer_apply?.[0],
						fixed_offer_type_minimum:
							res?.data?.message?.en?.fixed_offer_type_minimum?.[0],
						offer_type_minimum: res?.data?.message?.en?.offer_type_minimum?.[0],
						fixed_offer_amount_minimum:
							res?.data?.message?.en?.fixed_offer_amount_minimum?.[0],
						offer_amount_minimum:
							res?.data?.message?.en?.offer_amount_minimum?.[0],
						coupon_status: res?.data?.message?.en?.coupon_status?.[0],
						discount_value_offer3:
							res?.data?.message?.en?.discount_value_offer3?.[0],
						maximum_discount: res?.data?.message?.en?.maximum_discount?.[0],
						select_category_id: res?.data?.message?.en?.select_category_id?.[0],
						select_payment_id: res?.data?.message?.en?.select_payment_id?.[0],
						category_id: res?.data?.message?.en?.category_id?.[0],
						get_category_id: res?.data?.message?.en?.get_category_id?.[0],
					});
					setStartDateError(res?.data?.message?.en?.start_at?.[0]);
					setEndDateError(res?.data?.message?.en?.end_at?.[0]);
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | اضافة عرض</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Offers")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style} className='nested-pages-modal'>
						<section className='create-offers-page p-3'>
							<div className='head-category mb-md-5 mb-3'>
								<div className='row'>
									<nav aria-label='breadcrumb'>
										<ol className='breadcrumb'>
											<li className='breadcrumb-item'>
												<Link to='/' className='me-2'>
													<img src={howIcon} alt='' loading='lazy' />
													<span className='me-2'> الرئيسية</span>
												</Link>
											</li>
											<li
												className='breadcrumb-item '
												aria-current='page'
												onClick={() => {
													dispatch(closeVerifyModal());
												}}>
												<Link to='/Offers' className='me-2'>
													العروض الخاصة
												</Link>
											</li>
											<li
												className='breadcrumb-item active'
												aria-current='page'>
												انشاء عرض جديد
											</li>
										</ol>
									</nav>
								</div>
							</div>

							<form onSubmit={handleSubmit(addNewOffer)}>
								{/** Offers Details */}
								<div className='create-offer-form-wrapper add-form-wrapper '>
									<div className='row '>
										<div className='col-12'>
											<div className='form-title'>
												<h5 className=''> بيانات العرض</h5>
											</div>
										</div>
									</div>

									<div className='form-body'>
										<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
											<div className='col-12 mb-md-4 mb-3'>
												<div className='row-title'>
													<h4 className='mb-2'>نوع العرض</h4>
													<p>اختر نوع الخصم الذي سيتم تطبيقه على المشتريات</p>
												</div>
											</div>
											<div className='col-12'>
												<RadioGroup
													className='radio-btn-group'
													aria-labelledby='demo-controlled-radio-buttons-group'
													name='offer_type'
													value={offer?.offer_type}
													onChange={(e) => {
														handleOnChange(e);
													}}>
													<div className='radio-box mb-1 '>
														<FormControlLabel
															value='If_bought_gets'
															id='If_bought_gets'
															control={<Radio />}
														/>
														<label
															className={
																offer?.offer_type === "If_bought_gets"
																	? "active me-3"
																	: " me-3"
															}
															htmlFor='If_bought_gets'>
															اذا اشترى العميل X يحصل على Y
														</label>
													</div>
													<div className='radio-box mb-1'>
														<FormControlLabel
															value='fixed_amount'
															id='fixed_amount'
															control={<Radio />}
														/>
														<label
															className={
																offer?.offer_type === "fixed_amount"
																	? "active me-3"
																	: " me-3"
															}
															htmlFor='fixed_amount'>
															مبلغ ثابت من قيمة مشتريات العميل
														</label>
													</div>
													<div className='radio-box '>
														<FormControlLabel
															value='percent'
															id='percent'
															control={<Radio />}
														/>
														<label
															className={
																offer?.offer_type === "percent"
																	? "active me-3"
																	: " me-3"
															}
															htmlFor='percent'>
															نسبة من قيمة مشتريات العميل
														</label>
													</div>
												</RadioGroup>
											</div>
											<div className='col-12'>
												{offerError?.offer_type && (
													<span className='fs-6 text-danger'>
														{offerError?.offer_type}
													</span>
												)}
											</div>
										</div>
										<div className='row mb-md-5 mb-3 d-flex  justify-content-evenly'>
											<div className='col-md-6 col-12 mb-md-0 mb-3'>
												<label htmlFor='offer-title ' className='d-block mb-1'>
													عنوان العرض
												</label>
												<div className='input-icon'>
													<OffersIcon />
												</div>
												<input
													name='offer_title'
													type='text'
													id='offer-title'
													{...register("offer_title", {
														required: "حقل عنوان العرض مطلوب",
														pattern: {
															value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
															message: "عنوان العرض يجب أن يكون نصاً",
														},
													})}
												/>
												<div className='col-12'>
													<span className='fs-6 text-danger'>
														{offerError?.offer_title}
														{errors?.offer_title && errors.offer_title.message}
													</span>
												</div>
											</div>
											<div className='col-md-6 col-12'>
												<label
													htmlFor='offer-platform '
													className='d-block mb-1'>
													منصة العرض
													<span className='sub-label'>
														{" "}
														( اختر أين ترغب ان يظهر العرض للعملاء )
													</span>
												</label>
												<FormControl>
													<Select
														className='select-offer-platform '
														labelId='demo-simple-select-label'
														name='offer_view'
														value={offer?.offer_view}
														onChange={(e) => {
															handleOnChange(e);
														}}
														IconComponent={ArrowIconDown}
														displayEmpty
														inputProps={{ "aria-label": "Without label" }}
														renderValue={(selected) => {
															if (offer?.offer_view === "") {
																return (
																	<p className='text-[#ADB5B9]'>
																		اختر منصة العرض
																	</p>
																);
															}
															return selected === "store_website"
																? "موقع المتجر"
																: selected === "store_application"
																? "تطبيق الموقع"
																: "موقع و تطبيق المتجر";
														}}>
														<MenuItem value='store_website'>
															<LaptopIcon />
															<span className='me-3'>موقع المتجر</span>
														</MenuItem>
														<MenuItem value='store_application'>
															<MobileIcon />
															<span className='me-3'>تطبيق المتجر</span>
														</MenuItem>

														<MenuItem value='both'>
															<MultiDevices />
															<span className='me-3'>موقع و تطبيق المتجر</span>
														</MenuItem>
													</Select>
												</FormControl>
												<div className='col-12'>
													{offerError?.offer_view && (
														<span className='fs-6 text-danger'>
															{offerError?.offer_view}
														</span>
													)}
												</div>
											</div>
										</div>
										<div className='row  d-flex  justify-content-evenly'>
											<div className='col-md-6 col-12 mb-md-0 mb-3'>
												<label
													htmlFor='start-offer-date '
													className='d-block mb-2'>
													تاريخ بداية العرض
												</label>
												<div className='date-icon'>
													<DateIcon />
												</div>
												<DatePicker
													minDate={moment().toDate()}
													selected={startDate}
													placeholderText='تاريخ بداية العرض '
													onChange={(date) => setStartDate(date)}
													dateFormat='dd/MM/yyyy'
												/>
												<div className='col-12'>
													{startDateError && (
														<span className='fs-6 text-danger'>
															{startDateError}
														</span>
													)}
												</div>
											</div>
											<div className='col-md-6 col-12'>
												<label
													htmlFor='end-offer-date '
													className='d-block mb-2'>
													تاريخ انتهاء العرض
												</label>

												<div className='date-icon'>
													<DateIcon />
												</div>
												<DatePicker
													minDate={moment().toDate()}
													selected={endDate}
													placeholderText='تاريخ  نهاية العرض '
													onChange={(date) => setEndDate(date)}
													dateFormat='dd/MM/yyyy'
												/>
												<div className='col-12'>
													{endDateError && (
														<span className='fs-6 text-danger'>
															{endDateError}
														</span>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/** Offers options */}
								<div className='create-offer-form-wrapper offers-options'>
									<div className='row '>
										<div className='col-12'>
											<div className='form-title  '>
												<h5 className=''> خيارات العرض</h5>
											</div>
										</div>
									</div>
									{offer?.offer_type === "If_bought_gets" ? (
										<div className='form-body'>
											<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>مشتريات العميل </h4>
														<p>
															{" "}
															حدد المنتجات والكميات المطلوب تواجدها في سلة
															المشتريات لتطبيق الخصم
														</p>
													</div>
												</div>
											</div>
											{/** --- */}
											<div className='row mb-md-5 mb-3 d-flex justify-content-start'>
												<div className='col-md-6 col-12'>
													<label htmlFor='count ' className='d-block mb-1'>
														الكمية
													</label>
													<div className='input-icon'>
														<Quantity className='quantity' />
													</div>
													<Controller
														name={"purchase_quantity"}
														control={control}
														rules={{
															required: "حقل كمية الشراء مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message: "يجب ان تكون كمية الشراء رقماّّ",
															},
															min: {
																value: -1,
																message: "يجب أن تكون كمية الشراء أكبر من -1",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																name='purchase_quantity'
																type='text'
																id='count'
																placeholder='0'
																value={value}
																onChange={(e) =>
																	onChange(
																		e.target.value.replace(/[^0-9]/g, "")
																	)
																}
															/>
														)}
													/>
												</div>
												<div className='col-12'>
													<span className='fs-6 text-danger'>
														{offerError?.purchase_quantity}
														{errors?.purchase_quantity &&
															errors.purchase_quantity.message}
													</span>
												</div>
											</div>
											{/** --- */}
											<div className='row mb-md-5 mb-3 d-flex  justify-content-evenly'>
												<RadioGroup
													className=' d-flex flex-row'
													aria-labelledby='demo-controlled-radio-buttons-group'
													name='purchase_type'
													value={offer?.purchase_type}
													onChange={(e) => {
														handleOnChange(e);
													}}>
													<div className='col-md-6 col-12'>
														<div className='radio-box mb-1 '>
															<FormControlLabel
																value='product'
																id='product'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.purchase_type === "product"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='product'>
																اختيار منتجات
															</label>
														</div>
														<div className='mx-md-3'>
															<div className='col-12'>
																<div className='input-icon'>
																	<SearchIcon className='search-icon' />
																</div>
																<input
																	value={purchase_serach}
																	onChange={(e) =>
																		purchaseSearchItems(e.target.value)
																	}
																	disabled={offer?.purchase_type !== "product"}
																	type='text'
																	placeholder='البحث في المنتجات.'
																/>
																<div className='col-12'>
																	{offerError?.product_id && (
																		<span className='fs-6 text-danger'>
																			{offerError?.product_id}
																		</span>
																	)}
																</div>
															</div>
															{purchase_serach !== "" && (
																<ul className='purchase_serach'>
																	{purchase_products?.map((item, index) => (
																		<li
																			key={index}
																			value={productId}
																			onClick={() => {
																				if (!productId.includes(item?.id)) {
																					setProductId([
																						...productId,
																						item?.id,
																					]);
																				}
																				purchaseSearchItems("");
																			}}>
																			{item?.name}
																		</li>
																	))}
																</ul>
															)}
															{purchase_products_selected?.length !== 0 && (
																<ul className='purchase_products_selected'>
																	{purchase_products_selected?.map(
																		(item, index) => (
																			<li key={index}>_ {item?.name}</li>
																		)
																	)}
																</ul>
															)}
														</div>
													</div>
													<div className='col-md-6 col-12'>
														<div className='radio-box mb-1'>
															<FormControlLabel
																id='category'
																control={<Radio />}
																value='category'
															/>
															<label
																className={
																	offer?.purchase_type === "category"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='category'>
																اختيار تصنيفات
															</label>
														</div>
														<div className='mx-md-3'>
															<div className='col-12'>
																<FormControl sx={{ m: 0, width: "100%" }}>
																	<Select
																		disabled={
																			offer?.purchase_type !== "category"
																		}
																		name='category_id'
																		value={offer?.category_id}
																		onChange={(e) => {
																			handleOnChange(e);
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
																		inputProps={{
																			"aria-label": "Without label",
																		}}
																		renderValue={(selected) => {
																			if (offer?.category_id === "") {
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
																							backgroundColor:
																								"rgba(211, 211, 211, 1)",
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
																	{offerError?.category && (
																		<span className='fs-6 text-danger'>
																			{offerError?.category}
																		</span>
																	)}
																</div>
															</div>
														</div>
													</div>
												</RadioGroup>
												<div className='col-12'>
													{offerError?.purchase_type && (
														<span className='fs-6 text-danger'>
															{offerError?.purchase_type}
														</span>
													)}
												</div>
											</div>
											{/** --- */}
											<div className='row mb-md-5 mb-3 d-flex  justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'> يحصل العميل على </h4>
														<p>
															{" "}
															حدد ما سوف يحصل علىه العميل عند استفياء الشروط
															السابقة
														</p>
													</div>
												</div>
											</div>
											{/** --- */}
											<div className='row mb-md-5 mb-3 d-flex  justify-content-start'>
												<div className='col-md-6 col-12'>
													<label htmlFor='count ' className='d-block mb-1'>
														الكمية
													</label>
													<div className='input-icon'>
														<Quantity className='quantity' />
													</div>
													<Controller
														name={"get_quantity"}
														control={control}
														rules={{
															required: "حقل الحصول على الكمية مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message: "يجب أن تكون كمية الاستلام رقمًا",
															},
															min: {
																value: -1,
																message: "يجب أن تكون كمية الاستلام أكبر من -1",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																name='get_quantity'
																type='text'
																id='count'
																placeholder='0'
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
															{offerError?.get_quantity}
															{errors?.get_quantity &&
																errors.get_quantity.message}
														</span>
													</div>
												</div>
											</div>
											{/** --- */}
											<div className='row mb-md-5 mb-3 d-flex  justify-content-evenly'>
												<RadioGroup
													className=' d-flex flex-row'
													aria-labelledby='demo-controlled-radio-buttons-group'
													name='get_type'
													value={offer?.get_type}
													onChange={(e) => {
														handleOnChange(e);
													}}>
													<div className='col-md-6 col-12'>
														<div className='radio-box mb-1 '>
															<FormControlLabel
																value='product'
																id='product'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.get_type === "product"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='product'>
																اختيار منتجات
															</label>
														</div>
														<div className='mx-md-3'>
															<div className='col-12'>
																<div className='input-icon'>
																	<SearchIcon className='search-icon' />
																</div>
																<input
																	value={get_serach}
																	onChange={(e) =>
																		getSearchItems(e.target.value)
																	}
																	disabled={offer?.get_type !== "product"}
																	type='text'
																	placeholder='البحث في المنتجات.'
																/>
																<div className='col-12'>
																	{offerError?.get_product_id && (
																		<span className='fs-6 text-danger'>
																			{offerError?.get_product_id}
																		</span>
																	)}
																</div>
															</div>
															{get_serach !== "" && (
																<ul className='purchase_serach'>
																	{get_products?.map((item, index) => (
																		<li
																			key={index}
																			value={getProductId}
																			onClick={() => {
																				if (!getProductId.includes(item?.id)) {
																					setGetProductId([
																						...getProductId,
																						item?.id,
																					]);
																				}
																				getSearchItems("");
																			}}>
																			{item?.name}
																		</li>
																	))}
																</ul>
															)}
															{get_products_selected?.length !== 0 && (
																<ul className='purchase_products_selected'>
																	{get_products_selected?.map((item, index) => (
																		<li key={index}>_ {item?.name}</li>
																	))}
																</ul>
															)}
														</div>
													</div>
													<div className='col-md-6 col-12'>
														<div className='radio-box mb-1'>
															<FormControlLabel
																id='category'
																control={<Radio />}
																value='category'
															/>
															<label
																className={
																	offer?.get_type === "category"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='category'>
																اختيار تصنيفات
															</label>
														</div>
														<div className='mx-md-3'>
															<div className='col-12'>
																<FormControl sx={{ m: 0, width: "100%" }}>
																	<Select
																		disabled={offer?.get_type !== "category"}
																		name='get_category_id'
																		value={offer?.get_category_id}
																		onChange={(e) => {
																			handleOnChange(e);
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
																		inputProps={{
																			"aria-label": "Without label",
																		}}
																		renderValue={(selected) => {
																			if (offer?.get_category_id === "") {
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
																							backgroundColor:
																								"rgba(211, 211, 211, 1)",
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
															</div>
														</div>
														<div className='col-12'>
															{offerError?.get_category_id && (
																<span className='fs-6 text-danger'>
																	{offerError?.get_category_id}
																</span>
															)}
														</div>
													</div>
												</RadioGroup>
												<div className='col-12'>
													{offerError?.get_type && (
														<span className='fs-6 text-danger'>
															{offerError?.get_type}
														</span>
													)}
												</div>
											</div>
											<div className='row d-flex  justify-content-evenly'>
												<div className='col-12 mb-2'>
													<h4>نوع الخصم</h4>
												</div>
												<Controller
													name={"offer1_type"}
													control={control}
													rules={{ required: "حقل نوع الخصم مطلوب" }}
													render={({ field: { onChange, value } }) => (
														<RadioGroup
															className=' d-flex flex-row'
															aria-labelledby='demo-controlled-radio-buttons-group'
															name='offer1_type'
															value={value}
															onChange={onChange}>
															<div className='col-6'>
																<div className='radio-box mb-1 '>
																	<FormControlLabel
																		id='percent'
																		control={<Radio />}
																		value='percent'
																	/>
																	<label
																		className={
																			value === "percent"
																				? "active me-3"
																				: " me-3"
																		}
																		htmlFor='percent'>
																		نسبة خصم
																	</label>
																</div>
																{value === "percent" && (
																	<div className='col-12'>
																		<div className='row-title'>
																			<h4 className='mb-2'>نسبة الخصم</h4>
																			<p>
																				ادخال نسبة الخصم التي سوف يحصل عليها
																				العميل عند الشراء
																			</p>
																		</div>
																		<div className='col-12 mt-3'>
																			<div className='d-flex flex-row align-items-center'>
																				<div className='col-12'>
																					<Controller
																						name={"discount_percent"}
																						control={control}
																						rules={{
																							required: " حقل نسبة الخصم مطلوب",
																							pattern: {
																								value: /^[0-9]+$/i,
																								message:
																									"يجب أن تكون نسبة الخصم رقمًا",
																							},
																							min: {
																								value: 0,
																								message:
																									"يجب أن تكون نسبة الخصم أكبر من 0",
																							},
																							max: {
																								value: 100,
																								message:
																									"يجب أن تكون نسبة الخصم أقل من 100",
																							},
																						}}
																						render={({
																							field: { onChange, value },
																						}) => (
																							<input
																								name='discount_percent'
																								type='text'
																								placeholder='0'
																								value={value}
																								onChange={(e) =>
																									onChange(
																										e.target.value.replace(
																											/[^0-9]/g,
																											""
																										)
																									)
																								}
																							/>
																						)}
																					/>
																				</div>
																				<span className='offer-currency'>
																					%
																				</span>
																			</div>
																			<br />
																			<span className='fs-6 text-danger'>
																				{errors?.discount_percent &&
																					errors.discount_percent.message}
																			</span>
																		</div>
																	</div>
																)}
															</div>
															<div className='col-6'>
																<div className='radio-box mb-1'>
																	<FormControlLabel
																		id='free_product'
																		control={<Radio />}
																		value='free_product'
																	/>
																	<label
																		className={
																			value === "free_product"
																				? "active me-3"
																				: " me-3"
																		}
																		htmlFor='free-product'>
																		منتج مجاني
																	</label>
																</div>
															</div>
														</RadioGroup>
													)}
												/>
												<div className='col-12'>
													<span className='fs-6 text-danger'>
														{offerError?.offer1_type}
														{errors?.offer1_type && errors.offer1_type.message}
													</span>
												</div>
											</div>
										</div>
									) : offer?.offer_type === "fixed_amount" ? (
										<div className='form-body'>
											<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>قيمة التخفيض</h4>
														<p>
															ادخال قيمة التخفيض التي سوف يحصل عليها العميل عند
															الشراء
														</p>
													</div>
													<div className='col-md-6 col-12 mt-3'>
														<div className='d-flex flex-row align-items-center'>
															<div className='col-12'>
																<div className='input-icon'>
																	<Dollar className='search-icon' />
																</div>
																<Controller
																	name={"discount_value_offer2"}
																	control={control}
																	rules={{
																		required: "حقل الخصم مطلوب",
																		pattern: {
																			value: /^[0-9]+$/i,
																			message: "يجب أن يكون الخصم رقمًا",
																		},
																		min: {
																			value: 1,
																			message: "يجب أن يكون الخصم أكبر من 0",
																		},
																	}}
																	render={({ field: { onChange, value } }) => (
																		<input
																			name='discount_value_offer2'
																			type='text'
																			placeholder='0'
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
															<span className='offer-currency'>ر.س</span>
														</div>
													</div>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{offerError?.discount_value_offer2}
															{errors?.discount_value_offer2 &&
																errors.discount_value_offer2.message}
														</span>
													</div>
												</div>
											</div>
											<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>يتم تطبيق العرض على</h4>
														<p>اختر واحد من الخيارات التالية</p>
													</div>
													<RadioGroup
														aria-labelledby='demo-controlled-radio-buttons-group'
														name='fixed_offer_apply'
														value={offer?.fixed_offer_apply}
														onChange={(e) => {
															handleOnChange(e);
														}}>
														<div className='radio-box'>
															<FormControlLabel
																value='all'
																id='all'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.fixed_offer_apply === "all"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='all'>
																جميع المنتجات
															</label>
														</div>
														<div className='radio-box'>
															<FormControlLabel
																value='selected_product'
																id='selected_product'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.fixed_offer_apply ===
																	"selected_product"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='selected_product'>
																منتجات مختارة
															</label>
														</div>
														<div className='radio-box'>
															<FormControlLabel
																value='selected_category'
																id='selected_category'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.fixed_offer_apply ===
																	"selected_category"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='selected_category'>
																تصنيفات مختارة
															</label>
														</div>
														<div className='radio-box'>
															<FormControlLabel
																value='selected_payment'
																id='selected_payment'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.fixed_offer_apply ===
																	"selected_payment"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='selected_payment'>
																طرق دفع مختارة
															</label>
														</div>
													</RadioGroup>
													<div className='col-12'>
														{offerError?.offer_apply && (
															<span className='fs-6 text-danger'>
																{offerError?.offer_apply}
															</span>
														)}
													</div>
												</div>
											</div>
											{offer?.fixed_offer_apply === "selected_product" && (
												<div className='mx-md-3'>
													<div className='col-12'>
														<div className='input-icon'>
															<SearchIcon className='search-icon' />
														</div>
														<input
															value={fixed_serach}
															onChange={(e) => fixedSearchItems(e.target.value)}
															type='text'
															placeholder='البحث في المنتجات.'
														/>
														<div className='col-12'>
															{offerError?.select_product_id && (
																<span className='fs-6 text-danger'>
																	{offerError?.select_product_id}
																</span>
															)}
														</div>
													</div>
													{fixed_serach !== "" && (
														<ul className='purchase_serach'>
															{fixed_products?.map((item, index) => (
																<li
																	key={index}
																	value={fixedProduct}
																	onClick={() => {
																		if (!fixedProduct.includes(item?.id)) {
																			setFixedProduct([
																				...fixedProduct,
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
															{fixed_products_selected?.map((item, index) => (
																<li key={index}>_ {item?.name}</li>
															))}
														</ul>
													)}
												</div>
											)}
											{offer?.fixed_offer_apply === "selected_category" && (
												<div className='col-12 mb-4'>
													<FormControl sx={{ m: 0, width: "100%" }}>
														<Select
															name='select_category_id'
															value={offer?.select_category_id}
															onChange={(e) => {
																handleOnChange(e);
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
																if (offer?.select_category_id === "") {
																	return (
																		<p className='text-[#ADB5B9]'>
																			اختر التصنيف
																		</p>
																	);
																}
																const result =
																	categories?.data?.categories?.filter(
																		(item) => item?.id === parseInt(selected)
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
																				backgroundColor:
																					"rgba(211, 211, 211, 1)",
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
														{offerError?.select_category_id && (
															<span className='fs-6 text-danger'>
																{offerError?.select_category_id}
															</span>
														)}
													</div>
												</div>
											)}
											{offer?.fixed_offer_apply === "selected_payment" && (
												<div className='col-12 mb-4'>
													<FormControl sx={{ m: 0, width: "100%" }}>
														<Select
															name='select_payment_id'
															value={offer?.select_payment_id}
															onChange={(e) => {
																handleOnChange(e);
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
																if (offer?.select_payment_id === "") {
																	return (
																		<p className='text-[#ADB5B9]'>
																			اختر طريقة الدفع
																		</p>
																	);
																}
																const result =
																	payments?.data?.payment_types?.filter(
																		(item) => item?.id === parseInt(selected)
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
																				backgroundColor:
																					"rgba(211, 211, 211, 1)",
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
														{offerError?.select_payment_id && (
															<span className='fs-6 text-danger'>
																{offerError?.select_payment_id}
															</span>
														)}
													</div>
												</div>
											)}
											<div className='row  mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>الحد الأدنى لتطبيق العرض</h4>
														<p>اختر واحد من الخيارات التالية</p>
													</div>
													<Controller
														name={"fixed_offer_type_minimum"}
														control={control}
														rules={{
															required:
																"حقل الحد الأدنى لنوع العرض الثابت مطلوب",
														}}
														render={({ field: { onChange, value } }) => (
															<RadioGroup
																className='row d-flex flex-row mt-4'
																aria-labelledby='demo-controlled-radio-buttons-group'
																name='fixed_offer_type_minimum'
																value={value}
																onChange={onChange}>
																<div className='col-md-6 col-12'>
																	<div className='radio-box mb-1 '>
																		<FormControlLabel
																			id='purchase_amount'
																			control={
																				<Radio value='purchase_amount' />
																			}
																		/>
																		<label
																			className={
																				value === "purchase_amount"
																					? "active me-3"
																					: " me-3"
																			}
																			htmlFor='purchase_amount'>
																			الحد الأدنى لمبلغ الشراء
																		</label>
																	</div>
																	<div className='d-flex flex-row'>
																		<div className='col-12'>
																			<div className='input-icon'>
																				<Dollar className='search-icon' />
																			</div>
																			<Controller
																				name={"fixed_offer_amount_minimum"}
																				control={control}
																				render={({
																					field: { onChange, value },
																				}) => (
																					<input
																						name='fixed_offer_amount_minimum'
																						value={
																							value !== "purchase_amount"
																								? ""
																								: offer?.fixed_offer_amount_minimum
																						}
																						onChange={(e) => {
																							setOffer({
																								...offer,
																								fixed_offer_amount_minimum:
																									e.target.value.replace(
																										/[^\d.]|\.(?=.*\.)/g,
																										""
																									),
																							});
																							onChange(
																								e.target.value.replace(
																									/[^\d.]|\.(?=.*\.)/g,
																									""
																								)
																							);
																						}}
																						type='text'
																						placeholder='0'
																						disabled={
																							value !== "purchase_amount"
																						}
																					/>
																				)}
																			/>
																		</div>
																		<span className='offer-currency'>ر.س</span>
																		<div className='col-12'>
																			{offerError?.offer_amount_minimum && (
																				<span className='fs-6 text-danger'>
																					{offerError?.offer_amount_minimum}
																				</span>
																			)}
																		</div>
																	</div>
																</div>
																<div className='col-md-6 col-12'>
																	<div className='radio-box mb-1'>
																		<FormControlLabel
																			id='product_quantity'
																			control={
																				<Radio value='product_quantity' />
																			}
																		/>
																		<label
																			className={
																				value === "product_quantity"
																					? "active me-3"
																					: " me-3"
																			}
																			htmlFor='product_quantity'>
																			الحد الأدنى لكمية المنتجات
																		</label>
																	</div>
																	<div className='col-12'>
																		<div className='input-icon'>
																			<Quantity className='search-icon' />
																		</div>
																		<Controller
																			name={"fixed_offer_amount_minimum"}
																			control={control}
																			render={({
																				field: { onChange, value },
																			}) => (
																				<input
																					name='fixed_offer_amount_minimum'
																					value={
																						value !== "product_quantity"
																							? ""
																							: offer?.fixed_offer_amount_minimum
																					}
																					onChange={(e) => {
																						setOffer({
																							...offer,
																							fixed_offer_amount_minimum:
																								e.target.value.replace(
																									/[^\d.]|\.(?=.*\.)/g,
																									""
																								),
																						});
																						onChange(
																							e.target.value.replace(
																								/[^\d.]|\.(?=.*\.)/g,
																								""
																							)
																						);
																					}}
																					type='text'
																					placeholder='0'
																					disabled={
																						value !== "product_quantity"
																					}
																				/>
																			)}
																		/>
																		<div className='col-12'>
																			{offerError?.offer_amount_minimum && (
																				<span className='fs-6 text-danger'>
																					{offerError?.offer_amount_minimum}
																				</span>
																			)}
																		</div>
																	</div>
																</div>
															</RadioGroup>
														)}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{offerError?.fixed_offer_type_minimum}
															{errors?.fixed_offer_type_minimum &&
																errors.fixed_offer_type_minimum.message}
														</span>
													</div>
												</div>
											</div>
											<FormGroup>
												<FormControlLabel
													sx={{ mr: "-10px" }}
													value={fixedCouponStatus}
													control={
														<Checkbox
															onChange={(e) => {
																if (e.target.checked) {
																	setFixedCouponStatus(1);
																} else {
																	setFixedCouponStatus(0);
																}
															}}
														/>
													}
													label='تفعيل العرض مع وجود كوبون'
												/>
											</FormGroup>
											<div className='col-12'>
												{offerError?.coupon_status && (
													<span className='fs-6 text-danger'>
														{offerError?.coupon_status}
													</span>
												)}
											</div>
										</div>
									) : (
										<div className='form-body'>
											<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
												<div className='col-md-6 col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>قيمة التخفيض</h4>
														<p>
															ادخال نسبة التخفيض التي سوف يحصل علىها العميل عند
															الشراء
														</p>
													</div>
													<div className='col-12 mt-3'>
														<div className='d-flex flex-row align-items-center'>
															<div className='col-12'>
																<div className='input-icon'>
																	<Dollar className='search-icon' />
																</div>
																<Controller
																	name={"discount_value_offer3"}
																	control={control}
																	rules={{
																		required: "حقل قيمة التخفيض مطلوب",
																		pattern: {
																			value: /^[0-9]+$/i,
																			message: "يجب أن يكون الخصم رقمًا",
																		},
																		min: {
																			value: 0,
																			message:
																				"يجب أن تكون نسبة الخصم أكبر من 0",
																		},
																		max: {
																			value: 100,
																			message:
																				"يجب أن تكون نسبة الخصم أقل من 100",
																		},
																	}}
																	render={({ field: { onChange, value } }) => (
																		<input
																			name='discount_value_offer3'
																			type='text'
																			placeholder='0'
																			value={value}
																			onChange={(e) =>
																				onChange(
																					e.target.value.replace(/[^0-9]/g, "")
																				)
																			}
																		/>
																	)}
																/>
															</div>
															<span className='offer-currency'>%</span>
														</div>
														<div className='col-12'>
															<span className='fs-6 text-danger'>
																{offerError?.discount_value_offer3}
																{errors?.discount_value_offer3 &&
																	errors.discount_value_offer3.message}
															</span>
														</div>
													</div>
												</div>
												<div className='col-md-6 col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>الحد الأقصى للخصم</h4>
														<p>
															ادخال أقصى قيمة للتخفيض الذي سيحصل عليه العميل
														</p>
													</div>
													<div className='col-12 mt-3'>
														<div className='d-flex flex-row align-items-center'>
															<div className='col-12'>
																<div className='input-icon'>
																	<Dollar className='search-icon' />
																</div>
																<Controller
																	name={"maximum_discount"}
																	control={control}
																	rules={{
																		required: "مطلوب حقل الحد الأقصى للخصم",
																		pattern: {
																			value: /^[0-9]+$/i,
																			message:
																				"يجب أن يكون الحد الأقصى للخصم رقمًا",
																		},
																		min: {
																			value: 1,
																			message:
																				"يجب أن يكون الحد الأقصى للخصم أكبر من 0",
																		},
																	}}
																	render={({ field: { onChange, value } }) => (
																		<input
																			name='maximum_discount'
																			type='text'
																			placeholder='0'
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
															<span className='offer-currency'>ر.س</span>
														</div>
													</div>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{offerError?.maximum_discount}
															{errors?.maximum_discount &&
																errors.maximum_discount.message}
														</span>
													</div>
												</div>
											</div>
											<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>يتم تطبيق العرض على</h4>
														<p>اختر واحد من الخيارات التالية</p>
													</div>
													<RadioGroup
														aria-labelledby='demo-controlled-radio-buttons-group'
														name='offer_apply'
														value={offer?.offer_apply}
														onChange={(e) => {
															handleOnChange(e);
														}}>
														<div className='radio-box'>
															<FormControlLabel
																value='all'
																id='all'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.offer_apply === "all"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='all'>
																جميع المنتجات
															</label>
														</div>
														<div className='radio-box'>
															<FormControlLabel
																value='selected_product'
																id='selected_product'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.offer_apply === "selected_product"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='selected_product'>
																منتجات مختارة
															</label>
														</div>
														<div className='radio-box'>
															<FormControlLabel
																value='selected_category'
																id='selected_category'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.offer_apply === "selected_category"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='selected_category'>
																تصنيفات مختارة
															</label>
														</div>
														<div className='radio-box'>
															<FormControlLabel
																value='selected_payment'
																id='selected_payment'
																control={<Radio />}
															/>
															<label
																className={
																	offer?.offer_apply === "selected_payment"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='selected_payment'>
																طرق دفع مختارة
															</label>
														</div>
													</RadioGroup>
													<div className='col-12'>
														{offerError?.offer_apply && (
															<span className='fs-6 text-danger'>
																{offerError?.offer_apply}
															</span>
														)}
													</div>
												</div>
											</div>
											{offer?.offer_apply === "selected_product" && (
												<div className='mx-md-3'>
													<div className='col-12'>
														<div className='input-icon'>
															<SearchIcon className='search-icon' />
														</div>
														<input
															value={fixed_serach}
															onChange={(e) => fixedSearchItems(e.target.value)}
															type='text'
															placeholder='البحث في المنتجات.'
														/>
														<div className='col-12'>
															{offerError?.select_product_id && (
																<span className='fs-6 text-danger'>
																	{offerError?.select_product_id}
																</span>
															)}
														</div>
													</div>
													{fixed_serach !== "" && (
														<ul className='purchase_serach'>
															{fixed_products?.map((item, index) => (
																<li
																	key={index}
																	value={fixedProduct}
																	onClick={() => {
																		if (!fixedProduct.includes(item?.id)) {
																			setFixedProduct([
																				...fixedProduct,
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
															{fixed_products_selected?.map((item, index) => (
																<li key={index}>_ {item?.name}</li>
															))}
														</ul>
													)}
												</div>
											)}
											{offer?.offer_apply === "selected_category" && (
												<div className='col-12 mb-4'>
													<FormControl sx={{ m: 0, width: "100%" }}>
														<Select
															name='select_category_id'
															value={offer?.select_category_id}
															onChange={(e) => {
																handleOnChange(e);
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
																if (offer?.select_category_id === "") {
																	return (
																		<p className='text-[#ADB5B9]'>
																			اختر التصنيف
																		</p>
																	);
																}
																const result =
																	categories?.data?.categories?.filter(
																		(item) => item?.id === parseInt(selected)
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
																				backgroundColor:
																					"rgba(211, 211, 211, 1)",
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
														{offerError?.select_category_id && (
															<span className='fs-6 text-danger'>
																{offerError?.select_category_id}
															</span>
														)}
													</div>
												</div>
											)}
											{offer?.offer_apply === "selected_payment" && (
												<div className='col-12 mb-4'>
													<FormControl sx={{ m: 0, width: "100%" }}>
														<Select
															name='select_payment_id'
															value={offer?.select_payment_id}
															onChange={(e) => {
																handleOnChange(e);
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
																if (offer?.select_payment_id === "") {
																	return (
																		<p className='text-[#ADB5B9]'>
																			اختر طريقة الدفع
																		</p>
																	);
																}
																const result =
																	payments?.data?.payment_types?.filter(
																		(item) => item?.id === parseInt(selected)
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
																				backgroundColor:
																					"rgba(211, 211, 211, 1)",
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
														{offerError?.select_payment_id && (
															<span className='fs-6 text-danger'>
																{offerError?.select_payment_id}
															</span>
														)}
													</div>
												</div>
											)}
											<div className='row  mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>الحد الأدنى لتطبيق العرض</h4>
														<p>اختر واحد من الخيارات التالية</p>
													</div>
													<Controller
														name={"offer_type_minimum"}
														control={control}
														rules={{
															required: "حقل الحد الأدنى لتطبيق العرض مطلوب",
														}}
														render={({ field: { onChange, value } }) => (
															<RadioGroup
																className='row d-flex flex-row mt-4'
																aria-labelledby='demo-controlled-radio-buttons-group'
																value={value}
																onChange={onChange}
																disabled={
																	offer?.offer_type === "percent" ? false : true
																}>
																<div className='col-md-6 col-12'>
																	<div className='radio-box mb-1 '>
																		<FormControlLabel
																			id='purchase_amount'
																			control={
																				<Radio value='purchase_amount' />
																			}
																		/>
																		<label
																			className={
																				value === "purchase_amount"
																					? "active me-3"
																					: " me-3"
																			}
																			htmlFor='purchase_amount'>
																			الحد الأدنى لمبلغ الشراء
																		</label>
																	</div>
																	<div className='d-flex flex-row'>
																		<div className='col-12'>
																			<div className='input-icon'>
																				<Dollar className='search-icon' />
																			</div>
																			<Controller
																				name={"offer_amount_minimum"}
																				control={control}
																				render={({
																					field: { onChange, value },
																				}) => (
																					<input
																						name='offer_amount_minimum'
																						value={
																							value !== "purchase_amount"
																								? ""
																								: offer?.offer_amount_minimum
																						}
																						onChange={(e) => {
																							setOffer({
																								...offer,
																								offer_amount_minimum:
																									e.target.value.replace(
																										/[^\d.]|\.(?=.*\.)/g,
																										""
																									),
																							});
																							onChange(
																								e.target.value.replace(
																									/[^\d.]|\.(?=.*\.)/g,
																									""
																								)
																							);
																						}}
																						type='text'
																						placeholder='0'
																						disabled={
																							value !== "purchase_amount"
																						}
																					/>
																				)}
																			/>
																		</div>
																		<span className='offer-currency'>ر.س</span>
																	</div>
																	<div className='col-12'>
																		{offerError?.offer_amount_minimum && (
																			<span className='fs-6 text-danger'>
																				{offerError?.offer_amount_minimum}
																			</span>
																		)}
																	</div>
																</div>
																<div className='col-md-6 col-12'>
																	<div className='radio-box mb-1'>
																		<FormControlLabel
																			id='product_quantity'
																			control={
																				<Radio value='product_quantity' />
																			}
																		/>
																		<label
																			className={
																				value === "product_quantity"
																					? "active me-3"
																					: " me-3"
																			}
																			htmlFor='product_quantity'>
																			الحد الأدنى لكمية المنتجات
																		</label>
																	</div>
																	<div className='col-12'>
																		<div className='input-icon'>
																			<Quantity className='search-icon' />
																		</div>
																		<Controller
																			name={"offer_amount_minimum"}
																			control={control}
																			render={({
																				field: { onChange, value },
																			}) => (
																				<input
																					name='offer_amount_minimum'
																					value={
																						value !== "product_quantity"
																							? ""
																							: offer?.offer_amount_minimum
																					}
																					onChange={(e) => {
																						setOffer({
																							...offer,
																							offer_amount_minimum:
																								e.target.value.replace(
																									/[^\d.]|\.(?=.*\.)/g,
																									""
																								),
																						});
																						onChange(
																							e.target.value.replace(
																								/[^\d.]|\.(?=.*\.)/g,
																								""
																							)
																						);
																					}}
																					type='text'
																					placeholder='0'
																					disabled={
																						value !== "product_quantity"
																					}
																				/>
																			)}
																		/>
																	</div>
																	<div className='col-12'>
																		{offerError?.offer_amount_minimum && (
																			<span className='fs-6 text-danger'>
																				{offerError?.offer_amount_minimum}
																			</span>
																		)}
																	</div>
																</div>
															</RadioGroup>
														)}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{offerError?.offer_type_minimum}
															{errors?.offer_type_minimum &&
																errors?.offer_type_minimum?.message}
														</span>
													</div>
												</div>
											</div>
											<FormGroup>
												<FormControlLabel
													sx={{ mr: "-10px" }}
													value={couponStatus}
													control={
														<Checkbox
															onChange={(e) => {
																if (e.target.checked) {
																	setCouponStatus(1);
																} else {
																	setCouponStatus(0);
																}
															}}
														/>
													}
													label='تفعيل العرض مع وجود كوبون'
												/>
											</FormGroup>
											<div className='col-12'>
												{offerError?.coupon_status && (
													<span className='fs-6 text-danger'>
														{offerError?.coupon_status}
													</span>
												)}
											</div>
										</div>
									)}
								</div>

								{/** Offers data */}
								<div className='create-offer-form-wrapper offers-data'>
									<div className='row '>
										<div className='col-12'>
											<div className='form-title  d-flex align-content-center'>
												<GiftIcon />
												<h5 className=' me-3'>ملخص العرض</h5>
											</div>
										</div>
									</div>

									<div className='form-body'>
										<div className='row d-flex justify-content-evenly position-relative'>
											<div className='arrow-icon'>
												<ArrowIcon />
											</div>

											<div className='col-md-6 col-12 mb-md-0 mb-3'>
												<div className='offer-terms offer-box p-3'>
													{offer?.offer_type === "If_bought_gets" ? (
														<>
															<p>
																{" "}
																اذا اشترى العميل {offer?.purchase_quantity} قطعة
																من المنتجات التالية
															</p>
															<ul>
																{purchase_products_selected?.map(
																	(item, index) => (
																		<li key={index}> _ {item?.name}</li>
																	)
																)}
															</ul>
														</>
													) : (
														<p>نوع الخصم</p>
													)}
												</div>
											</div>
											<div className='col-md-6 col-12'>
												<div className='offer offer-box p-3'>
													{offer?.offer_type === "If_bought_gets" ? (
														<>
															<p> يحصل مجانا على {offer?.get_quantity} قطعة </p>
															<ul>
																{get_products_selected?.map((item, index) => (
																	<li key={index}> _ {item?.name}</li>
																))}
															</ul>
														</>
													) : (
														<p>
															{offer?.offer1_type === "discount"
																? "نسبة خصم"
																: "منتج مجاني"}
														</p>
													)}
												</div>
											</div>
										</div>
									</div>
								</div>

								{/** form buttons */}
								<div className='form-footer-btn'>
									<div className='row'>
										<div className='col-6'>
											<button
												type='submit'
												className='create-offer-btn active-offer-btn'>
												تفعيل العرض
											</button>
										</div>
										<div className='col-6'>
											<button
												type='button'
												className='create-offer-btn cancel-offer-btn'
												onClick={() => navigate("/Offers")}>
												الغاء العرض
											</button>
										</div>
									</div>
								</div>
							</form>
						</section>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default CreateOffer;
