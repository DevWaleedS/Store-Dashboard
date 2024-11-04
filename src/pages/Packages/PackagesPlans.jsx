import React from "react";

import {
	useGetUpgradePackagesQuery,
	useSetPackageIdPrePaymentMutation,
} from "../../store/apiSlices/upgradePackagesApi";
// Helpers
import { CircularLoading } from "../../HelperComponents";

import "./Packages.css";
import { useNavigate } from "react-router-dom";
import PackagesFeatures from "./PackagesFeatures";
import { toast } from "react-toastify";
import { Message } from "rsuite";

export const PackagesPlans = () => {
	const navigate = useNavigate();
	const { data: upgradePackages, isLoading } = useGetUpgradePackagesQuery();

	const packagesIsNotActive = upgradePackages?.every?.(
		(pack) => pack?.status === "غير نشط"
	);

	// handle set package id and navigate user to checkout package
	const [setPackageIdPrePayment] = useSetPackageIdPrePaymentMutation();
	const handleNavigateToCheckoutPackages = async (pack) => {
		// data that send to api...
		let formData = new FormData();
		formData.append("package_id", pack?.id);

		// make request...
		try {
			const response = await setPackageIdPrePayment({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				navigate("/checkout-packages");
			} else {
				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);
			}
		} catch (error) {
			console.error("Error changing setPackageIdPrePayment:", error);
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
								item?.is_selected && item?.package_paid ? "top-package" : ""
							}`}>
							{item?.is_selected && item?.package_paid ? (
								item?.left_days === 0 ? (
									<Message closable type='error' showIcon>
										الباقة منتهية <strong>انتبه!</strong>
									</Message>
								) : item?.left_days <= 30 ? (
									<Message closable type='warning' showIcon>
										<strong>يرجي الانتباه!</strong> الباقة ستنتهي خلال{" "}
										<strong>
											{item?.left_days === 1
												? "يوم !"
												: item?.left_days === 2
												? "يومين !"
												: item?.left_days > 2 && item?.left_days + "أيام !"}
										</strong>
									</Message>
								) : null
							) : null}
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

							{item?.is_selected && item?.package_paid ? (
								<div className='w-100 d-flex justify-content-center align-items-center current_package_btn'>
									{item?.left_days <= 30 ? (
										<button
											className='package_btn'
											onClick={() => {
												handleNavigateToCheckoutPackages(item);
											}}>
											تجديد الباقة
										</button>
									) : (
										"	الباقة الحالية "
									)}
								</div>
							) : (
								<button
									className='package_btn'
									onClick={() => {
										handleNavigateToCheckoutPackages(item);
									}}>
									إختر الباقة
								</button>
							)}
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default PackagesPlans;
