import React from "react";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { IoCheckmarkSharp } from "react-icons/io5";
import { useGetPackagesQuery } from "../../store/apiSlices/selectorsApis/selectPackageApi";

import "./Packages.css";
import { ArrowBack } from "../../data/Icons";
import LogoHeader from "../Authentication/LogoHeader/LogoHeader";

// handle sorting plans based select value
export const PackagePlan = ({ item }) => {
	// Create a new sorted array without mutating the original array
	const sortedPlans = [...(item || [])]?.sort((a, b) => {
		if (a.selected === b.selected) return 0;
		return a.selected ? -1 : 1;
	});

	return (
		<div>
			{sortedPlans.map((plan, index) => (
				<h2
					style={{
						color: !plan?.selected ? "#ADB5B9" : "",
						fontSize: "18px",
						fontWeight: "400",
						display: "flex",
						justifyContent: "start",
						alignItems: "start",
						marginBottom: index === sortedPlans.length - 1 ? "20px" : "10px",
					}}
					key={index}>
					<IoCheckmarkSharp
						style={{
							color: plan?.selected ? "#3AE374" : "#ADB5B9",
							display: "inline-block",
							marginLeft: "0.1em",
							width: "22px",
							height: "22px",
						}}
					/>
					<span
						style={{
							color: plan?.selected ? "#011723" : "#ADB5B9",
							whiteSpace: "normal",
							fontWeight: plan?.selected ? "500" : "400",
							display: "inline-block",
							lineHeight: "1.6",
						}}>
						{plan?.name}
					</span>
				</h2>
			))}
		</div>
	);
};

const ComparePackages = () => {
	const { data: packages, isLoading } = useGetPackagesQuery();

	/**/
	// check if all packages are not active or not
	const packagesIsNotActive = packages?.every?.(
		(pack) => pack?.status === "غير نشط"
	);

	/**/
	// Find the package with the highest yearly_price
	const highestPricedPackage = packages?.reduce((max, item) => {
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

	console.log(highestPricedPackage);

	const handleGoBack = () => {
		window.history.back();
	};

	const handleSelectPackageId = (id) => {
		handleGoBack();
		localStorage.setItem("package_id", id);
	};
	return (
		<div className='py-5 px-3'>
			<div>
				<LogoHeader />
				<div className='mt-5'>
					<div
						style={{ cursor: "pointer" }}
						className='box-logo d-flex justify-content-start align-items-center '
						onClick={handleGoBack}>
						<ArrowBack />
						<span
							style={{
								color: "#1dbbbe",
								fontSize: "24px",
								fontWeight: "500",
								paddingRight: "10px",
							}}>
							مقارنة الباقات
						</span>
					</div>
				</div>
			</div>
			<div className='package-boxes py-5 d-flex flex-md-row flex-column gap-4 align-items-center justify-content-center flex-wrap'>
				{isLoading ? (
					<div className='w-100 d-flex flex-column align-items-center justify-content-center'>
						<CircularLoading />
					</div>
				) : !packages?.length || packagesIsNotActive ? (
					<h3 className=' w-100 d-flex justify-content-center align-content-center mt-5'>
						لا توجد باقات!
					</h3>
				) : (
					packages?.map((item, idx) => (
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
									<p className='package-type'>/سنوياََ</p>
								</h2>
								<div>
									<PackagePlan item={item?.plans} />
								</div>
							</div>

							<button
								style={{
									color: "#EFF9FF",
									width: "100%",
									height: "56px",
									background: "#02466A ",
									borderRadius: "8px",
									fontSize: "20px",
									letterSpacing: " 0.2px",
									fontWeight: 500,
								}}
								onClick={() => {
									handleSelectPackageId(item?.id);
								}}>
								إختر الباقة
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default ComparePackages;
