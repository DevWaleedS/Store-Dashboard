// React and React DOM
import React, { useContext, useState, useEffect, Fragment } from "react";
import ReactDom from "react-dom";

// Third-party libraries
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

// Context
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeMaintenanceModeModal } from "../store/slices/MaintenanceModeModal";

// MUI
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button, Switch } from "@mui/material";

// Icons
import { RiText } from "react-icons/ri";
import { AiOutlineCloseCircle } from "react-icons/ai";

// Component
import CircularLoading from "../HelperComponents/CircularLoading";

// RTK Query
import {
	useGetMaintenanceModeDataQuery,
	useUpdateMaintenanceModeMutation,
} from "../store/apiSlices/maintenanceModeApi";

// Styles
const style = {
	position: "fixed",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 1024,
	maxWidth: "90%",
	borderRadius: 8,
	backgroundColor: "#fff",
	boxShadow: 24,
	p: 0,
	"@media(max-width:768px)": {
		top: "50%",
	},
};

const switchStyle = {
	"& .MuiSwitch-track": {
		width: 32,
		height: 18,
		opacity: 1,
		borderRadius: 8,
		backgroundColor: "rgba(0,0,0,.25)",
		boxSizing: "border-box",
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		width: 14,
		height: 14,
		borderRadius: 5,
		transform: "translate(8px,6px)",
		color: "#fff",
	},
	"&:hover": {
		"& .MuiSwitch-thumb": {
			boxShadow: "none",
		},
	},
	"& .MuiSwitch-switchBase": {
		padding: 1,
		"&.Mui-checked": {
			transform: "translateX(14px)",
			color: "#fff",
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#3AE374",
			},
		},
	},
};

const MaintenanceModeModal = () => {
	const Z_index = useContext(Context);

	const { setNavbarZindex } = Z_index;
	const { data: maintenancesMode, isLoading } =
		useGetMaintenanceModeDataQuery();

	const { isOpenMaintenanceModeModal } = useSelector(
		(state) => state.MaintenanceModeModal
	);

	const [maintenanceStatus, setMaintenanceStatus] = useState(false);
	const [maintenanceModeValue, setMaintenanceModeValue] = useState({
		title: "",
		message: "",
	});
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const dispatch = useDispatch(false);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: { title: "", message: "" },
	});
	const [dataError, setDataError] = useState({ title: "", message: "" });

	const resetDataError = () => {
		setDataError({ title: "", message: "" });
	};

	useEffect(() => {
		if (maintenancesMode) {
			setMaintenanceModeValue({
				title: maintenancesMode[0]?.title,
				message: maintenancesMode[0]?.message,
			});
			setMaintenanceStatus(
				maintenancesMode[0]?.status === "نشط" ? true : false
			);
		}
	}, [maintenancesMode]);

	useEffect(() => {
		reset(maintenanceModeValue);
	}, [maintenanceModeValue, reset]);

	const [UpdateMaintenanceMode] = useUpdateMaintenanceModeMutation();

	const handleUpdateMaintenanceMode = async (data) => {
		setLoadingTitle("جاري تعديل وضع الصيانة");
		resetDataError();
		let formData = new FormData();
		formData.append("title", data?.title);
		formData.append("message", data?.message);
		formData.append(
			"status",
			maintenanceStatus === true ? "active" : "not_active"
		);

		try {
			const response = await UpdateMaintenanceMode({ body: formData });
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				setNavbarZindex(false);
				dispatch(closeMaintenanceModeModal());
			} else {
				setLoadingTitle("");
				setNavbarZindex(false);
				setDataError({
					...dataError,
					title: response?.data?.message?.en?.title?.[0],
					message: response?.data?.message?.en?.message?.[0],
				});
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{ theme: "light" }
				);
				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error changing UpdateMaintenanceMode:", error);
		}
	};

	return (
		<section className='maintenance-page p-3'>
			<div className='row'>
				<div className='modal maintenance-modal'>
					<Modal
						aria-labelledby='transition-modal-title'
						aria-describedby='transition-modal-description'
						open={isOpenMaintenanceModeModal}
						onClose={() => {
							setNavbarZindex(false);
							dispatch(closeMaintenanceModeModal());
						}}
						closeAfterTransition>
						<Fade in={isOpenMaintenanceModeModal}>
							{isLoading ? (
								<CircularLoading />
							) : (
								<div style={style}>
									<form onSubmit={handleSubmit(handleUpdateMaintenanceMode)}>
										<div className='maintenance-modal-header d-flex justify-content-between align-items-center'>
											<span> وضع الصيانة</span>
											<AiOutlineCloseCircle
												onClick={() => {
													setNavbarZindex(false);
													dispatch(closeMaintenanceModeModal());
												}}
											/>
										</div>
										<div className='maintenance-modal-body'>
											<div className='row mx-0 mb-4'>
												<div className='modal-body-header d-flex flex-md-row flex-column-reverse justify-content-between align-items-center'>
													<div>
														<h5 className='mb-2'>وضع الصيانة</h5>
														<p className='modal-desc'>
															عند تفعيل وضع الصيانة ستتمكن لوحدك من الدخول
															للمتجر ،والعمل على تجهيزه، ستظهر للعملاء صفحة
															الصيانة للاطلاع عليها قم بالدخول إلى متجرك من
															متصفح آخر أو بتسجيل الخروج من لوحة التحكم
														</p>
													</div>
												</div>
											</div>
											<div className='row maintenance-modal-form mx-0'>
												<div className='col-12 mb-3'>
													<Switch
														name='status'
														onChange={(e) => {
															setMaintenanceStatus(e.target.checked);
														}}
														checked={maintenanceStatus}
														className='d-flex mx-auto'
														sx={switchStyle}
													/>
												</div>
												<div className='col-12 mb-3'>
													<div className='modal-input-group'>
														<label htmlFor='maintenance-title-input'>
															عنوان وضع الصيانة
														</label>
														<div className='modal-input-icon'>
															<span>
																<RiText />
															</span>
														</div>
														<input
															name='title'
															type='text'
															id='maintenance-title-input'
															placeholder='المتجر مغلق مؤقتاََ للصيانة'
															{...register("title", {
																required: "حقل العنوان مطلوب",
																pattern: {
																	value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
																	message:
																		" العنوان يجب أن يكون نصاً ولا يحتوي على حروف خاصه مثل الأقوس والرموز",
																},
															})}
														/>
														<br />
														<span className='fs-6 text-danger'>
															{dataError?.title}
															{errors?.title && errors.title.message}
														</span>
													</div>
												</div>
												<div className='col-12'>
													<div className='modal-input-group'>
														<label htmlFor='maintenance-message'>
															الرسالة النصية للعملاء
														</label>
														<div className='modal-input-icon'>
															<span>
																<RiText />
															</span>
														</div>
														<textarea
															name='message'
															id='maintenance-message'
															placeholder='نص الرسالة التي ستظهر للعملاء'
															{...register("message", {
																required: "حقل الرسالة مطلوب",
															})}
														/>
														<br />
														<span className='fs-6 text-danger'>
															{dataError?.message}
															{errors?.message && errors.message.message}
														</span>
													</div>
												</div>
											</div>
										</div>
										<div className='maintenance-modal-footer'>
											<div className='col-12'>
												<div className='modal-input-button d-flex justify-content-center'>
													<Button className='next-btn' type='submit'>
														حفظ
													</Button>
												</div>
											</div>
										</div>
									</form>
								</div>
							)}
						</Fade>
					</Modal>
				</div>
			</div>
		</section>
	);
};

const MaintenanceMode = () => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<MaintenanceModeModal />,
				document.getElementById("maintenance_mode_modal")
			)}
		</Fragment>
	);
};

export default MaintenanceMode;
