import React from "react";
import { useDropzone } from "react-dropzone";

const DropCSVFiles = ({ handleFile, fileError, file }) => {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		onDrop: (acceptedFiles) => {
			handleFile(
				acceptedFiles?.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	return (
		<>
			<div
				{...getRootProps({ className: "dropzone" })}
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}>
				<input {...getInputProps()} />
				<ul className='text-overflow' style={{ margin: "0" }}>
					{file?.name || <p>Drop CSV file</p>}
				</ul>
				<div className='fs-6 text-danger'>{fileError && fileError}</div>
			</div>
		</>
	);
};

export default DropCSVFiles;
