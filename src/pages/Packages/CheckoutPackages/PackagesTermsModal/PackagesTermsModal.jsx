import React, { Fragment } from "react";
import ReactDom from "react-dom";
import PackagesTermsContent from "./PackagesTermsContent";

const PackagesTermsModal = ({ show, closeModal }) => {
	return (
		show && (
			<Fragment>
				{ReactDom.createPortal(
					<PackagesTermsContent closeModal={closeModal} />,
					document.getElementById("modal-root")
				)}
			</Fragment>
		)
	);
};

export default PackagesTermsModal;
