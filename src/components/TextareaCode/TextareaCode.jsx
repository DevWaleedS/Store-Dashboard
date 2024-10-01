import React from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-markup";
require("prismjs/components/prism-jsx");

function TextareaCode({ value, setValue, placeholder }) {
	return (
		<Editor
			padding={10}
			value={value}
			placeholder={placeholder}
			onValueChange={(value) => setValue(value)}
			highlight={(value) => highlight(value, languages.js)}
			style={{
				fontFamily: '"Fira code", "Fira Mono", monospace',
				fontSize: 16,
			}}
		/>
	);
}

export default TextareaCode;
