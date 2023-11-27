import React, { Fragment } from "react";

// Icons
import { Product, Sales, User, Visit } from "../../data/Icons";

const DashboardSummeryDetails = ({ summeryDetails, loading }) => {
	const details = [
		{
			id: 1,
			icon: <Visit />,
			title: "اجمالي الزيارات ",
			numbers: summeryDetails?.visits || 0,
			color: "#A4A1FB",
		},
		{
			id: 2,
			icon: <User />,
			title: "اجمالي الطلبات",
			numbers: summeryDetails?.orders_count || 0,
			color: "#5EBFF2",
		},
		{
			id: 3,
			icon: <Sales />,
			title: "اجمالي المبيعات",
			numbers: summeryDetails?.sales || 0,
			color: "#02466A",
		},
		{
			id: 4,
			icon: <Product />,
			title: "اجمالي المنتجات",
			numbers: summeryDetails?.products_count || 0,
			color: "#B6BE34",
		},
	];
	return (
		<div className='row'>
			<Fragment>
				{details.map((detail) => (
					<div className='col-xl-3 col-lg-6 col-sm-6' key={detail?.id}>
						<div className='data-box mb-4'>
							<div className='w-100 d-flex flex-row align-items-center'>
								<div className='col-4 d-flex justify-content-md-start justify-content-center align-items-center'>
									<div
										className='icon'
										style={{ backgroundColor: `${detail?.color}` }}>
										{detail.icon}
									</div>
								</div>

								<div className='col-8'>
									<div className='data'>
										<h4>
											{loading
												? 0
												: detail?.title === "اجمالي المبيعات"
												? ` ${detail?.numbers} ر.س `
												: detail?.numbers}
										</h4>
										<p>{detail?.title}</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</Fragment>
		</div>
	);
};

export default DashboardSummeryDetails;
