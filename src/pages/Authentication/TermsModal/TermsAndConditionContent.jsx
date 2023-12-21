import React, { Fragment } from 'react';
import './TermsModal.css';
import { ImArrowRight } from 'react-icons/im';
const BackDrop = ({ closeModal }) => {
	return <div className='backdrop' onClick={closeModal}></div>;
};

const TermsAndConditionContent = ({ closeModal }) => {
	return (
		<Fragment>
			<BackDrop closeModal={closeModal} />
			<div className='modal_body'>
				<div className='modal_title'>
					<span onClick={closeModal}>
						<ImArrowRight />
					</span>
					<h5 className='mb-0'>الشروط والأحكام</h5>
				</div>
				<div className='modal_content'>
					تقدم منصة اطلبها تجربة مجانية تستطيع من خلالها ان تبدأ بإنشاء متجرك الخاص وإدارته بكل سهولة، حيث وفرنا لك لوحة تحكم سهلة وواضحة لتستطيع التحكم بكل ما تحتاجه قمنا بإضافة قسم السوق وبإمكانك أن تجد
					منتجات رائعة يمكنك ان تبدأ بشرائها وبيعها للعملاء
				</div>
			</div>
		</Fragment>
	);
};

export default TermsAndConditionContent;
