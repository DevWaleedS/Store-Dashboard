import * as React from "react";
import { BsArrowLeft } from "react-icons/bs";

import { Link, useNavigate } from "react-router-dom";

// ICons
import { ReactComponent as ReportIcon } from "../data/Icons/icon-24-actions-info_outined.svg";
import { ReactComponent as DeleteIcon } from "../data/Icons/icon-24-delete.svg";
import { BsThreeDotsVertical } from "react-icons/bs";

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
					style={{ minHeight: "400px" }}>
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
										style={{
											whiteSpace: "nowrap",
											width: "85px",
											textAlign: "center",
										}}>
										رقم الطلب
									</th>
									<th
										scope='col'
										style={{ whiteSpace: "nowrap", width: "200px" }}>
										الاسم
									</th>
									<th scope='col' className=' text-center'>
										الحالة
									</th>
									<th scope='col' className=' text-center pr-rad-left'>
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
												className='text-overflow'
												style={{ whiteSpace: "nowrap", width: "200px" }}>
												{" "}
												{`${order?.user?.name} ${order?.user?.user_name}`}
											</td>
											<td>
												<span
													className='status text-overflow'
													style={{
														background:
															order?.status === "تم التوصيل"
																? "#ebfcf1"
																: order?.status === "جاهز للشحن"
																? "#b29eff36"
																: order?.status === "جديد"
																? "#d4ebf7"
																: order?.status === "ملغي"
																? "#ffebeb"
																: "#9df1ba",
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
																<ReportIcon className='report-icon' />
															</Link>
														</li>
														<li className='delete'>
															<button className='dropdown-item'>
																<DeleteIcon />
															</button>
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
