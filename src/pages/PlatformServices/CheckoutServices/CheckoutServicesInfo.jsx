import React from "react";

import { LuDot } from "react-icons/lu";
const CheckoutServicesInfo = ({ selectedServices, grandTotal }) => {
	// Calculate tax at 15%
	const taxRate = 0.15;
	const taxAmount = grandTotal * taxRate;

	return (
		<>
			<div className='checkout__info'>
				<h2 className='mb-2'>تفاصيل الطلب</h2>

				<div className='package__info'>
					<table className='checkout-totals'>
						<>
							<thead>
								<tr>
									<th>اسم الخدمة</th>
									<th>الإجمالي</th>
								</tr>
							</thead>
							<tbody className='products'>
								{selectedServices?.map((item) => (
									<tr key={item?.id}>
										<td
											style={{
												display: "flex",
												flexDirection: "column",
												alignItems: "start",
												gap: "0.2rem",
											}}>
											<div className='d-flex flex-column align-items-start gap-1'>
												<span className='pack__name'>
													<span>
														<LuDot />
													</span>
													{item?.name}
												</span>
											</div>
										</td>

										<td>{(item?.price / 1.15).toFixed(2)} ر.س</td>
									</tr>
								))}
							</tbody>
							<tbody className='subtotals'>
								<tr>
									<th>السعر</th>
									<td>{(grandTotal / 1.15).toFixed(2)} ر.س</td>
								</tr>

								<tr>
									<th>الضريبة</th>
									<td>{taxAmount.toFixed(2)} ر.س</td>
								</tr>
							</tbody>

							<tfoot>
								<tr>
									<th>
										<div className='d-flex justify-content-start align-items-center gap-1 flex-wrap'>
											الإجمالي <span className='tax-text'>(شامل الضريبة)</span>
										</div>
									</th>
									<td>{grandTotal} ر.س</td>
								</tr>
							</tfoot>
						</>
					</table>
				</div>
			</div>
		</>
	);
};

export default CheckoutServicesInfo;
