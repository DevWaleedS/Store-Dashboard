import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Context
import { LoadingContext } from "../../../../Context/LoadingProvider";

// RTK Query
import { useUpdateOrderStatusMutation } from "../../../../store/apiSlices/ordersApiSlices/ordersApi";

// Icons
import {
	Radio,
	styled,
	RadioGroup,
	FormControl,
	FormControlLabel,
} from "@mui/material";
import { ArrowDown, ListIcon } from "../../../../data/Icons";
import SelectPickupDateModal from "../SelectPickupDate/SelectPickupDateModal";

// Utilities
import { FormatDateAsTimestamp } from "../../../../utilities";

const BpIcon = styled("span")(({ theme }) => ({
	borderRadius: "50%",
	width: 18,
	height: 18,
	boxShadow:
		"inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
	backgroundColor: "#f5f8fa",
	backgroundImage:
		"linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
	".Mui-focusVisible &": {
		outline: "2px auto rgba(19,124,189,.6)",
		outlineOffset: 2,
	},
	"input:hover ~ &": {
		backgroundColor: theme.palette.mode === "dark" ? "#30404d" : "#ebf1f5",
	},
	"input:disabled ~ &": {
		boxShadow: "none",
		background: "rgba(206,217,224,.5)",
	},
}));

const BpCheckedIcon = styled(BpIcon)({
	backgroundColor: "#1dbbbe",
	backgroundImage:
		"linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
	"&::before": {
		display: "block",
		width: 18,
		height: 18,
		backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
		content: '""',
	},
	"input:hover ~ &": {
		backgroundColor: "#1dbbbe",
	},
});

// Inspired by blue Print js
function BpRadio(props) {
	return (
		<Radio
			disableRipple
			color='default'
			checkedIcon={<BpCheckedIcon />}
			icon={<BpIcon />}
			{...props}
		/>
	);
}

const formControlLabelStyle = {
	"&.MuiFormControlLabel-root": {
		width: "100%",

		padding: "8px",
		borderRadius: "6px",
		":hover": {
			backgroundColor: "#a5e4e5",
		},
	},
};

const SelectShippingStatus = ({
	id,
	value,
	setValue,
	resetError,
	shipping,
	setError,
	error,
	currentOrder,
}) => {
	const navigate = useNavigate();

	// to handle set date rang of shipping
	// handle shipping status
	const [shippingStatus, setShippingStatus] = useState("");
	const [pickupDateModalIsOpen, setPickupDateModalIsOpen] = useState(false);

	const handleClosePickupDateModal = () => {
		setPickupDateModalIsOpen(false);
		setShippingStatus("");
		setValue(null);
		resetError();
	};

	const handleOnChange = (e) => {
		const newStatus = e.target.value;
		setShippingStatus(newStatus);

		if (newStatus === "delivery_in_progress") {
			setPickupDateModalIsOpen(true);
		} else {
			handleUpdateOrderStatus(newStatus);
		}
	};

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// To handle update order Status
	const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
	const handleUpdateOrderStatus = async (status) => {
		setLoadingTitle("جاري تعديل حالة الطلب");
		resetError();

		// Format the date as a timestamp with timezone offset
		const formattedDate = value ? FormatDateAsTimestamp(value) : null;

		// Data that send to API
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("status", status);
		formData.append("city", shipping?.city);
		formData.append("district", shipping?.district);
		formData.append("street_address", shipping?.address);
		if (
			status !== "completed" &&
			status !== "canceled" &&
			currentOrder?.orders?.shippingtypes?.name !== "اخرى"
		) {
			formData.append("pickup_date", formattedDate);
		}

		try {
			const response = await updateOrderStatus({
				id,
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				navigate("/Orders");
				setLoadingTitle("");
				if (pickupDateModalIsOpen) {
					handleClosePickupDateModal();
				}
			} else {
				setLoadingTitle("");
				setError({
					district: response?.data?.message?.en?.district?.[0] || "",
					city: response?.data?.message?.en?.city?.[0] || "",
					address: response?.data?.message?.en?.street_address?.[0] || "",
					pickup_date:
						response?.error?.status === 404
							? response?.error?.data?.error
							: response?.data?.message?.en?.pickup_date?.[0] || "",
					weight: response?.data?.message?.en?.weight?.[0] || "",
				});

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);

				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error changing update order status :", error);
		}
	};

	return (
		currentOrder?.orders?.status !== "ملغي" &&
		currentOrder?.orders?.status !== "مكتمل" && (
			<>
				<section>
					<div className='title mb-4'>
						<h5>حالة الشحن</h5>
						<div
							className='order-action-box accordion-box mb-3'
							id='accordionExample'>
							<div className='accordion-item w-100'>
								<button
									style={{ height: "auto" }}
									type='button'
									className='accordion-button  text-end '
									data-bs-toggle='collapse'
									data-bs-target='#collapseOne'
									aria-expanded='true'
									aria-controls='collapseOne'>
									<div className='action-title w-100 d-flex flex-wrap'>
										<ListIcon className='list-icon' />
										<span className='me-2' style={{ fontSize: "18px" }}>
											اختيار حالة الشحن
										</span>
									</div>
									<div className='action-icon'>
										<ArrowDown
											style={{
												cursor:
													currentOrder?.orders?.status ===
														"طلب مندوب لتوصيل الشحنة " ||
													currentOrder?.orders?.status === "ملغي" ||
													currentOrder?.orders?.status === "قيد التجهيز"
														? "not-allowed"
														: "pointer",
											}}
										/>
									</div>
								</button>

								<div
									id='collapseOne'
									className='accordion-collapse collapse '
									aria-labelledby='headingOne'
									data-bs-parent='#accordionExample'>
									<div className='accordion-body'>
										<FormControl
											sx={{
												width: "100%",
												"& .MuiFormControlLabel-root": {
													"@media(max-width:768px)": {
														marginRight: "-16px",
													},
												},

												"& .MuiFormControlLabel-label ": {
													whiteSpace: "normal",
												},
											}}>
											<RadioGroup
												value={shippingStatus}
												onChange={handleOnChange}>
												{!currentOrder?.orders?.is_service ? (
													<FormControlLabel
														className='mb-2'
														value='ready'
														control={<BpRadio />}
														sx={formControlLabelStyle}
														label='قيد التجهيز (يرجى ملء بيانات الشحنة أولاً)'
														disabled={
															isLoading ||
															currentOrder?.orders?.status === "قيد التجهيز" ||
															currentOrder?.orders?.status ===
																"طلب مندوب لتوصيل الشحنة " ||
															currentOrder?.orders?.status === "ملغي"
														}
													/>
												) : null}

												{(currentOrder?.orders?.shippingtypes?.name &&
													currentOrder?.orders?.shippingtypes?.name !==
														"اخرى") ||
												!currentOrder?.orders?.is_service ? (
													<FormControlLabel
														className='mb-2'
														value='delivery_in_progress'
														control={<BpRadio />}
														label='طلب مندوب لتوصيل الشحنة '
														sx={formControlLabelStyle}
														disabled={
															isLoading ||
															currentOrder?.orders?.status === "جديد" ||
															currentOrder?.orders?.status ===
																"طلب مندوب لتوصيل الشحنة " ||
															currentOrder?.orders?.status === "ملغي"
														}
													/>
												) : null}
												{currentOrder?.orders?.is_service ? (
													<FormControlLabel
														control={
															<BpRadio value='canceled' name='canceled' />
														}
														sx={formControlLabelStyle}
														label=' إلغاء الشحنة (إلغاء الطلب بالكامل) '
													/>
												) : (currentOrder?.orders?.status !==
														"طلب مندوب لتوصيل الشحنة " ||
														currentOrder?.orders?.status !== "ملغي") &&
												  currentOrder?.orders?.shippingtypes?.name ===
														"اخرى" ? (
													<FormControlLabel
														control={
															<BpRadio value='canceled' name='canceled' />
														}
														sx={formControlLabelStyle}
														label=' إلغاء الشحنة (إلغاء الطلب بالكامل) '
													/>
												) : null}

												{currentOrder?.orders?.is_service ? (
													<FormControlLabel
														value='completed'
														control={<BpRadio />}
														sx={formControlLabelStyle}
														label='مكتمل'
														disabled={
															isLoading ||
															currentOrder?.orders?.status === "مكتمل" ||
															currentOrder?.orders?.status === "ملغي"
														}
													/>
												) : (
													<FormControlLabel
														value='completed'
														control={<BpRadio />}
														sx={formControlLabelStyle}
														label='مكتمل'
														disabled={
															isLoading ||
															currentOrder?.orders?.status === "جديد" ||
															currentOrder?.orders?.status === "قيد التجهيز" ||
															currentOrder?.orders?.status === "مكتمل" ||
															currentOrder?.orders?.status === "ملغي"
														}
													/>
												)}
											</RadioGroup>
										</FormControl>
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>
				<SelectPickupDateModal
					error={error}
					value={value}
					setValue={setValue}
					isLoading={isLoading}
					pickupDateModalIsOpen={pickupDateModalIsOpen}
					handleUpdateOrderStatus={handleUpdateOrderStatus}
					setPickupDateModalIsOpen={setPickupDateModalIsOpen}
					handleClosePickupDateModal={handleClosePickupDateModal}
				/>
			</>
		)
	);
};

export default SelectShippingStatus;
