import React, { Fragment } from "react";

// Third party
import ReactDom from "react-dom";
import { Link } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Avatar, Skeleton } from "@mui/material";
import Typography from "@mui/material/Typography";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeVerifyModal } from "../../store/slices/VerifyStoreModal-slice";

// Icons
import { MdVerified } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";

// RTK Query
import { useGetUserProfileDataQuery } from "../../store/apiSlices/editUserDetailsApi";

const VerifyStore = ({ verificationStatus, isFetching }) => {
	// get user profile data from api...
	const { data: userProfileData } = useGetUserProfileDataQuery();

	const { isOpenVerifyModal } = useSelector((state) => state.VerifyModal);
	const dispatch = useDispatch(true);

	// styles
	const style = {
		position: "absolute",
		top: "114px",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "100%",
		maxWidth: "100%",
		bgcolor: verificationStatus === "تم التوثيق" ? "#07bc0c" : "#ffdd00",
		px: 4,
		paddingBottom: "11px",
		"@media(max-width:768px)": {
			top: "70px",
			left: 0,
			transform: "none",
			padding: "16px",
		},
	};

	return (
		<div>
			<Modal
				open={isOpenVerifyModal}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box sx={style}>
					<Typography
						component={"div"}
						id='modal-modal-description'
						sx={{ mt: 2, "@media(max-width:768px)": { mt: 0 } }}>
						<div className='d-flex justify-content-center align-items-center'>
							{isFetching ? (
								<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3 overflow-hidden'>
									<p className='verify-message d-flex align-items-center gap-3'>
										<Skeleton variant='circular'>
											<Avatar />
										</Skeleton>
										<div>
											<Skeleton
												variant='text'
												animation='wave'
												width={300}
												height={13}
											/>

											<Skeleton
												variant='text'
												animation='wave'
												width={800}
												height={30}
											/>
										</div>
									</p>
									<div className='btns-box'>
										<Skeleton width={160} height={40} variant='rectangular' />
									</div>
									<IoMdCloseCircleOutline
										style={{ cursor: "pointer", fill: "#02466a" }}
										fill='#02466a'
										onClick={() => {
											dispatch(closeVerifyModal());
										}}
									/>
								</div>
							) : (
								<div className='d-flex justify-content-center align-items-center'>
									{verificationStatus === "جاري التوثيق" ? (
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{!userProfileData?.name
														? userProfileData?.username || "٠٠٠"
														: userProfileData?.name}{" "}
												</span>{" "}
												المتجر الخاص قيد المراجعة من قبل الجهات المختصة
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
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{!userProfileData?.name
														? userProfileData?.username || "٠٠٠"
														: userProfileData?.name}{" "}
												</span>
												تم إستلام طلب التوثيق الخاص بك وجاري المراجعة من الجهات
												المختصة
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
									) : verificationStatus === "التوثيق مرفوض" ? (
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{!userProfileData?.name
														? userProfileData?.username || "٠٠٠"
														: userProfileData?.name}{" "}
												</span>
												طلب التوثيق مرفوض الرجاء التوجه إلى التوثيق لتعديل
												البيانات
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
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{!userProfileData?.name
														? userProfileData?.username || "٠٠٠"
														: userProfileData?.name}{" "}
												</span>
												فضلا أكمل البيانات الأساسية للمتجر لطلب التوثيق
											</p>
											<div className='btns-box' style={{ width: "250px" }}>
												<Link
													to='/MainInformation'
													onClick={() => {
														dispatch(closeVerifyModal());
													}}>
													إكمال البيانات
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
									) : verificationStatus === "تم التوثيق" ? (
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3'>
											<p className='verify-message text-white with-icon'>
												تهانينا... المتجر الخاص بك مكتمل التوثيق
												<MdVerified
													style={{ fill: "#ffffff", marginRight: "5px" }}
												/>
											</p>
											<IoMdCloseCircleOutline
												style={{ cursor: "pointer", fill: "#ffffff" }}
												fill='#fff'
												onClick={() => {
													dispatch(closeVerifyModal());
												}}
											/>
										</div>
									) : null}
								</div>
							)}
						</div>
					</Typography>
				</Box>
			</Modal>
		</div>
	);
};

const VerifyStoreModal = ({ verificationStatus, isFetching }) => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<VerifyStore
					verificationStatus={verificationStatus}
					isFetching={isFetching}
				/>,
				document.getElementById("verifay_store_modal")
			)}
		</Fragment>
	);
};

export default VerifyStoreModal;
