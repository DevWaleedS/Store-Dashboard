import React, { Fragment } from "react";
import ReactDom from "react-dom";

import { useDispatch, useSelector } from "react-redux";
import { closeVerifyAfterMainModal } from "../store/slices/VerifyStoreAlertAfterMainModal-slice";
import { useNavigate } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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
						<p>تم حفظ البيانات بنجاح</p>
						<p className='text-bold'>يرجى اكمال بيانات التوثيق</p>
					</div>
					<div className='store-alert-footer d-flex justify-between '>
						<button
							onClick={() => {
								navigate("/VerifyStore");
								dispatch(closeVerifyAfterMainModal());
							}}
							style={{
								color: "#fff",
								fontSize: "24px",
								fontWight: 500,
								height: "70px",
								backgroundColor: "#1DBBBE",
								borderRadius: " 0 0 16px 16px",
							}}
							className='w-100'>
							التوجه إلى الصفحة التوثيق
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
