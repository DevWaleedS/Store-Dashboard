import React, { useState, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Components
import RenderAddress from "./RenderAddress";
import RenderCouponInput from "./RenderCouponInput";
import RenderPaymentsList from "./RenderPaymentsList";
import RenderShippingList from "./RenderShippingList";
import RenderCheckoutInfo from "./RenderCheckoutInfo";
import CircularLoading from "../../../../HelperComponents/CircularLoading";

// Redux
import { useDispatch } from "react-redux";
import { openMessage } from "../../../../store/slices/SuccessMessageModalSlice";

// RTK Query
import {
	useCheckOutCartMutation,
	useShowImportCartQuery,
} from "../../../../store/apiSlices/souqOtlobhaProductsApi";
import { useImportPaymentMethodsQuery } from "../../../../store/apiSlices/importPaymentMethodApi";
import { useGetDefaultAddressQuery } from "../../../../store/apiSlices/selectorsApis/defaultAddressApi";
import { useGetShippingCompaniesQuery } from "../../../../store/apiSlices/shippingCompaniesApi";
import RenderCartIsEmpty from "./RenderCartIsEmpty";
import { Breadcrumb } from "../../../../components";

function CheckoutPage() {
	const dispatch = useDispatch(true);
	const navigate = useNavigate();

	// get cart data..
	const { data: cartData, isLoading } = useShowImportCartQuery();

	// get payment methods..
	const { data: paymentMethods } = useImportPaymentMethodsQuery();

	// get default address..
	const { data: defaultAddress } = useGetDefaultAddressQuery();

	// get shipping Companies..
	const { data: shippingCompanies } = useGetShippingCompaniesQuery();

	const [paymentSelect, setPaymentSelect] = useState(null);
	const [shippingSelect, setShippingSelect] = useState(null);
	const [btnLoading, setBtnLoading] = useState(false);
	const [shippingPrice, setShippingPrice] = useState(null);
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
				defaultAddress: defaultAddress?.default_address === "1" ? true : false,
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
	/** ----------------------------- */

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
		// formData.append("postal_code", shipping?.postCode);
		formData.append(
			"paymentype_id",
			JSON.parse(paymentSelect) ? JSON.parse(paymentSelect)?.id : ""
		);
		formData.append("shippingtype_id", JSON.parse(shippingSelect) || "");
		formData.append(
			"cod",
			JSON.parse(paymentSelect)?.name === "الدفع عند الاستلام" ? 1 : 0
		);
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
					setBtnLoading(false);
					dispatch(openMessage());
					navigate("/Products/SouqOtlobha");
				} else {
					setBtnLoading(false);
					toast.error(response?.data?.message?.ar, { theme: "colored" });
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

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الدفع </title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<Breadcrumb
					currentPage={"	سوق اطلبها"}
					parentPage={"	الدفع"}
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
												<RenderCheckoutInfo cartData={cartData} />

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

												<RenderPaymentsList
													paymentSelect={paymentSelect}
													paymentMethods={paymentMethods}
													setPaymentSelect={setPaymentSelect}
													paymentMethodError={error?.paymentMethod}
												/>
												<RenderShippingList
													shipping={shipping}
													setShipping={setShipping}
													shippingSelect={shippingSelect}
													setShippingPrice={setShippingPrice}
													setShippingSelect={setShippingSelect}
													shippingCompanies={shippingCompanies}
													shippingTypeErrors={error?.shippingType}
												/>

												<button
													className='checkout-btn'
													disabled={btnLoading || isCartLoading}
													onClick={() => handleCheckout()}>
													تأكيد الطلب
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
