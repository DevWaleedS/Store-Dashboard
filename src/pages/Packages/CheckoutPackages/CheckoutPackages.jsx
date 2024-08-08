import React, { useEffect, useState } from "react";

import "./CheckoutPackages.css";
import { useNavigate } from "react-router-dom";
import { Box, Modal } from "@mui/material";
import { Helmet } from "react-helmet";
import RenderPaymentsList from "../../nestedPages/SouqOtlbha/CheckoutPage/RenderPaymentsList";
import { toast } from "react-toastify";
import {
	useCheckOutPackageMutation,
	useCreateMadfuPaymentPackageOrderMutation,
	useLoginMadfuWithPaymentPackageMutation,
} from "../../../store/apiSlices/checkoutPackagesApi";

import CircularLoading from "../../../HelperComponents/CircularLoading";
import { useGetMainInformationQuery } from "../../../store/apiSlices/mainInformationApi";
import { useGetUpgradePackagesQuery } from "../../../store/apiSlices/upgradePackagesApi";
import PackageCheckoutInfo from "./PackageCheckoutInfo";
import { ArrowBack } from "../../../data/Icons";

// styles
const style = {
	position: "absolute",
	top: "0",
	left: "0",
	padding: "130px 120px 0 40px",

	transform: "translate(0%, 0%)",
	width: "100%",
	bgcolor: "#fff",
	"@media(max-width:768px)": {
		padding: "30px 10px 0 10px",
	},
};

const CheckoutPackages = () => {
	const navigate = useNavigate();
	const [btnLoading, setBtnLoading] = useState(false);
	const [paymentSelect, setPaymentSelect] = useState(null);

	// To show the store info that come from api
	const { data: mainInformation, isLoading } = useGetMainInformationQuery();
	const { data: upgradePackages, isLoading: loadingPackages } =
		useGetUpgradePackagesQuery();

	const selectedPackage = upgradePackages?.find(
		(pack) =>
			pack?.id ===
			(localStorage.getItem("package_id") !== null
				? +localStorage.getItem("package_id")
				: mainInformation?.package_id)
	);

	/** Errors  */
	const [error, setError] = useState({
		paymentMethod: "",
	});
	const resetError = () => {
		setError({
			district: "",
			city: "",
			address: "",
			postCode: "",
			notes: "",
			paymentMethod: "",
			shippingType: "",
		});
	};

	// handle check out cart
	const [checkOutPackage, { isCartLoading }] = useCheckOutPackageMutation();
	const handleCheckout = async () => {
		resetError();
		setBtnLoading(true);

		// data that send to api...
		let formData = new FormData();
		formData.append("package_id", selectedPackage?.id);
		formData.append("paymentype_id", paymentSelect || "");

		// make request...
		try {
			const response = await checkOutPackage({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				if (response?.data?.message?.en === "order send successfully") {
					if (
						response?.data?.message?.en === "order send successfully" &&
						response?.data?.data?.payment?.IsSuccess === true &&
						response?.data?.data?.payment?.Message ===
							"Invoice Created Successfully!"
					) {
						window.location.href =
							response?.data?.data?.payment?.Data?.PaymentURL;
					} else {
						// to handle madfu login
						if (+paymentSelect === 5) {
							handleLoginWithMadu();
						} else {
							navigate("/success");
							setBtnLoading(false);
						}
					}
				}
			} else {
				setBtnLoading(false);

				setError({
					district: response?.data?.message?.en?.district?.[0] || "",
					city: response?.data?.message?.en?.city?.[0] || "",
					address: response?.data?.message?.en?.street_address?.[0] || "",
					postCode: response?.data?.message?.en?.postal_code?.[0] || "",
					notes: response?.data?.message?.en?.description?.[0] || "",
					paymentMethod: response?.data?.message?.en?.paymentype_id?.[0] || "",
				});

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);

				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error changing checkOutCart:", error);
		}
	};

	// handle checkout with madfu
	const [loginWithMadfu] = useLoginMadfuWithPaymentPackageMutation();
	const handleLoginWithMadu = async () => {
		const formData = new FormData();
		formData.append("uuid", localStorage.getItem("domain"));
		formData.append("store_id", "atlbhaPlatform");
		try {
			const response = await loginWithMadfu({
				body: formData,
			});

			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				handleCreateOrderWithMadfu(response.data.data.data.token);
			} else {
				setBtnLoading(false);
				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error changing checkOutCart:", error);
		}
	};

	// handle create order with madfu
	const [createOrderWithMadfu] = useCreateMadfuPaymentPackageOrderMutation();
	const handleCreateOrderWithMadfu = async (token) => {
		// Create or retrieve guestOrderData, orderInfo, and orderDetails here or pass from somewhere
		const guestOrderData = {
			CustomerMobile: mainInformation?.user?.phonenumber.startsWith("+966")
				? mainInformation?.user?.phonenumber.slice(4)
				: mainInformation?.user?.phonenumber.startsWith("00966")
				? mainInformation?.user?.phonenumber.slice(5)
				: mainInformation?.user?.phonenumber,
			CustomerName:
				mainInformation?.user?.name + " " + mainInformation?.user?.lastname,
		};

		const orderDetails = [
			{
				productName: selectedPackage?.name,
				SKU: selectedPackage?.id,
				productImage: "",
				count: parseInt(1),
				totalAmount:
					selectedPackage?.discount > 0
						? selectedPackage?.yearly_price - selectedPackage?.discount
						: selectedPackage?.yearly_price,
			},
		];

		const orderInfo = {
			Taxes: 0,
			ActualValue:
				selectedPackage?.discount > 0
					? selectedPackage?.yearly_price - selectedPackage?.discount
					: selectedPackage?.yearly_price,
			Amount:
				selectedPackage?.discount > 0
					? selectedPackage?.yearly_price - selectedPackage?.discount
					: selectedPackage?.yearly_price,
			MerchantReference: `package_reference_${selectedPackage?.unique_id}`,
		};

		// data that send  to api...
		const formData = new FormData();
		formData.append("token", token);
		formData.append("guest_order_data", JSON.stringify(guestOrderData));
		formData.append("order", JSON.stringify(orderInfo));
		formData.append("order_details", JSON.stringify(orderDetails));
		formData.append("url", `http://store.atlbha.com/checkout-packages`);

		try {
			const response = await createOrderWithMadfu({ body: formData });
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setBtnLoading(false);
				window.location.href = response.data.data.data.checkoutLink;
			} else {
				toast.error(response?.message, { theme: "colored" });
				setBtnLoading(false);
				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	const handleGoBack = () => {
		navigate("/");
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | دفع اشتراك الباقة </title>
			</Helmet>

			<Modal className='checkout-packages-page' open={true}>
				<Box component={"div"} sx={style}>
					<div className='checkout-page'>
						<div className='block'>
							<div className='container'>
								{isLoading ? (
									<CircularLoading />
								) : (
									<>
										<div className='mb-5'>
											<div>
												<div
													style={{ cursor: "pointer" }}
													className='box-logo d-flex justify-content-start align-items-center '
													onClick={handleGoBack}>
													<ArrowBack onClick={handleGoBack} />
													<span
														style={{
															color: "#1dbbbe",
															fontSize: "24px",
															fontWeight: "500",
															paddingRight: "10px",
														}}>
														العودة للصفحة الرئيسية
													</span>
												</div>
											</div>
										</div>
										<div className='checkout-package__title mb-3'>
											<h2 className='title__one'>
												اشترك الآن وانقل مشروعك أونلاين
											</h2>
											<h4 className='title__two'>
												احصل على مميزات مهمّة ومفيدة
											</h4>
										</div>{" "}
										<div className='row'>
											<div className='col-12 col-lg-4 mb-4 mb-lg-0'>
												<div className='card'>
													<div className='card-body'>
														<RenderPaymentsList
															paymentSelect={paymentSelect}
															setPaymentSelect={setPaymentSelect}
															paymentMethodError={error?.paymentMethod}
														/>
													</div>
												</div>
											</div>
											<div className='col-12 col-lg-6 mb-4 '>
												<div className='card '>
													<div className='card-body'>
														<PackageCheckoutInfo
															isCartLoading={isCartLoading}
															selectedPackage={selectedPackage}
															loadingPackages={loadingPackages}
														/>

														<button
															className='checkout-btn'
															disabled={btnLoading || isCartLoading}
															onClick={() => handleCheckout()}>
															{btnLoading || isCartLoading ? (
																<CircularLoading />
															) : (
																"ادفع واستفيد بالباقة"
															)}
														</button>
													</div>
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						</div>
					</div>
				</Box>
			</Modal>
		</>
	);
};

export default CheckoutPackages;
