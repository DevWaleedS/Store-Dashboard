import React, { useState, useEffect, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Context
import Context from "../../../../Context/context";

// Components
import CircularLoading from "../../../../HelperComponents/CircularLoading";

// Icons
import { useDispatch } from "react-redux";
import { CiDiscount1 } from "react-icons/ci";
import { HomeIcon, Check9x7Svg } from "../../../../data/Icons";

// Redux
import { openMessage } from "../../../../store/slices/SuccessMessageModalSlice";

// RTK Query
import {
	useAppLyDiscountCouponMutation,
	useCheckOutCartMutation,
	useShowImportCartQuery,
} from "../../../../store/apiSlices/souqOtlobhaProductsApi";
import { useImportPaymentMethodsQuery } from "../../../../store/apiSlices/importPaymentMethodApi";
import { useGetDefaultAddressQuery } from "../../../../store/apiSlices/selectorsApis/defaultAddressApi";
import { useGetShippingCitiesQuery } from "../../../../store/apiSlices/selectorsApis/selectShippingCitiesApi";

function CheckoutPage() {
	const dispatch = useDispatch(true);
	const navigate = useNavigate();

	// get cart data..
	const { data: cartData, isLoading } = useShowImportCartQuery();

	// get payment methods..
	const { data: paymentMethods } = useImportPaymentMethodsQuery();

	// get shipping cities..
	const { data: shippingCitiesData } = useGetShippingCitiesQuery(5);

	// get default address..
	const { data: defaultAddress } = useGetDefaultAddressQuery();

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const [paymentSelect, setPaymentSelect] = useState(null);
	const [btnLoading, setBtnLoading] = useState(false);
	const [shipping, setShipping] = useState({
		id: null,
		district: "",
		city: "",
		address: "",
		postCode: "",
		notes: "",
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
				defaultAddress: defaultAddress?.default_address === "1" ? true : false,
			});
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

	// handle set cities by arabic
	function removeDuplicates(arr) {
		const unique = arr?.filter((obj, index) => {
			return (
				index ===
				arr?.findIndex((o) => obj?.region?.name_en === o?.region?.name_en)
			);
		});
		return unique;
	}

	const getCityFromProvince =
		shippingCitiesData?.cities?.filter(
			(obj) => obj?.region?.name_en === shipping?.district
		) || [];

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

	// handle apply code
	const [appLyDiscountCoupon, { isApplyDiscountLoading }] =
		useAppLyDiscountCouponMutation();
	const handleApplyDiscountCoupon = async () => {
		setCoupon("");
		setLoadingCoupon(true);
		setCouponError(null);

		// data that send to api..
		let formData = new FormData();
		formData.append("code", coupon);

		// make request...
		try {
			const response = await appLyDiscountCoupon({
				body: formData,
				id: cartData?.id,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setEndActionTitle(response?.data?.message?.ar);
				setLoadingCoupon(false);
			} else {
				setBtnLoading(false);

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

	const renderCouponInput = () => {
		return (
			<div className='apply-coupon'>
				<div
					className='coupon'
					onClick={() => {
						setShowCoupon(!showCoupon);
						setCouponError(null);
					}}>
					<CiDiscount1 />
					<h6>هل لديك كود خصم ؟</h6>
				</div>
				{showCoupon && (
					<div className='coupon-wrapper'>
						<form className='coupon-form'>
							<input
								value={coupon}
								onChange={(e) => setCoupon(e.target.value)}
								type='text'
								className='form-control'
								id='input-coupon-code'
								placeholder='كود الخصم'
							/>
							<button
								onClick={handleApplyDiscountCoupon}
								type='button'
								className='btn btn-primary'
								disabled={loadingCoupon || isApplyDiscountLoading}>
								تطبيق
							</button>
						</form>
						{couponError && <span className='error'>{couponError}</span>}
					</div>
				)}
			</div>
		);
	};

	const renderPaymentsList = () => {
		const paymentsData = paymentMethods?.map((payment) => {
			const renderPayment = () => (
				<li className='item'>
					<label className='header'>
						<div className='d-flex flex-row align-items-center'>
							<span className='input-radio'>
								<span className='body'>
									<input
										type='radio'
										className='input'
										name='checkout_payment_method'
										value={JSON.stringify(payment)}
										checked={
											JSON.parse(paymentSelect)?.id === Number(payment?.id)
										}
										onChange={(e) => setPaymentSelect(e.target.value)}
									/>
									<span className='input-radio-circle' />
								</span>
							</span>
							<span>{payment?.name}</span>
						</div>
						<img
							src={payment?.image}
							alt=''
							width='40'
							height='20'
							style={{ objectFit: "contain" }}
						/>
					</label>
				</li>
			);

			return renderPayment();
		});

		return (
			<div className='payment-methods'>
				<h6>يرجى اختيار طريقة الدفع</h6>
				<ul className='list'>{paymentsData}</ul>
				{error?.paymentMethod && (
					<span
						style={{ fontSize: "0.85rem", fontWeight: "500" }}
						className='text-danger'>
						{error?.paymentMethod}
					</span>
				)}
			</div>
		);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الدفع </title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item' aria-current='page'>
									<Link to='/Products/SouqOtlobha' className='me-2'>
										سوق اطلبها
									</Link>
								</li>
								<li className='breadcrumb-item active' aria-current='page'>
									الدفع
								</li>
							</ol>
						</nav>
					</div>
				</div>
				<div className='checkout-page'>
					<h3>الدفع</h3>
					<div className='block'>
						<div className='container'>
							{isLoading ? (
								<CircularLoading />
							) : cartData ? (
								<div className='row'>
									<div className='col-12 col-lg-6 col-xl-7'>
										<div className='card mb-lg-0'>
											<div className='card-body'>
												<h3 className='card-title'>تفاصيل العنوان</h3>
												<div className='form-group mt-3'>
													<label htmlFor='country'>
														المنطقة
														<span className='required'>*</span>
													</label>
													<select
														value={shipping?.district}
														onChange={(e) => {
															if (e.target.value !== "") {
																setShipping({
																	...shipping,
																	district: e.target.value,
																});
															}
														}}
														id='country'
														className='form-control'>
														<option value=''>اختر المنطقة...</option>
														{removeDuplicates(shippingCitiesData?.cities)?.map(
															(district, index) => (
																<option
																	key={index}
																	value={district?.region?.name_en}>
																	{district?.region?.name}
																</option>
															)
														)}
													</select>
													{error?.district && (
														<span
															style={{ fontSize: "0.85rem", fontWeight: "500" }}
															className='text-danger'>
															{error?.district}
														</span>
													)}
												</div>
												<div className='form-group'>
													<label htmlFor='city'>
														المدينة
														<span className='required'>*</span>
													</label>
													<select
														value={shipping?.city}
														onChange={(e) => {
															if (e.target.value !== "") {
																setShipping({
																	...shipping,
																	city: e.target.value,
																});
															}
														}}
														id='city'
														className='form-control'>
														<option value=''>اختر المدينة...</option>
														{getCityFromProvince?.map((city, index) => (
															<option key={index} value={city?.name_en}>
																{city?.name}
															</option>
														))}
													</select>
													{error?.city && (
														<span
															style={{ fontSize: "0.85rem", fontWeight: "500" }}
															className='text-danger'>
															{error?.city}
														</span>
													)}
												</div>
												<div className='form-group'>
													<label htmlFor='address'>
														اسم الشارع <span className='required'>*</span>
													</label>
													<input
														value={shipping?.address}
														onChange={(e) =>
															setShipping({
																...shipping,
																address: e.target.value,
															})
														}
														id='address'
														type='text'
														className='form-control'
													/>
													{error?.address && (
														<span
															style={{ fontSize: "0.85rem", fontWeight: "500" }}
															className='text-danger'>
															{error?.address}
														</span>
													)}
												</div>
												<div className='form-group'>
													<label htmlFor='post_code'>
														الرمز البريدي / ZIP (اختياري)
													</label>
													<input
														value={shipping?.postCode}
														onChange={(e) =>
															setShipping({
																...shipping,
																postCode: e.target.value,
															})
														}
														id='post_code'
														type='text'
														className='form-control'
													/>
													{error?.postCode && (
														<span
															style={{ fontSize: "0.85rem", fontWeight: "500" }}
															className='text-danger'>
															{error?.postCode}
														</span>
													)}
												</div>
												<div className='form-group'>
													<div className='form-check'>
														<span className='input-check'>
															<span className='body'>
																<input
																	className='input'
																	type='checkbox'
																	id='checkout-create-account'
																	checked={shipping?.defaultAddress}
																	onChange={(e) => {
																		setShipping({
																			...shipping,
																			defaultAddress: e.target.checked,
																		});
																	}}
																/>
																<span className='input-check-box' />
																<Check9x7Svg className='input-check-icon' />
															</span>
														</span>
														<label
															className='form-check-label'
															htmlFor='checkout-create-account'>
															تعيينه كـ عنوان افتراضي
														</label>
													</div>
												</div>
											</div>
											<div className='card-divider'></div>
											<div className='card-body'>
												<h3 className='card-title'>تفاصيل الشحن</h3>
												<div className='form-group'>
													<label htmlFor='note'>ملاحظات الطلب</label>
													<textarea
														id='note'
														className='form-control'
														rows='4'
														value={shipping?.notes}
														onChange={(e) =>
															setShipping({
																...shipping,
																notes: e.target.value,
															})
														}></textarea>
													{error?.notes && (
														<span
															style={{ fontSize: "0.85rem", fontWeight: "500" }}
															className='text-danger'>
															{error?.notes}
														</span>
													)}
												</div>
											</div>
										</div>
									</div>
									<div className='col-12 col-lg-6 col-xl-5 mt-4 mt-lg-0'>
										<div className='card mb-lg-0'>
											<div className='card-body'>
												<h3 className='card-title'>تفاصيل الطلب</h3>
												<table className='checkout-totals'>
													<thead>
														<tr>
															<th>المنتج</th>
															<th>الإجمالي</th>
														</tr>
													</thead>
													<tbody className='products'>
														{cartData?.cartDetail?.map((item) => (
															<tr key={item?.id}>
																<td
																	style={{
																		display: "flex",
																		flexDirection: "column",
																		alignItems: "start",
																		gap: "0.2rem",
																	}}>
																	<div className='d-flex flex-row align-items-center gap-1'>
																		<span
																			style={{
																				maxWidth: "170px",
																				overflow: "hidden",
																				textOverflow: "ellipsis",
																				whiteSpace: "nowrap",
																			}}>
																			{item?.product?.name}
																		</span>{" "}
																		× <span>{item?.qty}</span>
																	</div>
																	<ul className='product-options'>
																		{item?.options?.map((option, index) => (
																			<li key={index}>{`${
																				index === 0
																					? `${option}`
																					: `/ ${option}`
																			}`}</li>
																		))}
																	</ul>
																</td>
																<td>{item?.sum} ر.س</td>
															</tr>
														))}
													</tbody>
													<tbody className='subtotals'>
														<tr>
															<th>السعر</th>
															<td>{cartData?.subtotal} ر.س</td>
														</tr>
														<tr>
															<th>الضريبة</th>
															<td>{cartData?.cart?.tax} ر.س</td>
														</tr>
														{cartData?.overweight_price !== null &&
															cartData?.overweight_price !== 0 && (
																<tr>
																	<th>
																		قيمة الوزن الزائد ({cartData?.overweight}{" "}
																		kg)
																	</th>
																	<td>{cartData?.overweight_price} ر.س</td>
																</tr>
															)}
														<tr>
															<th>الشحن</th>
															<td>{cartData?.shipping_price} ر.س</td>
														</tr>

														{cartData?.discount_total ? (
															<tr>
																<th>
																	الخصم
																	{cartData?.discount_type === "percent" ? (
																		<span
																			style={{
																				fontSize: "0.85rem",
																				color: "#7e7e7e",
																			}}>
																			({cartData?.discount_value}
																			%)
																		</span>
																	) : null}
																</th>
																<td>{cartData?.discount_total} ر.س</td>
															</tr>
														) : null}
													</tbody>

													<tfoot>
														<tr>
															<th>
																الإجمالي{" "}
																<span className='tax-text'>(شامل الضريبة)</span>
															</th>
															<td>{cartData?.total} ر.س</td>
														</tr>
													</tfoot>
												</table>

												{renderCouponInput()}
												{renderPaymentsList()}

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
								<div className='empty'>
									<span>لاتوجد منتجات في سلة الاستيراد</span>
									<Link to='/Products/SouqOtlobha'>العودة إلى سوق اطلبها</Link>
								</div>
							)}
						</div>
					</div>
				</div>
			</section>
		</>
	);
}

export default CheckoutPage;
