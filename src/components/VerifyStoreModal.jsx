import React, { useState, useEffect, Fragment, useContext } from "react";
import ReactDom from "react-dom";
import useFetch from "../Hooks/UseFetch";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { useDispatch, useSelector } from "react-redux";
import { closeVerifyModal } from "../store/slices/VerifyStoreModal-slice";
import { Link } from "react-router-dom";

// icons
import { IoMdCloseCircleOutline } from "react-icons/io";
import { ReactComponent as Verification } from "../data/Icons/icon-24-Verification.svg";
import CircularLoading from "../HelperComponents/CircularLoading";
import { UserAuth } from "../Context/UserAuthorProvider";

// styles
const style = {
	position: "absolute",
	top: "18%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "100%",
	maxWidth: "100%",
	bgcolor: "#ffdd00",
	boxShadow: 24,
	p: 4,
	"@media(max-width:768px)": {
		top: "70px",
		left: 0,
		transform: "none",
		padding: "16px",
	},
};

const VerifyStore = () => {
	const UserInfo = useContext(UserAuth);
	const { userInfo } = UserInfo;
	const [verificationStatus, setVerificationStatus] = useState();
	const { fetchedData, loading } = useFetch(
		"https://backend.atlbha.com/api/Store/verification_show"
	);
	const { isOpenVerifyModal } = useSelector((state) => state.VerifyModal);
	const dispatch = useDispatch(false);

	useEffect(() => {
		if (fetchedData?.data?.stores) {
			setVerificationStatus(
				fetchedData?.data?.stores?.map((store) => store?.verification_status)[0]
			);
		}
	}, [fetchedData?.data?.stores]);

	return (
		<div>
			{verificationStatus === "" || null ? null : (
				<Modal
					open={isOpenVerifyModal}
					onClose={() => {
						dispatch(closeVerifyModal());
					}}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<Typography
							id='modal-modal-description'
							sx={{ mt: 2, "@media(max-width:768px)": { mt: 0 } }}>
							<div className='d-flex justify-content-center align-items-center'>
								{loading ? (
									<CircularLoading />
								) : (
									<div className='d-flex justify-content-center align-items-center'>
										{verificationStatus === "تم التوثيق" ? (
											<div className='d-flex justify-content-between align-items-center verify-message-box gap-5'>
												<p className='verify-message'>
													مرحبا{" "}
													<span className='text-bold'>
														{userInfo?.name !== "null"
															? userInfo?.name
															: userInfo?.user_name || "صديقي التاجر"}
													</span>{" "}
													المتجر الخاص مكتمل التوثيق <Verification />
												</p>
												<IoMdCloseCircleOutline
													style={{ cursor: "pointer", fill: "#02466a" }}
													fill='#02466a'
													onClick={() => {
														dispatch(closeVerifyModal());
													}}
												/>
											</div>
										) : verificationStatus === "جاري التوثيق" ? (
											<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
												<p className='verify-message'>
													مرحبا{" "}
													<span className='text-bold'>
														{userInfo?.name !== "null"
															? userInfo?.name
															: "صديقي التاجر"}
													</span>{" "}
													المتجر الخاص تحت المراجعة من قبل الجهات المختصة
												</p>
												<IoMdCloseCircleOutline
													style={{ cursor: "pointer", fill: "#02466a" }}
													fill='#02466a'
													onClick={() => {
														dispatch(closeVerifyModal());
													}}
												/>
											</div>
										) : verificationStatus === "طلب جديد" ? (
											<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
												<p className='verify-message'>
													مرحبا{" "}
													{userInfo?.name !== "null"
														? userInfo?.name
														: userInfo?.user_name || "صديقي التاجر"}{" "}
													تم إستلام طلب التوثيق الخاص بك وجاري المراجعة من
													الجهات المختصة
												</p>
												<div className='btns-box' style={{ width: "250px" }}>
													<Link
														to='/VerifyStore'
														onClick={() => {
															dispatch(closeVerifyModal());
														}}>
														التوثيق الأن
													</Link>
													<IoMdCloseCircleOutline
														style={{ cursor: "pointer", fill: "#02466a" }}
														fill='#02466a'
														onClick={() => {
															dispatch(closeVerifyModal());
														}}
													/>
												</div>
											</div>
										) : verificationStatus === "لم يتم الطلب" ? (
											<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
												<p className='verify-message'>
													مرحبا{" "}
													{userInfo?.name !== "null"
														? userInfo?.name
														: userInfo?.user_name || "صديقي التاجر"}{" "}
													المتجر الخاص بك غير مكتمل الرجاء البدء بتوثيق المتجر
												</p>
												<div className='btns-box' style={{ width: "250px" }}>
													<Link
														to='/VerifyStore'
														onClick={() => {
															dispatch(closeVerifyModal());
														}}>
														التوثيق الأن
													</Link>
													<IoMdCloseCircleOutline
														style={{ cursor: "pointer", fill: "#02466a" }}
														fill='#02466a'
														onClick={() => {
															dispatch(closeVerifyModal());
														}}
													/>
												</div>
											</div>
										) : null}
									</div>
								)}
							</div>
						</Typography>
					</Box>
				</Modal>
			)}
		</div>
	);
};

const VerifyStoreModal = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<VerifyStore />,
				document.getElementById("verifay_store_modal")
			)}
		</Fragment>
	);
};

export default VerifyStoreModal;
