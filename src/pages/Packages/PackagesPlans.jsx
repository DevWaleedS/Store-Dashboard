import React, { useState, useEffect } from "react";

// components
import { CircularLoading } from "../../HelperComponents";

// css styles
import "./Packages.css";
import PackageData from "./PackageData";

export const PackagesPlans = ({ isLoading, upgradePackages, packageType }) => {
	const [packages, setPackages] = useState([]);

	const packagesIsNotActive = upgradePackages?.every?.(
		(pack) => pack?.status === "غير نشط"
	);

	// handle filter on package based on period type
	const handlePackageFiltering = () => {
		if (packageType !== "") {
			const filteredData = upgradePackages?.filter(
				(item) => item?.periodtype === packageType
			);
			setPackages(filteredData);
		} else {
			setPackages(upgradePackages);
		}
	};

	useEffect(() => {
		if (upgradePackages?.length > 0) {
			setPackages(upgradePackages);
		}
	}, [upgradePackages]);

	// Call this when periodType changes
	useEffect(() => {
		if (packageType) {
			handlePackageFiltering();
		}
	}, [packageType]);

	return (
		<div>
			<div className='package-boxes pb-5 d-flex flex-md-row flex-column gap-4 align-items-center justify-content-center flex-wrap'>
				{isLoading ? (
					<div className='w-100 d-flex flex-column align-items-center justify-content-center'>
						<CircularLoading />
					</div>
				) : packages?.length === 0 || packagesIsNotActive ? (
					<h3 className=' w-100 d-flex justify-content-center align-content-center mt-5'>
						لا توجد باقات!
					</h3>
				) : (
					packages?.map((item) => <PackageData item={item} />)
				)}
			</div>
		</div>
	);
};

export default PackagesPlans;
