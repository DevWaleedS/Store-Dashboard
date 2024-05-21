import React, { useEffect } from "react";

const RenderPaymentsList = ({
	paymentMethods,
	paymentSelect,
	setPaymentSelect,
	paymentMethodError,
}) => {
	// To select fist item by default
	useEffect(() => {
		if (paymentMethods?.length !== 0) {
			setPaymentSelect(paymentMethods?.[0]?.id);
		}
	}, [paymentMethods?.length]);

	const paymentsData = paymentMethods?.map((payment) => (
		<li className='item' key={payment?.id}>
			<label className='header'>
				<div className='d-flex flex-row align-items-center'>
					<span className='input-radio'>
						<span className='body'>
							<input
								type='radio'
								className='input'
								name='checkout_payment_method'
								value={payment?.id}
								checked={Number(paymentSelect) === Number(payment?.id)}
								onChange={(e) => setPaymentSelect(e.target.value)}
							/>
							<span className='input-radio-circle' />
						</span>
					</span>
					<span>{payment?.name}</span>
				</div>
				<img
					src={payment?.image}
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
			<h6>يرجى اختيار طريقة الدفع</h6>
			<ul className='list'>{paymentsData}</ul>
			{paymentMethodError && (
				<span
					style={{ fontSize: "0.85rem", fontWeight: "500" }}
					className='text-danger'>
					{paymentMethodError}
				</span>
			)}
		</div>
	);
};

export default RenderPaymentsList;
