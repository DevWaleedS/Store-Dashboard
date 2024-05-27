import React, { useContext } from "react";
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
	currentOrder,
}) => {
	const navigate = useNavigate();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// To handle update order Status
	const [updateOrderStatus] = useUpdateOrderStatusMutation();
	const handleUpdateOrderStatus = async (status) => {
		setLoadingTitle("جاري تعديل حالة الطلب");
		resetError();

		// Data that send to API
		let data = {
			status: status,
		};

		if (status === "ready" || status === "canceled") {
			data.district = shipping?.district;
			data.city = shipping?.city;
			data.street_address = shipping?.address;
		}

		try {
			const response = await updateOrderStatus({
				id,
				body: data,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				navigate("/Orders");
				setLoadingTitle("");
			} else {
				setLoadingTitle("");
				setError({
					district: response?.data?.message?.en?.district?.[0] || "",
					city: response?.data?.message?.en?.city?.[0] || "",
					address: response?.data?.message?.en?.street_address?.[0] || "",
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
												currentOrder?.orders?.status === "تم الشحن" ||
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
											"&.MuiFormControl-root": {
												width: "100%",
											},
											"&.MuiFormControlLabel-root": {
												width: "100%",
												backgroundColor: "red",
											},
										}}>
										<RadioGroup
											aria-labelledby='demo-radio-buttons-group-label'
											name='radio-buttons-group'>
											<FormControlLabel
												value='ready'
												className='mb-2'
												control={<BpRadio />}
												onClick={() => handleUpdateOrderStatus("ready")}
												sx={formControlLabelStyle}
												label='قيد التجهيز (يرجى ملء بيانات الشحنة أولاً)'
												disabled={
													currentOrder?.orders?.status === "قيد التجهيز" ||
													currentOrder?.orders?.status === "تم الشحن" ||
													currentOrder?.orders?.status === "ملغي"
												}
											/>

											<FormControlLabel
												className='mb-2'
												label='تم الشحن'
												control={<BpRadio />}
												onClick={() =>
													handleUpdateOrderStatus("delivery_in_progress")
												}
												sx={formControlLabelStyle}
												value='delivery_in_progress'
												disabled={
													currentOrder?.orders?.status === "جديد" ||
													currentOrder?.orders?.status === "تم الشحن" ||
													currentOrder?.orders?.status === "ملغي"
												}
											/>
											<FormControlLabel
												value='canceled'
												control={<BpRadio />}
												onClick={() => handleUpdateOrderStatus("canceled")}
												sx={formControlLabelStyle}
												label=' إلغاء الشحنة (إلغاء الطلب بالكامل) '
												disabled={
													currentOrder?.orders?.status === "تم الشحن" ||
													currentOrder?.orders?.status === "ملغي"
												}
											/>
										</RadioGroup>
									</FormControl>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		)
	);
};

export default SelectShippingStatus;
