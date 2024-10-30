import React from "react";

// third party
import moment from "moment";
import { Helmet } from "react-helmet";
import { TopBarSearchInput } from "../../global/TopBar";
import { Link, useParams } from "react-router-dom";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
// Helpers
import { CircularLoading } from "../../HelperComponents";

// Icons
import { ArrowBack } from "../../data/Icons";

// handle print invoice
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// RTK Query
import { useShowBillingByIdQuery } from "../../store/apiSlices/walletApi";

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

const BillingInfo = () => {
	const { id } = useParams();

	// get billing info by id
	const { data: billing, isFetching } = useShowBillingByIdQuery({
		billingId: id,
	});

	// ----------------------------------------------------

	// handle print billing
	const handlePrintBilling = () => {
		// Get the button and hide it
		const printButton = document.querySelector(".print-billing-btn");
		printButton.style.visibility = "hidden";

		const input = document.getElementById("printableArea");
		html2canvas(input)
			.then((canvas) => {
				const imgData = canvas.toDataURL("image/png");
				const pdf = new jsPDF({
					orientation: "p",
					unit: "mm",
					format: "a4",
				});

				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = pdf.internal.pageSize.getHeight();
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;
				let finalWidth = pdfWidth;
				let finalHeight = canvasHeight * (pdfWidth / canvasWidth);

				if (finalHeight > pdfHeight) {
					finalHeight = pdfHeight;
					finalWidth = canvasWidth * (pdfHeight / canvasHeight);
				}

				const x = (pdfWidth - finalWidth) / 2;
				const y = 0;

				pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
				pdf.save(`invoice(${billing?.paymentTransectionID}).pdf`);

				// Show the button again after PDF is generated
				printButton.style.visibility = "visible";
			})
			.catch((err) => {
				console.error("Error while generating PDF", err);
				// Ensure button visibility is restored even if there is an error
				printButton.style.visibility = "visible";
			});
	};

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

				{/* Order Details Header */}
				<div className='head-category mb-4'>
					<div className='row '>
						<div className='col-md-6 col-12'>
							{/** breadcrumb */}
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<Link to='/wallet'>
											<ArrowBack className='arrow-back-icon' />
										</Link>
										<Link to='/wallet'>جدول الفواتير</Link>
									</li>
									<li className='breadcrumb-item active ' aria-current='page'>
										تفاصيل الفاتورة
									</li>
								</ol>
							</nav>
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
						<div className='mb-md-4 mb-3' id='printableArea'>
							<div className='row mb-3'>
								<div className='col-6 d-flex align-items-end'>
									<button
										onClick={handlePrintBilling}
										className='print-billing-btn'>
										تحميل الفاتورة
									</button>
								</div>

								<div className='col-6 d-flex justify-content-end order__number'>
									<div className='order-number'>
										<div className='title'>
											<h5>رقم الفاتورة</h5>
										</div>
										<div className='number'>
											{isFetching ? "..." : billing?.paymentTransectionID}
										</div>
									</div>
								</div>
							</div>

							{/* customer data */}
							<div className='mb-3'>
								<div className='order-details-box'>
									<div className='title mb-4'>
										<h5>بيانات العميل</h5>
									</div>
									<div className='order-details-data '>
										<div className='row d-flex flex-md-row flex-column justify-content-center'>
											<div className='col-lg-12'>
												<div className='row mb-md-4 mb-3'>
													<div className='col-md-4 col-12 mb-3'>
														<h6 className='mb-2'>اسم العميل</h6>
														<div className='info-box'>
															<span className=' text-overflow'>
																{`${billing?.order?.user?.name} ${billing?.order?.user?.lastname}`}
															</span>
														</div>
													</div>

													<div className='col-md-4 col-12 mb-3'>
														<h6 className='mb-2'>رقم الهاتف</h6>
														<div className='info-box'>
															<span style={{ direction: "ltr" }}>
																{billing?.order?.user?.phonenumber?.startsWith(
																	"+966"
																)
																	? billing?.order?.user?.phonenumber?.slice(4)
																	: billing?.order?.user?.phonenumber?.startsWith(
																			"00966"
																	  )
																	? billing?.order?.user?.phonenumber?.slice(5)
																	: billing?.order?.user?.phonenumber}
															</span>
														</div>
													</div>

													<div className='col-md-4 col-12 '>
														<h6 className='mb-2'>البريد الالكتروني</h6>
														<div
															className='info-box'
															style={{
																justifyContent: "flex-start",
																gap: "30px",
															}}>
															<span className='text-overflow'>
																{billing?.order?.user?.email}
															</span>
														</div>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* order details */}
							<div className='order-details-box mb-3'>
								<div className='title mb-4'>
									<h5>بيانات الطلب</h5>
								</div>

								<div className='order-details-data '>
									<div className='boxes mb-4'>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>حالة الطلب</span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.order?.status}</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>رقم الطلب</span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.order?.order_number}</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>تاريخ الطلب</span>
											</div>

											<div className='order-data-row'>
												<span>
													{moment(billing?.order?.created_at).format(
														"DD-MM-YYYY"
													)}
												</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-3 price'>إجمالي الطلب</span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.order?.total_price} ر.س</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Billing details */}
							<div className='order-details-box mb-3'>
								<div className='title mb-4'>
									<h5>بيانات الدفع</h5>
								</div>

								<div className='order-details-data'>
									<div className='boxes mb-4'>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>طريقة الدفع</span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.paymentType}</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>تاريخ الدفع</span>
											</div>

											<div className='order-data-row'>
												<span>
													{moment(billing?.paymenDate).format("DD-MM-YYYY")}
												</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-3 price'>رقم المعاملة </span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.paymentTransectionID}</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>الرسوم</span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.deduction} ر.س</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>السعر بعد خصم الرسوم</span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.price_after_deduction}ر.س</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>حالة الدفع</span>
											</div>
											<div className='order-data-row'>
												<span>{billing?.order?.payment_status}</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Product info*/}
							<div>
								<div className='order-details-box'>
									<div className='title mb-4 d-flex justify-content-between  align-content-center  flex-wrap'>
										<h5>تفاصيل المنتجات</h5>
										<div className='d-flex justify-content-between  align-content-center gap-1'>
											<h6>عدد القطع:</h6>
											<p style={{ fontSize: "14px", fontWight: "400" }}>
												{billing?.order?.totalCount === 1 && <>(قطعة واحده)</>}
												{billing?.order?.totalCount === 2 && <>(قطعتين)</>}
												{billing?.order?.totalCount > 2 && (
													<>({billing?.order?.totalCount} قطعة)</>
												)}
											</p>
										</div>
									</div>
									<TableContainer>
										<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
											<EnhancedTableHead />
											<TableBody>
												{billing?.order?.orderItem?.map((row, index) => (
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
															{billing?.order?.subtotal} ر.س
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
															{billing?.order?.tax} ر.س
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
															{billing?.order?.shipping_price} ر.س
														</span>
													</TableCell>
												</TableRow>

												{billing?.order?.overweight !== 0 &&
													billing?.order?.overweight_price !== 0 && (
														<TableRow>
															<TableCell
																colSpan={3}
																component='th'
																scope='row'
																align='right'
																style={{ borderBottom: "none" }}>
																<span style={{ fontWeight: "700" }}>
																	تكلفة الوزن الزائد (
																	{billing?.order?.overweight} <span>kg</span>)
																</span>
															</TableCell>

															<TableCell
																align='center'
																style={{ borderBottom: "none" }}>
																<span
																	className='table-price_span'
																	style={{ fontWeight: "500" }}>
																	{billing?.order?.overweight_price} ر.س
																</span>
															</TableCell>
														</TableRow>
													)}
												{billing?.order?.discount !== 0 && (
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
																{billing?.order?.discount} ر.س
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
														<span style={{ fontWeight: "700" }}>الإجمالي</span>
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
															{billing?.order?.total_price} ر.س
														</span>
													</TableCell>
												</TableRow>
											</TableBody>
										</Table>
									</TableContainer>
								</div>
							</div>
						</div>
					</section>
				)}
			</section>
		</>
	);
};

export default BillingInfo;
