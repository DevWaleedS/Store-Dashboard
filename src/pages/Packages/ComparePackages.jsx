import React, { useState } from "react";

// RTK Query
import { useGetPackagesQuery } from "../../store/apiSlices/selectorsApis/selectPackageApi";
import "./Packages.css";
import PackagesPlans from "./PackagesPlans";
import PackagesHead from "./PackagesHead";
import CompareNavigate from "./CompareNavigate";

const ComparePackages = () => {
	const [packageType, setPackageType] = useState("");
	const { data: packages, isLoading } = useGetPackagesQuery();

	return (
		<div className='py-5 px-lg-5 px-3'>
			<CompareNavigate />
			<PackagesHead packageType={packageType} setPackageType={setPackageType} />
			<PackagesPlans
				isLoading={isLoading}
				packageType={packageType}
				setPackageType={setPackageType}
				upgradePackages={packages}
			/>
		</div>
	);
};

export default ComparePackages;
