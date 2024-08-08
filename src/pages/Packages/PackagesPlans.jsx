import React from "react";

import { IoCheckmarkSharp } from "react-icons/io5";
import { useGetUpgradePackagesQuery } from "../../store/apiSlices/upgradePackagesApi";
import CircularLoading from "../../HelperComponents/CircularLoading";

import "./Packages.css";
import { useNavigate } from "react-router-dom";

const PackagesPlans = () => {
	const navigate = useNavigate();
	const { data: upgradePackages, isLoading } = useGetUpgradePackagesQuery();

	const packagesIsNotActive = upgradePackages?.every?.(
		(pack) => pack?.status === "غير نشط"
	);

	const handleNavigateToCheckoutPackages = (item) => {
		if (!item?.is_selected) {
			navigate("/checkout-packages");
			localStorage.setItem("package_id", item?.id);
		}
	};

	return (
		<div>
			<div className='package-boxes pb-5 d-flex flex-md-row flex-column gap-4 align-items-center flex-wrap'>
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
							style={{ border: item?.is_selected && "1px solid #1dbbbe" }}
							key={idx}
							className=' p-4 content-package'>
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
								</h2>
								<p className='package-type '>/سنوياََ</p>
								<div>
									{item?.plans?.map((plan, index) => {
										return (
											<h2
												style={{
													color: !plan?.selected ? "#ADB5B9" : "",
													fontSize: "20px",
													fontWeight: "400",
													display: "flex",
													justifyContent: "start",
													alignItems: "start",
													marginBottom: "10px",
												}}
												key={index}>
												<IoCheckmarkSharp
													style={{
														color: plan?.selected ? "#3AE374" : "#ADB5B9",
														display: "inline-block",
														marginLeft: "0.1rem",
														width: "22px",
														height: "22px",
													}}
												/>
												<span
													style={{
														whiteSpace: "normal",
														display: "inline-block",
														lineHeight: "1.6",
													}}>
													{plan?.name}
												</span>
											</h2>
										);
									})}
								</div>
							</div>

							<button
								className=''
								style={{
									color: "#EFF9FF",
									width: "100%",
									height: "56px",
									marginTop: "16px",
									background: item?.is_selected ? "#1DBBBE" : "#02466A ",
									borderRadius: "8px",
									fontSize: "20px",
									letterSpacing: " 0.2px",
									fontWeight: 500,
								}}
								onClick={() => {
									handleNavigateToCheckoutPackages(item);
								}}>
								{item?.is_selected ? " الباقة الحالية " : " ترقية الباقة "}
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default PackagesPlans;
