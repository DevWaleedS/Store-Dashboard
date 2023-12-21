import React, { useContext, useState } from "react";

// Third party
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { TextEditorContext } from "../../Context/TextEditorProvider";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { closeReplyModal } from "../../store/slices/ReplyModal-slice";

// Icons
import { FiSend } from "react-icons/fi";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Components
import { TextEditor } from "../TextEditor";

const style = {
	position: "absolute",
	top: "56%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 966,
	maxWidth: "90%",
	bgcolor: "#FAFAFA",
	borderRadius: "16px",
	boxShadow: 24,
};

const headingStyle = {
	width: "100%",
	height: "70px",
	background: "#1DBBBE",
	borderRadius: "16px 16px 0px 0px",
	fontSize: "20px",
	fontWeight: 500,
	color: "#ECFEFF",
};

const contentStyles = {
	width: "100%",
	height: "64px",
	background: "#F4F5F7",
	border: "1px solid #67747B33",

	whiteSpace: "normal",
};

const SendSupportReplayModal = ({ supportDetails, reload, setReload }) => {
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	const { isOpenReplyModal } = useSelector((state) => state.ReplyModal);
	const dispatch = useDispatch(false);
	const navigate = useNavigate();

	const resetsMessage = () => {
		setEditorValue(null);
	};

	// Handle errors
	const [messageError, serMessageError] = useState("");

	// to send Replay Comment
	const sendReplayComment = () => {
		serMessageError("");
		let formData = new FormData();
		formData.append("replay_text", editorValue);
		formData.append("technical_support_id", supportDetails?.id);

		axios
			.post(
				`https://backend.atlbha.com/api/Store/replayTechnicalSupport`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${localStorage.getItem("store_token")}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					dispatch(closeReplyModal());
					setReload(!reload);
					resetsMessage();
					navigate("Support");
				} else {
					serMessageError(res?.data?.message?.en?.replay_text?.[0]);

					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.replay_text?.[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<div className='send-replay-modal' open={isOpenReplyModal}>
			<Modal
				onClose={() => dispatch(closeReplyModal())}
				open={isOpenReplyModal}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'>
				<Box component={"div"} sx={style}>
					<div className=''>
						<h3
							className='d-flex justify-content-center align-items-center '
							style={headingStyle}>
							ارسال رد
						</h3>
						<div>
							<div className=''>
								<p
									style={contentStyles}
									className='d-flex justify-content-start align-items-center mb-4 px-3'>
									إلى :
									<span style={{ color: "#67747B", marginRight: "14px" }}>
										{supportDetails?.user?.email}
									</span>
								</p>

								<div
									style={contentStyles}
									className='d-flex flex-row align-items-center gap-4 px-3 py-4'>
									<h2
										style={{
											fontSize: "20px",
											fontWeight: "500",
											color: "#011723",
										}}>
										نص الرسالة
									</h2>
								</div>
								<div className='d-flex flex-row align-items-center send-replay gap-4 pb-4'>
									<TextEditor
										ToolBar={"emptyCart"}
										placeholder={`نحن سعداء بتواصلك معنا يا ${supportDetails?.user?.name}.`}
									/>
								</div>
								{messageError && (
									<span className='fs-6 text-danger me-2'>{messageError}</span>
								)}
							</div>
						</div>
					</div>
					<div className='d-flex justify-content-center gap-4 mb-4 '>
						<button
							onClick={() => sendReplayComment()}
							style={{
								color: "#EFF9FF",
								fontSize: "24px",
								fontWight: 500,
								height: "56px",
								width: "163px",
								backgroundColor: "#02466A",
								borderRadius: " 8px",
							}}>
							<span style={{ marginLeft: "16px" }}>
								<FiSend
									style={{ color: "#EFF9FF", width: "18px", height: "18px" }}
								/>
							</span>
							<span className=''>ارسال</span>
						</button>
						<button
							onClick={() => {
								dispatch(closeReplyModal());
								resetsMessage();
							}}
							style={{
								color: "#02466A",
								fontSize: "24px",
								fontWight: 500,
								height: "56px",
								width: "163px",
								border: "1px solid #02466A",
								backgroundColor: "#02466A00",
								borderRadius: " 8px",
							}}>
							الغاء
						</button>
					</div>
				</Box>
			</Modal>
		</div>
	);
};

export default SendSupportReplayModal;
