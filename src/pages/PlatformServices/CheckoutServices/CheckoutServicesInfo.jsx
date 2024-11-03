import React from "react";

import { LuDot } from "react-icons/lu";
import { IoIosClose } from "react-icons/io";
import { CircularProgress } from "@mui/material";

import { CircularLoading } from "../../../HelperComponents";
import { useRemoveServiceCouponMutation } from "../../../store/apiSlices/platformServicesApi";
const CheckoutServicesInfo = ({
	selectedServices,
	grandTotal,
	cartAfterCoupon,
	cartIsLoading,
}) => {
	// Calculate tax at 15%
	const taxRate = 0.15;
	const taxAmount = grandTotal * taxRate;

	// handle set package id and navigate user to checkout package
	const [removeServiceCoupon, { isLoading }] = useRemoveServiceCouponMutation();
	const cancelCoupon = async () => {
		// make request...
		try {
			await removeServiceCoupon({
				id: cartAfterCoupon?.id,
			});
		} catch (error) {
			console.error("Error changing removeServiceCoupon:", error);
		}
	};

	return (
		<>
			<div className='checkout__info'>
				<h2 className='mb-2'>تفاصيل الطلب</h2>

				<div className='package__info'>
					<table className='checkout-totals'>
						{cartIsLoading || isLoading ? (
							<tbody>
								<td style={{ height: "230px" }}>
									<CircularLoading />
								</td>
							</tbody>
						) : (
							<>
								<thead>
									<tr>
										<th>اسم الخدمة</th>
										<th>الإجمالي</th>
									</tr>
								</thead>
								<tbody className='products'>
									{selectedServices?.map((item) => (
										<tr key={item?.id}>
											<td
												style={{
													display: "flex",
													flexDirection: "column",
													alignItems: "start",
													gap: "0.2rem",
												}}>
												<div className='d-flex flex-column align-items-start gap-1'>
													<span className='pack__name'>
														<span>
															<LuDot />
														</span>
														{item?.name}
													</span>
												</div>
											</td>

											<td>
												{(item?.price - item?.price * 0.15)?.toFixed(2)} ر.س
											</td>
										</tr>
									))}
								</tbody>
								<tbody className='subtotals'>
									<tr>
										<th>السعر</th>
										<td>{(grandTotal - grandTotal * 0.15).toFixed(2)} ر.س</td>
									</tr>

									<tr>
										<th>الضريبة</th>
										<td>{taxAmount.toFixed(2)} ر.س</td>
									</tr>

									{cartAfterCoupon?.coupon ? (
										<tr>
											<th>
												كود خصم
												<span className='coupon_box'>
													<span style={{ color: "#1dbbbe", fontSize: "1rem" }}>
														{" "}
														{cartAfterCoupon?.coupon?.code}{" "}
													</span>
													{cartAfterCoupon?.coupon?.discount_type ===
													"نسبة مئوية" ? (
														<p
															style={{
																display: "inline-block",
																fontSize: "0.85rem",
																color: "#7e7e7e",
															}}>
															({cartAfterCoupon?.coupon?.discount}%)
														</p>
													) : null}
													<button
														disabled={isLoading}
														className='cancel_coupon__icon'
														onClick={cancelCoupon}>
														{isLoading ? (
															<CircularProgress
																size='12px'
																sx={{ color: "#ccc" }}
															/>
														) : (
															<IoIosClose className='close__coupon_icon' />
														)}
													</button>
												</span>
											</th>

											<td>
												{cartAfterCoupon?.coupon?.discount_type === "نسبة مئوية"
													? `${(
															selectedServices?.reduce(
																(sum, item) => sum + item.price,
																0
															) *
															(cartAfterCoupon?.coupon?.discount / 100)
													  ).toFixed(2)} ر.س`
													: `${cartAfterCoupon?.coupon?.discount?.toFixed(
															2
													  )} ر.س`}
											</td>
										</tr>
									) : null}
								</tbody>
								<tfoot>
									<tr>
										<th>
											<div className='d-flex justify-content-start align-items-center gap-1 flex-wrap'>
												الإجمالي{" "}
												<span className='tax-text'>(شامل الضريبة)</span>
											</div>
										</th>
										<td>
											{cartAfterCoupon?.coupon
												? (
														grandTotal - cartAfterCoupon?.coupon?.discount
												  )?.toFixed(2)
												: grandTotal?.toFixed(2)}{" "}
											ر.س
										</td>
									</tr>
								</tfoot>
							</>
						)}
					</table>
				</div>
			</div>
		</>
	);
};

export default CheckoutServicesInfo;
