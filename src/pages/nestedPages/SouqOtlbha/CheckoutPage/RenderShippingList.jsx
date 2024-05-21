import React, { useEffect, useImperativeHandle, forwardRef } from "react";

// RTK Query
import { useReCalculateCartByShippingIdMutation } from "../../../../store/apiSlices/souqOtlobhaProductsApi";
import { useGetShippingCompaniesQuery } from "../../../../store/apiSlices/selectorsApis/selectShippingCompaniesApi";

const RenderShippingList = forwardRef(
	(
		{ shippingSelect, setShippingSelect, setShipping, shippingTypeErrors },
		ref
	) => {
		// get shipping Companies..
		const { data: shippingCompanies } = useGetShippingCompaniesQuery();

		// TO HANDLE NAME OF DAYS
		const daysDefinition = (time) => {
			const timeValue = Number(time);
			if (timeValue === 0) return;
			if (timeValue === 1) return "يوم واحد";
			if (timeValue === 2) return "يومين";
			if (timeValue >= 3 && timeValue <= 10) return `${timeValue} أيام`;
			return `${timeValue} يوم`;
		};

		// To select first item by default
		useEffect(() => {
			if (shippingCompanies?.length !== 0) {
				setShippingSelect(shippingCompanies?.[0]?.id);
			}
		}, [shippingCompanies?.length]);

		// Re-calculate cart based on ShippingId
		const [reCalculateCartByShippingId, { isLoading }] =
			useReCalculateCartByShippingIdMutation();

		// Use useImperativeHandle to expose isLoading to parent component
		useImperativeHandle(ref, () => ({
			isLoading,
		}));

		const handleReCalculateCartByShippingId = async () => {
			// make request...
			try {
				await reCalculateCartByShippingId({
					id: shippingSelect,
				});
			} catch (error) {
				console.error("Error changing checkOutCart:", error);
			}
		};

		// This effect to auto-fetch re-calculate cart api based on ShippingId
		useEffect(() => {
			if (shippingSelect) {
				handleReCalculateCartByShippingId();
			}
		}, [shippingSelect]);

		// handle on change to set shipping id and send it to api
		const handleShippingChange = (id) => {
			setShippingSelect(id);
			setShipping((prevShipping) => ({
				...prevShipping,
				shippingtype_id: id,
			}));
		};

		const shippingData = shippingCompanies?.map((shipping) => (
			<li className='item' key={shipping?.id}>
				<label className='header'>
					<div className='d-flex flex-row align-items-center'>
						<span className='input-radio'>
							<span className='body'>
								<input
									type='radio'
									className='input'
									name='shippingCompany'
									value={shipping?.id}
									checked={Number(shippingSelect) === Number(shipping?.id)}
									onChange={(e) => handleShippingChange(e.target.value)}
								/>
								<span className='input-radio-circle' />
							</span>
						</span>

						<div
							className='d-flex flex-row align-items-center'
							style={{ gap: "5px" }}>
							<span className='payment-methods__item-title'>
								{shipping?.name}
							</span>
							{shipping?.time !== "0" && shipping?.price !== "0" && (
								<span style={{ fontSize: "0.8rem", color: "#919191" }}>
									{shipping?.time
										? `مدة التوصيل : ${daysDefinition(shipping?.time)}`
										: ""}
								</span>
							)}
						</div>
					</div>
					<img
						src={shipping?.image}
						alt=''
						width='40'
						height='20'
						style={{ objectFit: "contain" }}
					/>
				</label>
			</li>
		));

		return (
			<div className='payment-methods'>
				<h6>يرجى اختيار شركة الشحن </h6>
				<ul className='list'>{shippingData}</ul>
				{shippingTypeErrors && (
					<span
						style={{ fontSize: "0.85rem", fontWeight: "500" }}
						className='text-danger'>
						{shippingTypeErrors}
					</span>
				)}
			</div>
		);
	}
);

export default RenderShippingList;
