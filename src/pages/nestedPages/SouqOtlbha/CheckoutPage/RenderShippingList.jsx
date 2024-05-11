import React, { useEffect } from "react";

const RenderShippingList = ({
	shippingCompanies,
	shippingSelect,
	setShippingSelect,
	setShipping,
	shipping,
	shippingTypeErrors,
	setShippingPrice,
}) => {
	// TO HANDLE NAME OF DAYS
	const daysDefinition = (time) => {
		let timeValue = Number(time);
		if (timeValue === 0) {
			return;
		}
		if (timeValue === 1) {
			return "يوم واحد";
		} else if (timeValue === 2) {
			return "يومين";
		} else if (timeValue <= 10 && timeValue >= 3) {
			return `${timeValue} أيام`;
		} else {
			return `${timeValue} يوم`;
		}
	};

	// to set setShippingSelect into other if no longer any shipping companies
	useEffect(() => {
		if (shippingCompanies?.length === 1) {
			setShippingSelect(5);
		}
	}, [shippingCompanies?.length]);

	// handle shipping price

	const shipping_price = shippingCompanies?.filter(
		(company) => Number(company?.id) === Number(shippingSelect)
	)?.[0]?.price;

	useEffect(() => {
		if (shipping_price) {
			setShippingPrice(Number(shipping_price));
		}
	}, [shipping_price]);

	const shippingData = shippingCompanies?.map((item) => (
		<li className='item' key={item?.id}>
			<label className='header'>
				<div className='d-flex flex-row align-items-center'>
					<span className='input-radio'>
						<span className='body'>
							<input
								type='radio'
								className='input'
								name='shippingCompany'
								value={item?.id}
								checked={JSON.parse(shippingSelect) === Number(item?.id)}
								onChange={(e) => {
									setShippingSelect(e.target.value);
									setShipping({
										...shipping,
										shippingtype_id: e.target.value,
									});
								}}
							/>
							<span className='input-radio-circle' />
						</span>
					</span>

					<div
						className='d-flex flex-row align-items-center'
						style={{ gap: "5px" }}>
						<span className='payment-methods__item-title'>{item?.name}</span>
						{item?.time !== "0" && item?.price !== "0" && (
							<span style={{ fontSize: "0.8rem", color: "#919191" }}>
								{item?.time !== null
									? `مدة التوصيل : ${daysDefinition(item?.time)}`
									: ""}
							</span>
						)}
					</div>
				</div>
				<img
					src={item?.image}
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
};

export default RenderShippingList;
