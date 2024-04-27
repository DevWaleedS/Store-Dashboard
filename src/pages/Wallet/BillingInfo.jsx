import React, { useEffect, useState } from "react";

// third party
import moment from "moment";
import { Helmet } from "react-helmet";
import { TopBarSearchInput } from "../../global";
import { Link, useParams } from "react-router-dom";

// Table
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Icons
import { PiTrafficSign } from "react-icons/pi";
import { BiLinkExternal } from "react-icons/bi";
import { FaMountainCity, FaSignsPost } from "react-icons/fa6";
import { FaServicestack, FaCity } from "react-icons/fa";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { AiFillCopy, AiFillCheckCircle } from "react-icons/ai";
import {
	ArrowBack,
	User,
	Location,
	Message,
	Phone,
	Quantity,
	StatusIcon,
	WalletIcon,
	DateIcon,
	Delevray,
} from "../../data/Icons";

// handle print invoice
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import useFetch from "../../Hooks/UseFetch";

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
	const { fetchedData, loading } = useFetch(`showBilling/${id}`);

	const [shippingId, setShippingId] = useState(null);
	const { fetchedData: shippingCities } = useFetch(
		`https://backend.atlbha.sa/api/selector/shippingcities/${shippingId}`
	);

	const [shipping, setShipping] = useState({
		district: "",
		city: "",
		address: "",
	});

	// ----------------------------------------------------

	// To handle the shipping information
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

	useEffect(() => {
		if (fetchedData?.data?.orders?.shippingtypes) {
			setShippingId(fetchedData?.data?.orders?.shippingtypes?.id);
		}
	}, [fetchedData?.data?.orders?.shippingtypes]);
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
		shippingCities?.data?.cities?.filter(
			(obj) => obj?.region?.name_en === shipping?.district
		) || [];

	function translateCityName(name) {
		const unique = shippingCities?.data?.cities?.filter(
			(obj) => obj?.name_en === name
		);
		return unique?.[0]?.name || name;
	}

	function translateProvinceName(name) {
		const unique = shippingCities?.data?.cities?.filter((obj) => {
			return obj?.region?.name_en === name;
		});

		return unique?.[0]?.region?.name || name;
	}

	// handle print billing
	const handlePrintBilling = () => {
		const input = document.getElementById("printableArea");
		html2canvas(input)
			.then((canvas) => {
				const imgData = canvas.toDataURL("image/png");
				const pdf = new jsPDF({
					orientation: "p",
					unit: "mm",
					format: "a4",
				});

				// Calculate the ratio to fit the image within the PDF page width
				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = pdf.internal.pageSize.getHeight();
				const canvasWidth = canvas.width;
				const canvasHeight = canvas.height;
				let finalWidth = pdfWidth;
				let finalHeight = canvasHeight * (pdfWidth / canvasWidth);

				// Make sure the content is not taller than the page
				if (finalHeight > pdfHeight) {
					finalHeight = pdfHeight;
					finalWidth = canvasWidth * (pdfHeight / canvasHeight);
				}

				// Calculate the position to center the image horizontally
				const x = (pdfWidth - finalWidth) / 2;
				const y = 0; // Start at the top of the page

				// Add the image to the PDF
				pdf.addImage(imgData, "PNG", x, y, finalWidth, finalHeight);
				pdf.save(
					`invoice(${fetchedData?.data?.billing?.paymentTransectionID}).pdf`
				);
			})
			.catch((err) => {
				console.error("Error while generating PDF", err);
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
				{loading ? (
					<section>
						<CircularLoading />
					</section>
				) : (
					<section className='order-details-body'>
						<div className='mb-md-4 mb-3' id='printableArea'>
							<div className='row mb-2'>
								<div className='col-md-6 col-12 d-flex align-items-center'>
									<h3>تفاصيل الفاتورة</h3>
								</div>
								<div className='col-md-6 col-12 d-flex justify-content-md-end justify-content-center order__number'>
									<div className='order-number'>
										<div className='title'>
											<h5>رقم الفاتورة</h5>
										</div>
										<div className='number'>
											{loading
												? "..."
												: fetchedData?.data?.billing?.paymentTransectionID}
										</div>
									</div>
								</div>
							</div>

							{/* customer data */}
							<div className=''>
								<div className='order-details-box'>
									<div className='title mb-4'>
										<h5>بيانات العميل</h5>
									</div>
									<div className='order-details-data pt-md-4 pb-md-4'>
										<div className='row d-flex flex-md-row flex-column justify-content-center'>
											<div className='col-lg-10 col-12'>
												<div className='row mb-md-4 mb-3'>
													<div className='col-md-6 col-12 mb-3'>
														<h6 className='mb-2'>اسم العميل</h6>
														<div className='info-box'>
															<User className='client-icon' />
															<span className=' text-overflow'>
																{`${fetchedData?.data?.billing?.order?.user?.name} ${fetchedData?.data?.billing?.order?.user?.lastname}`}
															</span>
														</div>
													</div>
													<div className='col-md-6 col-12 mb-3'>
														<h6 className='mb-2'>رقم الهاتف</h6>
														<div className='info-box'>
															<span style={{ direction: "ltr" }}>
																{fetchedData?.data?.billing?.order?.user?.phonenumber?.startsWith(
																	"+966"
																)
																	? fetchedData?.data?.billing?.order?.user?.phonenumber?.slice(
																			4
																	  )
																	: fetchedData?.data?.billing?.order?.user?.phonenumber?.startsWith(
																			"00966"
																	  )
																	? fetchedData?.data?.billing?.order?.user?.phonenumber?.slice(
																			5
																	  )
																	: fetchedData?.data?.billing?.order?.user
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
															<span className='text-overflow'>
																{fetchedData?.data?.billing?.order?.user?.email}
															</span>
														</div>
													</div>
													<div className='col-md-6 col-12 mb-3'>
														<h6 className='mb-3'>المنطقة</h6>
														<div className='info-box'>
															<span style={{ whiteSpace: "normal" }}>
																{
																	fetchedData?.data?.billing?.order
																		?.OrderAddress?.district
																}
															</span>
														</div>
													</div>
													<div className='col-md-6 col-12 mb-3'>
														<h6 className='mb-3'>المدينة</h6>

														<div className='info-box'>
															<span style={{ whiteSpace: "normal" }}>
																{fetchedData?.data?.billing?.order?.city}
															</span>
														</div>
													</div>
													{fetchedData?.data?.billing?.order?.postal_code && (
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
															<span style={{ whiteSpace: "normal" }}>
																{
																	fetchedData?.data?.billing?.order
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

							{/* order details */}
							<div className='order-details-box mb-5'>
								<div className='title mb-4'>
									<h5>بيانات الطلب</h5>
								</div>

								<div className='order-details-data pt-md-4 pb-md-4'>
									<div className='boxes mb-4'>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>حالة الطلب</span>
											</div>
											<div className='order-data-row'>
												<span>{fetchedData?.data?.billing?.order?.status}</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>رقم الطلب</span>
											</div>
											<div className='order-data-row'>
												<span>
													{fetchedData?.data?.billing?.order?.order_number}
												</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>تاريخ الطلب</span>
											</div>

											<div className='order-data-row'>
												<span>
													{moment(
														fetchedData?.data?.billing?.order?.created_at
													).format("DD-MM-YYYY")}
												</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-3 price'>إجمالي الطلب</span>
											</div>
											<div className='order-data-row'>
												<span>
													{fetchedData?.data?.billing?.order?.total_price} ر.س
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>

							{/* Billing details */}
							<div className='order-details-box mb-5'>
								<div className='title mb-4'>
									<h5>بيانات الدفع</h5>
								</div>

								<div className='order-details-data pt-md-4 pb-md-4'>
									<div className='boxes mb-4'>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>طريقة الدفع</span>
											</div>
											<div className='order-data-row'>
												<span>{fetchedData?.data?.billing?.paymentType}</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>تاريخ الدفع</span>
											</div>

											<div className='order-data-row'>
												<span>
													{moment(
														fetchedData?.data?.billing?.paymenDate
													).format("DD-MM-YYYY")}
												</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-3 price'>رقم المعاملة </span>
											</div>
											<div className='order-data-row'>
												<span>
													{fetchedData?.data?.billing?.paymentTransectionID}
												</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>الرسوم</span>
											</div>
											<div className='order-data-row'>
												<span>{fetchedData?.data?.billing?.deduction} ر.س</span>
											</div>
										</div>
										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>السعر بعد الرسوم</span>
											</div>
											<div className='order-data-row'>
												<span>
													{fetchedData?.data?.billing?.price_after_deduction}ر.س
												</span>
											</div>
										</div>

										<div className='box'>
											<div className='order-head-row'>
												<span className='me-2'>حالة الدفع</span>
											</div>
											<div className='order-data-row'>
												<span>
													{fetchedData?.data?.billing?.order?.payment_status}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						{/* Print Billing */}
						<div className='mb-md-3 mb-2'>
							<div className='col-12'>
								<button
									onClick={handlePrintBilling}
									style={{
										color: "#EFF9FF",
										fontSize: "22px",
										fontWight: 400,

										height: "54px",
										width: "163px",
										backgroundColor: "#02466A",
										borderRadius: "6px",
									}}>
									تحميل الفاتورة
								</button>
							</div>
						</div>
					</section>
				)}
			</section>
		</>
	);
};

export default BillingInfo;
