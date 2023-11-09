import React from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import howIcon from "../data/Icons/icon_24_home.svg";
import { IoMdAdd } from "react-icons/io";

const MarketingCampaign = () => {
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الحملة التسويقية</title>
			</Helmet>
			<section className='offers-page p-lg-3'>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' loading='lazy' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>

								<li className='breadcrumb-item active' aria-current='page'>
									العروض الخاصة
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='row mb-5'>
					<div className='add-offer-btn-wrapper d-flex justify-content-end '>
						<button type='button' className='add-offer-btn'>
							<IoMdAdd />
							حملة جديدة
						</button>
					</div>
				</div>

				<div className='row'>
					<div className='postponed-page-title'>مؤجلة</div>
				</div>
			</section>
		</>
	);
};

export default MarketingCampaign;
