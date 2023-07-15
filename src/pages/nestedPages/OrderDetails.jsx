import React, { useContext, useRef, Fragment } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useFetch from "../../Hooks/UseFetch";
import { Link } from "react-router-dom";
import CircularLoading from "../../HelperComponents/CircularLoading";
import moment from "moment";

// to download order details as pdf file
import Pdf from "react-to-pdf";

// to print order details
import ReactToPrint from "react-to-print";
// Icons
import { ReactComponent as StatusIcon } from "../../data/Icons/status.svg";
import { ReactComponent as DateIcon } from "../../data/Icons/icon-date.svg";
import { ReactComponent as WalletIcon } from "../../data/Icons/icon-24-wallet.svg";
import { ReactComponent as ArrowIcon } from "../../data/Icons/icon-30-arrwos back.svg";
import { ReactComponent as Client } from "../../data/Icons/icon-24-user.svg";
import { ReactComponent as Message } from "../../data/Icons/icon-24-email.svg";
import { ReactComponent as Phone } from "../../data/Icons/icon-24- call.svg";
import { ReactComponent as Location } from "../../data/Icons/icon-24-pic map.svg";
import { ReactComponent as ArrowDown } from "../../data/Icons/icon-24-chevron_down.svg";
import { ReactComponent as Print } from "../../data/Icons/icon-24-print.svg";
import { ReactComponent as PDFIcon } from "../../data/Icons/pfd.svg";
// import { ReactComponent as DeleteIcon } from '../../data/Icons/icon-24-delete.svg';
import { ReactComponent as ListIcon } from "../../data/Icons/icon-24-circlr.svg";
import { AiOutlineSearch } from "react-icons/ai";
import { UserAuth } from "../../Context/UserAuthorProvider";

const OrderDetails = () => {
	const componentRef = useRef();
	const { id } = useParams();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/orders/${id}`
	);
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const navigate = useNavigate();

	const updateOrderStatus = (status) => {
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("status", status);
		axios
			.post(`https://backend.atlbha.com/api/Store/orders/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Orders");
					setReload(!reload);
				} else {
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Orders");
					setReload(!reload);
				}
			});
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
										<ArrowIcon className='arrow-back-icon' />
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
										<div className='title mb-3'>
											<h5>بيانات الطلب</h5>
										</div>
										<div className='order-details-data pt-md-4 pb-md-4'>
											<div className='row d-flex justify-content-center  '>
												<div className='col-md-3 col-12 mb-md-0 mb-3'>
													<div className='order-head-row'>
														<StatusIcon />
														<span className='me-3'>الحالة</span>
													</div>
													<div className='order-data-row'>
														<span className='status'>
															{fetchedData?.data?.orders?.status}
														</span>
													</div>
												</div>
												<div className='col-md-3 col-12 mb-md-0 mb-3'>
													<div className='order-head-row '>
														<DateIcon className='date-icon' />
														<span className='me-3'>تاريخ الطلب</span>
													</div>
													<div className='order-data-row'>
														<span> 20/08/2022</span>
													</div>
												</div>
												<div className='col-md-3 col-12 mb-md-0 mb-3'>
													<div className='order-head-row'>
														<WalletIcon />
														<span className='me-3 price'>
															قيمة الطلب <span>(ر.س)</span>
														</span>
													</div>
													<div className='order-data-row'>
														<span>
															{fetchedData?.data?.orders?.total_price}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</div>
								<div className='mb-md-5 mb-4'>
									<div className='order-details-box'>
										<div className='title mb-3'>
											<h5>بيانات العميل</h5>
										</div>
										<div className='order-details-data pt-md-4 pb-md-4'>
											<div className='row d-flex flex-md-row flex-column justify-content-center'>
												<div className='col-md-2 col-12 mb-md-0 mb-3'>
													<div className='client-date'>
														<div className='img mb-2'>
															<img
																className=' img-fluid'
																src={fetchedData?.data?.orders?.user?.image}
																alt='client'
															/>
														</div>
														<div className='text'>
															<div className='register-type mb-1'>
																التسجيل في المتجر
															</div>
															<div className='register-date'>
																{moment(
																	fetchedData?.data?.orders?.user?.created_at
																).format("DD/MM/YYYY")}
															</div>
														</div>
													</div>
												</div>
												<div className='col-md-10 col-12'>
													<div className='row mb-md-4 mb-3'>
														<div className='col-md-6 col-12 mb-md-0 mb-3'>
															<div className='info-box'>
																<Client className='client-icon' />
																<span>
																	{fetchedData?.data?.orders?.user?.name}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12'>
															<div className='info-box'>
																<Phone />
																<span style={{ direction: "ltr" }}>
																	{fetchedData?.data?.orders?.user?.phonenumber}
																</span>
															</div>
														</div>
													</div>
													<div className='row'>
														<div className='col-md-6 col-12 mb-md-0 mb-3'>
															<div
																className='info-box'
																style={{
																	justifyContent: "flex-start",
																	gap: "30px",
																}}>
																<Message />
																<span>
																	{fetchedData?.data?.orders?.user?.email}
																</span>
															</div>
														</div>
														<div className='col-md-6 col-12'>
															<div className='info-box'>
																<Location />
																<span>
																	{fetchedData?.data?.orders?.user?.city?.name}
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
									<div className='title mb-3'>
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
															<li onClick={() => updateOrderStatus("new")}>
																جديد
															</li>
															<li
																onClick={() => updateOrderStatus("completed")}>
																مكتمل
															</li>
															<li
																onClick={() =>
																	updateOrderStatus("delivery_in_progress")
																}>
																جاري التجهيز
															</li>
															<li onClick={() => updateOrderStatus("ready")}>
																جاهز
															</li>
															<li onClick={() => updateOrderStatus("canceled")}>
																ملغي
															</li>
															<li
																onClick={() =>
																	updateOrderStatus("not_completed")
																}>
																غير مكتمل
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
