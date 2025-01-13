import React from "react";

// third party
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// components
import PackagesFeatures from "./PackagesFeatures";
import PackagePeriodAlert from "./PackagePeriodAlert";
import PackagePeriodNaming from "./PackagePeriodNaming";

// RTK Query
import { useSetPackageIdPrePaymentMutation } from "../../store/apiSlices/upgradePackagesApi";

const PackageData = ({ item }) => {
	const navigate = useNavigate();

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

	// navigate to register
	const handleSelectPackageId = (id) => {
		navigate("/auth/merchant");
		localStorage.setItem("package_id", id);
	};

	return (
		<>
			<div
				key={item?.id}
				className={`p-4 content-package ${
					item?.is_selected && item?.package_paid ? "top-package" : ""
				}`}>
				<PackagePeriodAlert pack={item} />

				<div className='w-100'>
					<h2 className='d-flex align-items-center  text-center gap-4 mb-6 justify-content-center pack-name'>
						{item?.name}
					</h2>
					<h2 className='gap-1 d-flex justify-content-center align-items-baseline pack-price-box'>
						{item?.discount > 0 ? (
							item?.yearly_price - item?.discount === 0 ? (
								<span className='price'>مجاناً</span>
							) : (
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
							)
						) : (
							<span className='price'>
								{item?.yearly_price} <span className='currency '>ر.س</span>
							</span>
						)}
						<p className='package-type'>
							/<PackagePeriodNaming pack={item} />
						</p>
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
							"الباقة الحالية"
						)}
					</div>
				) : window.location?.pathname === "/compare-packages" ? (
					<button
						className='package_btn'
						onClick={() => {
							handleSelectPackageId(item?.id);
						}}>
						إختر الباقة
					</button>
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
		</>
	);
};

export default PackageData;
