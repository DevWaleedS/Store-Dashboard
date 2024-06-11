import React from "react";

// Third party
import { useNavigate } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeCommentModal } from "../../../store/slices/BankAccStatusCommentModal";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { FailedCheckout } from "../../../data/Icons";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 620,
	maxWidth: "90%",
	height: 220,
	bgcolor: "#fff",
	border: "1px solid #707070",
	borderRadius: "16px",
	boxShadow: 24,
	"@media(max-width:768px)": {
		height: "auto",
	},
};

const BankAccStatusComment = ({ comment }) => {
	const { isCommentOpen } = useSelector(
		(state) => state.BankAccStatusCommentModal
	);
	const dispatch = useDispatch(false);
	const navigate = useNavigate();

	return (
		<div className='add-category-form' open={isCommentOpen}>
			<Modal
				onClose={() => {
					dispatch(closeCommentModal());
					navigate("/wallet");
				}}
				open={isCommentOpen}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div className='d-flex p-2 justify-content-end'>
						<CloseIcon
							className='close_video_icon'
							style={{ cursor: "pointer" }}
							onClick={() => {
								dispatch(closeCommentModal());
								navigate("/wallet");
							}}
						/>
					</div>
					<div
						className='text-center add-product-from-store'
						style={{ padding: "45px 45px 0 45px" }}>
						<div>
							<FailedCheckout
								className=' mb-2 mb-md-3 '
								style={{ width: "50px" }}
							/>
						</div>
						<div
							style={{
								whiteSpace: "normal",
								fontSize: "20px",
								fontWeight: "400",
								color: "#0f5575",
							}}>
							{comment}
						</div>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default BankAccStatusComment;
