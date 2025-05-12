import React, { useContext, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { useNavigate } from "react-router-dom";

// ICONS

import { AiOutlineCloseCircle } from "react-icons/ai";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { closeDelegateRequestAlert } from "../../../../store/slices/DelegateRequestAlert-slice";
import { SuccessCheckout } from "../../../../data/Icons";
import { useRefundOrderMutation } from "../../../../store/apiSlices/ordersApiSlices/ordersApi";
import { LoadingContext } from "../../../../Context/LoadingProvider";
import Context from "../../../../Context/context";
import { toast } from "react-toastify";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 755,
	maxWidth: "90%",
	bgcolor: "#fff",
	border: "1px solid #707070",
	borderRadius: "16px",
	boxShadow: 24,
};

const headingStyle = {
	fontSize: "24px",
	fontWight: 500,
	letterSpacing: "0px",
	color: "#1DBBBE",
};

const contentStyles = {
	whiteSpace: "normal",
	fontSize: "22px",
	fontWight: 400,
	letterSpacing: "0px",
	color: "#0c486b;",
};

const RefundAmountModal = ({ currentOrder, id }) => {
	const { isOpen } = useSelector((state) => state.DelegateRequestAlert);
	const dispatch = useDispatch(false);
	const navigate = useNavigate();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// handle refund return order
	const [refundError, setRefundError] = useState("");

	// set price of order
	let price = currentOrder
		? currentOrder?.orders?.shippingtypes?.id === 5
			? currentOrder?.orders?.total_price
			: currentOrder?.orders?.total_price -
			  currentOrder?.orders?.overweight_price -
			  currentOrder?.orders?.shipping_price
		: "";

	// handle Refund Order
	const [RefundOrder, { isLoading }] = useRefundOrderMutation();
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
				dispatch(closeDelegateRequestAlert());
				navigate("/orders");
				setLoadingTitle("");
				setEndActionTitle(response?.data?.message?.ar);
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
		<div className='add-category-form' open={isOpen}>
			<Modal
				open={isOpen}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div className='close-icon p-2 text-start'>
						<AiOutlineCloseCircle
							onClick={() => {
								dispatch(closeDelegateRequestAlert());
							}}
							style={{
								color: "#000",
								width: "22px",
								height: "22px",
								cursor: "pointer",
							}}
						/>
					</div>
					<div
						className='text-center add-product-from-store'
						style={{ padding: "40px 4px 0 40px" }}>
						<h3 className='my-2 my-lg-4' style={headingStyle}>
							<SuccessCheckout className='checkout-icon' />
						</h3>

						<div className='content' style={{ marginBottom: "90px" }}>
							<h1 className='checkout-status-title success-status-title '>
								تم إلغاء الطلب بنجاح!
							</h1>
							<p style={contentStyles}>
								<span
									className='d-block'
									style={{ fontWeight: 500, whiteSpace: "normal" }}>
									{" "}
									هل تود رد مبلغ الطلب الآن؟
								</span>{" "}
							</p>

							<div
								style={{
									fontWeight: 400,
									whiteSpace: "normal",
									fontSize: "16px",
								}}>
								<span
									style={{
										fontWeight: 500,
										whiteSpace: "normal",
										fontSize: "16px",
										color: "#1dbbbe",
									}}>
									مبلغ الطلب:
								</span>{" "}
								{price} ر.س
							</div>
							{refundError && <p className='fs-6 text-danger'>{refundError}</p>}
						</div>
					</div>

					<div className='d-flex justify-between '>
						<button
							disabled={isLoading}
							onClick={handleRefundOrder}
							style={{
								width: "50%",
								color: "#fff",
								fontSize: "24px",
								fontWight: 500,
								height: "70px",
								backgroundColor: "#1DBBBE",
								borderRadius: " 0 0 16px 0",
							}}>
							{isLoading ? "جاري رد المبلغ للعميل" : "رد المبلغ"}
						</button>

						<button
							onClick={() => {
								dispatch(closeDelegateRequestAlert());
								navigate("/orders");
							}}
							style={{
								width: "50%",
								color: "#02466A",
								fontSize: "24px",
								fontWight: 500,
								height: "70px",
								border: "1px solid #02466A",
								backgroundColor: "#02466A00",
								borderRadius: " 0 0 0 16px",
							}}>
							الغاء
						</button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default RefundAmountModal;
