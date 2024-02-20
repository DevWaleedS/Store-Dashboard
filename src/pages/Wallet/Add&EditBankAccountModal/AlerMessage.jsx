import React from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";

import { IoMdInformationCircleOutline } from "react-icons/io";
// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";
import { closeMessageAlert } from "../../../store/slices/BankAccountAlert";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 500,
	maxWidth: "90%",
	height: 200,
	bgcolor: "#fff",
	border: "1px solid #707070",
	borderRadius: "8px",
	boxShadow: 24,
	"@media(max-width:768px)": {
		height: "auto",
		top: "180px",
	},
};

const AlertMessage = () => {
	const { isMessageAlertOpen, messageAlert } = useSelector(
		(state) => state.BankAccountAlert
	);
	const dispatch = useDispatch(false);

	return (
		<div className='add-category-form' open={isMessageAlertOpen}>
			<Modal
				open={isMessageAlertOpen}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div className='d-flex pt-2 px-2 justify-content-end'>
						{" "}
						<CloseIcon
							className='close_video_icon'
							style={{ cursor: "pointer" }}
							onClick={() => {
								dispatch(closeMessageAlert());
							}}
						/>
					</div>
					<div className='text-center delete-category-alert'>
						<div>
							<IoMdInformationCircleOutline
								className='mb-2 mb-md-3'
								style={{
									color: "#3392ff",
									fontSize: "45px",
								}}
							/>
						</div>
						{messageAlert}
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default AlertMessage;
