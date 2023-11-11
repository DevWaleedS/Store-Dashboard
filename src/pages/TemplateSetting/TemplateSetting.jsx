import React from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// ICONS
import { AiOutlineSearch } from "react-icons/ai";
import arrowBack from "../../data/Icons/icon-30-arrwos back.svg";

// COMPONENTS
import TemplateUpdate from "./TemplateUpdate";

const TemplateSetting = () => {
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | القالب</title>
			</Helmet>
			<section className='template-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
					</div>
				</div>
				<div className='head-category mb-md-4 mb-3'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<img src={arrowBack} alt='' loading='lazy' />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>
									<li className='breadcrumb-item active ' aria-current='page'>
										تنسيق القالب
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>

				{/* Template Update Setting*/}
				<div className='row'>
					<div className='template-widgets-wrapper'>
						<div className='widget-bx mb-md-4 mb-3'>
							<TemplateUpdate />
						</div>
					</div>
				</div>
			</section>
		</>
	);
};

export default TemplateSetting;
