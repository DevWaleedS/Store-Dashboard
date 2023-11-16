import react from "react";

const VideoOfCourseDuration = ({ duration }) => {
	// To check the hour ,secondes and minutes
	const [hours, minutes] = duration?.split(":");

	// Display hours, and minutes
	return (
		<>
			{parseInt(hours, 10) > 0 && `${hours} ساعة`}
			{parseInt(minutes, 10) > 0 && `${minutes} دقيقة `}
		</>
	);
};

export default VideoOfCourseDuration;
