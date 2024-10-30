import React, { useEffect, useState, useMemo } from "react";

// css styles
import "../../Packages/CheckoutPackages/CheckoutPackages.css";

// third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// mui components
import { Box, Modal } from "@mui/material";

// components
import RenderPaymentsList from "./RenderPaymentsList";
import CheckoutServicesInfo from "./CheckoutServicesInfo";
import RenderServicesCouponInput from "./RenderServicesCouponInput";
import { CircularLoading } from "../../../HelperComponents";

// RTK  Query
import {
	useCreateMadfuPaymentPackageOrderMutation,
	useLoginMadfuWithPaymentPackageMutation,
} from "../../../store/apiSlices/upgradePackagesApi";
import { useGetMainInformationQuery } from "../../../store/apiSlices/mainInformationApi";

//  icons
import { ArrowBack } from "../../../data/Icons";
import {
	useApplyServicesCouponMutation,
	useRequestNewServiceMutation,
	useShowServiceOrderQuery,
} from "../../../store/apiSlices/platformServicesApi";

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

const CheckoutServices = ({
	data,
	setData,
	errors,
	resetErrors,
	setErrors,
	handleOnChangeData,
	setOpenCheckoutServices,
}) => {
	const date = Date.now();

	const [merchantReference, setMerchantReference] = useState(null);
	const [btnLoading, setBtnLoading] = useState(false);

	// coupon
	const [showCoupon, setShowCoupon] = useState(false);
	const [loadingCoupon, setLoadingCoupon] = useState(false);
	const [coupon, setCoupon] = useState(null);
	const [couponError, setCouponError] = useState(null);

	// To show the store info that come from api
	const { data: mainInformation, isLoading } = useGetMainInformationQuery();

	// using this effect to handle merchantReference if paymentSelect is madfu...
	useEffect(() => {
		if (+data?.paymentype_id === 5) {
			setMerchantReference(`service_reference_${date.toString().slice(-5)}`);
		} else {
			setMerchantReference(null);
		}
	}, [data?.paymentype_id]);

	// handle apply code
	const [
		applyServicesCoupon,
		{ data: cartAfterCoupon, isLoading: applyServicesCouponLoading },
	] = useApplyServicesCouponMutation();
	const handleApplyDiscountCoupon = async () => {
		setCoupon("");
		setLoadingCoupon(true);
		setCouponError(null);

		// data that send to api..
		let formData = new FormData();
		formData.append("code", coupon);

		data?.services?.forEach((service, index) =>
			formData.append(`service_id[${index}]`, service?.id)
		);

		// make request...
		try {
			const response = await applyServicesCoupon({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				toast.success(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);
				if (
					response?.data?.message?.en === "The coupon is invalid" ||
					response?.data?.message?.en === "The coupon is already used"
				) {
					toast.error(
						response?.data?.message?.ar
							? response.data.message.ar
							: response.data.message.en,
						{
							theme: "light",
						}
					);
				}

				setLoadingCoupon(false);
			} else {
				setBtnLoading(false);
				setLoadingCoupon(false);

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
			console.error("Error changing appLyDiscountCoupon:", error);
		}
	};

	const { data: showServiceOrder, isLoading: showServiceOrderLoading } =
		useShowServiceOrderQuery({ id: cartAfterCoupon?.data?.websiteorder?.id });

	// Send Request Order
	const [requestNewService, { isLoading: reqServiceIsLoading }] =
		useRequestNewServiceMutation();
	const handleRequestService = async () => {
		resetErrors();
		setBtnLoading(true);

		// data that send to api
		let formData = new FormData();
		formData.append("name", data?.store_name);
		if (cartAfterCoupon) {
			formData.append(
				"order_id",
				cartAfterCoupon?.data?.websiteorder?.order_number
			);
		}

		data?.services?.forEach((service, index) =>
			formData.append(`service_id[${index}]`, service?.id)
		);

		formData.append("description", data?.description);
		formData.append("paymentype_id", data?.paymentype_id);

		// handle set package_reference is the payment id is madfu
		if (+data?.paymentype_id === 5) {
			formData.append("service_reference", merchantReference);
		}

		try {
			const response = await requestNewService({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			)
				if (
					response.data?.data?.payment?.IsSuccess === true &&
					response.data?.data?.payment?.Message ===
						"Invoice Created Successfully!"
				) {
					window.location.href = response.data?.data?.payment?.Data?.PaymentURL;
					setBtnLoading(false);
				} else {
					// to handle madfu login
					if (+data?.paymentype_id === 5) {
						handleLoginWithMadu();
					} else {
						setBtnLoading(false);
					}
				}
			else {
				setBtnLoading(false);
				setErrors({
					...errors,
					store_name: response.data.message.store_name?.[0],
					activity: response.data.message.activity?.[0],
					services: response.data.message.services?.[0],
					name: response.data.message.name?.[0],
					description: response.data.message.description?.[0],
					paymentype_id: response.data.message.paymentype_id?.[0],
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
			console.error("Error changing edit Product:", error);
		}
	};
	// --------------------------------------------------------------

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

		const orderDetails = data?.services?.map((item) => ({
			productName: item?.name,
			SKU: item?.id,
			productImage: "",
			count: parseInt(1),
			totalAmount: item?.price,
		}));

		const orderInfo = {
			Taxes: 0,
			ActualValue: grandTotal,
			Amount: grandTotal,
			MerchantReference: merchantReference,
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
				setOpenCheckoutServices(false);
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
	// --------------------------------------------------------------

	// Calculate the total price of selected services
	const totalSelectedServicesPrice = useMemo(() => {
		return (
			showServiceOrder?.total_price ??
			data?.services?.reduce((total, service) => total + service.price, 0)
		);
	}, [data?.services, showServiceOrder]);

	// Calculate the grand total (including the main service price)
	const grandTotal = useMemo(() => {
		return totalSelectedServicesPrice;
	}, [totalSelectedServicesPrice]);

	const handleGoBack = () => {
		setOpenCheckoutServices(false);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | ادفع و احصل علي خدمات المنصة </title>
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
														العودة إلى صفحة الخدمات
													</span>
												</div>
											</div>
										</div>
										<div className='checkout-package__title mb-3'>
											<h2 className='title__one'>
												إشترك الآن وعزز من نجاح مشروعك
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
															data={data}
															setData={setData}
															handleOnChangeData={handleOnChangeData}
															paymentMethodError={errors?.paymentype_id}
														/>
													</div>
												</div>
											</div>
											<div className='col-12 col-lg-6 mb-4 '>
												<div className='card '>
													<div className='card-body'>
														<CheckoutServicesInfo
															cartAfterCoupon={showServiceOrder}
															grandTotal={grandTotal}
															selectedServices={data?.services}
															cartIsLoading={
																applyServicesCouponLoading ||
																showServiceOrderLoading
															}
														/>

														<RenderServicesCouponInput
															coupon={coupon}
															setCoupon={setCoupon}
															showCoupon={showCoupon}
															couponError={couponError}
															setShowCoupon={setShowCoupon}
															loadingCoupon={loadingCoupon}
															setCouponError={setCouponError}
															isLoading={applyServicesCouponLoading}
															handleApplyDiscountCoupon={
																handleApplyDiscountCoupon
															}
														/>

														<button
															className='checkout-btn'
															disabled={btnLoading || reqServiceIsLoading}
															onClick={() => handleRequestService()}>
															{btnLoading || reqServiceIsLoading ? (
																<CircularLoading />
															) : (
																"تأكيد الطلب"
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

export default CheckoutServices;
