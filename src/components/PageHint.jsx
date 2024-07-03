import React from "react";

const PageHint = ({ flex, hint }) => {
	return (
		<div className={` ${flex} mb-5 option-info-label`}>
			<svg
				stroke='currentColor'
				fill='currentColor'
				stroke-width='0'
				viewBox='0 0 512 512'
				height='1em'
				width='1em'
				xmlns='http://www.w3.org/2000/svg'>
				<path d='M256 90c44.3 0 86 17.3 117.4 48.6C404.7 170 422 211.7 422 256s-17.3 86-48.6 117.4C342 404.7 300.3 422 256 422s-86-17.3-117.4-48.6C107.3 342 90 300.3 90 256s17.3-86 48.6-117.4C170 107.3 211.7 90 256 90m0-42C141.1 48 48 141.1 48 256s93.1 208 208 208 208-93.1 208-208S370.9 48 256 48z'></path>
				<path d='M277 360h-42V235h42v125zm0-166h-42v-42h42v42z'></path>
			</svg>
			<span>{hint}</span>
		</div>
	);
};

export default PageHint;
