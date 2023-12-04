import React, { useEffect, useState } from "react";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../store/slices/VideoModal-slice";

// Icons
import { IoMdClose } from "react-icons/io";

// Style the modal
const style = {
	position: "absolute",
	top: "55%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 850,
	maxWidth: "90%",
	borderRadius: 1,
};

const CourseVideoModal = () => {
	const { isOpenVideoModal, currentVideo } = useSelector(
		(state) => state.VideoModal
	);
	const dispatch = useDispatch(true);

	// This code to handle get the src from youtube iframe src
	const [videoUrl, setVideoUrl] = useState(null);
	useEffect(() => {
		const parser = new DOMParser();
		const doc = parser?.parseFromString(
			typeof currentVideo === "object" ? currentVideo?.video : currentVideo,
			"text/html"
		);
		const iframeSrc = doc?.querySelector("iframe")?.getAttribute("src");
		setVideoUrl(iframeSrc);
	}, [currentVideo]);

	return (
		<>
			{isOpenVideoModal && currentVideo && videoUrl && (
				<div>
					<Modal
						aria-labelledby='transition-modal-title'
						aria-describedby='transition-modal-description'
						open={isOpenVideoModal}
						onClose={() => {
							dispatch(closeModal());
						}}
						closeAfterTransition>
						<Box component={"div"} sx={style} className='explain-courses-modal'>
							<div className='video-course-close-icon'>
								<IoMdClose
									style={{ cursor: "pointer", color: "#fff" }}
									onClick={() => {
										dispatch(closeModal());
									}}
								/>
							</div>

							<section className='course-details-video-modal'>
								<iframe
									width='100%'
									height='100%'
									src={videoUrl}
									allowFullScreen
									title={"fetchedData?.data?.explainvideos?.title"}
								/>
							</section>
						</Box>
					</Modal>
				</div>
			)}
		</>
	);
};
export default CourseVideoModal;
