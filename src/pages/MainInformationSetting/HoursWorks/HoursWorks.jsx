import React, { useContext } from "react";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Icons
import { AiOutlineCloseCircle } from "react-icons/ai";

// Context
import Context from "../../../Context/context";

// -------------------------------------------------------------

/* Modal Styles */
const ModalStyle = {
	position: "absolute",
	top: "90px",
	left: "50%",
	transform: "translate(-50%, 0%)",
	width: "750px",
	maxWidth: "90%",
	paddingBottom: "30px",

	"@media(max-width:768px)": {
		position: "absolute",
		top: "10px",

		maxWidth: "95%",
	},
};

const HoursWorks = ({
	worksDaysData,
	setWorkDays,
	setOpenHoursWork,
	openHoursWork,
	workDays,
}) => {
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

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

	return (
		<Modal
			open={openHoursWork}
			aria-labelledby='modal-modal-title'
			aria-describedby='modal-modal-description'>
			<Box component={"div"} sx={ModalStyle}>
				<div className='d-flex flex-row align-items-center justify-content-between p-3 p-md-4 work-hours-head'>
					<h6 style={{ color: "#F7FCFF" }}>ساعات العمل</h6>
					<AiOutlineCloseCircle
						onClick={() => {
							setOpenHoursWork(false);

							setWorkDays(worksDaysData);
						}}
						style={{
							color: "#ffffff",
							width: "22px",
							height: "22px",
							cursor: "pointer",
						}}
					/>
				</div>
				<div className='text-center work-hours-wrapper'>
					{workDays?.map((day, index) => (
						<div
							key={index}
							className='work-day d-flex flex-sm-row flex-column align-items-center justify-content-between px-3 py-2 gap-3'>
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
										disabled={day?.status !== "active"}
									/>
								</div>
								<div className='time-input'>
									<input
										value={day?.to}
										onChange={(e) => updateToTime(index, e.target.value)}
										type='time'
										style={{ color: "#000000" }}
										disabled={day?.status !== "active"}
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
						className='w-100 save-work-hours'>
						حفظ ساعات العمل
					</button>
				</div>
			</Box>
		</Modal>
	);
};

export default HoursWorks;
