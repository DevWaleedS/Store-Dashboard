import React from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import SeoWeight from '../components/SeoWeight';

// import arrowBack from '../data/Icons/icon-30-arrwos back.svg';
import howIcon from '../data/Icons/icon_24_home.svg';

const Seo = () => {
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الكلمات المفتاحية</title>
			</Helmet>
			<section className='seo-page p-lg-3'>
				<div className='head-category mb-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item ' aria-current='page'>
									التسويق
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									الكلمات المفتاحية
								</li>
							</ol>
						</nav>
					</div>
				</div>
				<SeoWeight />
			</section>
		</>
	);
};

export default Seo;
