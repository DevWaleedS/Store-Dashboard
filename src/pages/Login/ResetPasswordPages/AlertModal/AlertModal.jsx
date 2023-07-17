import React, { Fragment } from "react";
import ReactDom from "react-dom";
import "./AlertModal.css";

const BackDrop = () => {
	return <div className='backdrop'></div>;
};

export const AlertModalContent = ({ message }) => {
	return (
		<Fragment>
			<BackDrop />
			<div className='alert-modal_body'>
				<div className='alert-message'>
					<div className='alert-message'>{message}</div>

					<div className='progress-bar'></div>
				</div>
			</div>
		</Fragment>
	);
};

const AlertModal = ({ show, message }) => {
	return (
		show && (
			<Fragment>
				{ReactDom.createPortal(
					<AlertModalContent message={message} />,
					document.getElementById("alert-modal")
				)}
			</Fragment>
		)
	);
};

export default AlertModal;
