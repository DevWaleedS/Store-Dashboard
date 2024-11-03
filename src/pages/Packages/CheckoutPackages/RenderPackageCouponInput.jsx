import React from "react";

import { CiDiscount1 } from "react-icons/ci";

import { toast } from "react-toastify";
import { useApplyPackageCouponMutation } from "../../../store/apiSlices/upgradePackagesApi";

const RenderPackageCouponInput = ({
	setShowCoupon,
	setCouponError,
	showCoupon,
	coupon,
	setCoupon,
	setLoadingCoupon,
	setBtnLoading,
	cartId,
	couponError,
	loadingCoupon,
}) => {
	// handle apply code
	const [applyPackageCoupon, { isApplyPackageCouponLoading }] =
		useApplyPackageCouponMutation();
	const handleApplyDiscountCoupon = async () => {
		setCoupon("");
		setLoadingCoupon(true);
		setCouponError(null);

		// data that send to api..
		let formData = new FormData();
		formData.append("code", coupon);

		// make request...
		try {
			const response = await applyPackageCoupon({
				body: formData,
				id: cartId,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				if (
					response?.data?.message?.en === "The coupon is invalid" ||
					response?.data?.message?.en === "The coupon is already used"
				) {
					toast.error(
						response?.data?.message?.ar
							? response.data.message.ar
							: response.data.message.en,
						{
							theme: "light",
						}
					);
				}

				setLoadingCoupon(false);
			} else {
				setBtnLoading(false);
				setLoadingCoupon(false);

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);
			}
		} catch (error) {
			console.error("Error changing appLyDiscountCoupon:", error);
		}
	};

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
							disabled={
								loadingCoupon || isApplyPackageCouponLoading || !coupon
							}>
							تطبيق
						</button>
					</form>
					{couponError && <span className='error'>{couponError}</span>}
				</div>
			)}
		</div>
	);
};

export default RenderPackageCouponInput;
