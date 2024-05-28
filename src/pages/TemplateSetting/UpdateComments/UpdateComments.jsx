import React, { useContext, useEffect, useState } from "react";

// Third party
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Icons
import { BsArrowLeft } from "react-icons/bs";
import { CommentIcon } from "../../../data/Icons";

// Context
import { LoadingContext } from "../../../Context/LoadingProvider";

// MUI
import { Button, FormControl, Switch } from "@mui/material";

// RTK Query
import { useUpdateClientsCommentsMutation } from "../../../store/apiSlices/templateSettingApi";

const UpdateComments = ({ Comments, loading }) => {
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// comment status
	const [commentStatus, setCommentStatus] = useState(true);
	const [clientStatus, setClientStatus] = useState(true);

	useEffect(() => {
		if (Comments) {
			// set comment status
			setCommentStatus(Comments[0]?.commentstatus === "active" ? true : false);
			// set client status
			setClientStatus(Comments[0]?.clientstatus === "active" ? true : false);
		}
	}, [Comments]);

	// handle  Update comments function

	const [updateClientsComments] = useUpdateClientsCommentsMutation();

	const handleUupdateClientsComments = async () => {
		setLoadingTitle("جاري تعديل التعليقات والعملاء");

		// data that send to api
		let formData = new FormData();
		formData.append("commentstatus", commentStatus ? "active" : "not_active");
		formData.append("clientstatus", clientStatus ? "active" : "not_active");

		// make request...
		try {
			const response = await updateClientsComments({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
			} else {
				setLoadingTitle("");

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
			console.error("Error changing updateClientsComments:", error);
		}
	};
	return (
		<div className='seo-weight-edit-box template-edit-box '>
			<div className='title d-flex flex-md-row flex-column justify-content-between align-items-md-center flex-wrap gap-4'>
				<h4>
					التعليقات والعملاء
					<span> (تستطيع تفعيل وتعطيل العملاء المميزون والتعليقات )</span>
				</h4>
				<div className='view-more-btn mx-md-4 mt-md-0 mt-3'>
					<Link to='/Rating' variant='contained'>
						<span>عرض التفاصيل</span>
						<BsArrowLeft className='me-2' />
					</Link>
				</div>
			</div>

			<FormControl variant='standard' className='edit-robot-teat-area py-4'>
				<div className='row'>
					<div className='col-12 p-4'>
						<div className='input-bx'>
							<div className='switch-widget d-flex justify-content-between align-items-center'>
								<div className='widget-text'>
									<CommentIcon />
									<span className='me-3'> تعليقات العملاء</span>
								</div>
								<div className='switch-btn'>
									<Switch
										onChange={() => setCommentStatus(!commentStatus)}
										sx={{
											width: "35px",
											padding: 0,
											height: "20px",
											borderRadius: "0.75rem",
											"& .MuiSwitch-thumb": {
												width: "12px",
												height: "12px",
											},
											"& .MuiSwitch-switchBase": {
												padding: "0",
												top: "4px",
												left: "4px",
											},
											"& .MuiSwitch-switchBase.Mui-checked": {
												left: "-4px",
											},
											"& .Mui-checked .MuiSwitch-thumb": {
												backgroundColor: "#FFFFFF",
											},
											"& .MuiSwitch-track": {
												height: "100%",
											},
											"&.MuiSwitch-root .Mui-checked+.MuiSwitch-track": {
												backgroundColor: "#3AE374",
												opacity: 1,
											},
										}}
										checked={commentStatus}
									/>
								</div>
							</div>
						</div>
					</div>

					<div className='col-12 p-4'>
						<div className='btn-bx '>
							<Button
								disabled={loading}
								onClick={() => handleUupdateClientsComments()}
								variant='contained'>
								حفظ
							</Button>
						</div>
					</div>
				</div>
			</FormControl>
		</div>
	);
};

export default UpdateComments;
