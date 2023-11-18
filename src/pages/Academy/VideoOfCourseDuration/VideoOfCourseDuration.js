import React from "react";

const VideoOfCourseDuration = ({ duration }) => {
	// To check the hour, minutes, and seconds
	const [hours, minutes, seconds] = duration?.split(":");

	// Convert hours, minutes, and seconds values to integers
	const hoursValue = parseInt(hours, 10);
	const minutesValue = parseInt(minutes, 10);
	const secondsValue = parseInt(seconds, 10);

	// Generate the formatted duration string
	let formattedDuration = "";

	// Handle hours
	if (hoursValue > 0) {
		formattedDuration += `${
			hoursValue === 1
				? "ساعة"
				: hoursValue === 2
				? "ساعتين"
				: hoursValue <= 10
				? `ساعات ${hoursValue}`
				: `ساعة ${hoursValue}`
		} `;
	}

	// Handle minutes
	if (minutesValue > 0) {
		formattedDuration += `${formattedDuration ? "و " : ""} ${
			minutesValue <= 9 ? `${minutesValue} دقائق` : `${minutesValue} دقيقة`
		}  `;
	}

	// Handle seconds
	if (secondsValue > 0) {
		formattedDuration += `${formattedDuration ? "و " : ""}${
			secondsValue <= 10 ? `${secondsValue} ثواني` : `${secondsValue} ثانية`
		}  `;
	}

	return <>{formattedDuration}</>;
};

export default VideoOfCourseDuration;
