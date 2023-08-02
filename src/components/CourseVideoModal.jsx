import React from "react";

import { useDispatch, useSelector } from "react-redux";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import { AiOutlineCloseCircle } from "react-icons/ai";
import { closeModal } from "../store/slices/VideoModal-slice";

const style = {
	position: "absolute",
	top: "55%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 700,
	maxWidth: "90%",
	borderRadius: 5,
};

const CourseVideoModal = () => {
	const { isOpenVideoModal, currentVideo } = useSelector(
		(state) => state.VideoModal
	);
	const dispatch = useDispatch(true);

	return (
		<div open={isOpenVideoModal}>
			<Modal
				sx={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
				aria-labelledby='transition-modal-title'
				aria-describedby='transition-modal-description'
				open={isOpenVideoModal}
				onClose={() => {
					dispatch(closeModal());
				}}
				closeAfterTransition>
				<Box component={"div"} sx={style} className='explain-courses-modal'>
					<div className='close-icon-video-modal'>
						<AiOutlineCloseCircle
							style={{ cursor: "pointer", color: "#FFF" }}
							onClick={() => {
								dispatch(closeModal());
							}}
						/>
					</div>
					<video className='video-modal' controls>
						<source
							src={
								typeof currentVideo === "object"
									? currentVideo?.video
									: currentVideo
							}
							type='video/mp4'
						/>
					</video>
				</Box>
			</Modal>
		</div>
	);
};
export default CourseVideoModal;
