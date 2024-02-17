import React from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeDeleteCategoryAlert } from "../../store/slices/DeleteCategoryAlertModal";
import { FiAlertTriangle } from "react-icons/fi";
// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import CloseIcon from "@mui/icons-material/Close";

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
	},
};

const DeleteCategoryAlert = () => {
	const { isDeleteCategoryAlertOpen, messageAlert } = useSelector(
		(state) => state.DeleteCategoryAlertModal
	);
	const dispatch = useDispatch(false);

	return (
		<div className='add-category-form' open={isDeleteCategoryAlertOpen}>
			<Modal
				open={isDeleteCategoryAlertOpen}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div className='d-flex p-2 justify-content-end'>
						{" "}
						<CloseIcon
							className='close_video_icon'
							style={{ cursor: "pointer" }}
							onClick={() => {
								dispatch(closeDeleteCategoryAlert());
							}}
						/>
					</div>
					<div
						className='text-center add-product-from-store'
						style={{
							height: "100%",
						}}>
						<div>
							<FiAlertTriangle
								style={{
									color: "#ffb248",
									fontSize: "45px",
									marginBottom: "20px",
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

export default DeleteCategoryAlert;
