import React from "react";
import { Link } from "react-router-dom";

const RenderCartIsEmpty = () => {
	return (
		<div className='empty'>
			<span>لاتوجد منتجات في سلة الاستيراد</span>
			<Link to='/Products/SouqOtlobha'>العودة إلى سوق اطلبها</Link>
		</div>
	);
};

export default RenderCartIsEmpty;
