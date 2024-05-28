import React from "react";

// Third party
import { Helmet } from "react-helmet";

// Components
import { Breadcrumb } from "../../components";
import TemplateUpdate from "./TemplateUpdate";
import { TopBarSearchInput } from "../../global/TopBar";

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

				<Breadcrumb mb={"mb-md-4 mb-3"} currentPage={"تنسيق القالب"} />

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
