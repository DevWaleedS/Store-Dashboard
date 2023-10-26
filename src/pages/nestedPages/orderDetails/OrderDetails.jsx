import React, { useState, useContext, useRef, Fragment, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useFetch from "../../../Hooks/UseFetch";
import { Link } from "react-router-dom";
import CircularLoading from "../../../HelperComponents/CircularLoading";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import moment from "moment";
import { LoadingContext } from "../../../Context/LoadingProvider";

// to download order details as pdf file
import Pdf from "react-to-pdf";

// to print order details
import ReactToPrint from "react-to-print";

// Icons
import { ReactComponent as StatusIcon } from "../../../data/Icons/status.svg";
import { ReactComponent as DateIcon } from "../../../data/Icons/icon-date.svg";
import { ReactComponent as WalletIcon } from "../../../data/Icons/icon-24-wallet.svg";
import { ReactComponent as ArrowIcon } from "../../../data/Icons/icon-30-arrwos back.svg";
import { ReactComponent as Client } from "../../../data/Icons/icon-24-user.svg";
import { ReactComponent as Message } from "../../../data/Icons/icon-24-email.svg";
import { ReactComponent as Phone } from "../../../data/Icons/icon-24- call.svg";
import { ReactComponent as Location } from "../../../data/Icons/icon-24-pic map.svg";
import { ReactComponent as ArrowDown } from "../../../data/Icons/icon-24-chevron_down.svg";
import { ReactComponent as Print } from "../../../data/Icons/icon-24-print.svg";
import { ReactComponent as PDFIcon } from "../../../data/Icons/pfd.svg";
import { ReactComponent as Quantity } from "../../../data/Icons/icon-24-Quantity.svg";
// import { ReactComponent as DeleteIcon } from '../../../data/Icons/icon-24-delete.svg';
import { ReactComponent as ListIcon } from "../../../data/Icons/icon-24-circlr.svg";
import { AiFillCopy, AiFillCheckCircle, AiOutlineSearch } from "react-icons/ai";
import { BiLinkExternal } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

const OrderDetails = () => {
	// to send the order sticker to preview and print sticker page
	const previewStickerContext = useContext(Context);
	const { setPreviewSticker } = previewStickerContext;
	// -------------------------------------------------

	const componentRef = useRef();
	const { id } = useParams();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/orders/${id}`
	);
	const { fetchedData: cities } = useFetch(
		`https://backend.atlbha.com/api/Store/getAllCity`
	);
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const navigate = useNavigate();
	const [copy, setCopy] = useState(false);
	const [printError, setPrintError] = useState("");
	const [shipping, setShipping] = useState({
		district: "",
		city: "",
		address: "",
		weight: "",
	});

	const [error, setError] = useState({
		district: "",
		city: "",
		address: "",
		weight: "",
	});

	const resetError = () => {
		setError({
			district: "",
			city: "",
			address: "",
			weight: "",
		});
	};

	useEffect(() => {
		if (fetchedData?.data?.orders?.shipping) {
			setShipping({
				...shipping,
				district: fetchedData?.data?.orders?.shipping?.district,
				city: fetchedData?.data?.orders?.shipping?.city,
				address: fetchedData?.data?.orders?.shipping?.street_address,
				weight: fetchedData?.data?.orders?.shipping?.weight,
			});
		}
	}, [fetchedData?.data?.orders?.shipping]);

	function removeDuplicates(arr) {
		const unique = arr?.filter((obj, index) => {
			return index === arr?.findIndex((o) => obj?.province === o?.province);
		});
		return unique;
	}

	const getCityFromProvince =
		cities?.data?.cities?.data?.cities?.filter(
			(obj) =>
				obj?.province ===
				(shipping?.district)
		) || [];

	function translateProvinceName(name) {
		const unique = cities?.data?.cities?.data?.cities?.filter(
			(obj) => obj?.province === name
		);
		return unique?.[0]?.provice_ar || name;
	}

	function translateCityName(name) {
		const unique = cities?.data?.cities?.data?.cities?.filter(
			(obj) => obj?.name === name
		);
		return unique?.[0]?.name_ar || name;
	}

	const updateOrderStatus = (status) => {
		setLoadingTitle("جاري تعديل حالة الطلب");
		resetError();
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("status", status);
		if (status === "ready" || status === "canceled") {
			formData.append("district",shipping?.district);
			formData.append("city", shipping?.city);
			formData.append("street_address", shipping?.address);
			formData.append("weight", shipping?.weight);
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/orders/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setEndActionTitle("");
					setError({
						district: res?.data?.message?.en?.district?.[0],
						city: res?.data?.message?.en?.city?.[0],
						address: res?.data?.message?.en?.street_address?.[0],
						weight: res?.data?.message?.en?.weight?.[0],
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
					<TableCell align='center' sx={{ color: "#02466a" }}>
						الإجمالي
					</TableCell>
				</TableRow>
			</TableHead>
		);
	}

	const printSticker = () => {
		setPrintError("");
		if (fetchedData?.data?.orders?.shippingtypes?.name === "ساعي") {
			axios
				.get(
					`https://backend.atlbha.com/api/Store/PrintSaeeSticker/${fetchedData?.data?.orders?.shipping?.shipping_id}`,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${cookies?.access_token}`,
						},
					}
				)
				.then((res) => {
					if (res?.data?.success === true && res?.data?.data?.status === 200) {
						// navigate("preview-sticker");
						// Open a new window with the HTML content
						const newTab = window.open("", "_blank");
						if (newTab) {
							newTab.document.write(res?.data?.data?.Sticker?.data);
							newTab.document.close();
						} else {
							console.error("Failed to open a new tab");
						}
						// setPreviewSticker(res?.data?.data?.Sticker?.data);
					} else {
						setReload(!reload);
						setPrintError(res?.data?.message?.ar);
					}
				});
		} else {
			axios
				.get(
					`https://backend.atlbha.com/api/Store/PrintSmsaSticker/${fetchedData?.data?.orders?.shipping?.shipping_id}`,
					{
						headers: {
							"Content-Type": "multipart/form-data",
							Authorization: `Bearer ${cookies?.access_token}`,
						},
					}
				)
				.then((res) => {
					if (res?.data?.success === true && res?.data?.data?.status === 200) {
						console.log();
						window.open(`https://dashboard.go-tex.net/api${res?.data?.data?.Sticker?.data?.[0]}`, "_blank");
					} else {
						setReload(!reload);
						setPrintError(res?.data?.message?.ar);
					}
				});
		}
	};

	// handle calc total price if codePrice is !== 0
	const calcTotalPrice = (codprice, totalPrice) => {
		const cashOnDelivery = codprice || 0;
		const totalCartValue = parseFloat(totalPrice?.replace(/,/g, ""));

		const totalValue = cashOnDelivery
			? (totalCartValue + cashOnDelivery)?.toFixed(2)
			: totalPrice;
		return totalValue;
	};


	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تفاصيل الطلب</title>
			</Helmet>
			<section
				className='order-details-page orders-pages p-md-3'
				id='report'
				ref={componentRef}>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
					</div>
				</div>
				<div className='head-category mb-5 pt-md-4'>
					<div className='row '>
						<div className='col-md-6 col-12'>
							<h3>تفاصيل الطلب</h3>
							{/** breadcrumb */}
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<Link to='/Orders'>
											<ArrowIcon className='arrow-back-icon' />
										</Link>
										<Link to='/Orders' className='me-2'>
											جدول الطلبات
										</Link>
									</li>
									<li className='breadcrumb-item active ' aria-current='page'>
										تفاصيل الطلب
									</li>
								</ol>
							</nav>
						</div>
						<div className='col-md-6 col-12 d-flex justify-content-md-end justify-content-center'>
							<div className='order-number'>
								<div className='title'>
									<h5>رقم الطلب</h5>
								</div>
								<div className='number'>
									{loading ? 0 : fetchedData?.data?.orders?.order_number}
								</div>
							</div>
						</div>
					</div>
				</div>

				<div className='order-details-body'>
					{loading ? (
						<CircularLoading />
					) : (
						<>
							<div>
								<div className='mb-md-5 mb-4'>
									<div className='order-details-box '>
										<div className='title mb-4'>
											<h5>بيانات الطلب</h5>
										</div>
										<div className='order-details-data pt-md-4 pb-md-4'>
											<div className='boxes mb-4'>
												<div className='box'>
													<div className='order-head-row'>
														<StatusIcon />
														<span className='me-3'>الحالة</span>
													</div>
													<div className='order-data-row'>
														<span>{fetchedData?.data?.orders?.status}</span>
													</div>
												</div>
												<div className='box'>
													<div className='order-head-row'>
														<DateIcon className='date-icon' />
														<span className='me-3'>تاريخ الطلب</span>
													</div>

													<div className='order-data-row'>
														<span>
															{moment(
																fetchedData?.data?.orders?.created_at
															).format("DD-MM-YYYY")}
														</span>
													</div>
												</div>
												<div className='box'>
													<div className='order-head-row'>
														<WalletIcon />
														<span className='me-3 price'>إجمالي الطلب</span>
													</div>
													<div className='order-data-row'>
														<span>
															{calcTotalPrice(
																fetchedData?.data?.orders?.codprice,
																fetchedData?.data?.orders?.total_price
															)}{" "}
															ر.س
														</span>
													</div>
												</div>
												<div className='box'>
													<div className='order-head-row'>
														<Quantity />
														<span className='me-3'>كمية الطلب</span>
													</div>
													<div className='order-data-row'>
														<span>{fetchedData?.data?.orders?.quantity}</span>
													</div>
												</div>
												<div className='box'>
													<div className='order-head-row'>
														<span className='me-3'>شركة الشحن</span>
													</div>
													<div className='order-data-row'>
														<span>
															{fetchedData?.data?.orders?.shippingtypes?.name}
														</span>
													</div>
												</div>
											</div>
											<div className='boxes mb-4'>
												{fetchedData?.data?.orders?.shipping?.track_id && (
													<div className='box mb-4'>
														<div className='order-head-row'>
															<span className='me-3 '>رقم التتبع</span>{" "}
															<span
																className='me-2'
																style={{ display: "block", fontSize: "1rem" }}>
																( انسخ رقم التتبع و تتبع الشحنة من هنا{" "}
																<a
																	href={fetchedData?.data?.orders?.trackingLink}
																	target='_blank'
																	rel='noreferrer'>
																	<BiLinkExternal
																		style={{ width: "16px", cursor: "pointer" }}
																	/>
																</a>
																)
															</span>
														</div>
														<div className='order-data-row'>
															<span
																style={{
																	width: "100%",
																	display: "flex",
																	flexDirection: "row",
																	alignItems: "center",
																	justifyContent: "space-between",
																	padding: "0 10px",
																}}>
																{fetchedData?.data?.orders?.shipping?.track_id}
																{copy ? (
																	<AiFillCheckCircle color='#1dbbbe' />
																) : (
																	<AiFillCopy
																		color='#1dbbbe'
																		style={{ cursor: "pointer" }}
																		onClick={() => {
																			setCopy(true);
																			setTimeout(() => {
																				navigator.clipboard.writeText(
																					fetchedData?.data?.orders?.shipping
																						?.track_id
																				);
																				setCopy(false);
																			}, 1000);
																		}}></AiFillCopy>
																)}
															</span>
														</div>
													</div>
												)}
												{fetchedData?.data?.orders?.shipping?.shipping_id && (
													<div className='box mb-4'>
														<div className='order-head-row'>
															<span className='me-3'>رقم البوليصة</span>
														</div>
														<div className='order-data-row'>
															<span>
																{
																	fetchedData?.data?.orders?.shipping
																		?.shipping_id
																}
															</span>
														</div>
													</div>
												)}
											</div>
											<div className=''>
												<div className='order-head-row'>
													<span className='me-3'>ملاحظات الطلب</span>
												</div>
												<div className='order-data-row'>
													<span
														style={{
															whiteSpace: "normal",
															textAlign: "center",
														}}>
														{fetchedData?.data?.orders?.description}
													</span>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='mb-md-5 mb-4'>
									<div className='order-details-box'>
										<div className='title mb-4'>
											<h5>تفاصيل المنتجات</h5>
										</div>
										<TableContainer>
											<Table
												sx={{ minWidth: 750 }}
												aria-labelledby='tableTitle'>
												<EnhancedTableHead />
												<TableBody>
													{fetchedData?.data?.orders?.orderItem?.map(
														(row, index) => (
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
																				maxWidth: "100%",
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
																		<span>{row?.quantity}</span>
																	</div>
																</TableCell>
																<TableCell align='center'>
																	<span>{row?.sum} ر.س</span>
																</TableCell>
															</TableRow>
														)
													)}
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
															<span style={{ fontWeight: "500" }}>
																{fetchedData?.data?.orders?.subtotal} ر.س
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
															<span style={{ fontWeight: "700" }}>الضريبة</span>
														</TableCell>
														<TableCell
															align='center'
															style={{ borderBottom: "none" }}>
															<span style={{ fontWeight: "500" }}>
																{fetchedData?.data?.orders?.tax} ر.س
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
															<span style={{ fontWeight: "500" }}>
																{fetchedData?.data?.orders?.shipping_price} ر.س
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
																الدفع عند الإستلام
															</span>
														</TableCell>
														<TableCell
															align='center'
															style={{ borderBottom: "none" }}>
															<span style={{ fontWeight: "500" }}>
																{fetchedData?.data?.orders?.codprice} ر.س
															</span>
														</TableCell>
													</TableRow>
													{fetchedData?.data?.orders?.discount !== 0 && (
														<TableRow>
															<TableCell
																colSpan={3}
																component='th'
																scope='row'
																align='right'
																style={{ borderBottom: "none" }}>
																<span style={{ fontWeight: "700" }}>الخصم</span>
															</TableCell>
															<TableCell
																align='center'
																style={{ borderBottom: "none" }}>
																<span style={{ fontWeight: "500" }}>
																	{fetchedData?.data?.orders?.codprice} ر.س
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
															<span style={{ fontWeight: "500" }}>
																{calcTotalPrice(
																	fetchedData?.data?.orders?.codprice,
																	fetchedData?.data?.orders?.total_price
																)}{" "}
																ر.س
															</span>
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</TableContainer>
									</div>
								</div>
								<div className='mb-md-5 mb-4'>
									<div className='order-details-box'>
										<div className='title mb-4'>
											<h5>بيانات العميل</h5>
										</div>
										<div className='order-details-data pt-md-4 pb-md-4'>
											<div className='row d-flex flex-md-row flex-column justify-content-center'>
												<div className='col-lg-2 col-12 mb-lg-0 mb-3'>
													<div className='client-date'>
														<div className='img mb-2'>
															<img
																className=' img-fluid'
																src={fetchedData?.data?.orders?.user?.image}
																alt='client'
															/>
														</div>
													</div>
												</div>
												<div className='col-lg-10 col-12'>
													<div className='row mb-md-4 mb-3'>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-2'>اسم العميل</h6>
															<div className='info-box'>
																<Client className='client-icon' />
																<span className=' text-overflow'>
																	{`${fetchedData?.data?.orders?.user?.name} ${fetchedData?.data?.orders?.user?.user_name}`}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-2'>رقم الهاتف</h6>
															<div className='info-box'>
																<Phone />
																<span style={{ direction: "ltr" }}>
																	{fetchedData?.data?.orders?.user?.phonenumber?.startsWith(
																		"+966"
																	)
																		? fetchedData?.data?.orders?.user?.phonenumber?.slice(
																			4
																		)
																		: fetchedData?.data?.orders?.user?.phonenumber?.startsWith(
																			"00966"
																		)
																			? fetchedData?.data?.orders?.user?.phonenumber?.slice(
																				5
																			)
																			: fetchedData?.data?.orders?.user
																				?.phonenumber}
																</span>
															</div>
														</div>
													</div>
													<div className='row'>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-2'>البريد الالكتروني</h6>
															<div
																className='info-box'
																style={{
																	justifyContent: "flex-start",
																	gap: "30px",
																}}>
																<Message />
																<span className='text-overflow'>
																	{fetchedData?.data?.orders?.user?.email}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-3'>المنطقة</h6>
															<div className='info-box'>
																<span style={{ whiteSpace: "normal" }}>
																	{translateProvinceName(
																		fetchedData?.data?.orders?.OrderAddress
																			?.district
																	)}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-3'>المدينة</h6>
															<div className='info-box'>
																<span style={{ whiteSpace: "normal" }}>
																	{translateCityName(
																		fetchedData?.data?.orders?.OrderAddress
																			?.city
																	)}
																</span>
															</div>
														</div>
														{fetchedData?.data?.orders?.OrderAddress
															?.postal_code && (
																<div className='col-md-6 col-12 mb-3'>
																	<h6 className='mb-3'>الرمز البريدي</h6>
																	<div className='info-box'>
																		<span style={{ whiteSpace: "normal" }}>
																			{
																				fetchedData?.data?.orders?.OrderAddress
																					?.postal_code
																			}
																		</span>
																	</div>
																</div>
															)}
														<div className='col-12 mb-3'>
															<h6 className='mb-3'>العنوان</h6>
															<div className='info-box'>
																<Location />
																<span style={{ whiteSpace: "normal" }}>
																	{
																		fetchedData?.data?.orders?.OrderAddress
																			?.street_address
																	}
																</span>
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='mb-md-5 mb-4'>
								<div className='order-details-box'>
									<div className='title mb-5'>
										<h5>اضافة بيانات الشحنة</h5>
									</div>
									<div className='px-md-3'>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-category'>
													المنطقة<span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-9 col-md-9 col-12'>
												<Select
													name='district'
													value={shipping?.district}
													onChange={(e) => {
														setShipping({
															...shipping,
															district: e.target.value,
														});
													}}
													sx={{
														fontSize: "18px",
														width: "100%",
														backgroundColor: "#cce4ff38",
														boxShadow: "0 0 5px 0px #eded",
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
															border: "none",
														},
														"& .MuiSelect-icon": {
															right: "95%",
														},
													}}
													IconComponent={IoIosArrowDown}
													displayEmpty
													inputProps={{ "aria-label": "Without label" }}
													renderValue={(selected) => {
														if (!selected) {
															return (
																<p className='text-[#ADB5B9]'>اختر المنطقة</p>
															);
														}
														return translateProvinceName(selected);
													}}>
													{removeDuplicates(
														cities?.data?.cities?.data?.cities
													)?.map((district, index) => {
														return (
															<MenuItem
																key={index}
																className='souq_storge_category_filter_items'
																sx={{
																	backgroundColor: "rgba(211, 211, 211, 1)",
																	height: "3rem",
																	"&:hover": {},
																}}
																value={district?.province}>
																{district?.provice_ar}
															</MenuItem>
														);
													})}
												</Select>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-9 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{error?.district}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-category'>
													المدينة<span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-9 col-md-9 col-12'>
												<Select
													name='category_id'
													value={shipping?.city}
													onChange={(e) => {
														setShipping({ ...shipping, city: e.target.value });
													}}
													sx={{
														fontSize: "18px",
														width: "100%",
														backgroundColor: "#cce4ff38",
														boxShadow: "0 0 5px 0px #eded",
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
															border: "none",
														},
														"& .MuiSelect-icon": {
															right: "95%",
														},
													}}
													IconComponent={IoIosArrowDown}
													displayEmpty
													inputProps={{ "aria-label": "Without label" }}
													renderValue={(selected) => {
														if (shipping?.city === "") {
															return (
																<p className='text-[#ADB5B9]'>اختر المدينة</p>
															);
														}
														const result =
															getCityFromProvince?.filter(
																(district) => district?.name === selected
															) || "";
														return result[0]?.name_ar;
													}}>
													{getCityFromProvince?.map((city, index) => {
														return (
															<MenuItem
																key={index}
																className='souq_storge_category_filter_items'
																sx={{
																	backgroundColor: "rgba(211, 211, 211, 1)",
																	height: "3rem",
																	"&:hover": {},
																}}
																value={city?.name}>
																{city?.name_ar}
															</MenuItem>
														);
													})}
												</Select>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-9 col-md-9 col-12'>
												<span className='fs-6 text-danger'>{error?.city}</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-name'>
													العنوان <span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-9 col-md-9 col-12'>
												<input
													type='text'
													placeholder='عنوان الشحنة'
													name='name'
													value={shipping?.address}
													onChange={(e) =>
														setShipping({
															...shipping,
															address: e.target.value,
														})
													}
													style={{
														width: "100%",
														height: "56px",
														padding: "5px 1rem",
														backgroundColor: "#cce4ff38",
														boxShadow: "0 0 5px 0px #eded",
													}}
												/>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-9 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{error?.address}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-name'>
													الوزن <span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-9 col-md-9 col-12'>
												<div
													className='d-flex flex-row align-items-center justify-content-between'
													style={{
														width: "100%",
														height: "56px",
														padding: "5px 1rem",
														backgroundColor: "#cce4ff38",
														boxShadow: "0 0 5px 0px #eded",
													}}>
													<input
														type='text'
														className='w-100 h-100'
														placeholder='الوزن بالكيلو جرام '
														name='name'
														value={shipping?.weight}
														onChange={(e) =>
															setShipping({
																...shipping,
																weight: e.target.value,
															})
														}
														style={{ backgroundColor: "transparent" }}
													/>
													<span>kg</span>
												</div>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-9 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{error?.weight}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
							<div className='mb-md-5 mb-4'>
								<div className='order-details-box'>
									<div className='title mb-4'>
										<h5> خيارات الطلب</h5>
									</div>
									<div className='px-md-3'>
										<div
											className='order-action-box accordion-box mb-3'
											id='accordionExample'>
											<div className='accordion-item w-100'>
												<button
													className='accordion-button  text-end '
													type='button'
													data-bs-toggle='collapse'
													data-bs-target='#collapseOne'
													aria-expanded='true'
													aria-controls='collapseOne'>
													<div className='action-title w-100'>
														<ListIcon className='list-icon' />
														<span className='me-2'> تعديل حالة الطلب</span>
													</div>
													<div className='action-icon'>
														<ArrowDown />
													</div>
												</button>

												<div
													id='collapseOne'
													className='accordion-collapse collapse '
													aria-labelledby='headingOne'
													data-bs-parent='#accordionExample'>
													<div className='accordion-body'>
														<ul className='select-status p-0'>
															<li
																onClick={() => updateOrderStatus("new")}
																style={{ cursor: "pointer" }}>
																جديد
															</li>

															<li
																onClick={() => updateOrderStatus("ready")}
																style={{ cursor: "pointer" }}>
																جاهز للشحن
																<span style={{ fontSize: "1rem" }}>
																	{" "}
																	(يرجى ملء بيانات الشحنة أولاً){" "}
																</span>
															</li>

															<li
																onClick={() => updateOrderStatus("completed")}
																style={{ cursor: "pointer" }}>
																تم التوصيل
															</li>

															<li
																onClick={() => updateOrderStatus("canceled")}
																style={{ cursor: "pointer" }}>
																ملغي
															</li>
														</ul>
													</div>
												</div>
											</div>
										</div>

										<div className='order-action-box mb-3'>
											<div className='action-title'>
												<ListIcon className='list-icon' />
												<span className='me-2'> طباعة الفاتورة</span>
											</div>
											<div className='action-icon'>
												<ReactToPrint
													trigger={() => {
														return <Print />;
													}}
													content={() => componentRef.current}
													documentTitle='order-details-report'
												/>
											</div>
										</div>
										<div className='order-action-box mb-3'>
											<div className='action-title'>
												<ListIcon className='list-icon' />
												<span className='me-2'> تصدير الطلب</span>
											</div>
											<div className='action-icon'>
												<Pdf
													targetRef={componentRef}
													filename='report-details.pdf'
													x={0.5}
													y={0.5}
													scale={0.6}>
													{({ toPdf }) => (
														<PDFIcon className='pdf-icon' onClick={toPdf} />
													)}
												</Pdf>
											</div>
										</div>
										{fetchedData?.data?.orders?.shipping && (
											<>
												<button
													disabled={fetchedData?.data?.orders?.shipping === null}
													style={{ cursor: "pointer" }}
													onClick={() => printSticker()}
													className='order-action-box mb-3'>
													<div className='action-title'>
														<ListIcon className='list-icon' />
														<span className='me-2'>طباعة ملصق الشحن</span>
													</div>
													<div className='action-icon'>
														<Print />
													</div>
												</button>
												<span className='fs-6 text-danger'>
													{printError}
												</span>
											</>
										)}
										{/**
											<div className='order-action-box mb-md-5'>
										<div className='action-title'>
											<ListIcon className='list-icon' />
											<span className='me-2'> حذف الطلب</span>
										</div>
										<div
											className='action-icon'
											onClick={() => {
												deleteProduct(fetchedData?.data?.orders?.id);
											}}
										>
											<DeleteIcon className='delete-icon' />
										</div>
									</div>
									*/}
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</section>
		</>
	);
};

export default OrderDetails;
