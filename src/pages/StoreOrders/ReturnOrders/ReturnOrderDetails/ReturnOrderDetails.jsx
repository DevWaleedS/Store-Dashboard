import React, { useState, useContext, useEffect, useRef } from "react";

// Third party
import moment from "moment";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";

// Context
import Context from "../../../../Context/context";
import { LoadingContext } from "../../../../Context/LoadingProvider";

// Components
import { TopBarSearchInput } from "../../../../global";
import CircularLoading from "../../../../HelperComponents/CircularLoading";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// TO print this page
import ReactToPrint from "react-to-print";

// Icons
import { PiTrafficSign } from "react-icons/pi";
import { BiLinkExternal } from "react-icons/bi";
import { IoIosArrowDown } from "react-icons/io";
import { FaMountainCity, FaSignsPost } from "react-icons/fa6";
import { FaServicestack, FaCity } from "react-icons/fa";

import { BsFillInfoSquareFill } from "react-icons/bs";
import { AiFillCopy, AiFillCheckCircle } from "react-icons/ai";
import {
	ArrowBack,
	ArrowDown,
	User,
	ListIcon,
	Location,
	Message,
	PDFIcon,
	Phone,
	Print,
	Quantity,
	StatusIcon,
	WalletIcon,
	DateIcon,
	Delevray,
} from "../../../../data/Icons";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// RTK Query
import {
	useGetOrderByIdQuery,
	useUpdateOrderStatusMutation,
} from "../../../../store/apiSlices/ordersApiSlices/ordersApi";
import { useGetShippingCitiesQuery } from "../../../../store/apiSlices/selectorsApis/selectShippingCitiesApi";

// The Table title
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

const ReturnOrderDetails = () => {
	// get current order by id
	const { id } = useParams();
	const { data: currentOrder, isFetching } = useGetOrderByIdQuery(id);

	//get shipping cities data
	const navigate = useNavigate();
	const [shippingId, setShippingId] = useState(null);
	const { data: shippingCitiesData } = useGetShippingCitiesQuery(shippingId);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [copy, setCopy] = useState(false);
	const [printError, setPrintError] = useState("");
	const [shipping, setShipping] = useState({
		district: "",
		city: "",
		address: "",
	});

	// Handle errors
	const [error, setError] = useState({
		district: "",
		city: "",
		address: "",
	});
	const resetError = () => {
		setError({
			district: "",
			city: "",
			address: "",
		});
	};
	// ----------------------------------------------------

	// To handle the shipping information
	useEffect(() => {
		if (currentOrder?.orders?.shipping) {
			setShipping({
				...shipping,
				district: currentOrder?.orders?.shipping?.district,
				city: currentOrder?.orders?.shipping?.city,
				address: currentOrder?.orders?.shipping?.street_address,
				weight: currentOrder?.orders?.shipping?.weight,
			});
		}
	}, [currentOrder?.orders?.shipping]);

	useEffect(() => {
		if (currentOrder?.orders?.shippingtypes) {
			setShippingId(currentOrder?.orders?.shippingtypes?.id);
		}
	}, [currentOrder?.orders?.shippingtypes]);
	// ----------------------------------------------------

	function removeDuplicates(arr) {
		const unique = arr?.filter((obj, index) => {
			return (
				index ===
				arr?.findIndex((o) => obj?.region?.name_en === o?.region?.name_en)
			);
		});
		return unique;
	}

	const getCityFromProvince =
		shippingCitiesData?.cities?.filter(
			(obj) => obj?.region?.name_en === shipping?.district
		) || [];

	function translateCityName(name) {
		const unique = shippingCitiesData?.cities?.filter(
			(obj) => obj?.name_en === name
		);
		return unique?.[0]?.name || name;
	}

	function translateProvinceName(name) {
		const unique = shippingCitiesData?.cities?.filter((obj) => {
			return obj?.region?.name_en === name;
		});

		return unique?.[0]?.region?.name || name;
	}

	// -----------------------------------------------------

	// To handle update order Status
	const [updateOrderStatus] = useUpdateOrderStatusMutation();

	const handleUpdateOrderStatus = async (status) => {
		setLoadingTitle("جاري تعديل حالة الطلب");
		resetError();

		// Data that send to API
		let data = {
			status: status,
		};

		if (status === "ready" || status === "canceled") {
			data.district = shipping?.district;
			data.city = shipping?.city;
			data.street_address = shipping?.address;
		}

		try {
			const response = await updateOrderStatus({
				id,
				body: data, // Sending JSON object
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				navigate("/Orders");
				setLoadingTitle("");
				setEndActionTitle(response?.data?.message?.ar);
			} else {
				setLoadingTitle("");
				setError({
					district: response?.data?.message?.en?.district?.[0] || "",
					city: response?.data?.message?.en?.city?.[0] || "",
					address: response?.data?.message?.en?.street_address?.[0] || "",
					weight: response?.data?.message?.en?.weight?.[0] || "",
				});
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
			console.error("Error changing update order status :", error);
		}
	};

	// -------------------------------------------------

	// Handle print sticker Function
	const printSticker = () => {
		setPrintError("");
		// this will open the sticker in new tap
		window.open(currentOrder?.orders?.shipping?.sticker, "_blank");
		// this will open the sticker in new tap
	};
	// -------------------------------------------------

	// Handle print this page as pdf file
	const componentRef = useRef();

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تفاصيل الطلب</title>
			</Helmet>

			<section className='order-details-page orders-pages p-md-3' id='report'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<section ref={componentRef}>
					{/* Order Details Header */}
					<div className='head-category mb-5 pt-md-4'>
						<div className='row '>
							<div className='col-md-6 col-12'>
								<h3>تفاصيل الطلب</h3>
								{/** breadcrumb */}
								<nav aria-label='breadcrumb'>
									<ol className='breadcrumb'>
										<li className='breadcrumb-item'>
											<Link to='/Orders'>
												<ArrowBack className='arrow-back-icon' />
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
							<div className='col-md-5 col-12 d-flex justify-content-md-end justify-content-center order__number'>
								<div className='order-number'>
									<div className='title'>
										<h5>رقم الطلب</h5>
									</div>
									<div className='number'>
										{isFetching ? 0 : currentOrder?.orders?.order_number}
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* order-details-body */}
					{isFetching ? (
						<section>
							<CircularLoading />
						</section>
					) : (
						<section className='order-details-body'>
							<div className='mb-md-5 mb-4'>
								<div className='order-details-box mb-5'>
									<div className='title mb-4'>
										<h5>بيانات الطلب</h5>
									</div>
									<div className='order-details-data pt-md-4 pb-md-4'>
										<div className='boxes mb-4'>
											<div className='box'>
												<div className='order-head-row'>
													<StatusIcon />
													<span className='me-2'>الحالة</span>
												</div>
												<div className='order-data-row'>
													<span>{currentOrder?.orders?.status}</span>
												</div>
											</div>
											<div className='box'>
												<div className='order-head-row'>
													<DateIcon className='date-icon' />
													<span className='me-2'>تاريخ الطلب</span>
												</div>

												<div className='order-data-row'>
													<span>
														{moment(currentOrder?.orders?.created_at).format(
															"DD-MM-YYYY"
														)}
													</span>
												</div>
											</div>
											<div className='box'>
												<div className='order-head-row'>
													<WalletIcon />
													<span className='me-3 price'>إجمالي الطلب</span>
												</div>
												<div className='order-data-row'>
													<span>{currentOrder?.orders?.total_price} ر.س</span>
												</div>
											</div>
											<div className='box'>
												<div className='order-head-row'>
													<Quantity />
													<span className='me-2'> عدد المنتجات</span>
												</div>
												<div className='order-data-row'>
													<span>{currentOrder?.orders?.quantity}</span>
												</div>
											</div>
											<div className='box'>
												<div className='order-head-row'>
													<Delevray style={{ width: "34px", height: "34px" }} />
													<span className='me-2'>شركة الشحن</span>
												</div>
												<div className='order-data-row'>
													<span>
														{currentOrder?.orders?.shippingtypes?.name}
													</span>
												</div>
											</div>
										</div>
										<div className='boxes mb-4'>
											{currentOrder?.orders?.shipping?.shipping_id && (
												<div className='box mb-4'>
													<div className='order-head-row'>
														<FaServicestack />
														<span className='me-2'>رقم التتبع</span>{" "}
														<span
															className='me-2'
															style={{
																display: "block",
																fontSize: "1rem",
															}}>
															( انسخ رقم التتبع و تتبع الشحنة من هنا{" "}
															<a
																href={currentOrder?.orders?.trackingLink}
																target='_blank'
																rel='noreferrer'>
																<BiLinkExternal
																	style={{
																		width: "16px",
																		cursor: "pointer",
																	}}
																/>
															</a>
															)
														</span>
													</div>
													<div className='order-data-row track_id_box'>
														<div className='d-flex justify-content-center align-items-center'>
															<span className='track_id_input'>
																{currentOrder?.orders?.shipping?.track_id}
															</span>
															{copy ? (
																<div className='copy-track_id-icon'>
																	<AiFillCheckCircle color='#1dbbbe' />
																</div>
															) : (
																<div className='copy-track_id-icon'>
																	<AiFillCopy
																		color='#1dbbbe'
																		style={{ cursor: "pointer" }}
																		onClick={() => {
																			setCopy(true);
																			setTimeout(() => {
																				navigator.clipboard.writeText(
																					currentOrder?.orders?.shipping
																						?.track_id
																				);
																				setCopy(false);
																			}, 1000);
																		}}
																	/>
																</div>
															)}
														</div>
													</div>
												</div>
											)}
											{currentOrder?.orders?.shipping?.shipping_id && (
												<div className='box mb-4'>
													<div className='order-head-row'>
														<PiTrafficSign />
														<span className='me-2'>رقم البوليصة</span>
													</div>
													<div className='order-data-row'>
														<span>
															{currentOrder?.orders?.shipping?.shipping_id}
														</span>
													</div>
												</div>
											)}
										</div>
										<div className=''>
											<div className='order-head-row'>
												<BsFillInfoSquareFill
													style={{ width: "22px", height: "22px" }}
												/>
												<span className='me-2'>ملاحظات الطلب</span>
											</div>
											<div className='order-data-row'>
												<span
													style={{
														whiteSpace: "normal",
														textAlign: "center",
													}}>
													{currentOrder?.orders?.description}
												</span>
											</div>
										</div>
									</div>
								</div>

								<div className='mb-md-5 mb-4'>
									<div className='order-details-box'>
										<div className='title mb-4 d-flex justify-content-between  align-content-center  flex-wrap'>
											<h5>تفاصيل المنتجات</h5>
											<div className='d-flex justify-content-between  align-content-center gap-1'>
												<h6>عدد القطع:</h6>
												<p style={{ fontSize: "14px", fontWight: "400" }}>
													{currentOrder?.orders?.totalCount === 1 && (
														<>(قطعة واحده)</>
													)}
													{currentOrder?.orders?.totalCount === 2 && (
														<>(قطعتين)</>
													)}
													{currentOrder?.orders?.totalCount > 2 && (
														<>({currentOrder?.orders?.totalCount} قطعة)</>
													)}
												</p>
											</div>
										</div>
										<TableContainer>
											<Table
												sx={{ minWidth: 750 }}
												aria-labelledby='tableTitle'>
												<EnhancedTableHead />
												<TableBody>
													{currentOrder?.orders?.orderItem?.map(
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
																			className='me-2'
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
																		<span>{row?.quantity}</span>
																	</div>
																</TableCell>
																<TableCell align='center'>
																	<span className='table-price_span'>
																		{row?.sum} ر.س
																	</span>
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
															<span
																className='table-price_span'
																style={{ fontWeight: "500" }}>
																{currentOrder?.orders?.subtotal} ر.س
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
															<span
																className='table-price_span'
																style={{ fontWeight: "500" }}>
																{currentOrder?.orders?.tax} ر.س
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
																{currentOrder?.orders?.shipping_price} ر.س
															</span>
														</TableCell>
													</TableRow>
													{currentOrder?.orders?.codprice !== 0 && (
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
																<span
																	className='table-price_span'
																	style={{ fontWeight: "500" }}>
																	{currentOrder?.orders?.codprice} ر.س
																</span>
															</TableCell>
														</TableRow>
													)}

													{currentOrder?.orders?.overweight !== 0 &&
														currentOrder?.orders?.overweight_price !== 0 && (
															<TableRow>
																<TableCell
																	colSpan={3}
																	component='th'
																	scope='row'
																	align='right'
																	style={{ borderBottom: "none" }}>
																	<span style={{ fontWeight: "700" }}>
																		تكلفة الوزن الزائد (
																		{currentOrder?.orders?.overweight}{" "}
																		<span>kg</span>)
																	</span>
																</TableCell>

																<TableCell
																	align='center'
																	style={{ borderBottom: "none" }}>
																	<span
																		className='table-price_span'
																		style={{ fontWeight: "500" }}>
																		{currentOrder?.orders?.overweight_price} ر.س
																	</span>
																</TableCell>
															</TableRow>
														)}
													{currentOrder?.orders?.discount !== 0 && (
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
																<span
																	className='table-price_span'
																	style={{ fontWeight: "500" }}>
																	{currentOrder?.orders?.discount} ر.س
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
																{currentOrder?.orders?.total_price} ر.س
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
																alt=''
																loading={"lazy"}
																className=' img-fluid'
																src={currentOrder?.orders?.user?.image}
															/>
														</div>
													</div>
												</div>
												<div className='col-lg-10 col-12'>
													<div className='row mb-md-4 mb-3'>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-2'>اسم العميل</h6>
															<div className='info-box'>
																<User className='client-icon' />
																<span className=' text-overflow'>
																	{`${currentOrder?.orders?.user?.name} ${currentOrder?.orders?.user?.lastname}`}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-2'>رقم الهاتف</h6>
															<div className='info-box'>
																<Phone />
																<span style={{ direction: "ltr" }}>
																	{currentOrder?.orders?.user?.phonenumber?.startsWith(
																		"+966"
																	)
																		? currentOrder?.orders?.user?.phonenumber?.slice(
																				4
																		  )
																		: currentOrder?.orders?.user?.phonenumber?.startsWith(
																				"00966"
																		  )
																		? currentOrder?.orders?.user?.phonenumber?.slice(
																				5
																		  )
																		: currentOrder?.orders?.user?.phonenumber}
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
																	{currentOrder?.orders?.user?.email}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-3'>المنطقة</h6>
															<div className='info-box'>
																<FaCity
																	style={{
																		width: "24px",
																		height: "24px",
																		fill: "#1dbbbe",
																	}}
																/>
																<span style={{ whiteSpace: "normal" }}>
																	{translateProvinceName(
																		currentOrder?.orders?.OrderAddress?.district
																	)}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-3'>المدينة</h6>

															<div className='info-box'>
																<FaMountainCity
																	style={{
																		width: "24px",
																		height: "24px",
																		fill: "#1dbbbe",
																	}}
																/>
																<span style={{ whiteSpace: "normal" }}>
																	{translateCityName(
																		currentOrder?.orders?.OrderAddress?.city
																	)}
																</span>
															</div>
														</div>
														{currentOrder?.orders?.OrderAddress
															?.postal_code && (
															<div className='col-md-6 col-12 mb-3'>
																<h6 className='mb-3'>الرمز البريدي</h6>
																<div className='info-box'>
																	<FaSignsPost
																		style={{
																			width: "24px",
																			height: "24px",
																			fill: "#1dbbbe",
																		}}
																	/>
																	<span style={{ whiteSpace: "normal" }}>
																		{
																			currentOrder?.orders?.OrderAddress
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
																		currentOrder?.orders?.OrderAddress
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
													المنطقة<span className='important-hint'>*</span>
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
													disabled={
														currentOrder?.orders?.status === "تم الشحن" ||
														currentOrder?.orders?.status === "ملغي" ||
														currentOrder?.orders?.status === "مكتمل"
															? true
															: false
													}
													inputProps={{ "aria-label": "Without label" }}
													renderValue={(selected) => {
														if (!selected || shipping?.district === "") {
															return (
																<p className='text-[#ADB5B9]'>اختر المنطقة</p>
															);
														}
														return translateProvinceName(selected);
													}}>
													{removeDuplicates(shippingCitiesData?.cities)?.map(
														(district, index) => {
															return (
																<MenuItem
																	key={index}
																	className='souq_storge_category_filter_items'
																	sx={{
																		backgroundColor: "rgba(211, 211, 211, 1)",
																		height: "3rem",
																		"&:hover": {},
																	}}
																	value={district?.region?.name_en}>
																	{district?.region?.name}
																</MenuItem>
															);
														}
													)}
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
													المدينة<span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-9 col-md-9 col-12'>
												<Select
													name='category_id'
													value={shipping?.city}
													onChange={(e) => {
														setShipping({
															...shipping,
															city: e.target.value,
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
													disabled={
														currentOrder?.orders?.status === "تم الشحن" ||
														currentOrder?.orders?.status === "ملغي" ||
														currentOrder?.orders?.status === "مكتمل"
															? true
															: false
													}
													inputProps={{ "aria-label": "Without label" }}
													renderValue={(selected) => {
														if (!selected || shipping?.city === "") {
															return (
																<p className='text-[#ADB5B9]'>اختر المدينة</p>
															);
														}
														const result =
															getCityFromProvince?.filter(
																(district) => district?.name_en === selected
															) || "";
														return result[0]?.name;
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
																value={city?.name_en}>
																{city?.name}
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
													العنوان <span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-9 col-md-9 col-12'>
												<input
													disabled={
														currentOrder?.orders?.status === "تم الشحن" ||
														currentOrder?.orders?.status === "ملغي" ||
														currentOrder?.orders?.status === "مكتمل"
															? true
															: false
													}
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
									</div>
								</div>
							</div>
						</section>
					)}
				</section>

				{/* Order options */}
				<section className={`${isFetching ? "d-none" : "order-details-body"}`}>
					<div className='mb-md-5 mb-4'>
						<div className='order-details-box'>
							<div className='title mb-4'>
								<h5> حالة الشحن</h5>
							</div>
							<div className='px-md-3'>
								<div
									className='order-action-box accordion-box mb-3'
									id='accordionExample'>
									<div className='accordion-item w-100'>
										<button
											type='button'
											className='accordion-button  text-end '
											data-bs-toggle='collapse'
											data-bs-target='#collapseOne'
											aria-expanded='true'
											aria-controls='collapseOne'>
											<div className='action-title w-100 d-flex flex-wrap'>
												<ListIcon className='list-icon' />
												<span className='me-2' style={{ fontSize: "18px" }}>
													{" "}
													اختيار حالة الشحن
												</span>
											</div>
											<div className='action-icon'>
												<ArrowDown
													style={{
														cursor:
															currentOrder?.orders?.status === "تم الشحن" ||
															currentOrder?.orders?.status === "ملغي" ||
															currentOrder?.orders?.status === "مكتمل"
																? "not-allowed"
																: "pointer",
													}}
												/>
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
														onClick={() => handleUpdateOrderStatus("ready")}
														style={
															currentOrder?.orders?.status === "قيد التجهيز"
																? {
																		pointerEvents: "none",
																		opacity: "0.6",
																		cursor: "not-allowed",
																  }
																: { cursor: "pointer" }
														}>
														قيد التجهيز
														{currentOrder?.orders?.status === " قيد التجهيز" ? (
															<span style={{ fontSize: "1rem" }}>
																{" "}
																(تم تغيير حالة الطلب إلى قيد التجهيز من قبل ){" "}
															</span>
														) : (
															<span style={{ fontSize: "1rem" }}>
																{" "}
																(يرجى ملء بيانات الشحنة أولاً){" "}
															</span>
														)}
													</li>

													<li
														onClick={() => handleUpdateOrderStatus("completed")}
														style={
															currentOrder?.orders?.status === "تم الشحن"
																? {
																		pointerEvents: "none",
																		opacity: "0.6",
																		cursor: "not-allowed",
																  }
																: { cursor: "pointer" }
														}>
														تم الشحن
													</li>

													<li
														onClick={() => handleUpdateOrderStatus("canceled")}
														style={
															currentOrder?.orders?.status === "ملغي"
																? {
																		pointerEvents: "none",
																		opacity: "0.6",
																		cursor: "not-allowed",
																  }
																: { cursor: "pointer" }
														}>
														الغاء الشحنة
														<span style={{ fontSize: "1rem", color: "red" }}>
															{" "}
															(إلغاء الطلب بالكامل){" "}
														</span>
													</li>
												</ul>
											</div>
										</div>
									</div>
								</div>

								<div className='order-action-box mb-3'>
									<div className='action-title'>
										<ListIcon className='list-icon' />
										<span className='me-2' style={{ fontSize: "18px" }}>
											{" "}
											تصدير الطلب
										</span>
									</div>

									<ReactToPrint
										trigger={() => {
											return (
												<div className='action-icon'>
													<PDFIcon className='pdf-icon' />
												</div>
											);
										}}
										content={() => componentRef.current}
										documentTitle='order-details-report'
										bodyClass='order-details-print'
									/>
								</div>

								{currentOrder?.orders?.shipping &&
									currentOrder?.orders?.shippingtypes?.name !== "اخرى" && (
										<button
											disabled={
												currentOrder?.orders?.status === "تم الشحن" ||
												currentOrder?.orders?.status === "ملغي" ||
												currentOrder?.orders?.status === "مكتمل"
													? true
													: false
											}
											style={{
												cursor:
													currentOrder?.orders?.status === "تم الشحن" ||
													currentOrder?.orders?.status === "ملغي" ||
													currentOrder?.orders?.status === "مكتمل"
														? "not-allowed"
														: "pointer",
											}}
											onClick={() => printSticker()}
											className='order-action-box mb-3'>
											<div className='action-title'>
												<ListIcon className='list-icon' />
												<span
													className='me-2 ms-2'
													style={{ fontSize: "18px" }}>
													{" "}
													طباعة بوليصة الشحن
												</span>
												{printError && (
													<span className='fs-6 text-danger'>
														({printError})
													</span>
												)}
											</div>
											<div className='action-icon'>
												<Print
													style={{
														cursor:
															currentOrder?.orders?.status === "تم الشحن" ||
															currentOrder?.orders?.status === "ملغي" ||
															currentOrder?.orders?.status === "مكتمل"
																? "not-allowed"
																: "pointer",
													}}
												/>
											</div>
										</button>
									)}
							</div>
						</div>
					</div>
				</section>
			</section>
		</>
	);
};

export default ReturnOrderDetails;
