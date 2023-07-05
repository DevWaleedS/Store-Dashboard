import React, { Fragment } from 'react';
import { ReactComponent as Visit } from '../data/Icons/icon-24-invisible.svg';
import { ReactComponent as User } from '../data/Icons/icon-24-user.svg';
import { ReactComponent as Sales } from '../data/Icons/icon-32-sales.svg';
import { ReactComponent as Product } from '../data/Icons/icon-32-product.svg';

const Details = ({ summeryDetails, loading }) => {
	const details = [
		{
			id: 1,
			icon: <Visit />,
			title: 'اجمالي الزيارات ',
			numbers: summeryDetails?.visits || 0,
			color: '#A4A1FB',
		},
		{
			id: 2,
			icon: <User />,
			title: 'اجمالي العملاء ',
			numbers: summeryDetails?.customers || 0,
			color: '#5EBFF2',
		},
		{
			id: 3,
			icon: <Sales />,
			title: 'اجمالي المبيعات',
			numbers: summeryDetails?.sales || 0,
			color: '#02466A',
		},
		{
			id: 4,
			icon: <Product />,
			title: 'اجمالي المنتجات',
			numbers: summeryDetails?.products_count || 0,
			color: '#B6BE34',
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
									<div className='icon' style={{ backgroundColor: `${detail?.color}` }}>
										{detail.icon}
									</div>
								</div>

								<div className='col-8'>
									<div className='data'>
										<h4>{loading ? 0 : detail?.numbers === summeryDetails?.sales ? ` ${detail?.numbers} ر.س ` : detail?.numbers}</h4>
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

export default Details;
