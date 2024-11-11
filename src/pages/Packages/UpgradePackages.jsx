import React, { useState } from "react";

// Third party
import { Helmet } from "react-helmet";

// Icons
import { TopBarSearchInput } from "../../global/TopBar";
import PackagesPlans from "./PackagesPlans";
import { Breadcrumb } from "../../components";

import { useGetUpgradePackagesQuery } from "../../store/apiSlices/upgradePackagesApi";
import PackagesHead from "./PackagesHead";

const UpgradePackages = () => {
	const [packageType, setPackageType] = useState("");
	const { data: upgradePackages, isLoading } = useGetUpgradePackagesQuery();

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

				<PackagesHead
					packageType={packageType}
					setPackageType={setPackageType}
				/>

				{/* Package Plans */}
				<div className='row'>
					<PackagesPlans
						isLoading={isLoading}
						packageType={packageType}
						setPackageType={setPackageType}
						upgradePackages={upgradePackages}
					/>
				</div>
			</section>
		</>
	);
};
export default UpgradePackages;
