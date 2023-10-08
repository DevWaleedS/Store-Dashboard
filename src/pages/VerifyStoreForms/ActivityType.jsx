import React, { Fragment } from "react";
import MultipleSelectCheckmarks from "../../components/MultipleSelectCheckmarks";

const ActivityType = ({ setShowErr, showErr }) => {
	return (
		<Fragment>
			<MultipleSelectCheckmarks showErr={showErr} setShowErr={setShowErr} />
		</Fragment>
	);
};

export default ActivityType;
