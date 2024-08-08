import React, { Fragment } from "react";
import ReactDom from "react-dom";

import { Box, Modal } from "@mui/material";

// Icons
import { FailedCheckout, SuccessCheckout } from "../../../../../data/Icons";

import { useNavigate, useLocation } from "react-router-dom";

import "./CheckOutStatus.css";
import { useGetUpgradePackagesQuery } from "../../../../../store/apiSlices/upgradePackagesApi";

// styles
const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 769,
	maxWidth: "90%",
	height: 450,
	bgcolor: "#fff",
	border: "1px solid #707070",
	borderRadius: "16px",
	boxShadow: 24,
	"@media(max-width:768px)": {
		height: "auto",
	},
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

const CheckoutStatusModal = () => {
	const navigate = useNavigate();
	const location = useLocation();

	const { data: upgradePackages } = useGetUpgradePackagesQuery();

	const pack = upgradePackages?.find((pack) => pack?.is_selected);

	return (
		<>
			<helmet>
				<title>
					لوحة تحكم اطلبها |
					{location.pathname === "/Products/SouqOtlobha/success" ||
					location.pathname === "/checkout-packages/success"
						? "عملية دفع ناجحة"
						: "فشل الدفع"}
				</title>
			</helmet>
			<div className='add-category-form' open={true}>
				{location?.pathname === "/Products/SouqOtlobha/success" ? (
					<Modal open={true}>
						<Box component={"div"} sx={style}>
							{location.pathname === "/Products/SouqOtlobha/success" ? (
								<div
									className='text-center add-product-from-store'
									style={{ padding: "45px 45px 0 45px" }}>
									<h3 className='my-4' style={headingStyle}>
										<SuccessCheckout className='checkout-icon' />
									</h3>
									<div className='content' style={{ marginBottom: "90px" }}>
										{/*<h1 className='checkout-status-title success-status-title '>
										عملية دفع ناجحة!
									</h1>*/}

										<h1 className='checkout-status-title success-status-title '>
											تمت إضافه المنتجات بنجاح
										</h1>
										{/*	<p style={contentStyles}>
										بعد الموافقه ستجدها في قسم المنتجات{" "}
										<span style={{ fontWeight: 500 }}>
											وخلال ثلاث أيام ستصلك المنتجات
										</span>{" "}
									</p>*/}

										<p style={contentStyles}>
											سيتم التواصل معك لإتمام إجراءات الدفع و بعد الموافقه
											ستجدها في قسم المنتجات{" "}
											<span style={{ fontWeight: 500 }}>
												وخلال ثلاث أيام ستصلك المنتجات
											</span>{" "}
										</p>
									</div>
								</div>
							) : (
								<div
									className='text-center add-product-from-store'
									style={{ padding: "45px 45px 40px 45px" }}>
									<h3 style={headingStyle}>
										<FailedCheckout className='failed-checkout-icon checkout-icon mb-2' />
									</h3>
									<div className='content' style={{ marginBottom: "90px" }}>
										<h1 className='checkout-status-title failed-status-title '>
											مع الاسف
										</h1>
										<div className='checkout-status-sub-title'>
											فشلت عملية الدفع يرجى المحاولة لاحقاً
										</div>
									</div>
								</div>
							)}
							<div className='add-product-from-store-footer d-flex justify-between'>
								<button
									onClick={() => {
										navigate("/Products/SouqOtlobha");
									}}
									style={{
										color: "#fff",
										fontSize: "24px",
										fontWight: 500,
										height: "70px",
										backgroundColor: "#1DBBBE",
										borderRadius: " 0 0 16px 0",
									}}
									className='w-50'>
									إستيراد منتجات آخري
								</button>
								<button
									onClick={() => {
										navigate("/Products");
									}}
									style={{
										color: "#1DBBBE",
										fontSize: "24px",
										fontWight: 500,
										height: "70px",
										backgroundColor: "#FFF",
										borderTop: "1px solid #1DBBBE",
										borderRadius: " 0 0 0 16px",
									}}
									className='w-50'>
									عودة
								</button>
							</div>
						</Box>
					</Modal>
				) : (
					<Modal open={true}>
						<Box component={"div"} sx={style}>
							{location.pathname === "/checkout-packages/success" ? (
								<div
									className='text-center add-product-from-store'
									style={{ padding: "40px 4px 0 40px" }}>
									<h3 className='my-4' style={headingStyle}>
										<SuccessCheckout className='checkout-icon' />
									</h3>
									<div className='content' style={{ marginBottom: "90px" }}>
										<h1 className='checkout-status-title success-status-title '>
											عملية دفع ناجحة!
										</h1>
										<p style={contentStyles}>
											تم الاشتراك في باقة{" "}
											<span style={{ color: "#1dbbbe", fontWeight: 500 }}>
												({pack?.name}){" "}
											</span>{" "}
											بنجاح.
											<span className='d-block' style={{ fontWeight: 500 }}>
												{" "}
												يمكنك الاستمتاع بكافة مميزات الباقة الآن.
											</span>{" "}
										</p>
									</div>
								</div>
							) : (
								<div
									className='text-center add-product-from-store'
									style={{ padding: "45px 45px 40px 45px" }}>
									<h3 style={headingStyle}>
										<FailedCheckout className='failed-checkout-icon checkout-icon mb-2' />
									</h3>
									<div className='content' style={{ marginBottom: "90px" }}>
										<h1 className='checkout-status-title failed-status-title '>
											مع الاسف
										</h1>
										<div className='checkout-status-sub-title'>
											فشلت عملية الدفع يرجى المحاولة لاحقاً
										</div>
									</div>
								</div>
							)}
							<div className='add-product-from-store-footer w-100'>
								<button
									onClick={() => {
										navigate("/");
									}}
									style={{
										color: "#1DBBBE",
										fontSize: "24px",
										fontWight: 500,
										height: "70px",

										backgroundColor: "#FFF",
										borderTop: "1px solid #1DBBBE",
										borderRadius: " 0 0 16px 16px",
									}}
									className='w-100'>
									إغلاق
								</button>
							</div>
						</Box>
					</Modal>
				)}
			</div>
		</>
	);
};

const CheckoutStatus = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<CheckoutStatusModal />,
				document.getElementById("checkout-status")
			)}
		</Fragment>
	);
};

export default CheckoutStatus;
