import React, { Fragment } from "react";

import CircularLoading from "../../HelperComponents/CircularLoading";

const SalesReports = ({ salesReport, loading }) => {
	return (
		<section className='sales-reports-data'>
			<div className='report-head mb-2'>
				<h4>المبيعات</h4>
			</div>
			{loading ? (
				<div
					className='d-flex justify-content-center align-items-center'
					style={{ height: "200px" }}>
					<CircularLoading />
				</div>
			) : (
				<Fragment>
					<div className='report-body'>
						<div className='total-wrapper mb-2'>
							<div className='row'>
								<div className='col-5'>
									<h6>إجمالي المبيعات</h6>
								</div>
								<div className='col-5'>
									<h5 className='report_numbers'>
										<span className='number ms-2'>
											{salesReport?.total_sales}
										</span>
										<span className='currency'> ر.س</span>
									</h5>
								</div>
							</div>
						</div>
						<div className='total-wrapper  mb-2'>
							<div className='row'>
								<div className='col-5'>
									<h6>تكاليف المنتجات</h6>
								</div>
								<div className='col-5'>
									<h5 className='report_numbers'>
										<span className='number ms-2'>
											{salesReport?.products_costs}
										</span>
										<span className='currency'> ر.س</span>
									</h5>
								</div>
							</div>
						</div>
						<div className='total-wrapper  mb-2'>
							<div className='row'>
								<div className='col-5'>
									<h6>كود خصم التخفيض</h6>
								</div>
								<div className='col-5'>
									<h5 className='report_numbers'>
										<span className='number ms-2'>
											{salesReport?.discount_coupons}
										</span>
										<span className='currency'> ر.س</span>
									</h5>
								</div>
							</div>
						</div>
						<div className='total-wrapper  mb-2'>
							<div className='row'>
								<div className='col-5'>
									<h6>الشحن</h6>
								</div>
								<div className='col-5'>
									<h5 className='report_numbers'>
										<span className='number ms-2'>
											{salesReport?.shipping_price}
										</span>
										<span className=' currency'> ر.س</span>
									</h5>
								</div>
							</div>
						</div>
						<div className='total-wrapper mb-2'>
							<div className='row'>
								<div className='col-5'>
									<h6>الضرائب</h6>
								</div>
								<div className='col-5'>
									<h5 className='report_numbers'>
										<span className='number ms-2'>{salesReport?.taxs}</span>
										<span className=' currency'> ر.س</span>
									</h5>
								</div>
							</div>
						</div>
						<div className='total-wrapper  mb-2'>
							<div className='row'>
								<div className='col-5'>
									<h6>رسوم الدفع الالكتروني</h6>
								</div>
								<div className='col-5'>
									<h5 className='report_numbers'>
										<span className='number ms-2'>{salesReport?.payment}</span>
										<span className=' currency'> ر.س</span>
									</h5>
								</div>
							</div>
						</div>
					</div>
					<div className='report-footer'>
						<div className='row'>
							<div className='col-5'>
								<h5>صافي المبيعات</h5>
							</div>
							<div className='col-5'>
								<h5
									style={{
										display: "flex",
										justifyContent: "flex-end",
										alignItems: "center",
										gap: "5px",
									}}>
									<span className='number'>{salesReport?.sales}</span>
									ر.س
								</h5>
							</div>
						</div>
					</div>
				</Fragment>
			)}
		</section>
	);
};

export default SalesReports;
