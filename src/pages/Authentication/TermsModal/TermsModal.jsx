import React, { Fragment } from 'react';
import ReactDom from 'react-dom';

import TermsAndConditionContent from './TermsAndConditionContent';




const TermsModal = ({ show, closeModal }) => {
	return show && <Fragment>{ReactDom.createPortal(<TermsAndConditionContent closeModal={closeModal} />, document.getElementById('modal-root'))}</Fragment>;
};

export default TermsModal;
