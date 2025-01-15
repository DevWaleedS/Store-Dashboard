import React from "react";
import { Message } from "rsuite";

// utilities
import { DaysFormatter } from "../../utilities";

const PackagePeriodAlert = ({ pack }) => {
	return (
		<>
			{" "}
			<div className='end_package_period w-100'>
				{pack?.is_selected && pack?.package_paid ? (
					pack?.left_days === 0 ? (
						<Message closable type='error' showIcon>
							<strong>انتهت!</strong> مدة الاشتراك في الباقة{" "}
						</Message>
					) : pack?.left_days <= 30 ? (
						<Message closable type='warning' showIcon>
							<strong>يرجي الانتباه!</strong> ستنتهي الباقة خلال{" "}
							<strong>{DaysFormatter(pack?.left_days)} !</strong>
						</Message>
					) : null
				) : null}
			</div>
		</>
	);
};

export default PackagePeriodAlert;
