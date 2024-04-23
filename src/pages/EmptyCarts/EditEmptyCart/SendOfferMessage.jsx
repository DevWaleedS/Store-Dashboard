import React, { useContext, useEffect } from "react";
import { TextEditorContext } from "../../../Context/TextEditorProvider";
import { TextEditor } from "../../../components/TextEditor";

// Content style
const contentStyles = {
	width: "100%",
	minWidth: "100%",
	height: "64px",
	background: "#F4F5F7",
	border: "1px solid #67747B33",
	borderRadius: "3px 3px 0px 0px",
	whiteSpace: "normal",
	fontSize: "20px",
	fontWight: 500,
	color: "#011723",
};
const SendOfferMessage = ({ currentCartData, errors }) => {
	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { setEditorValue } = editorContent;

	// To set discount_total
	useEffect(() => {
		if (currentCartData) {
			setEditorValue(currentCartData?.message || "");
		}
	}, [currentCartData]);

	return (
		<>
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
			<div className='d-flex flex-row align-items-center gap-4 empty-cart'>
				<TextEditor ToolBar={"emptyCart"} placeholder={"اكتب الرساله..."} />
			</div>
			{errors?.messageErr && (
				<div>
					<span className='fs-6 text-danger'>{errors?.messageErr}</span>
				</div>
			)}
		</>
	);
};

export default SendOfferMessage;
