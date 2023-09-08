import React, { useContext } from "react";

//
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

// this file contain all custom styles
import "./TextEditor.css";

// import context
import { TextEditorContext } from "../../Context/TextEditorProvider";

const TextEditor = () => {
	// To set the editor value
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	return (
		<div style={{ width: "100%" }}>
			<CKEditor
				editor={ClassicEditor}
				config={{ language: "ar" }}
				onChange={(event, editor) => {
					const data = editor.getData();

					setEditorValue(data);
					console.log(editorValue);
				}}
			/>
		</div>
	);
};

export default TextEditor;
