const FormatDateAsTimestamp = (date) => {
	const timestamp = date.getTime();
	const offset = date.getTimezoneOffset();
	const offsetHours = Math.abs(Math.floor(offset / 60))
		.toString()
		.padStart(2, "0");
	const offsetMinutes = Math.abs(offset % 60)
		.toString()
		.padStart(2, "0");
	const offsetSign = offset > 0 ? "-" : "+";

	return `${timestamp}${offsetSign}${offsetHours}${offsetMinutes}`;
};

export default FormatDateAsTimestamp;
