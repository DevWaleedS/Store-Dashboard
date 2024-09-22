import React, { Fragment } from "react";
import "./PackagesTermsModal.css";

import { ArrowBack } from "../../../../data/Icons";

const BackDrop = ({ closeModal }) => {
	return <div className='backdrop' onClick={closeModal}></div>;
};

const PackagesTermsContent = ({ closeModal }) => {
	return (
		<Fragment>
			<BackDrop closeModal={closeModal} />
			<div className='modal_body'>
				<div className='modal_title'>
					<button className='back_btn' onClick={closeModal}>
						<ArrowBack />
					</button>
					<h5 className='mb-0'>شروط باقة متجر الاعمال في منصة اطلبها</h5>
				</div>
				<div className='modal_content'>
					<ul className='packages_condition__list'>
						<li>يبدأ الاشتراك في المتجر من تاريخ دفع الرسوم لمدة 12 شهر.</li>
						<li>
							يبدأ عمل الموظف تاريخ 5/10/2024 م لمدة 5 أيام من الساعة 4م الى 9م.
						</li>
						<li>انطلاقة الدورة التدريبية 13/10/2024 سيتم التواصل معكم .</li>
						<li>ورشة العمل ليست اجبارية ويتم تحديدها بعد الدورة.</li>
						<li>
							⁠الشهادة تصدر من المؤسسة العامة للتدريب للمقيمين في السعودية.
						</li>
					</ul>
				</div>
			</div>
		</Fragment>
	);
};

export default PackagesTermsContent;
