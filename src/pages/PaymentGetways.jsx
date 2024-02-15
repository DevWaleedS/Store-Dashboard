import React, { useContext, useEffect, useState } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// CONTEXT
import Context from "../Context/context";

// MUI
import { Switch } from "@mui/material";

// components
import useFetch from "../Hooks/UseFetch";
import { TopBarSearchInput } from "../global";
import CircularLoading from "../HelperComponents/CircularLoading";
// Redux
import { useDispatch, useSelector } from "react-redux";
// Icons
import { HomeIcon } from "../data/Icons";
import { IoWallet } from "react-icons/io5";
import { IoMdInformationCircleOutline } from "react-icons/io";
import { openAddBankAccountModal } from "../store/slices/AddBankAccountModal";
import { openCommentModal } from "../store/slices/BankAccStatusCommentModal";

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

const PaymentGetways = () => {
	const dispatch = useDispatch();

	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];

	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/paymenttype`
	);

	// showSupplier bank account
	const { fetchedData: currentBankAccount } = useFetch(
		`https://backend.atlbha.com/api/Store/indexSupplier`
	);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const [cashOnDelivery, setCashOnDelivery] = useState([]);
	const [allPayments, setAllPayments] = useState([]);
	// -----------------------------------------------------------

	//  handle if the store is not verified navigate to home page
	const navigate = useNavigate();
	const { verificationStoreStatus } = useSelector((state) => state.VerifyModal);
	useEffect(() => {
		if (verificationStoreStatus !== "تم التوثيق") {
			navigate("/");
		}
	}, [verificationStoreStatus, navigate]);
	// -----------------------------------------------------------

	// Side Effects
	useEffect(() => {
		if (fetchedData) {
			setCashOnDelivery(
				fetchedData?.data?.paymenttypes?.filter(
					(paymenttypes) => paymenttypes?.name === "الدفع عند الاستلام"
				)
			);

			setAllPayments(
				fetchedData?.data?.paymenttypes?.filter(
					(paymenttypes) => paymenttypes?.name !== "الدفع عند الاستلام"
				)
			);
		}
	}, [fetchedData]);

	// change Status function
	const changeStatus = (id, e) => {
		axios
			.get(
				`https://backend.atlbha.com/api/Store/changePaymenttypeStatus/${id}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
				}
			});
	};

	const changeCashOnDeliveryStatus = (id) => {
		if (allPayments?.some((item) => item?.status === "نشط")) {
			axios
				.get(
					`https://backend.atlbha.com/api/Store/changePaymenttypeStatus/${id}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store_token}`,
						},
					}
				)
				.then((res) => {
					if (res?.data?.success === true && res?.data?.data?.status === 200) {
						setEndActionTitle(res?.data?.message?.ar);
						setReload(!reload);
					} else {
						toast.error(res?.data?.message?.ar, {
							theme: "light",
						});
						setReload(!reload);
					}
				});
		} else {
			toast.error("يجب تفعيل طريقه دفع واحدة علي الاقل", {
				theme: "light",
			});
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
				<div className='head-category mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>

								<li className='breadcrumb-item active' aria-current='page'>
									بوابات الدفع
								</li>
							</ol>
						</nav>
					</div>
				</div>
				{loading || !currentBankAccount ? (
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
								{!currentBankAccount?.data ? (
									<div className='mb-2 payments-hint option-info-label d-flex justify-content-start align-items-start align-items-md-center flex-column flex-md-row gap-2'>
										<div className='d-flex gap-1'>
											<IoMdInformationCircleOutline />
											<span>
												قم باضافه الحساب البنك الخاص بك لكي تتمكن من استخدام
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
												<span>الاطلاع علي سبب الرفض</span>
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
												<span>الاطلاع علي سبب الغلق</span>
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
												<span>الاطلاع علي سبب التجميد</span>
											</button>
										)}
									</div>
								) : null}
							</div>
						</div>

						<div className='data-container '>
							<div className='row other-shipping-company mb-4'>
								<div className='mb-4 option-info-label d-flex d-md-none  justify-content-start align-items-center gap-2'>
									<IoMdInformationCircleOutline />
									<span>
										يمكنك استخدام خيار الدفع عند الاستلام كطريقه من ضمن طرق
										الدفع المختلفه التي نوفرها لك
									</span>
								</div>
								{cashOnDelivery?.map((item) => (
									<div className='col-xl-3 col-lg-6 col-12' key={item.id}>
										<div className='data-widget'>
											<div className='data'>
												<div className='image-box'>
													<img
														className='img-fluid'
														src={item?.image}
														alt={item?.name}
														style={{ width: "110px" }}
													/>
												</div>
												{item?.name ? (
													<div className='current-price mt-1 w-100 d-flex justify-content-center'>
														{item?.name}
													</div>
												) : null}
											</div>
										</div>
									</div>
								))}
								{cashOnDelivery?.length !== 0 && (
									<div className='col-xl-8 col-lg-6 col-12'>
										<div className='mb-5 option-info-label d-none d-md-flex  justify-content-start align-items-center gap-2'>
											<IoMdInformationCircleOutline />
											<span>
												يمكنك استخدام خيار الدفع عند الاستلام كطريقه من ضمن طرق
												الدفع المختلفه التي نوفرها لك
											</span>
										</div>
										<div className=''>
											<div className='tax-text'>
												تفعيل/تعطيل الدفع عند الاستلام{" "}
											</div>
											<div
												className='switch-box d-flex justify-content-center align-items-center mb-2'
												style={{
													height: "50px",
													backgroundColor: "#f7f8f8",
												}}>
												<Switch
													onChange={() => {
														changeCashOnDeliveryStatus(cashOnDelivery[0]?.id);
													}}
													checked={
														cashOnDelivery[0]?.status === "نشط" ? true : false
													}
													sx={switchStyle}
												/>
											</div>
										</div>
									</div>
								)}
							</div>

							<div className='row'>
								{allPayments?.length !== 0 &&
									allPayments?.map((item) => (
										<div className='col-xl-3 col-6' key={item.id}>
											<div className='data-widget'>
												<div className='data'>
													<div className='image-box'>
														<img
															className='img-fluid'
															src={item?.image}
															alt={item?.name}
															style={{ width: "110px" }}
														/>
													</div>
													{item?.description ? (
														<div className='current-price mt-1 w-100 d-flex justify-content-center'>
															<span>الرسوم:</span> {item?.description}
														</div>
													) : null}
												</div>
												<div className='switch-box'>
													<Switch
														name={item?.name}
														checked={item?.status === "نشط" ? true : false}
														onChange={() => changeStatus(item?.id)}
														sx={switchStyle}
													/>
												</div>
											</div>
										</div>
									))}
							</div>
						</div>
					</>
				)}
			</section>
		</>
	);
};

export default PaymentGetways;
