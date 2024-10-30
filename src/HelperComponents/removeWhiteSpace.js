const removeWhiteSpace = (e) => {
	e.preventDefault();
	let pastedData = (e.clipboardData || window.clipboardData).getData("text");
	pastedData = pastedData.replace(/\s+/g, "");
	e.target.value = pastedData;
};

export default removeWhiteSpace;
