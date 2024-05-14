import React, { useState, useContext, useEffect, useRef } from "react";

// Third party
import moment from "moment";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

// Context
import Context from "../../../../Context/context";
import { LoadingContext } from "../../../../Context/LoadingProvider";

// Components
import { TopBarSearchInput } from "../../../../global";
import CircularLoading from "../../../../HelperComponents/CircularLoading";

// TO print this page
import ReactToPrint from "react-to-print";

// Icons

import { FaMountainCity, FaSignsPost, FaArrowRight } from "react-icons/fa6";
import { FaCity } from "react-icons/fa";

import { BsFillInfoSquareFill } from "react-icons/bs";

import {
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
} from "../../../../data/Icons";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";

// RTK Query
import { useGetShippingCitiesQuery } from "../../../../store/apiSlices/selectorsApis/selectShippingCitiesApi";
import {
	useAcceptOrRejectReturnOrderMutation,
	useGetReturnOrderByIdQuery,
} from "../../../../store/apiSlices/ordersApiSlices/returnOrdersApi";
import { Breadcrumb } from "../../../../components";

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
	const { data: currentOrder, isFetching } = useGetReturnOrderByIdQuery(id);

	//get shipping cities data
	const navigate = useNavigate();
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [printError, setPrintError] = useState("");

	const [shippingId, setShippingId] = useState(null);

	useEffect(() => {
		if (currentOrder?.order?.shippingtypes) {
			setShippingId(currentOrder?.order?.shippingtypes?.id);
		}
	}, [currentOrder?.order?.shippingtypes]);

	const { data: shippingCitiesData } = useGetShippingCitiesQuery(
		shippingId || 1
	);

	// ----------------------------------------------------
	// to translate city and province
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
	const [acceptOrRejectReturnOrder, { isLoading }] =
		useAcceptOrRejectReturnOrderMutation();
	const handleAcceptReturnOrder = async (status) => {
		setLoadingTitle(
			`جاري ${status === "accept" ? "قبول " : "رفض"} طلب الارجاع`
		);

		// Data that send to API
		let data = {
			status: status,
		};
		try {
			const response = await acceptOrRejectReturnOrder({
				id,
				body: data,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				navigate("/ReturnOrders");
				setLoadingTitle("");
				setEndActionTitle(response?.data?.message?.ar);
			} else {
				setLoadingTitle("");

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
			console.error("Error changing update acceptOrRejectReturnOrder:", error);
		}
	};

	// -------------------------------------------------

	// Handle print sticker Function
	const printSticker = () => {
		setPrintError("");
		// this will open the sticker in new tap
		window.open(currentOrder?.order?.shipping_return?.sticker, "_blank");
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
								<Breadcrumb
									icon={"arrowRight"}
									pageTile={"	تفاصيل طلب الارجاع"}
									currentPage={"تفاصيل طلب الارجاع"}
									parentPage={"جدول المرتجعات"}
									route={"/ReturnOrders"}
								/>
							</div>
							<div className='col-md-5 col-12 d-flex justify-content-md-end justify-content-center order__number'>
								<div className='order-number'>
									<div className='title'>
										<h5>رقم الطلب</h5>
									</div>
									<div className='number'>
										{isFetching ? 0 : currentOrder?.order?.order_number}
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
							<div>
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
													<span>{currentOrder?.status}</span>
												</div>
											</div>
											<div className='box'>
												<div className='order-head-row'>
													<DateIcon className='date-icon' />
													<span className='me-2'>تاريخ الطلب</span>
												</div>

												<div className='order-data-row'>
													<span>
														{moment(currentOrder?.order?.created_at).format(
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
													<span>{currentOrder?.order?.total_price} ر.س</span>
												</div>
											</div>
											<div className='box'>
												<div className='order-head-row'>
													<Quantity />
													<span className='me-2'> عدد المنتجات</span>
												</div>
												<div className='order-data-row'>
													<span>{currentOrder?.order?.quantity}</span>
												</div>
											</div>
											<div className='box'>
												<div className='order-head-row'>
													<BsFillInfoSquareFill
														style={{ width: "22px", height: "22px" }}
													/>
													<span className='me-2'>سبب الارجاع </span>
												</div>
												<div className='order-data-row'>
													<span>{currentOrder?.reason_txt?.title}</span>
												</div>
											</div>
										</div>

										{currentOrder?.comment && (
											<div className=''>
												<div className='order-head-row'>
													<BsFillInfoSquareFill
														style={{ width: "22px", height: "22px" }}
													/>
													<span className='me-2'>ملاحظات طلب الارجاع</span>
												</div>
												<div className='order-data-row'>
													<span
														style={{
															whiteSpace: "normal",
															textAlign: "center",
														}}>
														{currentOrder?.comment}
													</span>
												</div>
											</div>
										)}
									</div>
								</div>

								<div className='mb-md-5 mb-4'>
									<div className='order-details-box'>
										<div className='title mb-4 d-flex justify-content-between  align-content-center  flex-wrap'>
											<h5>تفاصيل المنتجات</h5>
											<div className='d-flex justify-content-between  align-content-center gap-1'>
												<h6>عدد القطع:</h6>
												<p style={{ fontSize: "14px", fontWight: "400" }}>
													{currentOrder?.order?.totalCount === 1 && (
														<>(قطعة واحده)</>
													)}
													{currentOrder?.order?.totalCount === 2 && (
														<>(قطعتين)</>
													)}
													{currentOrder?.order?.totalCount > 2 && (
														<>({currentOrder?.order?.totalCount} قطعة)</>
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
													{currentOrder?.order?.orderItem?.map((row, index) => (
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
																{currentOrder?.order?.subtotal} ر.س
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
																{currentOrder?.order?.tax} ر.س
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
																{currentOrder?.order?.shipping_price} ر.س
															</span>
														</TableCell>
													</TableRow>
													{currentOrder?.order?.codprice !== 0 && (
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
																	{currentOrder?.order?.codprice} ر.س
																</span>
															</TableCell>
														</TableRow>
													)}

													{currentOrder?.order?.overweight !== 0 &&
														currentOrder?.order?.overweight_price !== 0 && (
															<TableRow>
																<TableCell
																	colSpan={3}
																	component='th'
																	scope='row'
																	align='right'
																	style={{ borderBottom: "none" }}>
																	<span style={{ fontWeight: "700" }}>
																		تكلفة الوزن الزائد (
																		{currentOrder?.order?.overweight}{" "}
																		<span>kg</span>)
																	</span>
																</TableCell>

																<TableCell
																	align='center'
																	style={{ borderBottom: "none" }}>
																	<span
																		className='table-price_span'
																		style={{ fontWeight: "500" }}>
																		{currentOrder?.order?.overweight_price} ر.س
																	</span>
																</TableCell>
															</TableRow>
														)}
													{currentOrder?.order?.discount !== 0 && (
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
																	{currentOrder?.order?.discount} ر.س
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
																{currentOrder?.order?.total_price} ر.س
															</span>
														</TableCell>
													</TableRow>
												</TableBody>
											</Table>
										</TableContainer>
									</div>
								</div>
								<div className='mb-3'>
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
																src={currentOrder?.order?.user?.image}
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
																	{`${currentOrder?.order?.user?.name} ${currentOrder?.order?.user?.lastname}`}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12 mb-3'>
															<h6 className='mb-2'>رقم الهاتف</h6>
															<div className='info-box'>
																<Phone />
																<span style={{ direction: "ltr" }}>
																	{currentOrder?.order?.user?.phonenumber?.startsWith(
																		"+966"
																	)
																		? currentOrder?.order?.user?.phonenumber?.slice(
																				4
																		  )
																		: currentOrder?.order?.user?.phonenumber?.startsWith(
																				"00966"
																		  )
																		? currentOrder?.order?.user?.phonenumber?.slice(
																				5
																		  )
																		: currentOrder?.order?.user?.phonenumber}
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
																	{currentOrder?.order?.user?.email}
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
																		currentOrder?.order?.OrderAddress?.district
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
																		currentOrder?.order?.OrderAddress?.city
																	)}
																</span>
															</div>
														</div>
														{currentOrder?.order?.OrderAddress?.postal_code && (
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
																			currentOrder?.order?.OrderAddress
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
																		currentOrder?.order?.OrderAddress
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
						</section>
					)}
				</section>

				{/* Order options */}
				<section className={`${isFetching ? "d-none" : "order-details-body"}`}>
					<div className='mb-md-5 mb-4'>
						<div className='order-details-box'>
							<div className='px-md-3'>
								<div className='order-action-box mb-3'>
									<div className='action-title'>
										<ListIcon className='list-icon' />
										<span className='me-2' style={{ fontSize: "18px" }}>
											{" "}
											تصدير طلب الارجاع
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

								{currentOrder?.order?.shipping_return?.sticker &&
									currentOrder?.order?.shippingtypes?.name !== "اخرى" &&
									currentOrder?.status !== "جديد" && (
										<button
											disabled={currentOrder?.status === "جديد" ? true : false}
											style={{
												cursor:
													currentOrder?.status === "جديد"
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
													طباعة بوليصة الارجاع
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
															currentOrder?.status !== "جديد"
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

				{/* Save and cancel buttons */}
				<section className={`${isFetching ? "d-none" : "order-details-body"}`}>
					{currentOrder?.status === "جديد" ? (
						<div className='row d-flex justify-content-center align-items-center'>
							<div className='col-lg-4 col-6'>
								<button
									className='save-btn'
									disabled={isLoading}
									onClick={() => {
										handleAcceptReturnOrder("accept");
									}}>
									قبول طلب الارجاع
								</button>
							</div>
							<div className='col-lg-4 col-6'>
								<button
									className='close-btn'
									disabled={isLoading}
									onClick={() => {
										handleAcceptReturnOrder("reject");
									}}>
									رفض طلب الارجاع
								</button>
							</div>
						</div>
					) : (
						<div className='row d-flex justify-content-center align-items-center'>
							<div className='col-6'>
								<button
									className='close-btn '
									disabled={isLoading}
									onClick={() => navigate("/ReturnOrders")}>
									<FaArrowRight className=' ps-2' />
									العوده إلى جدول المرتجعات
								</button>
							</div>
						</div>
					)}
				</section>
			</section>
		</>
	);
};

export default ReturnOrderDetails;
