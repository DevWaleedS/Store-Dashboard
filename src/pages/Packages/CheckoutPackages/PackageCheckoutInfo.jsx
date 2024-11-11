import React from "react";
import { IoIosClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { CircularLoading } from "../../../HelperComponents";
import { useSetPackageIdPrePaymentMutation } from "../../../store/apiSlices/upgradePackagesApi";
import { CircularProgress } from "@mui/material";
import PackagePeriodNaming from "../PackagePeriodNaming";

const PackageCheckoutInfo = ({
	packageId,
	selectedPackage,
	loadingPackages,
	isCartLoading,
}) => {
	const navigate = useNavigate();

	// handle set package id and navigate user to checkout package
	const [setPackageIdPrePayment, { isLoading }] =
		useSetPackageIdPrePaymentMutation();
	const cancelCoupon = async () => {
		// data that send to api...
		let formData = new FormData();
		formData.append("package_id", packageId);

		// make request...
		try {
			await setPackageIdPrePayment({
				body: formData,
			});
		} catch (error) {
			console.error("Error changing setPackageIdPrePayment:", error);
		}
	};

	return (
		<>
			<div className='checkout__info'>
				<h2>تفاصيل الطلب</h2>

				<div className='package__info'>
					<table className='checkout-totals'>
						{isCartLoading || loadingPackages ? (
							<tbody>
								<td style={{ height: "100px" }}>
									<CircularLoading />
								</td>
							</tbody>
						) : (
							<>
								<thead>
									<tr>
										<th>اسم الباقة</th>
										<th>الإجمالي</th>
									</tr>
								</thead>
								<tbody className='products'>
									<tr>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "start",
												gap: "0.2rem",
											}}>
											<div className='d-flex flex-row align-items-center gap-1'>
												<span className='pack__name'>
													{selectedPackage?.name}
												</span>

												<button
													className='change__package_btn'
													onClick={() => navigate("/upgrade-packages")}>
													تغيير الباقة
												</button>
											</div>
										</td>
										<td>
											{selectedPackage?.yearly_price} ر.س /{" "}
											<PackagePeriodNaming pack={selectedPackage} />
										</td>
									</tr>
								</tbody>
								<tbody className='subtotals'>
									<tr>
										<th>السعر</th>
										<td>
											{selectedPackage?.yearly_price} ر.س /{" "}
											<PackagePeriodNaming pack={selectedPackage} />
										</td>
									</tr>
									{selectedPackage?.discount ? (
										<tr>
											<th>الخصم</th>
											<td>
												{selectedPackage?.discount} ر.س /{" "}
												<PackagePeriodNaming pack={selectedPackage} />
											</td>
										</tr>
									) : null}

									{selectedPackage?.coupon_info ? (
										<tr>
											<th>
												كود خصم
												<span className='coupon_box'>
													<span style={{ color: "#1dbbbe", fontSize: "1rem" }}>
														{" "}
														{selectedPackage?.coupon_info?.code}{" "}
													</span>
													{selectedPackage?.coupon_info?.discount_type ===
													"نسبة مئوية" ? (
														<p
															style={{
																display: "inline-block",
																fontSize: "0.85rem",
																color: "#7e7e7e",
															}}>
															({selectedPackage?.coupon_info?.discount}%)
														</p>
													) : null}
													<button
														disabled={isLoading}
														className='cancel_coupon__icon'
														onClick={cancelCoupon}>
														{isLoading ? (
															<CircularProgress
																size='12px'
																sx={{ color: "#ccc" }}
															/>
														) : (
															<IoIosClose className='close__coupon_icon' />
														)}
													</button>
												</span>
											</th>
											<td>
												{selectedPackage?.coupon_info?.discount_type ===
												"نسبة مئوية"
													? `${
															selectedPackage?.price_after_coupon *
															(selectedPackage?.coupon_info?.discount / 100)
													  } ر.س`
													: `${selectedPackage?.coupon_info?.discount} ر.س`}
											</td>
										</tr>
									) : null}
								</tbody>

								<tfoot>
									<tr>
										<th>
											الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
										</th>
										<td>
											{selectedPackage?.price_after_coupon}
											<span style={{ fontSize: "15px" }}>
												{" "}
												ر.س / <PackagePeriodNaming pack={selectedPackage} />
											</span>
										</td>
									</tr>
								</tfoot>
							</>
						)}
					</table>
				</div>
			</div>
		</>
	);
};

export default PackageCheckoutInfo;
