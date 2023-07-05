import React from 'react';
import { useDropzone } from 'react-dropzone';

const DropCSVFiles = ({ handleFile,fileError,file }) => {
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone(
		{
			onDrop: (acceptedFiles) => {
				handleFile(
					acceptedFiles.map((file) =>
						Object.assign(file, {
							preview: URL.createObjectURL(file),
						})
					)
				);
			},
		}
	);

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	return (
		<>
			<div {...getRootProps({ className: 'dropzone' })}>
				<input {...getInputProps()} />
				<ul>{file?.name || <p>Drop CSV file</p>}</ul>
			</div>
			<br />
			<span className='fs-6 text-danger'>{fileError && fileError}</span>
		</>
	);
};

export default DropCSVFiles;
