import React from "react";
import { IoCheckmarkSharp } from "react-icons/io5";

const PackagesFeatures = ({ packageFeatures }) => {
	const navigateToCommercialFlightsPage = (url) => {
		window.location.href = url;
	};

	return (
		<div>
			{packageFeatures?.map(
				(plan, index) =>
					plan?.selected && (
						<h2
							style={{
								fontSize: "18px",
								fontWeight: "400",
								display: "flex",
								justifyContent: "start",
								alignItems: "start",
								marginBottom:
									index === packageFeatures.length - 1 ? "20px" : "10px",
							}}
							key={index}>
							<IoCheckmarkSharp
								style={{
									color: "#3AE374",
									display: "inline-block",
									marginLeft: "0.1em",
									width: "22px",
									height: "22px",
								}}
							/>

							<span
								style={{
									color: [
										"مجانا رحلة تجارية الى الامارات",
										"مجانا رحلة تجارية الى الصين",
										"مجانا رحلة تجارية الى الأمارات",
									].includes(plan?.name)
										? "#1dbbbe"
										: "#011723",
									fontWeight: "400",
									display: "inline-block",
									width: "100%",
									lineHeight: "1.6",
									whiteSpace: [
										"مجانا رحلة تجارية الى الامارات",
										"مجانا رحلة تجارية الى الصين",
										"مجانا رحلة تجارية الى الأمارات",
									].includes(plan?.name)
										? undefined
										: "normal",
								}}>
								{[
									"مجانا رحلة تجارية الى الامارات",
									"مجانا رحلة تجارية الى الصين",
									"مجانا رحلة تجارية الى الأمارات",
								].includes(plan?.name) ? (
									<>
										{plan?.name}
										<button
											className='d-flex justify-content-center align-items-center'
											onClick={() =>
												plan?.name?.includes("مجانا رحلة تجارية الى الأمارات")
													? navigateToCommercialFlightsPage(
															"https://atlbha.sa/business-store"
													  )
													: null
											}
											style={{
												fontWeight: "300",
												padding: "10px 0 0 0",
											}}>
											(للمزيد من المعلومات)
										</button>
									</>
								) : (
									plan?.name
								)}
							</span>
						</h2>
					)
			)}
		</div>
	);
};

export default PackagesFeatures;
