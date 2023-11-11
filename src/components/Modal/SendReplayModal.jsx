import React, { useContext } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import Context from "../../Context/context";
import { useDispatch, useSelector } from "react-redux";
import { closeReplyModal } from "../../store/slices/ReplyModal-slice";

import { Editor } from "react-draft-wysiwyg";
import { EditorState, convertToRaw } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { FiSend } from "react-icons/fi";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";

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
	borderRadius: "0px 8px",
	whiteSpace: "normal",
	fontSize: "20px",
	fontWight: 500,
	color: "#011723",
};

const SendReplayModal = ({ commentDetails, reload, setReload }) => {
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const { isOpenReplyModal } = useSelector((state) => state.ReplyModal);
	const dispatch = useDispatch(false);

	const [description, setDescription] = useState({
		htmlValue: "",
		editorState: EditorState.createEmpty(),
	});

	const onEditorStateChange = (editorValue) => {
		const editorStateInHtml = draftToHtml(
			convertToRaw(editorValue.getCurrentContent())
		);

		setDescription({
			htmlValue: editorStateInHtml,
			editorState: editorValue,
		});
	};

	// Handle errors
	const [messageError, serMessageError] = useState("");

	// to send Replay Comment
	const sendReplayComment = () => {
		serMessageError("");
		let formData = new FormData();
		formData.append("comment_text", description?.htmlValue);
		formData.append("comment_id", commentDetails?.id);

		axios
			.post(`https://backend.atlbha.com/api/Store/replaycomment`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					dispatch(closeReplyModal());
					setReload(!reload);
				} else {
					serMessageError(res?.data?.message?.en?.comment_text?.[0]);
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
										{commentDetails?.user?.email}{" "}
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
								<div className='d-flex flex-row align-items-center gap-4  py-4'>
									<Editor
										className='text-black '
										toolbarHidden={false}
										editorState={description.editorState}
										onEditorStateChange={onEditorStateChange}
										inDropdown={true}
										placeholder={
											<div className='d-flex flex-column  '>
												<p
													style={{
														fontSize: "20px",
														fontWeight: "500",
														color: "#011723",
													}}>
													{" "}
													شكراً أسيل{" "}
												</p>
												<p
													style={{
														fontSize: "20px",
														fontWeight: "500",
														color: "#011723",
													}}>
													{" "}
													سعداء بتسوقك من متجرنا{" "}
												</p>
											</div>
										}
										editorClassName='demo-editor'
										toolbar={{
											options: ["inline", "textAlign", "image", "list"],
											inline: {
												options: ["bold"],
											},
											list: {
												options: ["unordered", "ordered"],
											},
										}}
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
							onClick={() => dispatch(closeReplyModal())}
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

export default SendReplayModal;
