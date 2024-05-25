import React from "react";
import CircularLoading from "../../../../HelperComponents/CircularLoading";
import { Cross10 } from "../../../../data/Icons";
import { toast } from "react-toastify";
import { useRemoveCartItemsMutation } from "../../../../store/apiSlices/souqOtlobhaProductsApi";

const RenderCheckoutInfo = ({ cartData, isCartLoading }) => {
	// handle remove cart items function
	const [removeCartItems, { isLoading }] = useRemoveCartItemsMutation();
	const handleRemoveCartItems = async () => {
		try {
			await removeCartItems()
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					} else {
						toast.success(data?.message?.ar, {
							theme: "light",
						});
					}
				});
		} catch (err) {
			console.error("Failed to delete the deleteImportCart", err);
		}
	};

	return (
		<>
			{" "}
			<div className='d-flex justify-content-between align-content-center render-checkout-info'>
				<h3 className='card-title'>تفاصيل الطلب</h3>
				<button
					disabled={isLoading}
					className='remove '
					onClick={() => handleRemoveCartItems()}>
					<Cross10 />
				</button>
			</div>
			<table className='checkout-totals'>
				{isCartLoading ? (
					<tbody>
						<td style={{ height: "100px" }}>
							<CircularLoading />
						</td>
					</tbody>
				) : (
					<>
						<thead>
							<tr>
								<th>المنتج</th>
								<th>الإجمالي</th>
							</tr>
						</thead>
						<tbody className='products'>
							{cartData?.cartDetail?.map((item) => (
								<tr key={item?.id}>
									<td
										style={{
											display: "flex",
											flexDirection: "column",
											alignItems: "start",
											gap: "0.2rem",
										}}>
										<div className='d-flex flex-row align-items-center gap-1'>
											<span
												style={{
													maxWidth: "170px",
													overflow: "hidden",
													textOverflow: "ellipsis",
													whiteSpace: "nowrap",
												}}>
												{item?.product?.name}
											</span>{" "}
											× <span>{item?.qty}</span>
										</div>

										<ul className='product-options'>
											{item?.options?.map((option, index) => (
												<li key={index}>{`${
													index === 0 ? `${option}` : `/ ${option}`
												}`}</li>
											))}
										</ul>
									</td>
									<td>{item?.sum} ر.س</td>
								</tr>
							))}
						</tbody>
						<tbody className='subtotals'>
							<tr>
								<th>السعر</th>
								<td>{cartData?.subtotal} ر.س</td>
							</tr>
							<tr>
								<th>الضريبة</th>
								<td>{cartData?.tax} ر.س</td>
							</tr>
							{cartData?.overweight_price !== null &&
								cartData?.overweight_price !== 0 && (
									<tr>
										<th>قيمة الوزن الزائد ({cartData?.overweight} kg)</th>
										<td>{cartData?.overweight_price} ر.س</td>
									</tr>
								)}
							<tr>
								<th>الشحن</th>
								<td>{cartData?.shipping_price} ر.س</td>
							</tr>

							{cartData?.discount_total ? (
								<tr>
									<th>
										الخصم
										{cartData?.discount_type === "percent" ? (
											<span
												style={{
													fontSize: "0.85rem",
													color: "#7e7e7e",
												}}>
												({cartData?.discount_value}
												%)
											</span>
										) : null}
									</th>
									<td>{cartData?.discount_total} ر.س</td>
								</tr>
							) : null}
						</tbody>

						<tfoot>
							<tr>
								<th>
									الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
								</th>
								<td>{cartData?.total} ر.س</td>
							</tr>
						</tfoot>
					</>
				)}
			</table>
		</>
	);
};

export default RenderCheckoutInfo;
