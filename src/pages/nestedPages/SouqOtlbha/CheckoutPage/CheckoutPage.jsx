import React, { useState, useEffect, useRef } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// Components
import RenderAddress from "./RenderAddress";
import RenderCartIsEmpty from "./RenderCartIsEmpty";
import { Breadcrumb } from "../../../../components";
import RenderCouponInput from "./RenderCouponInput";
import RenderPaymentsList from "./RenderPaymentsList";
import RenderShippingList from "./RenderShippingList";
import RenderCheckoutInfo from "./RenderCheckoutInfo";
import CircularLoading from "../../../../HelperComponents/CircularLoading";

// RTK Query
import {
	useCheckOutCartMutation,
	useCreateOrderWithMadfuMutation,
	useLoginWithMadfuMutation,
	useShowImportCartQuery,
} from "../../../../store/apiSlices/souqOtlobhaProductsApi";
import { useGetDefaultAddressQuery } from "../../../../store/apiSlices/selectorsApis/defaultAddressApi";
import { useNavigate } from "react-router-dom";

function CheckoutPage() {
	// im using this with forwardRef  to share isLoading from RenderShippingList
	const shippingListRef = useRef();

	// get cart data..
	const { data: cartData, isLoading } = useShowImportCartQuery();

	// get default address..
	const { data: defaultAddress } = useGetDefaultAddressQuery();

	// using it madfu checkout
	const navigate = useNavigate();
	const [merchantReference, setMerchantReference] = useState(null);
	const [paymentSelect, setPaymentSelect] = useState(null);
	const [shippingSelect, setShippingSelect] = useState(null);
	const [btnLoading, setBtnLoading] = useState(false);
	const [shipping, setShipping] = useState({
		id: null,
		district: "",
		city: "",
		address: "",
		postCode: "",
		notes: "",
		shippingtype_id: "",
		defaultAddress: true,
	});

	// coupon
	const [showCoupon, setShowCoupon] = useState(false);
	const [loadingCoupon, setLoadingCoupon] = useState(false);
	const [coupon, setCoupon] = useState(null);
	const [couponError, setCouponError] = useState(null);

	/** set the default address */
	useEffect(() => {
		if (defaultAddress) {
			setShipping({
				...shipping,
				id: defaultAddress?.id,
				district: defaultAddress?.district,
				city: defaultAddress?.city,
				address: defaultAddress?.street_address,
				postCode: defaultAddress?.postCode,
				notes: defaultAddress?.notes,
				shippingtype_id: defaultAddress?.shippingtype_id,
				defaultAddress: defaultAddress?.default_address === 1 ? true : false,
			});

			setShippingSelect(defaultAddress?.shippingtype_id || 1);
		}
	}, [defaultAddress]);
	/* -------------------------------------------- */

	/** Errors  */
	const [error, setError] = useState({
		district: "",
		city: "",
		address: "",
		postCode: "",
		notes: "",
		paymentMethod: "",
		shippingType: "",
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
	// --------------------------------------------------------

	// handle check out cart
	const [checkOutCart, { isCartLoading }] = useCheckOutCartMutation();
	const handleCheckout = async () => {
		resetError();
		setBtnLoading(true);

		// data that send to api...
		let formData = new FormData();
		formData.append("district", shipping?.district);
		formData.append("city", shipping?.city);
		formData.append("street_address", shipping?.address);
		// formData.append("paymentype_id", paymentSelect || "");
		formData.append("shippingtype_id", shippingSelect || "");
		formData.append("description", shipping?.notes || "");
		formData.append("default_address", shipping?.defaultAddress ? 1 : 0);

		// make request...
		try {
			const response = await checkOutCart({
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
							setMerchantReference(response?.data?.data?.order?.order_number);
						} else {
							navigate("/Products/SouqOtlobha/success");
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
	const [loginWithMadfu] = useLoginWithMadfuMutation();
	const handleLoginWithMadu = async () => {
		const formData = new FormData();
		formData.append("uuid", localStorage.getItem("domain"));
		formData.append("store_id", localStorage.getItem("store_id"));
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
	const [createOrderWithMadfu] = useCreateOrderWithMadfuMutation();
	const handleCreateOrderWithMadfu = async (token) => {
		// Create or retrieve guestOrderData, orderInfo, and orderDetails here or pass from somewhere
		const guestOrderData = {
			CustomerMobile: cartData?.user?.phonenumber.startsWith("+966")
				? cartData?.user?.phonenumber.slice(4)
				: cartData?.user?.phonenumber.startsWith("00966")
				? cartData?.user?.phonenumber.slice(5)
				: cartData?.user?.phonenumber,
			CustomerName: cartData?.user?.name + " " + cartData?.user?.lastname,
		};

		const orderDetails = cartData?.cartDetail?.map((item) => ({
			productName: item?.product?.name,
			SKU: item?.product?.id,
			productImage: item?.product?.cover,
			count: parseInt(item.qty),
			totalAmount: item?.sum,
		}));

		const orderInfo = {
			Taxes: cartData?.tax,
			ActualValue: cartData?.total,
			Amount: cartData?.subtotal,
			MerchantReference: merchantReference,
		};

		// data that send  to api...
		const formData = new FormData();
		formData.append("token", token);
		formData.append("guest_order_data", JSON.stringify(guestOrderData));
		formData.append("order", JSON.stringify(orderInfo));
		formData.append("order_details", JSON.stringify(orderDetails));
		formData.append("url", `http://store.atlbha.com/Products/SouqOtlobha`);

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

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الدفع </title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<Breadcrumb
					parentPage={"الدفع"}
					currentPage={"	سوق اطلبها"}
					route={"/Products/SouqOtlobha"}
				/>

				<div className='checkout-page'>
					<h3>الدفع</h3>
					<div className='block'>
						<div className='container'>
							{isLoading ? (
								<CircularLoading />
							) : cartData ? (
								<div className='row'>
									<RenderAddress
										error={error}
										shipping={shipping}
										setShipping={setShipping}
									/>

									<div className='col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0'>
										<div className='card mb-lg-0'>
											<div className='card-body'>
												<RenderCheckoutInfo
													cartData={cartData}
													isCartLoading={shippingListRef.current?.isLoading}
												/>
												<RenderCouponInput
													coupon={coupon}
													cartId={cartData?.id}
													setCoupon={setCoupon}
													showCoupon={showCoupon}
													couponError={couponError}
													setShowCoupon={setShowCoupon}
													setBtnLoading={setBtnLoading}
													loadingCoupon={loadingCoupon}
													setCouponError={setCouponError}
													setLoadingCoupon={setLoadingCoupon}
												/>
												{/*<RenderPaymentsList
													paymentSelect={paymentSelect}
													setPaymentSelect={setPaymentSelect}
													paymentMethodError={error?.paymentMethod}
												/>
												*/}

												<RenderShippingList
													ref={shippingListRef}
													shipping={shipping}
													setShipping={setShipping}
													shippingSelect={shippingSelect}
													setShippingSelect={setShippingSelect}
													shippingTypeErrors={error?.shippingType}
												/>
												<button
													className='checkout-btn'
													disabled={btnLoading || isCartLoading}
													onClick={() => handleCheckout()}>
													{btnLoading || isCartLoading ? (
														<CircularLoading />
													) : (
														"تأكيد الطلب"
													)}
												</button>
											</div>
										</div>
									</div>
								</div>
							) : (
								<RenderCartIsEmpty />
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default CheckoutPage;
