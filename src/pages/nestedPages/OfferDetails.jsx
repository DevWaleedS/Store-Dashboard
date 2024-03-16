import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useDispatch } from "react-redux";
import { closeVerifyModal } from "../../store/slices/VerifyStoreModal-slice";
import { useParams, Link, useNavigate } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch";
import moment from "moment";

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

// Icons
import { IoIosArrowDown } from "react-icons/io";
import {
	ArrowBack,
	ArrowDown,
	DateIcon,
	Dollar,
	GiftIcon,
	HomeIcon,
	LaptopIcon,
	Mobile,
	MultiDevices,
	OffersIcon,
	Quantity,
	SearchIcon,
} from "../../data/Icons";

// Modal Style
const style = {
	position: "fixed",
	top: "80px",
	left: "0%",
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

const OfferDetails = () => {
	const { id } = useParams();
	const { fetchedData } = useFetch(`offer/${id}`);
	const { fetchedData: categories } = useFetch("selector/mainCategories");
	const { fetchedData: payments } = useFetch("selector/payment_types");
	const { fetchedData: products } = useFetch("selector/products");
	const navigate = useNavigate();
	const dispatch = useDispatch(false);
	const [offer, setOffer] = useState({
		offer_type: "If_bought_gets",
		offer_title: "",
		offer_view: "store_website",
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

	//
	const handleSubmit = (event) => {
		event.preventDefault();
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

	useEffect(() => {
		if (fetchedData?.data?.offers?.offer_type === "If_bought_gets") {
			setOffer({
				...offer,
				offer_type: fetchedData?.data?.offers?.offer_type,
				offer_title: fetchedData?.data?.offers?.offer_title,
				offer_view: fetchedData?.data?.offers?.offer_view,
				purchase_quantity: fetchedData?.data?.offers?.purchase_quantity,
				purchase_type: fetchedData?.data?.offers?.purchase_type,
				get_quantity: fetchedData?.data?.offers?.get_quantity,
				offer1_type: fetchedData?.data?.offers?.offer1_type,
				get_type: fetchedData?.data?.offers?.get_type,
				discount_percent: fetchedData?.data?.offers?.discount_percent,
			});
		} else if (fetchedData?.data?.offers?.offer_type === "fixed_amount") {
			setOffer({
				...offer,
				offer_type: fetchedData?.data?.offers?.offer_type,
				offer_title: fetchedData?.data?.offers?.offer_title,
				offer_view: fetchedData?.data?.offers?.offer_view,
				discount_value_offer2: fetchedData?.data?.offers?.discount_value_offer2,
				fixed_offer_apply: fetchedData?.data?.offers?.offer_apply,
				fixed_offer_type_minimum: fetchedData?.data?.offers?.offer_type_minimum,
				fixed_offer_amount_minimum:
					fetchedData?.data?.offers?.offer_amount_minimum,
			});
			setFixedCouponStatus(
				+fetchedData?.data?.offers?.coupon_status === 1 ? true : false
			);
		} else {
			setOffer({
				...offer,
				offer_type: fetchedData?.data?.offers?.offer_type,
				offer_title: fetchedData?.data?.offers?.offer_title,
				offer_view: fetchedData?.data?.offers?.offer_view,
				offer_apply: fetchedData?.data?.offers?.offer_apply,
				offer_type_minimum: fetchedData?.data?.offers?.offer_type_minimum,
				offer_amount_minimum: fetchedData?.data?.offers?.offer_amount_minimum,
				discount_value_offer3: fetchedData?.data?.offers?.discount_value_offer3,
				maximum_discount: fetchedData?.data?.offers?.maximum_discount,
			});
			setCouponStatus(
				+fetchedData?.data?.offers?.coupon_status === 1 ? true : false
			);
		}
		if (
			fetchedData?.data?.offers?.start_at &&
			fetchedData?.data?.offers?.end_at
		) {
			setStartDate(
				moment(fetchedData?.data?.offers?.start_at, "YYYY-MM-DD").toDate()
			);
			setEndDate(
				moment(fetchedData?.data?.offers?.end_at, "YYYY-MM-DD").toDate()
			);
		} else {
			setStartDate("");
			setEndDate("");
		}
	}, [fetchedData?.data?.offers]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | بيانات العرض</title>
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
													<HomeIcon />
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
							<form onSubmit={handleSubmit}>
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
															disabled
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
															disabled
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
															disabled
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
													value={offer?.offer_title}
													onChange={(e) => {
														handleOnChange(e);
													}}
													type='text'
													id='offer-title'
													disabled
												/>
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
														IconComponent={ArrowDown}
														displayEmpty
														inputProps={{ "aria-label": "Without label" }}
														disabled
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
															<Mobile />
															<span className='me-3'>تطبيق المتجر</span>
														</MenuItem>

														<MenuItem value='both'>
															<MultiDevices />
															<span className='me-3'>موقع و تطبيق المتجر</span>
														</MenuItem>
													</Select>
												</FormControl>
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
													disabled
													selected={startDate}
													placeholderText='تاريخ بداية العرض '
													onChange={(date) => setStartDate(date)}
													dateFormat='yyyy-MM-dd'
												/>
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
													disabled
													selected={endDate}
													placeholderText='تاريخ  نهاية العرض '
													onChange={(date) => setEndDate(date)}
													dateFormat='yyyy-MM-dd'
												/>
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
													<input
														disabled
														name='purchase_quantity'
														value={offer?.purchase_quantity}
														onChange={(e) => {
															handleOnChange(e);
														}}
														type='text'
														id='count'
														placeholder='0'
													/>
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
																disabled
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
																	type='text'
																	placeholder='البحث في المنتجات.'
																	disabled
																/>
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
																disabled
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
																		disabled
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
																				right: "93%",
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
															</div>
														</div>
													</div>
												</RadioGroup>
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
													<input
														disabled
														name='get_quantity'
														value={offer?.get_quantity}
														onChange={(e) => {
															handleOnChange(e);
														}}
														type='text'
														id='count'
														placeholder='0'
													/>
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
																disabled
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
																	type='text'
																	placeholder='البحث في المنتجات.'
																	disabled
																/>
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
																disabled
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
																		disabled
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
													</div>
												</RadioGroup>
											</div>
											<div className='row d-flex  justify-content-evenly'>
												<div className='col-12 mb-2'>
													<h4>نوع الخصم</h4>
												</div>
												<RadioGroup
													className=' d-flex flex-row'
													aria-labelledby='demo-controlled-radio-buttons-group'
													name='offer1_type'
													value={offer?.offer1_type}
													onChange={(e) => {
														handleOnChange(e);
													}}>
													<div className='col-6'>
														<div className='radio-box mb-1 '>
															<FormControlLabel
																disabled
																id='percent'
																control={<Radio />}
																value='percent'
															/>
															<label
																className={
																	offer?.offer1_type === "percent"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='percent'>
																نسبة خصم
															</label>
														</div>
														{offer?.offer1_type === "percent" && (
															<div className='col-12'>
																<div className='row-title'>
																	<h4 className='mb-2'>نسبة الخصم</h4>
																	<p>
																		ادخال نسبة الخصم التي سوف يحصل عليها العميل
																		عند الشراء
																	</p>
																</div>
																<div className='col-12 mt-3'>
																	<div className='d-flex flex-row align-items-center'>
																		<div className='col-12'>
																			<input
																				name='discount_percent'
																				value={offer?.discount_percent}
																				onChange={(e) => {
																					handleOnChange(e);
																				}}
																				type='text'
																				placeholder='0'
																				disabled
																			/>
																		</div>
																		<span className='offer-currency'>%</span>
																	</div>
																</div>
															</div>
														)}
													</div>
													<div className='col-6'>
														<div className='radio-box mb-1'>
															<FormControlLabel
																disabled
																id='free_product'
																control={<Radio />}
																value='free_product'
															/>
															<label
																className={
																	offer?.offer1_type === "free_product"
																		? "active me-3"
																		: " me-3"
																}
																htmlFor='free-product'>
																منتج مجاني
															</label>
														</div>
													</div>
												</RadioGroup>
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
																<input
																	name='discount_value_offer2'
																	value={offer?.discount_value_offer2}
																	onChange={(e) => {
																		handleOnChange(e);
																	}}
																	type='text'
																	placeholder='0'
																	disabled
																/>
															</div>
															<span className='offer-currency'>ر.س</span>
														</div>
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
																disabled
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
																disabled
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
																disabled
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
																disabled
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
															disabled
														/>
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
															disabled
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
															disabled
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
												</div>
											)}
											<div className='row mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>الحد الأدنى لتطبيق العرض</h4>
														<p>اختر واحد من الخيارات التالية</p>
													</div>
													<RadioGroup
														className='row d-flex flex-row mt-4'
														aria-labelledby='demo-controlled-radio-buttons-group'
														name='fixed_offer_type_minimum'
														value={offer?.fixed_offer_type_minimum}
														onChange={(e) => {
															handleOnChange(e);
														}}>
														<div className='col-md-6 col-12'>
															<div className='radio-box mb-1 '>
																<FormControlLabel
																	value='purchase_amount'
																	disabled
																	id='purchase_amount'
																	control={<Radio />}
																/>
																<label
																	className={
																		offer?.fixed_offer_type_minimum ===
																		"purchase_amount"
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
																	<input
																		name='fixed_offer_amount_minimum'
																		value={
																			offer?.fixed_offer_type_minimum ===
																			"purchase_amount"
																				? offer?.fixed_offer_amount_minimum
																				: ""
																		}
																		onChange={(e) => {
																			handleOnChange(e);
																		}}
																		type='text'
																		placeholder='0'
																		disabled
																	/>
																</div>
																<span className='offer-currency'>ر.س</span>
															</div>
														</div>
														<div className='col-md-6 col-12'>
															<div className='radio-box mb-1'>
																<FormControlLabel
																	value='product_quantity'
																	disabled
																	id='product_quantity'
																	control={<Radio />}
																/>
																<label
																	className={
																		offer?.fixed_offer_type_minimum ===
																		"product_quantity"
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
																<input
																	name='fixed_offer_amount_minimum'
																	value={
																		offer?.fixed_offer_type_minimum ===
																		"product_quantity"
																			? offer?.fixed_offer_amount_minimum
																			: ""
																	}
																	onChange={(e) => {
																		handleOnChange(e);
																	}}
																	type='text'
																	placeholder='0'
																	disabled
																/>
															</div>
														</div>
													</RadioGroup>
												</div>
											</div>
											<FormGroup>
												<FormControlLabel
													className='active'
													sx={{ mr: "-10px" }}
													value={fixedCouponStatus}
													control={
														<Checkbox
															disabled
															checked={fixedCouponStatus}
															onChange={(e) => {
																const isChecked = e.target.checked;

																if (isChecked) {
																	setFixedCouponStatus(1);
																} else {
																	setFixedCouponStatus(0);
																}
															}}
														/>
													}
													label='تفعيل العرض مع وجود كود خصم'
												/>
											</FormGroup>
										</div>
									) : (
										<div className='form-body'>
											<div className='row mb-md-5 mb-3 d-flex justify-content-evenly'>
												<div className='col-md-6 col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>قيمة التخفيض</h4>
														<p>
															ادخال نسبة التخفيض التي سوف يحصل عليها العميل عند
															الشراء
														</p>
													</div>
													<div className='col-12 mt-3'>
														<div className='d-flex flex-row align-items-center'>
															<div className='col-12'>
																<div className='input-icon'>
																	<Dollar className='search-icon' />
																</div>
																<input
																	name='discount_value_offer3'
																	value={offer?.discount_value_offer3}
																	onChange={(e) => {
																		handleOnChange(e);
																	}}
																	type='text'
																	placeholder='0'
																	disabled
																/>
															</div>
															<span className='offer-currency'>%</span>
														</div>
													</div>
												</div>
												<div className='col-md-6 col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>الحد الأقصى للخصم</h4>
														<p>
															ادخال أقصى قيمة للتخفيض الذي سيحصل علىه العميل
														</p>
													</div>
													<div className='col-12 mt-3'>
														<div className='d-flex flex-row align-items-center'>
															<div className='col-12'>
																<div className='input-icon'>
																	<Dollar className='search-icon' />
																</div>
																<input
																	name='maximum_discount'
																	value={offer?.maximum_discount}
																	onChange={(e) => {
																		handleOnChange(e);
																	}}
																	type='text'
																	placeholder='0'
																	disabled
																/>
															</div>
															<span className='offer-currency'>ر.س</span>
														</div>
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
																disabled
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
																disabled
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
																disabled
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
																disabled
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
															disabled
														/>
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
															disabled
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
															disabled
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
												</div>
											)}
											<div className='row  mb-3 d-flex justify-content-evenly'>
												<div className='col-12'>
													<div className='row-title'>
														<h4 className='mb-2'>الحد الأدنى لتطبيق العرض</h4>
														<p>اختر واحد من الخيارات التالية</p>
													</div>
													<RadioGroup
														className='row d-flex flex-row mt-4'
														aria-labelledby='demo-controlled-radio-buttons-group'
														name='offer_type_minimum'
														value={offer?.offer_type_minimum}
														onChange={(e) => {
															handleOnChange(e);
														}}
														disabled>
														<div className='col-md-6 col-12'>
															<div className='radio-box mb-1 '>
																<FormControlLabel
																	value='purchase_amount'
																	disabled
																	id='purchase_amount'
																	control={<Radio />}
																/>
																<label
																	className={
																		offer?.offer_type_minimum ===
																		"purchase_amount"
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
																	<input
																		name='offer_amount_minimum'
																		value={
																			offer?.offer_type_minimum ===
																			"purchase_amount"
																				? offer?.offer_amount_minimum
																				: ""
																		}
																		onChange={(e) => {
																			handleOnChange(e);
																		}}
																		type='text'
																		placeholder='0'
																		disabled
																	/>
																</div>
																<span className='offer-currency'>ر.س</span>
															</div>
														</div>
														<div className='col-md-6 col-12'>
															<div className='radio-box mb-1'>
																<FormControlLabel
																	value='product_quantity'
																	disabled
																	id='product_quantity'
																	control={<Radio />}
																/>
																<label
																	className={
																		offer?.offer_type_minimum ===
																		"product_quantity"
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
																<input
																	name='offer_amount_minimum'
																	value={
																		offer?.offer_type_minimum ===
																		"product_quantity"
																			? offer?.offer_amount_minimum
																			: ""
																	}
																	onChange={(e) => {
																		handleOnChange(e);
																	}}
																	type='text'
																	placeholder='0'
																	disabled
																/>
															</div>
														</div>
													</RadioGroup>
												</div>
											</div>
											<FormGroup>
												<FormControlLabel
													sx={{ mr: "-10px" }}
													value={couponStatus}
													control={
														<Checkbox
															checked={couponStatus}
															disabled
															onChange={(e) => {
																if (e.target.checked) {
																	setFixedCouponStatus(1);
																} else {
																	setFixedCouponStatus(0);
																}
															}}
														/>
													}
													label='تفعيل العرض مع وجود كود خصم'
												/>
											</FormGroup>
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
												<ArrowBack />
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
									<div className='row justify-content-center'>
										<div className='col-6'>
											<button
												type='button'
												className='create-offer-btn cancel-offer-btn'
												onClick={() => navigate("/Offers")}>
												إغلاق
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

export default OfferDetails;
