import React, { useState, useContext, useEffect } from "react";

// Third Party
import axios from "axios";
import moment from "moment";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

import { Link, useNavigate, useParams } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";
import { TextEditorContext } from "../../Context/TextEditorProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { FormControlLabel, Radio, RadioGroup, Switch } from "@mui/material";

// Components
import useFetch from "../../Hooks/UseFetch";
import { TextEditor } from "../../components/TextEditor";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ICONS
import howIcon from "../../data/Icons/icon_24_home.svg";
import {
	Communication,
	DateIcon,
	Dollar,
	Location,
	Message,
	Phone,
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

// Content style
const contentStyles = {
	width: "100%",
	minWidth: "100%",
	height: "64px",
	background: "#F4F5F7",
	border: "1px solid #67747B33",
	borderRadius: "3px 3px 0px 0px",
	whiteSpace: "normal",
	fontSize: "20px",
	fontWight: 500,
	color: "#011723",
};

// Switch style
const switchStyle = {
	"& .MuiSwitch-track": {
		width: 36,
		height: 22,
		opacity: 1,
		backgroundColor: "rgba(0,0,0,.25)",
		boxSizing: "border-box",
		borderRadius: 20,
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		backgroundColor: "#EBEBEB",
		width: 16,
		height: 16,
		borderRadius: 4,
		transform: "translate(7px,7px)",
	},
	"&:hover": {
		"& .MuiSwitch-thumb": {
			boxShadow: "none",
		},
	},

	"& .MuiSwitch-switchBase": {
		"&:hover": {
			boxShadow: "none",
			backgroundColor: "none",
		},
		padding: 1,
		"&.Mui-checked": {
			transform: "translateX(12px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#3AE374",
			},
			"&:hover": {
				boxShadow: "none",
				backgroundColor: "none",
			},
		},
	},
};

const ClientData = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/cartShow/${id}`
	);
	const cartDetails = fetchedData?.data?.cart;

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	const [openPercentMenu, setOpenPercentMenu] = useState(false);
	const [free_shipping, setFree_shipping] = useState(false);
	const [discount_type, setDiscount_type] = useState(null);
	const [discount_value, setDiscount_value] = useState(0);
	const [discountPercentValue, setDiscountPercentValue] = useState(0);
	const [discountFixedValue, setDiscountFixedValue] = useState(0);
	const [discount_total, setDiscount_total] = useState(0);
	const [discount_expire_date, setDiscount_expire_date] = useState("");

	// ----------------------------------------------------------------------

	// To set discount_total
	useEffect(() => {
		if (cartDetails) {
			setDiscount_total(cartDetails?.discount_total);
			setDiscount_value(cartDetails?.discount_value);
			setDiscount_type(cartDetails?.discount_type);
			setFree_shipping(cartDetails?.free_shipping === "0" ? false : true);
			setEditorValue(cartDetails?.message || "");
		}
	}, [cartDetails]);

	// to handle open discount_type inputs
	useEffect(() => {
		if (
			cartDetails?.discount_type !== "" &&
			cartDetails?.discount_total !== 0 &&
			cartDetails?.discount_value !== 0
		) {
			setOpenPercentMenu(true);
		} else {
			setOpenPercentMenu(false);
		}
	}, [
		cartDetails?.discount_type,
		cartDetails?.discount_total,
		cartDetails?.discount_value,
	]);

	// To Calc discount total if the discount value is percent
	useEffect(() => {
		if (cartDetails && discount_type === "percent") {
			setDiscountPercentValue((discount_value / 100) * cartDetails?.total);
		} else if (cartDetails && discount_type === "fixed") {
			setDiscountFixedValue(cartDetails?.total - discount_value);
		} else {
			setDiscountPercentValue();
			setDiscountFixedValue();
		}
	}, [cartDetails, discount_type, discount_value]);

	// to handle  total discount value
	const [discountValue, setDiscountValue] = useState("---");
	useEffect(() => {
		calculateDiscountValue();
	}, [
		cartDetails,
		discount_type,
		discountFixedValue,
		discountPercentValue,
		openPercentMenu,
	]);

	const calculateDiscountValue = () => {
		let calculatedValue = "---";

		if (openPercentMenu) {
			if (discount_type === "fixed") {
				calculatedValue = discountFixedValue <= 0 ? "---" : discountFixedValue;
			} else if (discount_type === "percent") {
				const totalAfterDiscount = (
					cartDetails?.total - discountPercentValue
				)?.toFixed(2);
				calculatedValue = totalAfterDiscount <= 0 ? "---" : totalAfterDiscount;
			} else {
				calculatedValue = cartDetails?.total <= 0 ? "---" : cartDetails?.total;
			}
		} else {
			calculatedValue = cartDetails?.total <= 0 ? "---" : cartDetails?.total;
		}

		setDiscountValue(calculatedValue);
	};
	// -----------------------------------------------------------------------

	// errors
	const [errors, setErrors] = useState({
		messageErr: "",
		discountValueErr: "",
		discountExpireDateErr: "",
	});
	const resetError = () => {
		setErrors({
			message: "",
			discount_value: "",
			discount_expire_date: "",
		});
	};
	// -----------------------------------------------------------------------

	// --------------------------------------------------------------
	const sendOfferCart = () => {
		setLoadingTitle("جاري ارسال العرض");
		resetError();

		let formData = new FormData();
		formData.append("free_shipping", free_shipping === true ? 1 : 0);
		if (openPercentMenu) {
			formData.append("discount_type", discount_type);
			formData.append("discount_value", discount_value);
		} else {
			formData.append("discount_type", "");
			formData.append("discount_value", "");
		}

		formData.append("message", editorValue);
		formData.append("discount_total", discount_total);
		formData.append(
			"discount_expire_date",
			discount_expire_date
				? moment(discount_expire_date).format("YYYY-MM-DD")
				: ""
		);

		axios
			.post(
				`https://backend.atlbha.com/api/Store/sendOfferCart/${id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${localStorage.getItem("store_token")}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Carts");
					setReload(!reload);
					setEditorValue(null);
				} else {
					setLoadingTitle("");
					setErrors({
						...errors,
						messageErr: res?.data?.message?.en?.message?.[0],
						discountValueErr: res?.data?.message?.en?.discount_value?.[0],
						discountExpireDateErr:
							res?.data?.message?.en?.discount_expire_date?.[0],
					});

					toast.error(res?.data?.message?.en?.message?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.discount_value?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.discount_expire_date?.[0], {
						theme: "light",
					});
				}
			});
	};

	function EnhancedTableHead() {
		return (
			<TableHead sx={{ backgroundColor: "#cce4ff38" }}>
				<TableRow>
					<TableCell align='right' sx={{ color: "#02466a" }}>
						م
					</TableCell>
					<TableCell align='right' sx={{ color: "#02466a" }}>
						المنتج
					</TableCell>
					<TableCell align='right' sx={{ color: "#02466a" }}>
						الكمية
					</TableCell>
					<TableCell align='right' sx={{ color: "#02466a" }}>
						الإجمالي
					</TableCell>
				</TableRow>
			</TableHead>
		);
	}

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تفاصيل السلة</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Carts")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style} className='nested-pages-modal'>
						<div className='user-cart-data'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='head-category mb-md-5 pt-md-4'>
										<div className='row'>
											<div className='col-12'>
												<nav aria-label='breadcrumb'>
													<ol className='breadcrumb'>
														<li className='breadcrumb-item'>
															<img src={howIcon} alt='' loading='lazy' />
															<Link to='/' className='me-2'>
																الرئيسية
															</Link>
														</li>
														<li
															className='breadcrumb-item '
															aria-current='page'>
															<Link to='/Carts' className='me-2'>
																السلات المتروكة
															</Link>
														</li>
														<li
															className='breadcrumb-item active'
															aria-current='page'>
															# {cartDetails?.user?.name}
														</li>
													</ol>
												</nav>
											</div>
										</div>
									</div>
								</div>
							</div>

							{loading ? (
								<div
									className='d-flex justify-content-center align-items-center'
									style={{ height: "200px" }}>
									<CircularLoading />
								</div>
							) : (
								<div className='user-cart-data-wrapper'>
									<div className='mb-md-5 mb-3'>
										{/** client details */}
										<div className='userData-container'>
											<div className='container-title'>بيانات العميل</div>
											<div className='container-body'>
												<div className='row'>
													<div className='col-md-2 col-12 mb-md-0 mb-3'>
														<div className='client-date'>
															<img
																className='img-fluid'
																src={cartDetails?.user?.image}
																alt={""}
															/>
															<div className='text'>
																<div className='register-type mb-1'>
																	{cartDetails?.user_type === "store"
																		? "	التسجيل في المتجر"
																		: "	التسجيل في المتجر"}
																</div>

																<div className='register-date'>
																	{moment(cartDetails?.created_at).format(
																		"DD-MM-YYYY"
																	)}
																</div>
															</div>
														</div>
													</div>
													<div className='col-md-8 col-12  align-self-center'>
														<div className='row mb-4 '>
															<div className='col-12 col-md-5'>
																<div className='user-name '>
																	{`${cartDetails?.user?.name} ${cartDetails?.user?.lastname}`}
																</div>
															</div>
														</div>
														<div className='user-info'>
															<div className='row user-info-row'>
																<div className='col-md-2 col-12 mb-md-0 mb-3'>
																	<Location />
																	<span className='location'>
																		{cartDetails?.user?.city?.name}
																	</span>
																</div>
																<div className='col-md-4  col-12 mb-md-0 mb-3 d-flex justify-content-md-center align-items-center'>
																	<Phone />
																	<span
																		className='location me-1'
																		style={{ direction: "ltr" }}>
																		{" "}
																		{cartDetails?.user?.phonenumber}{" "}
																	</span>
																</div>
																<div className='col-md-3 me-md-4 col-12 p-md-0'>
																	<Message />
																	<span className='location me-1'>
																		{cartDetails?.user?.email}{" "}
																	</span>
																</div>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/** Products details */}
									<div className='mb-md-5 mb-3'>
										<div
											className='userData-container overflow-hidden'
											style={{ borderBottom: "none" }}>
											<div className='container-title d-flex justify-content-between align-items-center'>
												<div className='tit-box'>
													<span> تفاصيل المنتجات</span>

													<span className='product-count me-2'>
														({cartDetails?.count} منتج)
													</span>
												</div>
											</div>

											<TableContainer>
												<Table
													sx={{ minWidth: 750 }}
													aria-labelledby='tableTitle'>
													<EnhancedTableHead />
													<TableBody>
														{cartDetails?.cartDetail?.map((row, index) => (
															<TableRow hover tabIndex={-1} key={index}>
																<TableCell
																	component='th'
																	id={index}
																	scope='row'
																	align='right'>
																	<div
																		className='flex items-center'
																		style={{
																			display: "flex",
																			justifyContent: "start",
																			alignItems: "center",
																			gap: "7px",
																		}}>
																		{(index + 1).toLocaleString("en-US", {
																			minimumIntegerDigits: 2,
																			useGrouping: false,
																		})}
																	</div>
																</TableCell>

																<TableCell align='right'>
																	<div className='d-flex flex-row align-items-center'>
																		<img
																			className='rounded-circle img_icons'
																			src={row?.product?.cover}
																			alt='client'
																		/>
																		<span
																			className='me-3'
																			style={{
																				minWidth: "400px",
																				maxWidth: "550px",
																				whiteSpace: "nowrap",
																				overflow: "hidden",
																				textOverflow: "ellipsis",
																			}}>
																			{row?.product?.name}
																		</span>
																	</div>
																</TableCell>
																<TableCell align='right' sx={{ width: "90px" }}>
																	<div className='text-center'>
																		<span>{row?.qty}</span>
																	</div>
																</TableCell>
																<TableCell align='center'>
																	<span className='table-price_span'>
																		{row?.sum} ر.س
																	</span>
																</TableCell>
															</TableRow>
														))}
														<TableRow>
															<TableCell
																colSpan={3}
																component='th'
																scope='row'
																align='right'
																style={{ borderBottom: "none" }}>
																<span style={{ fontWeight: "700" }}>السعر</span>
															</TableCell>
															<TableCell
																align='center'
																style={{ borderBottom: "none" }}>
																<span
																	className='table-price_span'
																	style={{ fontWeight: "500" }}>
																	{fetchedData?.data?.cart?.subtotal} ر.س
																</span>
															</TableCell>
														</TableRow>
														<TableRow>
															<TableCell
																colSpan={3}
																component='th'
																scope='row'
																align='right'
																style={{ borderBottom: "none" }}>
																<span style={{ fontWeight: "700" }}>
																	الضريبة
																</span>
															</TableCell>
															<TableCell
																align='center'
																style={{ borderBottom: "none" }}>
																<span
																	className='table-price_span'
																	style={{ fontWeight: "500" }}>
																	{fetchedData?.data?.cart?.tax} ر.س
																</span>
															</TableCell>
														</TableRow>

														<TableRow>
															<TableCell
																colSpan={3}
																component='th'
																scope='row'
																align='right'
																style={{ borderBottom: "none" }}>
																<span style={{ fontWeight: "700" }}>الشحن</span>
															</TableCell>
															<TableCell
																align='center'
																style={{ borderBottom: "none" }}>
																<span
																	className='table-price_span'
																	style={{ fontWeight: "500" }}>
																	{fetchedData?.data?.cart?.shipping_price} ر.س
																</span>
															</TableCell>
														</TableRow>

														{fetchedData?.data?.cart?.overweight !== 0 &&
															fetchedData?.data?.cart?.overweight_price !==
																0 && (
																<TableRow>
																	<TableCell
																		colSpan={3}
																		component='th'
																		scope='row'
																		align='right'
																		style={{ borderBottom: "none" }}>
																		<span style={{ fontWeight: "700" }}>
																			تكلفة الوزن الزائد (
																			{fetchedData?.data?.cart?.overweight} kg )
																		</span>
																	</TableCell>

																	<TableCell
																		align='center'
																		style={{ borderBottom: "none" }}>
																		<span
																			className='table-price_span'
																			style={{ fontWeight: "500" }}>
																			{
																				fetchedData?.data?.cart
																					?.overweight_price
																			}{" "}
																			ر.س
																		</span>
																	</TableCell>
																</TableRow>
															)}
														{fetchedData?.data?.cart?.discount_total !== 0 && (
															<TableRow>
																<TableCell
																	colSpan={3}
																	component='th'
																	scope='row'
																	align='right'
																	style={{ borderBottom: "none" }}>
																	<span style={{ fontWeight: "700" }}>
																		الخصم
																	</span>
																</TableCell>
																<TableCell
																	align='center'
																	style={{ borderBottom: "none" }}>
																	<span
																		className='table-price_span'
																		style={{ fontWeight: "500" }}>
																		{fetchedData?.data?.cart?.discount_total}{" "}
																		ر.س
																	</span>
																</TableCell>
															</TableRow>
														)}
														<TableRow>
															<TableCell
																colSpan={3}
																component='th'
																scope='row'
																align='right'
																style={{
																	borderBottom: "none",
																	backgroundColor: "#e1e1e1",
																}}>
																<span style={{ fontWeight: "700" }}>
																	الإجمالي
																</span>
															</TableCell>
															<TableCell
																align='center'
																style={{
																	borderBottom: "none",
																	backgroundColor: "#e1e1e1",
																}}>
																<span
																	className='table-price_span'
																	style={{ fontWeight: "500" }}>
																	{fetchedData?.data?.cart?.total} ر.س
																</span>
															</TableCell>
														</TableRow>
													</TableBody>
												</Table>
											</TableContainer>
										</div>
									</div>
									{/** Discount details */}
									<div className='mb-md-5 mb-3'>
										<div className='userData-container'>
											<div className='container-title'> تفاصيل الخصم</div>
											<div
												className='container-body'
												style={{ height: "100%" }}>
												<div className='row'>
													<div className='col-12 mb-4'>
														<Switch
															onChange={() => {
																setFree_shipping(!free_shipping);
																setOpenPercentMenu(false);
															}}
															checked={free_shipping}
															sx={switchStyle}
														/>

														<span className='me-2'>شحن مجاني </span>
													</div>
													<div className='col-12 mb-4'>
														<Switch
															onChange={() => {
																setOpenPercentMenu(!openPercentMenu);
																setFree_shipping(false);
															}}
															checked={openPercentMenu}
															sx={switchStyle}
														/>

														<span className='me-2'> خصم على السلة </span>
													</div>
													<div className='col-12 '>
														{openPercentMenu && (
															<>
																<label
																	htmlFor='coupon-name '
																	className='d-block mb-1'>
																	نوع الخصم
																	<span className='important-hint'>*</span>
																</label>
																<RadioGroup
																	defaultValue='percent'
																	className='d-flex flex-row discount-type-radio-group mb-1'
																	aria-labelledby='demo-controlled-radio-buttons-group'
																	value={discount_type}
																	onClick={(e) => {
																		setDiscount_type(e.target.value);
																	}}>
																	<div
																		className='radio-box discount-radio-box'
																		style={{ marginRight: "-30px" }}>
																		<FormControlLabel
																			value='percent'
																			id='percent'
																			control={
																				<Radio
																					sx={{
																						".MuiSvgIcon-root": {
																							width: "24px",
																							height: "24px",
																						},
																					}}
																				/>
																			}
																		/>

																		<label
																			className={
																				discount_type === "percent"
																					? "me-3"
																					: "disabled me-3"
																			}
																			htmlFor='percent-price'>
																			نسبة من المشتريات
																		</label>
																	</div>
																	<div className='radio-box last_one'>
																		<FormControlLabel
																			value='fixed'
																			id='fixed'
																			control={
																				<Radio
																					sx={{
																						".MuiSvgIcon-root": {
																							width: "24px",
																							height: "24px",
																						},
																					}}
																				/>
																			}
																		/>
																		<label
																			className={
																				discount_type === "fixed"
																					? "me-3"
																					: "disabled me-3"
																			}
																			htmlFor='fixed-price'>
																			مبلغ ثابت من المشتريات
																		</label>
																	</div>
																</RadioGroup>

																<div>
																	<div className='percent-input-wrapper my-1'>
																		<Dollar />
																		<input
																			value={discount_value}
																			onChange={(e) =>
																				setDiscount_value(e.target.value)
																			}
																			className='w-100 '
																			type='text'
																			placeholder={
																				discount_type === "percent"
																					? "أدخل نسبة الخصم  "
																					: "أدخل قيمة المبلغ"
																			}
																		/>
																		{discount_type === "percent" ? (
																			<div className='percent-sign'> %</div>
																		) : (
																			<div className='percent-sign'>ر.س</div>
																		)}
																	</div>

																	{discount_type === "fixed" &&
																		discount_value > cartDetails?.total && (
																			<div>
																				<span className='fs-6 text-danger'>
																					قيمة المبلغ اكبر من اجمالي السلة
																				</span>
																			</div>
																		)}
																	{discount_type === "fixed" &&
																		discount_value == cartDetails?.total && (
																			<div>
																				<span className='fs-6 text-danger'>
																					قيمة المبلغ متساوية من اجمالي السلة
																				</span>
																			</div>
																		)}
																	{discount_type === "percent" &&
																		cartDetails?.total - discountPercentValue <
																			0 && (
																			<div>
																				<span className='fs-6 text-danger'>
																					قيمة النسبة اكبر من اجمالي السلة
																				</span>
																			</div>
																		)}
																	{discount_type === "percent" &&
																		cartDetails?.total -
																			discountPercentValue ===
																			0 && (
																			<div>
																				<span className='fs-6 text-danger'>
																					قيمة النسبة متساوية من اجمالي السلة
																				</span>
																			</div>
																		)}

																	{errors?.discountValueErr && (
																		<div>
																			<span
																				className='fs-6 text-danger'
																				style={{ whiteSpace: "normal" }}>
																				{errors?.discountValueErr}
																			</span>
																		</div>
																	)}
																</div>
															</>
														)}
													</div>
												</div>
											</div>
										</div>
									</div>
									{/** Products */}
									<div className='mb-5 overflow-hidden'>
										<div
											style={contentStyles}
											className='d-flex flex-row align-items-center gap-4 px-3 py-4'>
											<h2
												style={{
													fontSize: "20px",
													fontWeight: "500",
													color: "#011723",
												}}>
												نص الرسالة
											</h2>
										</div>
										<div className='d-flex flex-row align-items-center gap-4 empty-cart'>
											<TextEditor
												ToolBar={"emptyCart"}
												placeholder={"اكتب الرساله..."}
											/>
										</div>
										{errors?.messageErr && (
											<div>
												<span className='fs-6 text-danger'>
													{errors?.messageErr}
												</span>
											</div>
										)}
									</div>
									{/** Products */}
									<div className='mb-md-5 mb-3'>
										<div className='create-offer-row'>
											<div className='mb-md-0 mb-3 box user-name-box '>
												<label htmlFor='user-name'>اسم العميل</label>
												<input
													disabled
													value={`${cartDetails?.user?.name} ${cartDetails?.user?.lastname}`}
													onChange={() => console.log("")}
													type='text'
													name='user-name'
													id='user-name'
												/>
											</div>
											<div className='mb-md-0 mb-3 box total-discount-box'>
												<label htmlFor='total-discount'>
													اجمالي السلة بعد الخصم
												</label>
												<input
													disabled
													className='direction-ltr text-center'
													value={discountValue}
													type='text'
													name='total-discount'
													id='total-discount'
												/>
											</div>
											{(free_shipping || openPercentMenu) && (
												<div className=' mb-md-0 mb-3 box discount-date-box'>
													<label htmlFor='discount-date'>
														تاريخ انتهاء العرض
													</label>

													<div className='date-icon'>
														<DateIcon />
													</div>
													<DatePicker
														placeholderText='اختر تاريخ انتهاء العرض'
														type='text'
														dateFormat='yyyy-MM-dd'
														minDate={moment().toDate()}
														selected={discount_expire_date}
														onChange={(date) => setDiscount_expire_date(date)}
													/>
												</div>
											)}
										</div>
									</div>
									{/** Products */}
									<div className='mb-md-5 mb-3'>
										<div className='col-12 p-0'>
											{errors?.discountExpireDateErr && (
												<div
													className='text-center '
													style={{ marginTop: "-35px" }}>
													<span
														className='fs-6 text-danger'
														style={{ whiteSpace: "normal" }}>
														({errors?.discountExpireDateErr})
													</span>
												</div>
											)}
											<div className='send-offer-btn'>
												<button
													onClick={sendOfferCart}
													disabled={
														discountFixedValue <= 0 || cartDetails?.total <= 0
													}>
													<Communication />
													<span className='me-2'>ارسال العرض</span>
												</button>
											</div>
										</div>
									</div>
								</div>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default ClientData;
