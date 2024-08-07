import React from "react";
import CircularLoading from "../../../HelperComponents/CircularLoading";
import { useNavigate } from "react-router-dom";

const PackageCheckoutInfo = ({
	selectedPackage,
	loadingPackages,
	isCartLoading,
}) => {
	const navigate = useNavigate();
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

											<ul className='product-options'>
												<li>(إشتراك سنوي)</li>
											</ul>
										</td>
										<td>{selectedPackage?.yearly_price} ر.س</td>
									</tr>
								</tbody>
								<tbody className='subtotals'>
									<tr>
										<th>السعر</th>
										<td>{selectedPackage?.yearly_price} ر.س</td>
									</tr>

									{selectedPackage?.discount ? (
										<tr>
											<th>الخصم</th>
											<td>{selectedPackage?.discount} ر.س</td>
										</tr>
									) : null}
								</tbody>

								<tfoot>
									<tr>
										<th>
											الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
										</th>
										<td>
											{selectedPackage?.discount > 0
												? selectedPackage?.yearly_price -
												  selectedPackage?.discount
												: selectedPackage?.yearly_price}{" "}
											ر.س
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
