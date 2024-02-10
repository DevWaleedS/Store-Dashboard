import React, { useContext } from "react";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Switch from "@mui/material/Switch";

// Components
import useFetch from "../../../Hooks/UseFetch";

// Icons
import { AiOutlineCloseCircle } from "react-icons/ai";

// Context
import Context from "../../../Context/context";

// -------------------------------------------------------------
const ModalStyle = {
	position: "absolute",
	top: "55%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: "900px",
	maxWidth: "90%",
	bgcolor: "#fff",
	border: "1px solid #707070",
	borderRadius: "16px",
	boxShadow: 24,
	"@media(max-width:768px)": {
		top: "75px",
		borderRadius: "8px",
		transform: "translate(-50%, 0%)",
	},
};

const contentStyle = {
	height: "550px",
	display: "flex",
	flexDirection: "column",
	gap: "18px",
	fontSize: "20px",
	fontWight: 400,
	letterSpacing: "0.2px",
	color: "#FFFFFF",
	padding: "30px 80px 20px",
	whiteSpace: "normal",
	overflowY: "auto",
	overflowX: "hidden",
};

const switchStyle = {
	width: "36px !important",
	height: "22px !important",
	padding: "0 !important",
	borderRadius: "20px !important",
	"& .MuiSwitch-track": {
		width: "36px !important",
		height: "22px !important",
		opacity: 1,
		backgroundColor: "rgba(0,0,0,.25)",
		boxSizing: "border-box",
		borderRadius: "20px !important",
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		width: "16px !important",
		height: "16px !important",
		borderRadius: "50% !important",
		transform: "translate(3px,3px) !important",
		color: "#fff",
	},

	"&:hover": {
		"& .MuiSwitch-thumb": {
			boxShadow: "none !important",
		},
	},

	"& .MuiSwitch-switchBase": {
		padding: "0px !important",
		top: "0px !important",
		left: "0px !important",
		"&.Mui-checked": {
			transform: "translateX(12px) !important",
			color: "#fff",
			"& + .MuiSwitch-track": {
				opacity: 1,
				backgroundColor: "#3AE374",
			},
		},
	},
};

const HoursWorks = ({
	setWorkDays,
	setOpenHoursWork,
	openHoursWork,
	setOpenAlawys,
	openAlawys,
	workDays,
}) => {
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// To show the store info that come from api
	const { fetchedData } = useFetch(
		"https://backend.atlbha.com/api/Store/setting_store_show"
	);
	const updateState = (index) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, i) => {
				if (index === i) {
					return {
						...obj,
						status: obj?.status === "active" ? "not_active" : "active",
					};
				}
				return obj;
			});

			return newState;
		});
	};

	const updateFromTime = (index, value) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, i) => {
				if (index === i) {
					return { ...obj, from: value };
				}
				return obj;
			});
			return newState;
		});
	};

	const updateToTime = (index, value) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, i) => {
				if (index === i) {
					return { ...obj, to: value };
				}
				return obj;
			});
			return newState;
		});
	};

	const updateAll = (value) => {
		setWorkDays((prevState) => {
			const newState = prevState.map((obj, index) => {
				return {
					...obj,
					status: fetchedData?.data?.setting_store?.workDays?.[index]?.status,
					from: fetchedData?.data?.setting_store?.workDays?.[index]?.from,
					to: fetchedData?.data?.setting_store?.workDays?.[index]?.to,
				};
			});
			return newState;
		});
	};
	return (
		<Modal
			open={openHoursWork}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box component={"div"} sx={ModalStyle}>
				<div
					className='d-flex flex-row align-items-center justify-content-between p-4'
					style={{ backgroundColor: "#1DBBBE", borderRadius: "8px" }}>
					<h6 style={{ color: "#F7FCFF" }}>ساعات العمل</h6>
					<AiOutlineCloseCircle
						onClick={() => {
							setOpenHoursWork(false);
							setOpenAlawys(
								fetchedData?.data?.setting_store?.working_status === "active"
									? true
									: false
							);
							setWorkDays(fetchedData?.data?.setting_store?.workDays);
						}}
						style={{
							color: "#ffffff",
							width: "22px",
							height: "22px",
							cursor: "pointer",
						}}
					/>
				</div>
				<div
					className='delegate-request-alert text-center'
					style={contentStyle}>
					<div
						className='d-flex flex-row align-items-center justify-content-center gap-3'
						style={{
							backgroundColor: !openAlawys ? "#011723" : "#ADB5B9",
							borderRadius: "8px",
							fontSize: "20px",
							padding: "14px",
						}}>
						<Switch
							onChange={(e) => {
								setOpenAlawys(!openAlawys);
								updateAll(e.target.checked);
							}}
							checked={!openAlawys}
							sx={switchStyle}
						/>
						مفتوح دائماً
					</div>
					{workDays?.map((day, index) => (
						<div
							key={index}
							className='work-day d-flex flex-sm-row flex-column align-items-center justify-content-between px-3 py-2 gap-3'
							style={{
								minWidth: "max-content",
								minHeight: "80px",
								backgroundColor: "#FFFFFF",
								boxShadow: "0px 3px 6px #0000000F",
								borderRadius: "8px",
							}}>
							<div className='d-flex flex-row align-items-center gap-3'>
								<span
									style={{
										minWidth: "100px",
										color: "#011723",
										fontSize: "18px",
										fontWeight: "500",
									}}>
									{day?.day?.name}
								</span>
								<button
									disabled={!openAlawys}
									onClick={() => updateState(index)}
									className='day-switch'
									style={{
										backgroundColor:
											day?.status === "active" ? "#3AE374" : "#ADB5B9",
									}}>
									{day?.status === "not_active" && <span>مغلق</span>}
									<p className='circle'></p>
									{day?.status === "active" && <span>مفتوح</span>}
								</button>
							</div>

							<div className='choose-time'>
								<div className='time-input'>
									<input
										value={day?.from}
										onChange={(e) => updateFromTime(index, e.target.value)}
										type='time'
										style={{ color: "#000000" }}
										disabled={!openAlawys || day?.status !== "active"}
									/>
								</div>
								<div className='time-input'>
									<input
										value={day?.to}
										onChange={(e) => updateToTime(index, e.target.value)}
										type='time'
										style={{ color: "#000000" }}
										disabled={!openAlawys || day?.status !== "active"}
									/>
								</div>
							</div>
						</div>
					))}

					<button
						onClick={() => {
							setEndActionTitle("تم حفظ تحديث ساعات العمل");
							setOpenHoursWork(false);
						}}
						style={{
							minHeight: "56px",
							color: "#fff",
							fontSize: "20px",
							fontWight: 500,
							backgroundColor: "#1DBBBE",
							borderRadius: " 8px",
						}}
						className='w-100'>
						حفظ ساعات العمل
					</button>
				</div>
			</Box>
		</Modal>
	);
};

export default HoursWorks;
