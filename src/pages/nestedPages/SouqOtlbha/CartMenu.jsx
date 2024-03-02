import React from "react";
// Third party
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
// ICONS
import { Cross10 } from "../../../data/Icons";

function CartMenu({ data, reload, setReload }) {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	// delete item from cart function
	const deleteItemFromCart = (id) => {
		axios
			.get(`https://backend.atlbha.com/api/Store/deleteImportCart/${id}`, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true) {
					toast.success(res?.data?.message?.ar, {
						theme: "light",
					});
					setReload(!reload);
				} else {
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					setReload(!reload);
				}
			});
	};
	return (
		<div className='cart-menu'>
			{data?.totalCount > 0 ? (
				<>
					<div className='products-list'>
						{data?.cartDetail?.map((product) => (
							<div className='product'>
								<div className='image'>
									<Link to={`${product?.product?.id}`}>
										<img
											src={product?.product?.cover}
											alt={product?.product?.name}
										/>
									</Link>
								</div>
								<div className='info'>
									<div className='name'>
										<a href={`${product?.product?.id}`}>
											{product?.product?.name}
										</a>
										<ul className="product-options">
											{product?.options?.map((option, index) => (
												<li key={index}>{`${index === 0 ? `${option}` : `/ ${option}`}`}</li>
											))}
										</ul>
									</div>
									<div className='mate'>
										<span>{product?.qty}</span>
										{" × "}
										<span className='price'>{product?.price} ر.س</span>
									</div>
								</div>
								<button
									className='remove'
									onClick={() => deleteItemFromCart(product?.id)}>
									<Cross10 />
								</button>
							</div>
						))}
					</div>
					<div className='totals'>
						<table>
							<tbody>
								<tr>
									<th>السعر</th>
									<td>{data?.subtotal} ر.س</td>
								</tr>
								<tr>
									<th>الضريبة</th>
									<td>{data?.tax} ر.س</td>
								</tr>
								{data?.overweight_price !== null && data?.overweight_price !== 0 && (
									<tr>
										<th>قيمة الوزن الزائد ({data?.overweight} kg)</th>
										<td>
											{data?.overweight_price} ر.س
										</td>
									</tr>
								)}
								<tr>
									<th>الشحن</th>
									<td>{data?.shipping_price} ر.س</td>
								</tr>
								{data?.discount_total ? (
									<tr>
										<th>
											الخصم
											{data?.discount_type === "percent" ? (
												<span
													style={{
														fontSize: "0.85rem",
														color: "#7e7e7e",
													}}>
													({data?.discount_value}
													%)
												</span>
											) : null}
										</th>
										<td>{data?.discount_total} ر.س</td>
									</tr>
								) : null}
								<tr>
									<th>
										الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
									</th>
									<td>{data?.total} ر.س</td>
								</tr>
							</tbody>
						</table>
					</div>
					<div className='buttons'>
						<Link className='btn' to='Cart'>
							سلة الاستيراد
						</Link>
						<Link className='btn' to='Checkout'>
							الدفع
						</Link>
					</div>
				</>
			) : (
				<div className='empty'>
					<span>سلة الاستيراد الخاصة بك فارغة!</span>
				</div>
			)}
		</div>
	);
}

export default CartMenu;
