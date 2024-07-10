import { Switch } from "@mui/material";
import React from "react";

import { PageHint } from "../../components";

const PaymentRecieving = ({
	cashOnDelivery,
	handleChangeCashOnDeliveryStatus,
	switchStyle,
}) => {
	return (
		<div className='row other-shipping-company mb-4'>
			<PageHint
				hint={`يمكنك استخدام خيار الدفع عند الاستلام كطريقه من ضمن طرق الدفع
							المختلفة التي نوفرها لك
						`}
				flex={"d-flex d-md-none justify-content-start align-items-center gap-2"}
			/>

			<div className='col-xl-3 col-lg-6 col-12'>
				<div className='data-widget'>
					<div className='data pt-4'>
						<div className='image-box'>
							<img
								className='img-fluid'
								src={cashOnDelivery?.image}
								alt={cashOnDelivery?.name}
								style={{ width: "80px" }}
							/>
						</div>
						{cashOnDelivery?.name ? (
							<div className='current-price mt-1 w-100 d-flex justify-content-center'>
								{cashOnDelivery?.name}
							</div>
						) : null}
					</div>
				</div>
			</div>

			{cashOnDelivery && (
				<div className='col-xl-8 col-lg-6 col-12'>
					<PageHint
						hint={`يمكنك استخدام خيار الدفع عند الاستلام كطريقه من ضمن طرق الدفع
							المختلفة التي نوفرها لك
						`}
						flex={
							"d-none d-md-flex justify-content-start align-items-center gap-2"
						}
					/>

					<div className=''>
						<div className='tax-text'>تفعيل/تعطيل الدفع عند الاستلام </div>
						<div
							className='switch-box d-flex justify-content-center align-items-center mb-2'
							style={{
								height: "50px",
								backgroundColor: "#f7f8f8",
							}}>
							<Switch
								onChange={() => {
									handleChangeCashOnDeliveryStatus(cashOnDelivery?.id);
								}}
								checked={cashOnDelivery?.status === "نشط" ? true : false}
								sx={switchStyle}
							/>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default PaymentRecieving;
