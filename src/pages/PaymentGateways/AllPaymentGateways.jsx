import React from "react";
import Madfou3Modal from "./Madfou3Modal";
import { Switch } from "@mui/material";

const AllPaymentGateways = ({
	allPayments,
	switchStyle,
	hideMadfou3Modal,
	isMadfou3ModalOpen,
	handleChangePaymentStatus,
}) => {
	return (
		<>
			<div className='row'>
				{allPayments?.length !== 0 &&
					allPayments?.map((item) => (
						<div className='col-xl-3 col-6' key={item.id}>
							<div className='data-widget'>
								<div className='data'>
									<div className='image-box'>
										<img
											className='img-fluid'
											src={item?.image}
											alt={item?.name}
											style={{ width: "110px" }}
										/>
									</div>
									{item?.description ? (
										<div className='current-price mt-1 w-100 d-flex justify-content-center'>
											<span>الرسوم:</span> {item?.description}
										</div>
									) : null}
								</div>
								<div className='switch-box'>
									<Switch
										name={item?.name}
										checked={item?.status === "نشط" ? true : false}
										onChange={() => handleChangePaymentStatus(item?.id)}
										sx={switchStyle}
									/>
								</div>
							</div>
						</div>
					))}
			</div>
			<Madfou3Modal isShowing={isMadfou3ModalOpen} hide={hideMadfou3Modal} />
		</>
	);
};

export default AllPaymentGateways;
