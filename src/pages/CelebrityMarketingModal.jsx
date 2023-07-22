import React, { Fragment } from "react";
import { Helmet } from "react-helmet";
import ReactDom from "react-dom";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { closeCelebrityMarketingModal } from "../store/slices/CelebrityMarketingModal";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";

// Icons
import { AiOutlineCloseCircle } from "react-icons/ai";
import howIcon from "../data/Icons/icon_24_home.svg";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 820,
	maxWidth: "90%",
	borderRadius: 5,
};

const MarketingModal = () => {
	// create video modal funcation
	const { isOpenCelebrityMarketingModal } = useSelector(
		(state) => state.CelebrityMarketingModal
	);
	const dispatch = useDispatch(true);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | التسويق عبر المشاهير</title>
			</Helmet>
			<section className='marketing-page p-3'>
				<div className='row' open={isOpenCelebrityMarketingModal}>
					<div className='modal'>
						<Modal
							aria-labelledby='transition-modal-title'
							aria-describedby='transition-modal-description'
							open={isOpenCelebrityMarketingModal}
							onClose={() => {
								dispatch(closeCelebrityMarketingModal());
							}}
							closeAfterTransition
							BackdropComponent={Backdrop}
							BackdropProps={{
								timeout: 500,
							}}>
							<Box
								component={"div"}
								sx={style}
								className='video-modal-container'>
								<div className='close-icon-video-modal'>
									<AiOutlineCloseCircle
										style={{ cursor: "pointer" }}
										onClick={() => {
											dispatch(closeCelebrityMarketingModal());
										}}
									/>
								</div>
								<video className='video-modal' controls>
									<source
										src='https://www.w3schools.com/html/mov_bbb.mp4'
										type='video/mp4'
									/>
								</video>
								<Button
									className='modal-video-btn'
									variant='contained'
									size='medium'>
									توجه الي منصه المشاهير
								</Button>
							</Box>
						</Modal>
					</div>
				</div>
			</section>
		</>
	);
};

const CelebrityMarketingModal = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<MarketingModal />,
				document.getElementById("Celebrity_Marketing_Modal")
			)}
		</Fragment>
	);
};

export default CelebrityMarketingModal;
