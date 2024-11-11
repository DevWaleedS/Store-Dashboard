import React, { useContext, useEffect, useRef } from "react";
import ReactQuill from "react-quill";

// Context
import { TextEditorContext } from "../../Context/TextEditorProvider";

// Css Styles
import "./TextEditor.css";
import "react-quill/dist/quill.snow.css";

const TextEditor = ({ ToolBar, placeholder, readOnly }) => {
	const quillRef = useRef(null);
	const editorContent = useContext(TextEditorContext);
	const { setEditorValue, editorValue } = editorContent;

	useEffect(() => {
		quillRef.current?.focus();
	}, []);

	let toolbarOptions;
	if (ToolBar === "createOrEditPages") {
		toolbarOptions = [
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			[{ align: [] }],
			["italic", "underline", "bold"],
			[{ background: [] }, { color: [] }],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image"],
		];
	} else if (ToolBar === "product") {
		toolbarOptions = [
			["italic", "underline", "bold"],
			[{ align: [] }],
			[{ background: [] }, { color: [] }],
			[{ list: "ordered" }, { list: "bullet" }],
			["link"],
		];
	} else if (ToolBar === "emptyCart") {
		toolbarOptions = [
			["italic", "underline", "bold"],
			[{ list: "ordered" }, { list: "bullet" }],
			["link", "image"],
		];
	} else if (ToolBar === "evaluationThePlatform") {
		toolbarOptions = [["italic", "underline", "bold"]];
	} else if (ToolBar === "readOnly") {
		toolbarOptions = [];
	}

	return (
		<ReactQuill
			ref={quillRef}
			theme='snow'
			dir='rtl'
			readOnly={readOnly}
			placeholder={placeholder}
			value={editorValue}
			onChange={setEditorValue}
			modules={{ toolbar: toolbarOptions }}
		/>
	);
};

export default TextEditor;
