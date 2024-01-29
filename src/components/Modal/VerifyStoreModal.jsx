import React, { useState, useEffect, Fragment, useContext } from "react";

// Third party
import ReactDom from "react-dom";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Typography from "@mui/material/Typography";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeVerifyModal } from "../../store/slices/VerifyStoreModal-slice";

// Icons
import { MdVerified } from "react-icons/md";
import { IoMdCloseCircleOutline } from "react-icons/io";

// Context
import { UserAuth } from "../../Context/UserAuthorProvider";

// Components
import CircularLoading from "../../HelperComponents/CircularLoading";

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
	console.log(userInfo?.username);
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
							{loading ? (
								<CircularLoading />
							) : (
								<div className='d-flex justify-content-center align-items-center'>
									{verificationStatus === "جاري التوثيق" ? (
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{userInfo?.name === null
														? userInfo?.username || "٠٠٠"
														: userInfo?.name}{" "}
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
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{userInfo?.name === null
														? userInfo?.username || "٠٠٠"
														: userInfo?.name}{" "}
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
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{userInfo?.name === null
														? userInfo?.username || "٠٠٠"
														: userInfo?.name}{" "}
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
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
											<p className='verify-message'>
												مرحبا{" "}
												<span style={{ fontWeight: 600 }}>
													{userInfo?.name === null
														? userInfo?.username || "٠٠٠"
														: userInfo?.name}{" "}
												</span>
												فضلا اكمل البيانات الاساسية للمتجر لطلب التوثيق
											</p>
											<div className='btns-box' style={{ width: "250px" }}>
												<Link
													to='/MainInformation'
													onClick={() => {
														dispatch(closeVerifyModal());
													}}>
													اكمال البيانات
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
										<div className='d-flex justify-content-between verify-message-box align-items-center gap-5'>
											<p className='verify-message text-white'>
												تهانينا... المتجر الخاص بك مكتمل التوثيق
												<MdVerified
													style={{ fill: "#fff", marginRight: "5px" }}
												/>
											</p>
											<IoMdCloseCircleOutline
												style={{ cursor: "pointer", fill: "#fff" }}
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
