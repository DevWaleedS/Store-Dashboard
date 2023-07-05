const CustomDate = (duration) => {
	const timeString = duration;
	const date = new Date();
	date.setHours(timeString.split(':')[0]);
	const hour = date.getHours(); 

	return hour;
};

export default CustomDate;
