import React from "react";

import { CiDiscount1 } from "react-icons/ci";

const RenderServicesCouponInput = ({
	setShowCoupon,
	setCouponError,
	handleApplyDiscountCoupon,
	isLoading,
	showCoupon,
	coupon,
	setCoupon,
	couponError,
	loadingCoupon,
}) => {
	return (
		<div className='apply-coupon'>
			<div
				className='coupon'
				onClick={() => {
					setShowCoupon(!showCoupon);
					setCouponError(null);
				}}>
				<CiDiscount1 />
				<h6>هل لديك كود خصم ؟</h6>
			</div>
			{showCoupon && (
				<div className='coupon-wrapper'>
					<form className='coupon-form'>
						<input
							value={coupon}
							onChange={(e) => {
								setCoupon(e.target.value);
								setCouponError("");
							}}
							type='text'
							className='form-control'
							id='input-coupon-code'
							placeholder='كود الخصم'
						/>
						<button
							onClick={handleApplyDiscountCoupon}
							type='button'
							className='btn btn-primary'
							disabled={loadingCoupon || isLoading}>
							تطبيق
						</button>
					</form>
					{couponError && <span className='error'>{couponError}</span>}
				</div>
			)}
		</div>
	);
};

export default RenderServicesCouponInput;
