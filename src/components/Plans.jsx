import React from "react";
import useFetch from "../Hooks/UseFetch";
import CircularLoading from "../HelperComponents/CircularLoading";
import { IoCheckmarkSharp } from "react-icons/io5";

const Plans = ({ yearlyPlan }) => {
	const { fetchedData, loading } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/packages"
	);
	return (
		<div>
			<div className='package-boxes d-flex flex-md-row flex-column gap-4 align-items-center flex-wrap'>
				{loading ? (
					<div className='w-100 d-flex flex-column align-items-center justify-content-center'>
						<CircularLoading />
					</div>
				) : (
					fetchedData?.data?.packages?.map((item, idx) => (
						<div
							key={idx}
							className=' p-4  '
							style={{
								width: "352px",
								height: idx === 1 ? "640px" : "635px",
								background: "#F7FCFF",
								boxShadow:
									idx === 1
										? "0px 6px 12px #24242429"
										: "0px 3px 6px #438BB01A",
								borderRadius: "8px",
							}}>
							<div className='py-3  '>
								<h2
									className='d-flex align-items-center  text-center gap-4 mb-6 justify-content-center'
									style={{
										fontSize: "24px",
										letterSpacing: " 0.24px",
										color: "#011723",
									}}>
									{item?.name}
								</h2>
								<h2
									className='text-center'
									style={{
										fontSize: "20px",
										fontWeight: 400,
										letterSpacing: " 0px",
										color: "011723",
									}}>
									<span
										className=' mx-1'
										style={{
											fontSize: "38px",
											fontWeight: "bold",
											letterSpacing: " 0px",
											color: "#011723",
										}}>
										{yearlyPlan ? item?.yearly_price : item?.monthly_price}
									</span>
									ر.س
								</h2>
								<h2
									style={{
										fontSize: "18px",
										fontWeight: "400",
										letterSpacing: " 0.24px",
										color: "#011723",
									}}
									className='text-center'>
									{yearlyPlan ? "/12 شهر " : "/6 أشهر"}
								</h2>
								<div
									style={{
										width: "max-content",
										margin: "auto",
									}}>
									{item?.plans?.map((plan, index) => {
										return (
											<h2
												style={{
													color: !plan?.selected ? "#ADB5B9" : "",
													fontSize: "20px",
													fontWeight: "400",
													letterSpacing: "  0.2px",
												}}
												key={index}>
												<IoCheckmarkSharp
													style={{
														color: plan?.selected ? "#3AE374" : "#ADB5B9",
														display: "inline-block",
														marginLeft: "1rem",
														width: "28px",
														height: "28px",
													}}></IoCheckmarkSharp>
												{plan?.name}
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
									background: idx === 1 ? "#1DBBBE" : "#02466A ",
									borderRadius: "8px",
									fontSize: "20px",
									letterSpacing: " 0.2px",
									fontWeight: 500,
								}}
								onClick={() => {}}>
								{idx === 0 ? "الباقة الحالية" : "ترقية الباقة"}
							</button>
						</div>
					))
				)}
			</div>
		</div>
	);
};

export default Plans;
