import React, { Fragment } from "react";
import { Completed, FileIcon, PageIcon, Product } from "../../../../data/Icons";

// Icons

const OrdersQuickDetails = ({
	loading,
	new_order,
	completed,
	not_completed,
	canceled,
	all,
}) => {
	const details = [
		{
			id: 1,
			icon: <Completed />,
			title: "طلبات مكتمله ",
			numbers: completed,
			color: "#3ae374",
		},
		{
			id: 2,
			icon: <FileIcon />,
			title: "طلبات ملغيه",
			numbers: canceled,
			color: "#ff9f1a",
		},
		{
			id: 3,
			icon: <PageIcon />,
			title: " طلبات جديدة",
			numbers: new_order,
			color: "#02466a",
		},
		{
			id: 4,
			icon: <Product />,
			title: "إجمالي الطلبات",
			numbers: all,
			color: "#b6be34",
		},
	];

	return (
		<Fragment>
			{details.map((detail) => (
				<div className='col-xl-3 col-lg-6 col-sm-6' key={detail.id}>
					<div className='data-box mb-4'>
						<div className='d-flex flex-row align-items-center'>
							<div className='col-4 d-flex justify-content-md-start justify-content-center align-items-center'>
								<div
									className='icon'
									style={{ backgroundColor: `${detail.color}` }}>
									{detail.icon}
								</div>
							</div>

							<div className='col-8'>
								<div className='data'>
									<h4>{loading ? "..." : detail.numbers}</h4>
									<p>{detail.title}</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			))}
		</Fragment>
	);
};

export default OrdersQuickDetails;
