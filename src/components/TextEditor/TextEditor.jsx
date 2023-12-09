import React, { useRef, useEffect, useContext } from "react";
import Quill from "quill";

// Context
import { TextEditorContext } from "../../Context/TextEditorProvider";

// Css Styles
import "quill/dist/quill.snow.css";
import "./TextEditor.css";

const TextEditor = () => {
	const quillRef = useRef(null);

	const editorContent = useContext(TextEditorContext);
	const { setEditorValue, editorValue } = editorContent;

	console.log(editorValue);

	const toolbarOptions = [
		[{ header: [1, 2, 3, 4, 5, 6, false] }],
		["italic", "underline", "bold"],
		[{ color: [] }, { background: [] }],
		[{ align: [] }],
		[{ list: "ordered" }, { list: "bullet" }],
		["link", "image"],
	];

	useEffect(() => {
		const quill = new Quill(quillRef?.current, {
			theme: "snow",
			modules: {
				toolbar: toolbarOptions,
			},
			placeholder: "محتوي الصفحة...",
		});

		quill.on("text-change", () => {
			// Update the current editor value
			setEditorValue(quill.root.innerHTML);
		});

		// Optional: Set the initial editor content if available
		if (editorValue) {
			quill.root.innerHTML = editorValue;
		}

		return () => {
			quill.off("text-change");
		};
	}, []);

	return <div ref={quillRef} style={{ height: "400px", width: "100%" }} />;
};

export default TextEditor;
