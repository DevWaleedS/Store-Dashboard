import React from "react";

// Third party
import { Helmet } from "react-helmet";

// Icons
import { TopBarSearchInput } from "../../global/TopBar";
import PackagesPlans from "./PackagesPlans";
import { Breadcrumb, PageHint } from "../../components";

const UpgradePackages = () => {
	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | ترقية الباقة</title>
			</Helmet>
			<section className='carts-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<Breadcrumb
					mb={" mb-3"}
					parentPage={"بيانات المتجر"}
					currentPage={"تطوير الباقة"}
				/>

				<div className='row '>
					<PageHint
						hint={`نوفر لك مجموعة متنوعة من الباقات، بامكانك اختيار الباقة التي تتناسب مع إحتياجات متجرك بكل سهولة.`}
						flex={"d-flex justify-content-start align-items-center gap-2"}
					/>
				</div>

				{/* Package Plans */}
				<div className='row'>
					<PackagesPlans />
				</div>
			</section>
		</>
	);
};
export default UpgradePackages;
