import React, { Fragment, useEffect } from "react";

// Third party
import ReactDom from "react-dom";
import { Link } from "react-router-dom";

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

// RTK Query
import { useGetUserProfileDataQuery } from "../../store/apiSlices/editUserDetailsApi";
import { useGetPackageIdQuery } from "../../store/apiSlices/upgradePackagesApi";

const VerifyStore = ({
	verificationStatus,
	packagePaidStatus,
	isFetching,
	packageId,
}) => {
	// get user profile data from api...
	const { data: userProfileData, isLoading } = useGetUserProfileDataQuery();

	const { isOpenVerifyModal } = useSelector((state) => state.VerifyModal);

	// styles
	const style = {
		position: "absolute",
		top: "114px",
		left: "50%",
		transform: "translate(-50%, -50%)",
		width: "100%",
		maxWidth: "100%",
		bgcolor:
			verificationStatus !== "تم التوثيق" || !packagePaidStatus || !packageId
				? "#ffdd00"
				: "#07bc0c",
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
			<Modal open={isOpenVerifyModal}>
				<Box sx={style}>
					<Typography
						component={"div"}
						id='modal-modal-description'
						sx={{ mt: 2, "@media(max-width:768px)": { mt: 0 } }}>
						<div className='d-flex justify-content-center align-items-center'>
							<div className='d-flex justify-content-center align-items-center'>
								{packageId && packagePaidStatus ? (
									<StoreVerificationMessage
										userProfileData={userProfileData}
										verificationStatus={verificationStatus}
										packagePaidStatus={packagePaidStatus}
									/>
								) : (
									<SubscribeInPackagesMessage
										packageId={packageId}
										userProfileData={userProfileData}
										packagePaidStatus={packagePaidStatus}
									/>
								)}
							</div>
						</div>
					</Typography>
				</Box>
			</Modal>
		</div>
	);
};

const StoreVerificationMessage = ({
	verificationStatus,
	packagePaidStatus,
	userProfileData,
}) => {
	const dispatch = useDispatch(true);
	return verificationStatus === "جاري التوثيق" ? (
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
				تم إستلام طلب التوثيق الخاص بك وجاري المراجعة من الجهات المختصة
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
				طلب التوثيق مرفوض الرجاء التوجه إلى التوثيق لتعديل البيانات
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
				فضلاََ قم بتوثيق المتجر ليكتمل تفعيل متجرك
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
	) : verificationStatus === "تم التوثيق" ? (
		<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3'>
			<p className='verify-message text-white with-icon'>
				تهانينا... المتجر الخاص بك مكتمل التوثيق
				<MdVerified style={{ fill: "#ffffff", marginRight: "5px" }} />
			</p>
			<IoMdCloseCircleOutline
				style={{ cursor: "pointer", fill: "#ffffff" }}
				fill='#fff'
				onClick={() => {
					dispatch(closeVerifyModal());
				}}
			/>
		</div>
	) : null;
};

const SubscribeInPackagesMessage = ({
	packagePaidStatus,
	userProfileData,
	packageId,
}) => {
	const dispatch = useDispatch(true);
	const { data: getPackageId, refetch } = useGetPackageIdQuery();

	useEffect(() => {
		refetch();
	}, [refetch]);

	return (!packagePaidStatus || !packageId) && userProfileData ? (
		<div className='d-flex justify-content-between verify-message-box align-items-center gap-md-5 gap-3'>
			<p className='verify-message'>
				مرحباً{" "}
				<span style={{ fontWeight: 600 }}>
					{!userProfileData?.name
						? userProfileData?.username || "٠٠٠"
						: userProfileData?.name}{" "}
				</span>
				فضلاََ إشترك في الباقة لتفعيل خصائص المتجر
			</p>
			<div className='btns-box' style={{ width: "250px" }}>
				<Link
					to={`${getPackageId?.id ? "checkout-packages" : "upgrade-packages"}`}
					onClick={() => {
						dispatch(closeVerifyModal());
					}}>
					إشترك الآن
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
	) : null;
};

const VerifyStoreModal = ({
	verificationStatus,
	packagePaidStatus,
	isFetching,
	packageId,
}) => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<VerifyStore
					verificationStatus={verificationStatus}
					packagePaidStatus={packagePaidStatus}
					isFetching={isFetching}
					packageId={packageId}
				/>,
				document.getElementById("verifay_store_modal")
			)}
		</Fragment>
	);
};

export default VerifyStoreModal;
