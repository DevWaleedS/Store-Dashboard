import React, { useContext, useEffect, useState } from "react";

import "./PaymentGateways.css";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Components
import { TopBarSearchInput } from "../../global/TopBar";
import Breadcrumb from "../../components/Breadcrumb/Breadcrumb";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { openAddBankAccountModal } from "../../store/slices/AddBankAccountModal";
import { openCommentModal } from "../../store/slices/BankAccStatusCommentModal";

// Redux
import { useDispatch } from "react-redux";

// RTK Query
import {
	useChangePaymentStatusMutation,
	useGetPaymentGatewaysQuery,
} from "../../store/apiSlices/paymentGatewaysApi";
import { useGetCurrentBankAccountQuery } from "../../store/apiSlices/walletApi";

// Icons
import { IoWallet } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";
import PaymentRecieving from "./PaymentRecieving";
import AllPaymentGateways from "./AllPaymentGateways";
import Context from "../../Context/context";

// switch styles
const switchStyle = {
	"& .MuiSwitch-track": {
		width: 36,
		height: 22,
		opacity: 1,
		backgroundColor: "rgba(0,0,0,.25)",
		boxSizing: "border-box",
		borderRadius: 20,
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		backgroundColor: "#EBEBEB",
		width: 16,
		height: 16,
		borderRadius: 4,
		transform: "translate(6px,7px)",
	},
	"&:hover": {
		"& .MuiSwitch-thumb": {
			boxShadow: "none",
		},
	},

	"& .MuiSwitch-switchBase": {
		"&:hover": {
			boxShadow: "none",
			backgroundColor: "none",
		},
		padding: 1,
		"&.Mui-checked": {
			transform: "translateX(12px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#3AE374",
			},
			"&:hover": {
				boxShadow: "none",
				backgroundColor: "none",
			},
		},
	},
};

const PaymentGateways = () => {
	// To handle if the user is not verify  her account
	UseAccountVerification();

	const dispatch = useDispatch();
	const navigate = useNavigate();
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// to get all  data from server
	const { data: paymentGateways, isLoading } = useGetPaymentGatewaysQuery();

	// showSupplier bank account
	const { data: currentBankAccount } = useGetCurrentBankAccountQuery();

	const [cashOnDelivery, setCashOnDelivery] = useState([]);
	const [allPayments, setAllPayments] = useState([]);

	// -----------------------------------------------------------

	// Side Effects
	useEffect(() => {
		if (paymentGateways) {
			setCashOnDelivery(
				paymentGateways?.filter(
					(paymenttypes) => paymenttypes?.name === "الدفع عند الاستلام"
				)
			);

			setAllPayments(
				paymentGateways?.filter(
					(paymenttypes) => paymenttypes?.name !== "الدفع عند الاستلام"
				)
			);
		}
	}, [paymentGateways]);

	// ------------------------------------------------------------------------

	const [changePaymentStatus] = useChangePaymentStatusMutation();
	const changePaymentStatusFunc = async (id) => {
		// make request...
		try {
			const response = await changePaymentStatus(id);

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setEndActionTitle(response?.data?.message?.ar);
			} else {
				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);
			}
		} catch (error) {
			console.error("Error changing changePaymentStatus:", error);
		}
	};

	const [madfou3Status, setMadfou3Status] = useState(false);
	const [isMadfou3ModalOpen, setIsMadfou3ModalOpen] = useState(false);

	const showMadfou3Modal = () => setIsMadfou3ModalOpen(true);
	const hideMadfou3Modal = () => setIsMadfou3ModalOpen(false);

	const handleChangePaymentStatus = async (id) => {
		const madfou3 = allPayments.find(
			(item) => item.name === "الدفع الأجل (مدفوع)"
		);
		if (id === madfou3.id) {
			const isMadfou3 = madfou3.is_madfu;
			setMadfou3Status(isMadfou3);
			if (!isMadfou3) {
				showMadfou3Modal();
			}
			if (isMadfou3) {
				changePaymentStatusFunc(id);
			}
		} else {
			changePaymentStatusFunc(id);
		}
	};

	// handle change status of  Cash O nDelivery Status
	const handleChangeCashOnDeliveryStatus = async (id) => {
		if (
			(cashOnDelivery[0]?.status === "نشط" && allPayments?.length === 0) ||
			(cashOnDelivery[0]?.status === "نشط" &&
				allPayments?.every((item) => item?.status !== "نشط"))
		) {
			toast.error("يجب تفعيل طريقه دفع واحدة على الاقل", {
				theme: "light",
			});
		} else {
			// make request...
			try {
				const response = await changePaymentStatus(id);

				// Handle response
				if (
					response.data?.success === true &&
					response.data?.data?.status === 200
				) {
					setEndActionTitle(response?.data?.message?.ar);
				} else {
					// Handle display errors using toast notifications
					toast.error(
						response?.data?.message?.ar
							? response.data.message.ar
							: response.data.message.en,
						{
							theme: "light",
						}
					);
				}
			} catch (error) {
				console.error(
					"Error changing handleChangeCashOnDeliveryStatus:",
					error
				);
			}
		}
	};

	// handle open create bank account
	const handleOpenBankAccount = () => {
		dispatch(openAddBankAccountModal());
		navigate("/wallet");
	};

	// handle open create bank account
	const handleOpenBankComment = () => {
		dispatch(openCommentModal());
		navigate("/wallet");
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | بوابات الدفع</title>
			</Helmet>
			<section className='payment-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<Breadcrumb currentPage={"بوابات الدفع"} mb={"mb-3"} />

				{isLoading ? (
					<div className='row'>
						<div
							className='d-flex justify-content-center align-items-center col-12'
							style={{ minHeight: "250px" }}>
							<CircularLoading />
						</div>
					</div>
				) : (
					<>
						<div className='row  mb-2 '>
							<div className='col-12 '>
								{!currentBankAccount ? (
									<div className='mb-2 payments-hint option-info-label d-flex justify-content-start align-items-start align-items-md-center flex-column flex-md-row gap-2'>
										<div className='d-flex gap-1'>
											<IoMdInformationCircleOutline />
											<span>
												قم باضافة الحساب البنكي الخاص بك لكي تتمكن من استخدام
												بوابات الدفع
											</span>
										</div>

										<button
											onClick={() => handleOpenBankAccount()}
											className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto '>
											<span>
												<IoWallet />
											</span>
											<span>اضافة حساب بنكي</span>
										</button>
									</div>
								) : currentBankAccount?.data?.SupplierDetails
										?.SupplierStatus === "Pending" ? (
									<div className='mb-2 pending payments-hint option-info-label d-flex justify-content-start align-items-center gap-2 '>
										<IoMdInformationCircleOutline />
										<span>حسابك البنكي قيد المراجعه الآن</span>
									</div>
								) : currentBankAccount?.data?.SupplierDetails
										?.SupplierStatus === "rejected" ? (
									<div className='mb-2 rejected payments-hint option-info-label d-flex justify-content-start align-items-start align-items-md-center flex-column flex-md-row gap-2 '>
										<div className='d-flex gap-1'>
											<IoMdInformationCircleOutline />
											<span>تم رفض حسابك البنكي </span>
										</div>
										{currentBankAccount?.data?.SupplierDetails?.Comment && (
											<button
												onClick={() => handleOpenBankComment()}
												className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'>
												<span>الاطلاع على سبب الرفض</span>
											</button>
										)}
									</div>
								) : currentBankAccount?.data?.SupplierDetails
										?.SupplierStatus === "Closed" ? (
									<div className='mb-2 closed payments-hint option-info-label d-flex justify-content-start align-items-start align-items-md-center flex-column flex-md-row gap-2'>
										<div className='d-flex gap-1'>
											<IoMdInformationCircleOutline />
											<span>تم اغلاق حسابك البنكي </span>
										</div>
										{currentBankAccount?.data?.SupplierDetails?.Comment && (
											<button
												onClick={() => handleOpenBankComment()}
												className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'>
												<span>الاطلاع على سبب الغلق</span>
											</button>
										)}
									</div>
								) : currentBankAccount?.data?.SupplierDetails
										?.SupplierStatus === "Dormant" ? (
									<div className='mb-2 dormant payments-hint option-info-label d-flex justify-content-start align-items-start align-items-md-center flex-column flex-md-row gap-2'>
										<div className='d-flex gap-1'>
											<IoMdInformationCircleOutline />
											<span>تم تجميد حسابك البنكي </span>
										</div>

										{currentBankAccount?.data?.SupplierDetails?.Comment && (
											<button
												onClick={() => handleOpenBankComment()}
												className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'>
												<span>الاطلاع على سبب التجميد</span>
											</button>
										)}
									</div>
								) : null}
							</div>
						</div>

						<div className='data-container '>
							<PaymentRecieving
								cashOnDelivery={cashOnDelivery}
								handleChangeCashOnDeliveryStatus={
									handleChangeCashOnDeliveryStatus
								}
								switchStyle={switchStyle}
							/>

							<AllPaymentGateways
								allPayments={allPayments}
								switchStyle={switchStyle}
								showMadfou3Modal={showMadfou3Modal}
								hideMadfou3Modal={hideMadfou3Modal}
								isMadfou3ModalOpen={isMadfou3ModalOpen}
								handleChangePaymentStatus={handleChangePaymentStatus}
							/>
						</div>
					</>
				)}
			</section>
		</>
	);
};

export default PaymentGateways;
