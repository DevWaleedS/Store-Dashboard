import React from "react";

// Third party
import { useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Icons
import { CiCircleCheck } from "react-icons/ci";

import { closeMessage } from "../../store/slices/SuccessMessageModalSlice";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 769,
	maxWidth: "90%",
	height: 367,
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
	fontSize: "24px",
	fontWight: 400,
	letterSpacing: "0px",
	color: "#011723",
};

const SuccessMessageModal = () => {
	const { isOpenMessageOpen } = useSelector((state) => state.SuccessMessage);
	const dispatch = useDispatch(false);
	const navigate = useNavigate();

	return (
		<div className='add-category-form' open={isOpenMessageOpen}>
			<Modal
				onClose={() => dispatch(closeMessage())}
				open={isOpenMessageOpen}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div
						className='text-center add-product-from-store'
						style={{ padding: "45px 45px 0 45px" }}>
						<h3 className='my-4' style={headingStyle}>
							تم إرسال طلب الاستيراد بنجاح
							<CiCircleCheck style={{ fontSize: "26px", marginRight: "5px" }} />
						</h3>
						<div className='content' style={{ marginBottom: "90px" }}>
							<p style={contentStyles}>
								بعد الموافقه ستجدها في قسم المنتجات{" "}
								<span style={{ fontWeight: 500 }}>
									وخلال ثلاث أيام توصلك المنتجات
								</span>{" "}
							</p>
						</div>
					</div>
					<div className='add-product-from-store-footer d-flex justify-between'>
						<button
							onClick={() => {
								navigate("/Products/SouqOtlobha");
								dispatch(closeMessage());
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
							استيراد منتجات اخرى
						</button>
						<button
							onClick={() => {
								dispatch(closeMessage());
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
		</div>
	);
};

export default SuccessMessageModal;
