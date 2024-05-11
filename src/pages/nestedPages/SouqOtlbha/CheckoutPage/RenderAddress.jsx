import React from "react";

// Icons
import { Check9x7Svg } from "../../../../data/Icons";

// RTK Query
import { useGetShippingCitiesQuery } from "../../../../store/apiSlices/selectorsApis/selectShippingCitiesApi";

const RenderAddress = ({ shipping, setShipping, error }) => {
	// get shipping cities..
	const { data: shippingCitiesData } = useGetShippingCitiesQuery(5);

	// handle set cities by arabic
	function removeDuplicates(arr) {
		const unique = arr?.filter((obj, index) => {
			return (
				index ===
				arr?.findIndex((o) => obj?.region?.name_en === o?.region?.name_en)
			);
		});
		return unique;
	}

	const getCityFromProvince =
		shippingCitiesData?.cities?.filter(
			(obj) => obj?.region?.name_en === shipping?.district
		) || [];

	return (
		<div className='col-12 col-lg-6 col-xl-7'>
			<div className='card mb-lg-0'>
				<div className='card-body'>
					<h3 className='card-title'>تفاصيل العنوان</h3>
					<div className='form-group mt-3'>
						<label htmlFor='country'>
							المنطقة
							<span className='required'>*</span>
						</label>
						<select
							value={shipping?.district}
							onChange={(e) => {
								if (e.target.value !== "") {
									setShipping({
										...shipping,
										district: e.target.value,
									});
								}
							}}
							id='country'
							className='form-control'>
							<option value=''>اختر المنطقة...</option>
							{removeDuplicates(shippingCitiesData?.cities)?.map(
								(district, index) => (
									<option key={index} value={district?.region?.name_en}>
										{district?.region?.name}
									</option>
								)
							)}
						</select>
						{error?.district && (
							<span
								style={{ fontSize: "0.85rem", fontWeight: "500" }}
								className='text-danger'>
								{error?.district}
							</span>
						)}
					</div>
					<div className='form-group'>
						<label htmlFor='city'>
							المدينة
							<span className='required'>*</span>
						</label>
						<select
							value={shipping?.city}
							onChange={(e) => {
								if (e.target.value !== "") {
									setShipping({
										...shipping,
										city: e.target.value,
									});
								}
							}}
							id='city'
							className='form-control'>
							<option value=''>اختر المدينة...</option>
							{getCityFromProvince?.map((city, index) => (
								<option key={index} value={city?.name_en}>
									{city?.name}
								</option>
							))}
						</select>
						{error?.city && (
							<span
								style={{ fontSize: "0.85rem", fontWeight: "500" }}
								className='text-danger'>
								{error?.city}
							</span>
						)}
					</div>
					<div className='form-group'>
						<label htmlFor='address'>
							اسم الشارع <span className='required'>*</span>
						</label>
						<input
							value={shipping?.address}
							onChange={(e) =>
								setShipping({
									...shipping,
									address: e.target.value,
								})
							}
							id='address'
							type='text'
							className='form-control'
						/>
						{error?.address && (
							<span
								style={{ fontSize: "0.85rem", fontWeight: "500" }}
								className='text-danger'>
								{error?.address}
							</span>
						)}
					</div>
					<div className='form-group'>
						<label htmlFor='post_code'>الرمز البريدي / ZIP (اختياري)</label>
						<input
							value={shipping?.postCode}
							onChange={(e) =>
								setShipping({
									...shipping,
									postCode: e.target.value,
								})
							}
							id='post_code'
							type='text'
							className='form-control'
						/>
						{error?.postCode && (
							<span
								style={{ fontSize: "0.85rem", fontWeight: "500" }}
								className='text-danger'>
								{error?.postCode}
							</span>
						)}
					</div>
					<div className='form-group'>
						<div className='form-check'>
							<span className='input-check'>
								<span className='body'>
									<input
										className='input'
										type='checkbox'
										id='checkout-create-account'
										checked={shipping?.defaultAddress}
										onChange={(e) => {
											setShipping({
												...shipping,
												defaultAddress: e.target.checked,
											});
										}}
									/>
									<span className='input-check-box' />
									<Check9x7Svg className='input-check-icon' />
								</span>
							</span>
							<label
								className='form-check-label'
								htmlFor='checkout-create-account'>
								تعيينه كـ عنوان افتراضي
							</label>
						</div>
					</div>
				</div>
				<div className='card-divider'></div>
				<div className='card-body'>
					<h3 className='card-title'>تفاصيل الشحن</h3>
					<div className='form-group'>
						<label htmlFor='note'>ملاحظات الطلب</label>
						<textarea
							id='note'
							className='form-control'
							rows='4'
							value={shipping?.notes}
							onChange={(e) =>
								setShipping({
									...shipping,
									notes: e.target.value,
								})
							}></textarea>
						{error?.notes && (
							<span
								style={{ fontSize: "0.85rem", fontWeight: "500" }}
								className='text-danger'>
								{error?.notes}
							</span>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default RenderAddress;
