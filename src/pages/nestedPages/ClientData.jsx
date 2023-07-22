import React, { useState, useContext, useEffect } from "react";
import { Helmet } from "react-helmet";
import Context from "../../Context/context";
import axios from "axios";
import { useCookies } from "react-cookie";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { FormControlLabel, Radio, RadioGroup, Switch } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router-dom";
import moment from "moment";
import useFetch from "../../Hooks/UseFetch";
import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { LoadingContext } from "../../Context/LoadingProvider";

// Datepicker
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// ICONS
import { ReactComponent as DateIcon } from "../../data/Icons/icon-date.svg";
import CircularLoading from "../../HelperComponents/CircularLoading";
import howIcon from "../../data/Icons/icon_24_home.svg";
import { ReactComponent as Message } from "../../data/Icons/icon-24-email.svg";
import { ReactComponent as Phone } from "../../data/Icons/icon-24- call.svg";
import { ReactComponent as Location } from "../../data/Icons/icon-24-pic map.svg";
import { ReactComponent as Timer } from "../../data/Icons/icon-24-timer.svg";
import { ReactComponent as Communication } from "../../data/Icons/ico - 24 - communication - send_outlined.svg";
import { ReactComponent as Dollar } from "../../data/Icons/icon-24-dollar.svg";

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

const ClientData = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/cartShow/${id}`
	);
	const cartDetails = fetchedData?.data?.cart;
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [openPercentMenu, setOpenPercentMenu] = useState(false);
	const [free_shipping, setFree_shipping] = useState(true);
	const [discount_type, setDiscount_type] = useState("percent");
	const [discount_value, setDiscount_value] = useState();
	const [discountPercentValue, setDiscountPercentValue] = useState();
	const [discountFixedValue, setDiscountFixedValue] = useState();
	const [discount_total, setDiscount_total] = useState();
	const [discount_expire_date, setDiscount_expire_date] = useState("");

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
	// ---------------------------------------------------

	// to write the message
	const [description, setDescription] = useState({
		htmlValue: "",
		editorState: EditorState.createEmpty(),
	});
	const onEditorStateChange = (editorValue) => {
		const editorStateInHtml = draftToHtml(
			convertToRaw(editorValue.getCurrentContent())
		);

		setDescription({
			htmlValue: editorStateInHtml,
			editorState: editorValue,
		});
	};
	// -----------------------------------------------------------

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	// --------------------------------------------------------------
	const sendOfferCart = () => {
		setLoadingTitle("جاري ارسال العرض");
		resetError();

		let formData = new FormData();
		formData.append("free_shipping", free_shipping === true ? 1 : 0);
		formData.append("discount_type", discount_type);
		formData.append("discount_value", discount_value);
		formData.append("message", description?.htmlValue);
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
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Carts");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setErrors({
						...errors,
						messageErr: res?.data?.message?.en?.message?.[0],
						discountValueErr: res?.data?.message?.en?.discount_value?.[0],
						discountExpireDateErr:
							res?.data?.message?.en?.discount_expire_date?.[0],
					});
				}
			});
	};

	// To set  discount_total
	useEffect(() => {
		if (cartDetails) {
			setDiscount_total(cartDetails?.discount_total);
			setDiscount_value(cartDetails?.discount_value);
		}
	}, [cartDetails]);

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
	// im using varible to handle

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
					<Box sx={style} className='nested-pages-modal'>
						<div className='user-cart-data'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='head-category mb-md-5 pt-md-4'>
										<div className='row'>
											<div className='col-12'>
												<nav aria-label='breadcrumb'>
													<ol className='breadcrumb'>
														<li className='breadcrumb-item'>
															<img src={howIcon} alt='' />
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
								<form onSubmit={handleSubmit}>
									<div className='user-cart-data-wrapper'>
										<div className='mb-md-5 mb-3'>
											<div className='userData-container'>
												<div className='container-title'>بيانات العميل</div>
												<div className='container-body'>
													<div className='row'>
														<div className='col-md-2 col-12 mb-md-0 mb-3'>
															<div className='client-date'>
																<img
																	className='img-fluid'
																	src={cartDetails?.user?.image}
																	alt={cartDetails?.user?.name}
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
																		{cartDetails?.user?.name}
																	</div>
																</div>
															</div>
															<div className='user-info'>
																<div className='row user-info-row'>
																	<div className='col-md-2 col-12 mb-md-0 mb-3'>
																		<Location />
																		<span className='location '>
																			{cartDetails?.user?.city?.name}
																		</span>
																	</div>
																	<div className='col-md-4  col-12 mb-md-0 mb-3 d-flex justify-content-md-center align-items-center'>
																		<Phone />
																		<span className='location me-1'>
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
														<span className=''>المنتجات</span>

														<span className='product-count me-2'>
															({cartDetails?.count} منتج)
														</span>
													</div>
													<div className='active-discount-btn'>
														<button>
															<Timer />
															<span className='me-2'>تفعيل خصم مؤقت</span>
														</button>
													</div>
												</div>

												<div className='header'>
													<div className='row'>
														<div className='col-5'>
															<div className='product pe-2'>المنتج</div>
														</div>
														<div className='col-2'>
															<div className='count text-center'>الكمية</div>
														</div>
														<div className='col-2'>
															<div className='price text-center'>السعر</div>
														</div>
														<div className='col-3 d-flex justify-content-end'>
															<div className='total text-center'>المجموع</div>
														</div>
													</div>
												</div>
												{cartDetails?.cartDetail?.map((item) => (
													<div
														className='container-body products-details'
														key={item?.id}>
														<div className='row mb-md-4 mb-3'>
															<div className='col-5'>
																<div className='d-flex align-content-center product pe-2'>
																	<img
																		className='img-fluid'
																		style={{
																			width: "36px",
																			height: "36px",
																			borderRadius: "50%",
																		}}
																		src={item?.product?.cover}
																		alt={item?.product?.name}
																	/>
																	<span className='me-1 text-right text-overflow d-inline-block'>
																		{item?.product?.name}{" "}
																	</span>
																</div>
															</div>
															<div className='col-2'>
																<div className='count text-center'>
																	{item?.qty}
																</div>
															</div>
															<div className='col-2'>
																<div className='price text-center'>
																	{item?.price}
																</div>
															</div>
															<div className='col-3 d-flex justify-content-end'>
																<div className='total text-center'>
																	{item?.sum} ر.س
																</div>
															</div>
														</div>
													</div>
												))}
											</div>
											<div
												className='overflow-hidden'
												style={{
													border: "1px solid #f4f2f2",
													borderRadius: "0 0 6px 6px",
												}}>
												<div
													className='row  d-flex justify-content-between align-items-center'
													style={{
														backgroundColor: "rgb(218 253 254 / 43%)",
														padding: "10px",
														paddingLeft: "20px",
													}}>
													<div className='col-5'></div>
													<div className='col-2 d-flex flex-column justify-content-center align-content-center flex-wrap'>
														<div
															className='align-self-center total-of-orders'
															style={{ fontWeight: "500" }}>
															{cartDetails?.count}
														</div>
													</div>
													<div className='col-2'></div>
													<div className='col-3 d-flex flex-column justify-content-end'>
														<div
															className='align-self-end total-of-price'
															style={{ fontWeight: "500" }}>
															{cartDetails?.total} ر.س
														</div>
													</div>
												</div>
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
																onChange={() =>
																	setFree_shipping(!free_shipping)
																}
																checked={free_shipping}
																sx={{
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
																}}
															/>

															<span className='me-2'>شحن مجاني </span>
														</div>
														<div className='col-12 mb-4'>
															<Switch
																onChange={() =>
																	setOpenPercentMenu(!openPercentMenu)
																}
																checked={openPercentMenu}
																sx={{
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
																}}
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
																		<span className='text-danger'>*</span>
																	</label>
																	<RadioGroup
																		defaultValue='percent'
																		className='d-flex flex-row discount-type-radio-group mb-1'
																		aria-labelledby='demo-controlled-radio-buttons-group'
																		value={discount_type}
																		onClick={(e) => {
																			setDiscount_type(e.target.value);
																			console.log(e.target.value);
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
																			cartDetails?.total -
																				discountPercentValue <
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
																				<span className='fs-6 text-danger'>
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
											<div className='d-flex flex-row align-items-center gap-4'>
												<Editor
													className='text-black'
													toolbarHidden={false}
													editorState={description.editorState}
													onEditorStateChange={onEditorStateChange}
													inDropdown={true}
													placeholder={
														<p
															style={{
																fontSize: "20px",
																fontWeight: "400",
																color: "#011723",
																whiteSpace: "normal",
															}}>
															هذا النص هو مثال لنص يمكن أن يستبدل في نفس
															المساحة، لقد تم توليد هذا النص من مولد النص
															العربى، حيث يمكنك أن تولد مثل هذا النص أو العديد
															من النصوص الأخرى
														</p>
													}
													editorClassName='demo-editor'
													toolbar={{
														options: ["inline", "textAlign", "image", "list"],
														inline: {
															options: ["bold"],
														},
														list: {
															options: ["unordered", "ordered"],
														},
													}}
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
														value={cartDetails?.user?.name}
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
														value={
															discount_type === "fixed"
																? discountFixedValue
																: cartDetails?.total - discountPercentValue
														}
														type='number'
														name='total-discount'
														id='total-discount'
													/>
												</div>
												<div className=' mb-md-0 mb-3 box discount-date-box'>
													<label htmlFor='discount-date'>
														تاريخ انتهاء الخصم
													</label>

													<div className='date-icon'>
														<DateIcon />
													</div>
													<DatePicker
														placeholderText='اختر تاريخ انتهاء الخصم'
														type='text'
														dateFormat='yyyy-mm-dd'
														minDate={moment().toDate()}
														selected={discount_expire_date}
														onChange={(date) => setDiscount_expire_date(date)}
													/>
												</div>
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
													<button onClick={sendOfferCart}>
														<Communication />
														<span className='me-2'>ارسال العرض</span>
													</button>
												</div>
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

export default ClientData;
