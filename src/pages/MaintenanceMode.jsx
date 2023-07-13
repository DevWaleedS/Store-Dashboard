import React, { useContext, useState, useEffect, Fragment } from "react";
import ReactDom from "react-dom";
import axios from "axios";
import Context from "../Context/context";
import useFetch from "../Hooks/UseFetch";
import { useDispatch, useSelector } from "react-redux";
import { closeMaintenanceModeModal } from "../store/slices/MaintenanceModeModal";

import { AiOutlineCloseCircle } from "react-icons/ai";
import Backdrop from "@mui/material/Backdrop";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Fade from "@mui/material/Fade";
import { Button, Switch } from "@mui/material";
import { useCookies } from "react-cookie";

// Import ICONS
import { ReactComponent as TextIcon } from "../data/Icons/icon-24-format text right.svg";
import { RiText } from "react-icons/ri";
import { useForm } from "react-hook-form";
import { LoadingContext } from "../Context/LoadingProvider";

const style = {
	position: "fixed",
	top: "55%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 1024,
	maxWidth: "90%",
	borderRadius: 2,
	backgroundColor: "#fff",
	boxShadow: 24,
	p: 0,
	marginBottom: "200px",
	"@media(max-width:768px)": {
		top: "50%",
	},
};

const MaintenanceModeModal = () => {
	const [cookies] = useCookies(["access_token"]);
	const { fetchedData, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/maintenance"
	);

	const title = fetchedData?.data?.Maintenances.map((item) => item.title);
	const message = fetchedData?.data?.Maintenances.map((item) => item.message);
	const status = fetchedData?.data?.Maintenances.map((item) => item.status);
	// create video modal function
	const { isOpenMaintenanceModeModal } = useSelector(
		(state) => state.MaintenanceModeModal
	);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
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
		defaultValues: {
			title: "",
			message: "",
		},
	});
	const [maintenanceModeValue, setMaintenanceModeValue] = useState({
		title: "",
		message: "",
	});
	const [dataError, setDataError] = useState({
		title: "",
		message: "",
	});
	const resetDataError = () => {
		setDataError({
			title: "",
			message: "",
		});
	};
	const [maintenanceStatus, setMaintenanceStatus] = useState();

	// to set all data info from api
	useEffect(() => {
		if (fetchedData?.data?.Maintenances) {
			setMaintenanceModeValue({
				title: title,
				message: message,
			});
			setMaintenanceStatus(status[0] === "نشط" ? true : false);
		}
	}, [fetchedData?.data?.Maintenances]);

	useEffect(() => {
		reset(maintenanceModeValue);
	}, [maintenanceModeValue, reset]);

	// to update UpdateMaintenanceMode values
	const UpdateMaintenanceMode = (data) => {
		setLoadingTitle("جاري تعديل وضع الصيانة");
		resetDataError();
		let formData = new FormData();
		formData.append("title", data?.title);
		formData.append("message", data?.message);
		formData.append(
			"status",
			maintenanceStatus === true ? "active" : "not_active"
		);

		axios
			.post(
				`https://backend.atlbha.com/api/Store/updateMaintenance`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${cookies.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					dispatch(closeMaintenanceModeModal());
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setReload(!reload);
					setDataError({
						...dataError,
						title: res?.data?.message?.en?.title?.[0],
						message: res?.data?.message?.en?.message?.[0],
					});
				}
			});
	};

	return (
		<section className='maintenance-page p-3'>
			{/** Modal  */}
			<div className='row'>
				<div className='modal maintenance-modal'>
					<Modal
						aria-labelledby='transition-modal-title'
						aria-describedby='transition-modal-description'
						open={isOpenMaintenanceModeModal}
						onClose={() => {
							dispatch(closeMaintenanceModeModal());
						}}
						closeAfterTransition
						BackdropComponent={Backdrop}
						BackdropProps={{
							timeout: 500,
						}}>
						<Fade in={isOpenMaintenanceModeModal}>
							<Box sx={style}>
								<form onSubmit={handleSubmit(UpdateMaintenanceMode)}>
									<div className='maintenance-modal-header d-flex justify-content-between align-items-center'>
										<span> وضع الصيانة</span>
										<AiOutlineCloseCircle
											onClick={() => {
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
														عد تفعيل وضع الصيانة ستتمكن لوحدك من الدخول للمتجر
														والعمل على تجهيزه، ستظهر للعملاء صفحة الصيانة
														للاطلاع عليها قم بالدخول على متجرك من متصفح آخر أو
														بتسجيل الخروج من لوحة التحكم
													</p>
												</div>
												<Switch
													name='status'
													onChange={() => {
														setMaintenanceStatus(!maintenanceStatus);
													}}
													checked={maintenanceStatus}
													className='d-flex align-self-start mb-md-2 mb-3 mx-md-0 mx-auto'
													sx={{
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
													}}
												/>
											</div>
										</div>
										<div className='row maintenance-modal-form mx-0'>
											<div className='col-12 mb-3'>
												<div className='modal-input-group'>
													<label htmlFor=' maintenance-title-input'>
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
															required: "The title field is required",
															pattern: {
																value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
																message: "The title must be a string",
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
											<div className='col-12 mb-4'>
												<div className='modal-input-group'>
													<label htmlFor='maintenance-message'>
														الرسالة النصية للعملاء
													</label>
													<div className='modal-input-icon'>
														<span>
															<TextIcon />
														</span>
													</div>

													<textarea
														onResize={false}
														id='maintenance-message'
														placeholder='نص الرسالة التي ستظهر للعملاء'
														name='message'
														{...register("message", {
															required: "The message field is required",
														})}></textarea>
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
							</Box>
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
