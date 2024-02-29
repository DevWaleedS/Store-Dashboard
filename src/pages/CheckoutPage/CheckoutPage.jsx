import React, { useState, useEffect, useContext } from "react";
// Third party
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch";
import axios from "axios";
import { toast } from "react-toastify";
// Context
import Context from "../../Context/context";
// Components
import CircularLoading from "../../HelperComponents/CircularLoading";
// Icons
import { HomeIcon, Check9x7Svg } from "../../data/Icons";
import { useDispatch } from "react-redux";
import { openMessage } from "../../store/slices/SuccessMessageModalSlice";
import { CiDiscount1 } from "react-icons/ci";

function CheckoutPage() {
	const dispatch = useDispatch(true);
	const navigate = useNavigate();

	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/showImportCart"
	);
	const { fetchedData: paymentMethods } = useFetch(
		"https://backend.atlbha.com/api/Store/paymentmethodsImport"
	);
	const { fetchedData: citiesData } = useFetch(
		"https://backend.atlbha.com/api/selector/shippingcities/5"
	);
	const { fetchedData: defaultAddress } = useFetch(
		"https://backend.atlbha.com/api/show_default_address"
	);

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
				id: defaultAddress?.data?.orderAddress?.id,
				district: defaultAddress?.data?.orderAddress?.district,
				city: defaultAddress?.data?.orderAddress?.city,
				address: defaultAddress?.data?.orderAddress?.street_address,
				postCode: defaultAddress?.data?.orderAddress?.postCode,
				notes: defaultAddress?.data?.orderAddress?.notes,
				defaultAddress:
					defaultAddress?.data?.orderAddress?.default_address === "1"
						? true
						: false,
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
		citiesData?.data?.cities?.filter(
			(obj) => obj?.region?.name_en === shipping?.district
		) || [];

	const handleCheckout = () => {
		resetError();
		setBtnLoading(true);
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
		axios
			.post(`https://backend.atlbha.com/api/Store/checkoutImport`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					if (res?.data?.message?.en === "order send successfully") {
						setBtnLoading(false);
						dispatch(openMessage());
						navigate("/Products/SouqOtlobha");

						setReload(!reload);
					} else {
						setBtnLoading(false);
						toast.error(res?.data?.message?.ar, { theme: "colored" });
						setReload(!reload);
					}
				} else {
					setBtnLoading(false);
					setError({
						district: res?.data?.message?.en?.district?.[0] || "",
						city: res?.data?.message?.en?.city?.[0] || "",
						address: res?.data?.message?.en?.street_address?.[0] || "",
						postCode: res?.data?.message?.en?.postal_code?.[0] || "",
						notes: res?.data?.message?.en?.description?.[0] || "",
						paymentMethod: res?.data?.message?.en?.paymentype_id?.[0] || "",
					});
					toast.error(res?.data?.message?.en?.district?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.city?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.street_address?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.description?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.paymentype_id?.[0], {
						theme: "light",
					});
					setReload(!reload);
				}
			});
	};

	// handle apply code
	const applyDiscountCode = () => {
		setCoupon("");
		setLoadingCoupon(true);
		setCouponError(null);
		let formData = new FormData();
		formData.append("code", coupon);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/applyCoupon/${fetchedData?.data?.cart?.id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${store_token}`,
					},
				}
			)
			.then((res) => {
				if (
					res?.data?.success === true &&
					res?.data?.message?.en === "coupon updated successfully"
				) {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
					setLoadingCoupon(false);
				} else {
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					setCouponError(res?.data?.message?.ar);
					setLoadingCoupon(false);
				}
			});
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
								onClick={applyDiscountCode}
								type='button'
								className='btn btn-primary'
								disabled={loadingCoupon}>
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
		const paymentsData = paymentMethods?.data?.payment_types?.map((payment) => {
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
							{loading ? (
								<CircularLoading />
							) : fetchedData?.data?.cart ? (
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
														{removeDuplicates(citiesData?.data?.cities)?.map(
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
														{fetchedData?.data?.cart?.cartDetail?.map(
															(item) => (
																<tr key={item?.id}>
																	<td
																		style={{
																			display: "flex",
																			flexDirection: "column",
																			alignItems: "start",
																			gap: "0.2rem",
																		}}>
																		<div className="d-flex flex-row align-items-center gap-1">
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
																		<ul className="product-options">
																			{item?.options?.map((option, index) => (
																				<li key={index}>{`${index === 0 ? `${option}` : `/ ${option}`}`}</li>
																			))}
																		</ul>
																	</td>
																	<td>{item?.sum} ر.س</td>
																</tr>
															)
														)}
													</tbody>
													<tbody className='subtotals'>
														<tr>
															<th>السعر</th>
															<td>{fetchedData?.data?.cart?.subtotal} ر.س</td>
														</tr>
														<tr>
															<th>الضريبة</th>
															<td>{fetchedData?.data?.cart?.tax} ر.س</td>
														</tr>
														<tr>
															<th>الشحن</th>
															<td>
																{fetchedData?.data?.cart?.shipping_price} ر.س
															</td>
														</tr>

														{fetchedData?.data?.cart?.discount_total ? (
															<tr>
																<th>
																	الخصم
																	{fetchedData?.data?.cart?.discount_type ===
																		"percent" ? (
																		<span
																			style={{
																				fontSize: "0.85rem",
																				color: "#7e7e7e",
																			}}>
																			({fetchedData?.data?.cart?.discount_value}
																			%)
																		</span>
																	) : null}
																</th>
																<td>
																	{fetchedData?.data?.cart?.discount_total} ر.س
																</td>
															</tr>
														) : null}
													</tbody>

													<tfoot>
														<tr>
															<th>
																الإجمالي{" "}
																<span className='tax-text'>(شامل الضريبة)</span>
															</th>
															<td>{fetchedData?.data?.cart?.total} ر.س</td>
														</tr>
													</tfoot>
												</table>

												{renderCouponInput()}
												{renderPaymentsList()}

												<button
													className='checkout-btn'
													disabled={btnLoading}
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
