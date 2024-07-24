import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// context
import { LoadingContext } from "../../../../Context/LoadingProvider";

// Icons
import { IoIosPricetags } from "react-icons/io";
import { ListIcon } from "../../../../data/Icons";
import { useRefundOrderMutation } from "../../../../store/apiSlices/ordersApiSlices/ordersApi";

const RefundOrder = ({ id, currentOrder }) => {
	const navigate = useNavigate();
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// handle refund return order
	const [refundError, setRefundError] = useState("");

	// set price of order
	const [price, setPrice] = useState(null);
	useEffect(() => {
		if (currentOrder) {
			// if shipping is other return total price if aramex return price  without sipping price and over wight
			setPrice(
				currentOrder?.orders?.shippingtypes?.id === 5
					? currentOrder?.orders?.total_price
					: currentOrder?.orders?.total_price -
							currentOrder?.orders?.overweight_price -
							currentOrder?.orders?.shipping_price
			);
		}
	}, [currentOrder]);

	// handle Refund Order
	const [RefundOrder] = useRefundOrderMutation();
	const handleRefundOrder = async () => {
		setLoadingTitle("جاري رد المبلغ للعميل");

		try {
			const response = await RefundOrder({
				id,
				price,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				navigate("/Orders");
				setLoadingTitle("");
			} else {
				setLoadingTitle("");
				setRefundError(response?.data?.message?.ar);
				// Handle display errors using toast notifications
				toast.error(response?.data?.message?.ar, { theme: "light" });
			}
		} catch (error) {
			console.error("Error changing update refundReturnOrder:", error);
		}
	};

	return (
		currentOrder?.orders?.paymenttype?.id !== 4 &&
		currentOrder?.orders?.status === "ملغي" &&
		currentOrder.orders?.is_refund === 0 &&
		currentOrder?.orders?.payment_status === "تم الدفع" && (
			<div className='mb-3'>
				<div className='action-title'>
					<ListIcon className='list-icon' />
					<label htmlFor='return-order-price ' className='pe-2'>
						المبلغ المطلوب رده للعميل
					</label>
				</div>
				<div className='d-flex return-order-wrapper justify-content-start align-items-center gap-3 '>
					<div className='return-order-price-input '>
						<IoIosPricetags />

						<input
							name='return-order-price'
							type='text'
							value={price}
							onChange={(e) => {
								setPrice(e.target.value);
							}}
						/>
						<span className='return-order-currency'>رس</span>
					</div>
					<button
						onClick={() => handleRefundOrder()}
						className='flex justify-content-center align-items-center refund-order-btn '>
						رد المبلغ للعميل
					</button>
				</div>

				{refundError && <p className='fs-6 text-danger'>{refundError}</p>}
			</div>
		)
	);
};

export default RefundOrder;
