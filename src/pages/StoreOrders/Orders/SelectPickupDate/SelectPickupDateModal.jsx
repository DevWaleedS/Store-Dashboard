import React from "react";

// MUI
import { Box, Modal } from "@mui/material";

//Icons
import { AiOutlineCloseCircle } from "react-icons/ai";

import { PageHint } from "../../../../components";

// date picker
import { DatePicker } from "rsuite";

// import css style

import "./SelectPickupDate.css";

// Style the modal
const style = {
	position: "absolute",
	top: "90px",
	height: "650px",
	left: "0",
	transform: "translateX(50%)",
	width: "45%",
	maxWidth: "96%",
	"@media(max-width:768px)": {
		top: "80px",
		width: "96%",
		height: " auto",
		transform: "translateX(2%)",
	},
};

const SelectPickupDateModal = ({
	pickupDateModalIsOpen,
	handleClosePickupDateModal,
	handleUpdateOrderStatus,
	isLoading,
	setValue,
	value,
	error,
}) => {
	return (
		<Modal open={pickupDateModalIsOpen} closeAfterTransition>
			<Box component={"div"} sx={style}>
				<div className='change-categories-modal-content h-100 '>
					<section className='mb-4 '>
						<div className='row'>
							<div className='col-12'>
								<div
									className='form-title  d-flex justify-content-center align-content-center'
									style={{
										borderRadius: "16px 16px 0 0",
										backgroundColor: "#1DBBBE",
										padding: "20px ",
									}}>
									<h5
										className='text-white text-center'
										style={{
											fontSize: "22px",
											fontWeight: 400,
											whiteSpace: "normal",
										}}>
										تحديد تاريخ تسليم الشحنة لمندوب الشحن
									</h5>

									<div className='close-icon-video-modal ps-2'>
										<AiOutlineCloseCircle
											style={{ cursor: "pointer", color: "white" }}
											onClick={handleClosePickupDateModal}
										/>
									</div>
								</div>
							</div>
						</div>
					</section>

					<section className='pt-0 pb-3 px-3'>
						<div className='row mb-1'>
							<div className='col-12 '>
								<PageHint
									hint={` قم بتحديد تاريخ ووقت استلام مندوب الشحن للطلب الخاص بك ، وسيتم التواصل معك من قبل مندوب شركة الشحن .`}
									flex={"d-flex justify-content-start align-items-center gap-2"}
								/>
							</div>
						</div>
						<div className='row' style={{ marginBottom: "16rem" }}>
							<div className='col-12'>
								<label htmlFor='product-category'>
									تاريخ تسليم الشحنة لمندوب الشحن:
									<span className='important-hint'>*</span>
								</label>
							</div>
							<div className='col-12 '>
								<DatePicker
									block
									size='lg'
									showMeridian
									format='yyyy-MM-dd HH:mm:aa'
									placeholder='حدد تاريخ ووقت تسليم الشحنة'
									className='select_pickup_date_picker'
									value={value}
									onChange={setValue}
									disabledDate={(date) => {
										const today = new Date();
										today.setHours(0, 0, 0, 0);
										return date < today || date.getTime() === today.getTime();
									}}
								/>
							</div>

							{error?.pickup_date ? (
								<div className='col-12 mt-1'>
									<span className='fs-6 text-danger'>{error?.pickup_date}</span>
								</div>
							) : null}
						</div>

						<div className='row mb-3 d-flex justify-content-center align-items-center'>
							<div className='col-md-5 col-12'>
								<button
									disabled={isLoading}
									className='save-change-btn w-100'
									onClick={() =>
										handleUpdateOrderStatus("delivery_in_progress")
									}>
									تأكيد طلب المندوب
								</button>
							</div>
						</div>
					</section>
				</div>
			</Box>
		</Modal>
	);
};

export default SelectPickupDateModal;
