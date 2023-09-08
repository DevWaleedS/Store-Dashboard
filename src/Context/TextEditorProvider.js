import React, { useState } from "react";

export const TextEditorContext = React.createContext({});

const TextEditorProvider = (props) => {
	const [editorValue, setEditorValue] = useState("محتوي الصفحه");

	const editorContent = {
		editorValue,
		setEditorValue,
	};

	return (
		<TextEditorContext.Provider value={editorContent}>
			{props.children}
		</TextEditorContext.Provider>
	);
};

export default TextEditorProvider;
