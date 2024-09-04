import React from "react";

const AcademyToggle = ({ togglePage, togglePagesHandle }) => {
	console.log(togglePage);
	console.log(togglePagesHandle);
	return (
		<div className='row mb-md-5 mb-3'>
			<div className='btns-group-container flex-md-row flex-column gap-3 d-flex justify-content-md-start justify-content-center align-items-center'>
				<button
					onClick={() => togglePagesHandle(1)}
					className={togglePage === 1 ? "active" : ""}>
					الدورات التدريبية
				</button>

				<button
					onClick={() => togglePagesHandle(2)}
					className={togglePage === 2 ? " active" : ""}>
					الدورات المباشرة
				</button>

				<button
					onClick={() => togglePagesHandle(3)}
					className={togglePage === 3 ? "active" : ""}>
					شروحات
				</button>
			</div>
		</div>
	);
};

export default AcademyToggle;
