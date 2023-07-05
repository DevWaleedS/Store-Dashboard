import React from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import howIcon from '../data/Icons/icon_24_home.svg';


import { CreateOffer } from './nestedPages';


const BranchesAndWarehouses = () => {
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الفروع والمستودعات</title>
			</Helmet>
			<section className='offers-page p-lg-3'>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>

								<li className='breadcrumb-item active' aria-current='page'>
									الفروع والمستودعات
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='row'>
					<div className='postponed-page-title'>
						مؤجلة
					</div>
				</div>
				{/** Create offers form 
				<CreateOffer />
				*/}
			</section>
		</>
	);
};

export default BranchesAndWarehouses;
