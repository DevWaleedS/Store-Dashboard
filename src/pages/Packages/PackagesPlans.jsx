import React from "react";

import { useGetUpgradePackagesQuery } from "../../store/apiSlices/upgradePackagesApi";
import CircularLoading from "../../HelperComponents/CircularLoading";

import "./Packages.css";
import { useNavigate } from "react-router-dom";
import PackagesFeatures from "./PackagesFeatures";

export const PackagesPlans = () => {
	const navigate = useNavigate();
	const { data: upgradePackages, isLoading } = useGetUpgradePackagesQuery();

	const packagesIsNotActive = upgradePackages?.every?.(
		(pack) => pack?.status === "غير نشط"
	);

	// Find the package with the highest yearly_price
	const highestPricedPackage = upgradePackages?.reduce((max, item) => {
		// Calculate the price considering the discount
		const priceWithDiscount =
			item.discount > 0 ? item.yearly_price - item.discount : item.yearly_price;

		// Determine if the current item should be the new max
		return priceWithDiscount >
			(max
				? max.discount > 0
					? max.yearly_price - max.discount
					: max.yearly_price
				: 0)
			? item
			: max;
	}, null);

	const handleNavigateToCheckoutPackages = (item) => {
		if (!item?.is_selected) {
			navigate("/checkout-packages");
			localStorage.setItem("package_id", item?.id);
		}
	};

	return (
		<div>
			<div className='package-boxes pb-5 d-flex flex-md-row flex-column gap-4 align-items-center justify-content-center flex-wrap'>
				{isLoading ? (
					<div className='w-100 d-flex flex-column align-items-center justify-content-center'>
						<CircularLoading />
					</div>
				) : !upgradePackages?.length || packagesIsNotActive ? (
					<h3 className=' w-100 d-flex justify-content-center align-content-center mt-5'>
						لا توجد باقات!
					</h3>
				) : (
					upgradePackages?.map((item, idx) => (
						<div
							key={idx}
							className={`p-4 content-package ${
								item === highestPricedPackage ? "top-package" : ""
							}`}>
							<div className='w-100'>
								<h2 className='d-flex align-items-center  text-center gap-4 mb-6 justify-content-center pack-name'>
									{item?.name}
								</h2>
								<h2 className='gap-1 d-flex justify-content-center align-items-baseline pack-price-box'>
									{item?.discount > 0 ? (
										<>
											<span className='price'>
												{item?.yearly_price - item?.discount}
												<span className='currency pe-1'>ر.س</span>
											</span>
											<span className='discount-price'>
												{item?.yearly_price}
												<span className='currency'>ر.س</span>
											</span>
										</>
									) : (
										<span className='price'>
											{item?.yearly_price}{" "}
											<span className='currency '>ر.س</span>
										</span>
									)}
									<p className='package-type '>/سنوياََ</p>
								</h2>
								<div>
									<PackagesFeatures packageFeatures={item?.plans || []} />
								</div>
							</div>

							<button
								className={`package_btn ${
									item?.is_selected ? "current_package_btn" : ""
								}`}
								onClick={() => {
									handleNavigateToCheckoutPackages(item);
								}}>
								{item?.is_selected ? " الباقة الحالية " : "إختر الباقة"}
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default PackagesPlans;
