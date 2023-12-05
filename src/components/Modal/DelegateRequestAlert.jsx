import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeDelegateRequestAlert } from "../../store/slices/DelegateRequestAlert-slice";
import { useNavigate } from "react-router-dom";

// ICONS
import { TbAlertCircle } from "react-icons/tb";
import { AiOutlineCloseCircle } from "react-icons/ai";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

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

const contentStyle = {
	fontSize: "20px",
	fontWight: 400,
	letterSpacing: "0.2px",
	color: "#242424",
	padding: "35px 25px 100px",
	whiteSpace: "normal",
};

const DelegateRequestAlert = () => {
	const { isOpen } = useSelector((state) => state.DelegateRequestAlert);
	const dispatch = useDispatch(false);
	const navigate = useNavigate();

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
								navigate("");
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
						className='delegate-request-alert text-center'
						style={contentStyle}>
						<div className='mb-4'>
							<TbAlertCircle
								style={{ color: "red", width: "30px", height: "30px" }}
							/>
						</div>
						عند طلبك <span style={{ fontWeight: 500 }}>لخدمة المندوبين</span>{" "}
						فإننا في إدارة منصة اطلبها لا نتحمل مسئولية المندوب{" "}
						<span style={{ color: "#1DBBBE" }}>
							ونحن نخلي مسؤليتنا تماماً من أي تفاصيل تتعلق بالمندوب
						</span>
					</div>
					<div className='d-flex justify-between '>
						<button
							onClick={() => navigate("Delegate")}
							style={{
								color: "#fff",
								fontSize: "24px",
								fontWight: 500,
								height: "70px",
								backgroundColor: "#1DBBBE",
								borderRadius: " 0 0 16px 16px",
							}}
							className='w-100'>
							موافق
						</button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default DelegateRequestAlert;
