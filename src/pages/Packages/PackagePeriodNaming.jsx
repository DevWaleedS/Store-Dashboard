import React from "react";

const PackagePeriodNaming = ({ pack }) => {
	return (
		<>
			{" "}
			<span style={{ color: "#1dbbbe" }}>
				{pack?.periodtype === "year"
					? "سنوياََ"
					: pack?.periodtype === "6months"
					? "6 أشهر"
					: pack?.periodtype === "3months"
					? "3 أشهر"
					: pack?.periodtype === "month"
					? "شهرياََ"
					: ""}
			</span>
		</>
	);
};

export default PackagePeriodNaming;
