import React from "react";
import { PageHint } from "../../components";
import FilterPackageTypes from "./FilterPackageTypes";

// RTK Query
import { useShowVerificationQuery } from "../../store/apiSlices/verifyStoreApi";

const PackagesHead = ({ packageType, setPackageType }) => {
	const { data: showVerification } = useShowVerificationQuery();

	return (
		<>
			{" "}
			<div className='row mb-4 packages-header'>
				<PageHint
					hint={
						!showVerification?.package_id
							? `لكي تتمكن من مواصلة نشاطك بشكل احترافي قم باختيار الباقة التي تناسب متجرك.`
							: `نوفر لك مجموعة متنوعة من الباقات ، بامكانك اختيار الباقة التي تتناسب مع إحتياجات متجرك بكل سهولة.`
					}
					flex={"d-flex justify-content-start align-items-center gap-2"}
				/>
				<FilterPackageTypes
					packageType={packageType}
					setPackageType={setPackageType}
				/>
			</div>
		</>
	);
};

export default PackagesHead;
