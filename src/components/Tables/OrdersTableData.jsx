import * as React from "react";
import { BsArrowLeft } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { BsThreeDotsVertical } from "react-icons/bs";
import { DeleteIcon, Reports } from "../../data/Icons";

const OrdersTableData = ({ ordersDetails }) => {
	const navigate = useNavigate();

	return (
		<div className='new-orders-table'>
			<div className='row mb-3'>
				<div className='col-12'>
					<div className='comp-title d-flex justify-content-between '>
						<h4>أحدث الطلبات </h4>
						<BsArrowLeft
							className='arrow-style'
							onClick={() => navigate("Orders")}
						/>
					</div>
				</div>
			</div>

			<div className='row'>
				<div
					className='table-wrapper table-responsive'
					style={{ minHeight: "470px" }}>
					{ordersDetails?.length === 0 ? (
						<div className='d-flex justify-content-center align-items-center h-100'>
							لا يوجد طلبات حتى الآن
						</div>
					) : (
						<table className='table table-borderless orders-table text-center'>
							<thead>
								<tr>
									<th
										scope='col'
										className='pr-rad-right '
										style={{
											width: "85px",
											color: "#52575D",
											textAlign: "center",
											background: "#E6F5F6",
											whiteSpace: "normal",
										}}>
										رقم الطلب
									</th>
									<th
										scope='col'
										style={{
											whiteSpace: "nowrap",
											width: "200px",
											background: "#E6F5F6",
											color: "#52575D",
										}}>
										الاسم
									</th>
									<th
										scope='col'
										className=' text-center'
										style={{ background: "#E6F5F6", color: "#52575D" }}>
										الحالة
									</th>
									<th
										scope='col'
										className=' text-center pr-rad-left'
										style={{ background: "#E6F5F6", color: "#52575D" }}>
										الاجراء
									</th>
								</tr>
							</thead>
							<tbody>
								{ordersDetails?.map((order) => (
									<React.Fragment key={order?.id}>
										<tr>
											<td
												className=' text-end pe-3 text-overflow'
												style={{
													whiteSpace: "nowrap",
													width: "85px",
													textAlign: "center",
												}}>
												{order?.order_number}
											</td>
											<td
												style={{
													whiteSpace: "nowrap",
													width: "200px",
												}}>
												<div className='d-flex justify-content-start align-items-center gap-2'>
													<div style={{ whiteSpace: "nowrap", width: "40px" }}>
														<img
															style={{ borderRadius: "50%", width: "100%" }}
															className='rounded-circle img_icons'
															src={order?.user?.image}
															alt=''
														/>
													</div>
													<div
														style={{
															whiteSpace: "nowrap",
															overflow: "hidden",
															textOverflow: "ellipsis",
														}}>{`${order?.user?.name} ${order?.user?.lastname}`}</div>
												</div>
											</td>
											<td className=' d-flex justify-content-center align-items-center'>
												<span
													className='status'
													style={{
														backgroundColor:
															order?.status === "تم الشحن"
																? "#ebfcf1"
																: order?.status === "جديد"
																? "#d4ebf7"
																: order?.status === "الغاء الشحنة"
																? "#ffebeb"
																: order?.status === "قيد التجهيز"
																? "#ffecd1c7"
																: "#9df1ba",
														color:
															order?.status === "تم الشحن"
																? "##9df1ba"
																: order?.status === "جديد"
																? "#0077ff"
																: order?.status === "الغاء الشحنة"
																? "#ff7b7b"
																: order?.status === "قيد التجهيز"
																? "#ff9f1a"
																: "#07b543",
													}}>
													{order?.status}
												</span>
											</td>
											<td className=' text-center action-icon'>
												<div className='dropdown'>
													<div
														className=''
														data-bs-toggle='dropdown'
														aria-expanded='false'>
														<BsThreeDotsVertical />
													</div>

													<ul className='dropdown-menu new-orders-dropdown-menu'>
														<li>
															<Link
																className='dropdown-item'
																to={`/Orders/OrderDetails/${order?.id}`}>
																<Reports
																	className='report-icon'
																	title='تفاصيل الطلب'
																/>
															</Link>
														</li>
													</ul>
												</div>
											</td>
										</tr>
									</React.Fragment>
								))}
							</tbody>
						</table>
					)}
				</div>
			</div>
		</div>
	);
};

export default OrdersTableData;
