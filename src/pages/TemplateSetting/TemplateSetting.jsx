import React from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// COMPONENTS
import TemplateUpdate from "./TemplateUpdate";
import { ArrowBack } from "../../data/Icons";
import { TopBarSearchInput } from "../../global";

const TemplateSetting = () => {
	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | القالب</title>
			</Helmet>
			<section className='template-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-md-4 mb-3'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<ArrowBack />
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
