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
							{" "}
							تبدأ اعمال الموظفين من تاريخ 9/9/2024م لمدة 15 يوم، من الساعة 4م
							الى 9م .
						</li>
						<li> انطلاقة رحلة دبي في تاريخ 4/9/2024م يوم الأربعاء .</li>
						<li>
							الاستقبال من مطار دبي والتوجه للفندق بالباص الساعة السابعة ونصف
							مساء بتوقيت دبي.
						</li>
						<li> الاجتماع في قاعة الفندق الساعة الثامنة ونصف مساء . </li>
						<li> لأقامه عدة دورات تدريبية لمدة 4 أيام .</li>
						<li>
							السكن في فندق 4-5 نجوم في غرفة مشتركه، لمن يرغب في غرفة خاصة يدفع
							فارق السعر .
						</li>
						<li>السكن يشمل الإفطار .</li>
						<li>جميع التنقلات الجماعية مجانا .</li>
						<li>
							المغادرة من الفندق للمطار يوم السبت التاريخ 7/9/2024م الساعة اثنين
							ظهرا.
						</li>
					</ul>
				</div>
			</div>
		</Fragment>
	);
};

export default PackagesTermsContent;
