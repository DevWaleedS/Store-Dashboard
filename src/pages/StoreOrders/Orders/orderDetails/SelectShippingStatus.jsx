import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Context
import { LoadingContext } from "../../../../Context/LoadingProvider";

// RTK Query
import { useUpdateOrderStatusMutation } from "../../../../store/apiSlices/ordersApiSlices/ordersApi";

// Icons
import { ArrowDown, ListIcon } from "../../../../data/Icons";
import {
	FormControl,
	FormControlLabel,
	Radio,
	RadioGroup,
	styled,
} from "@mui/material";
import SelectPickupDateModal from "../SelectPickupDate/SelectPickupDateModal";

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

// Inspired by blueprintjs
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
	resetError,
	shipping,
	setError,
	error,
	currentOrder,
}) => {
	const navigate = useNavigate();

	// to handle set date rang of shipping
	const [value, setValue] = React.useState(null);
	const [pickupDateModalIsOpen, setPickupDateModalIsOpen] = useState(false);

	const handleClosePickupDateModal = () => {
		setPickupDateModalIsOpen(false);
		setValue(null);
		resetError();
	};

	// handle shipping status
	const [shippingStatus, setShippingStatus] = useState("");
	const handleOnChange = (e) => {
		setShippingStatus(e.target.value);
	};

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// To handle update order Status
	const [updateOrderStatus, { isLoading }] = useUpdateOrderStatusMutation();
	const handleUpdateOrderStatus = async () => {
		setLoadingTitle("جاري تعديل حالة الطلب");
		resetError();

		// Data that send to API
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("status", shippingStatus);
		formData.append("city", shipping?.city);
		formData.append("district", shipping?.district);
		formData.append("street_address", shipping?.address);
		formData.append("pickup_date", JSON.stringify(value?.getTime()));

		try {
			const response = await updateOrderStatus({
				id,
				body: formData,
			});

			console.log(response);
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
		currentOrder?.orders?.status !== "طلب مندوب لتسليم الشحنة" && (
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
														"طلب مندوب لتسليم الشحنة" ||
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
												onChange={(e) => {
													handleOnChange(e);
												}}>
												<FormControlLabel
													value='ready'
													className='mb-2'
													control={<BpRadio />}
													sx={formControlLabelStyle}
													onClick={() => {
														if (shippingStatus === "ready")
															handleUpdateOrderStatus();
													}}
													label='قيد التجهيز (يرجى ملء بيانات الشحنة أولاً)'
													disabled={
														isLoading ||
														currentOrder?.orders?.status === "قيد التجهيز" ||
														currentOrder?.orders?.status ===
															"طلب مندوب لتسليم الشحنة" ||
														currentOrder?.orders?.status === "ملغي"
													}
												/>

												<FormControlLabel
													className='mb-2'
													control={<BpRadio />}
													label='طلب مندوب لتسليم الشحنة'
													value='delivery_in_progress'
													sx={formControlLabelStyle}
													onClick={() =>
														setPickupDateModalIsOpen(
															currentOrder?.orders?.status === "جديد" ||
																currentOrder?.orders?.status ===
																	"طلب مندوب لتسليم الشحنة" ||
																currentOrder?.orders?.status === "ملغي"
																? false
																: true
														)
													}
													disabled={
														isLoading ||
														currentOrder?.orders?.status === "جديد" ||
														currentOrder?.orders?.status ===
															"طلب مندوب لتسليم الشحنة" ||
														currentOrder?.orders?.status === "ملغي"
													}
												/>

												{currentOrder?.orders?.status ===
													"طلب مندوب لتسليم الشحنة" ||
												currentOrder?.orders?.status === "ملغي" ? null : (
													<FormControlLabel
														value='canceled'
														control={<BpRadio />}
														onClick={() => {
															if (shippingStatus === "canceled")
																handleUpdateOrderStatus();
														}}
														sx={formControlLabelStyle}
														label=' إلغاء الشحنة (إلغاء الطلب بالكامل) '
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
