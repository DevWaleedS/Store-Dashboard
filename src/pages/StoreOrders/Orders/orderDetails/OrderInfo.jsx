import React, { useState } from "react";

import moment from "moment";

// Icons
import { PiTrafficSign } from "react-icons/pi";
import { BiLinkExternal } from "react-icons/bi";

import { FaServicestack } from "react-icons/fa";
import { BsFillInfoSquareFill } from "react-icons/bs";
import { AiFillCopy, AiFillCheckCircle } from "react-icons/ai";
import {
	Quantity,
	StatusIcon,
	WalletIcon,
	DateIcon,
	Delevray,
} from "../../../../data/Icons";

const OrderInfo = ({ currentOrder }) => {
	const [copy, setCopy] = useState(false);

	return (
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
								{moment(currentOrder?.orders?.created_at).format("DD-MM-YYYY")}
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
							<span>{currentOrder?.orders?.shippingtypes?.name}</span>
						</div>
					</div>
				</div>
				<div className='boxes mb-4'>
					{currentOrder?.orders?.shipping?.shipping_id && (
						<div className='box mb-4'>
							<div className='order-head-row'>
								<FaServicestack />

								<span className='me-2'>رقم التتبع</span>

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
										{currentOrder?.orders?.shipping?.shipping_id}
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
															currentOrder?.orders?.shipping?.shipping_id
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

					{currentOrder?.orders?.shipping?.track_id && (
						<div className='box mb-4'>
							<div className='order-head-row'>
								<PiTrafficSign />
								<span className='me-2'>رقم التحصيل</span>
							</div>
							<div className='order-data-row'>
								<span>{currentOrder?.orders?.shipping?.track_id}</span>
							</div>
						</div>
					)}
				</div>
				<div className=''>
					<div className='order-head-row'>
						<BsFillInfoSquareFill style={{ width: "22px", height: "22px" }} />
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
	);
};

export default OrderInfo;
