import React, { Fragment } from "react";
import ReactDom from "react-dom";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { closeVerifyModal } from "../../store/slices/VerifyStoreModal-slice";
import { closeVerifyStoreAlertModal } from "../../store/slices/VerifyStoreAlertModal-slice";

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
	letterSpacing: "0px",
	whiteSpace: "normal",
	fontSize: "24px",
	fontWight: 500,
	color: "#1DBBBE",
	padding: "110px 45px",
};

const VerifyAlert = () => {
	const navigate = useNavigate();
	const { isVerifyStoreAlertOpen } = useSelector(
		(state) => state.VerifyStoreAlertModal
	);
	const dispatch = useDispatch(false);

	return (
		<div className='add-category-form' open={isVerifyStoreAlertOpen}>
			<Modal
				open={isVerifyStoreAlertOpen}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div className='store-alert-body text-center' style={contentStyle}>
						<div>
							<SuccessCheckout
								className=' mb-2 mb-md-3 '
								style={{ width: "50px" }}
							/>
						</div>

						<p style={{ whiteSpace: "normal", fontSize: "20px" }}>
							جاري مراجعة طلب التوثيق في أقل من 24 ساعة{" "}
						</p>
						<p style={{ whiteSpace: "normal", fontSize: "18px" }}>
							ستصلك رسالة عبر البريد الالكتروني{" "}
						</p>
					</div>
					<div className='store-alert-footer d-flex justify-between'>
						<button
							onClick={() => {
								navigate("/");
								dispatch(closeVerifyStoreAlertModal());
								dispatch(closeVerifyModal());
							}}
							style={{
								color: "#fff",
								fontSize: "1.4rem",
								fontWight: 500,
								height: "70px",
								backgroundColor: "#1DBBBE",
								borderRadius: " 0 0 16px 16px",
							}}
							className='w-100'>
							الصفحة الرئيسية
						</button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

const VerifayStoreAlert = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<VerifyAlert />,
				document.getElementById("verifay_store_Alert")
			)}
		</Fragment>
	);
};

export default VerifayStoreAlert;
