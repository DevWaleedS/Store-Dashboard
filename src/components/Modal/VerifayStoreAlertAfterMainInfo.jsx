import React, { Fragment } from "react";
import ReactDom from "react-dom";
// Icons
import { CiCircleCheck } from "react-icons/ci";

import { toast } from "react-toastify";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeVerifyAfterMainModal } from "../../store/slices/VerifyStoreAlertAfterMainModal-slice";
import { useNavigate } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { SuccessCheckout } from "../../data/Icons";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 768,
	maxWidth: "90%",
	bgcolor: "#fff",
	border: "1px solid #707070",
	borderRadius: "16px",
	boxShadow: 24,
};

const contentStyle = {
	fontSize: "24px",
	fontWight: 500,
	letterSpacing: "0px",
	color: "#1DBBBE",
	padding: "110px 45px",
};

const VerifayAfterMainInfoAlert = () => {
	const navigate = useNavigate();
	const { isVerifyAfterMainOpen } = useSelector(
		(state) => state.VerifyAfterMainModal
	);
	const dispatch = useDispatch(false);

	return (
		<div className='add-category-form' open={isVerifyAfterMainOpen}>
			<Modal
				open={isVerifyAfterMainOpen}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div className='store-alert-body text-center' style={contentStyle}>
						<SuccessCheckout className='checkout-icon' />
						<p className='mb-2'>تم حفظ البيانات بنجاح</p>
						<p
							style={{
								whiteSpace: "normal",
								color: "#006e87",
								fontWeight: "500",
							}}>
							{" "}
							يمكنك الاشتراك في الباقة لتفعيل المتجر بالكامل
						</p>
					</div>
					<div className='store-alert-footer d-flex flex-column flex-md-row  justify-content-center p-md-4 p-2 py-4 align-content-center verification-alert-btns gap-2'>
						<button
							onClick={() => {
								navigate("/Upgrade-Packages");
								dispatch(closeVerifyAfterMainModal());
							}}
							className=' verification-now-btn'>
							إشترك الآن
						</button>
						<button
							onClick={() => {
								toast.warning(
									"سيتم حذف بيانات المتجر اذا لم يتم التوثيق خلال 7 أيام",
									{
										theme: "light",
									}
								);
								dispatch(closeVerifyAfterMainModal());
							}}
							className=' verification-later-btn'>
							وقت آخر
						</button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

const VerifayStoreAfterMainInfoAlert = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<VerifayAfterMainInfoAlert />,
				document.getElementById("verifay_store_Alert")
			)}
		</Fragment>
	);
};

export default VerifayStoreAfterMainInfoAlert;
