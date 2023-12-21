import React, { Fragment, useContext, useEffect } from "react";
import ReactDom from "react-dom";
import "./AlertModal.css";
import Context from "../../../../../Context/context";

const BackDrop = () => {
	return <div className='backdrop'></div>;
};

export const AlertModalContent = ({ message }) => {
	const contextStore = useContext(Context);
	const { showAlertModal, setShowAlertModal,setMessage } = contextStore;
	// to close Alert modal after timer end
	useEffect(() => {
		if (showAlertModal) {
			setTimeout(() => {
				setShowAlertModal(false);
				setMessage('');
			}, 3000);
		}
	}, [showAlertModal]);
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
