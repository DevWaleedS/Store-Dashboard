import moment from "moment-with-locales-es6";

const DateAndTimeFormatter = ({ date }) => {
	const calcPassedMinutes = (date1, date2) =>
		Math.round(Math.abs(date2 - date1) / (1000 * 60));

	const currentMinutes = calcPassedMinutes(+new Date(), +new Date(date));

	if (currentMinutes < 1) {
		return "الآن";
	} else if (currentMinutes === 1) {
		return "منذ دقيقة";
	} else if (currentMinutes === 2) {
		return "منذ دقيقتين";
	} else if (currentMinutes <= 10) {
		return `منذ ${currentMinutes} دقائق`;
	} else if (currentMinutes < 60 && currentMinutes >= 11) {
		return `منذ ${currentMinutes} دقيقة`;
	} else if (currentMinutes === 60) {
		return "منذ ساعة";
	} else if (currentMinutes === 120) {
		return "منذ ساعتين";
	} else if (currentMinutes < 1440) {
		let hours = Math.floor(currentMinutes / 60);
		let min = currentMinutes % 60;
		if (hours === 1) {
			return `منذ ساعة و ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
		} else if (hours === 2) {
			return `منذ  و ساعتين ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
		} else if (hours <= 10) {
			return `منذ ${hours} ساعات و ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
		} else {
			return `منذ ${hours} ساعة و ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
		}
	}

	const currentDate = Math.round(currentMinutes / 60 / 24);

	if (currentDate === 1) {
		return "أمس، الساعة " + moment(date).locale("ar").format(" h:mm a");
	} else if (currentDate === 2) {
		return " منذ يومين، الساعة" + moment(date).locale("ar").format(" h:mm a");
	} else if (currentDate <= 7) {
		return (
			`منذ ${currentDate}  أيام، الساعة` +
			moment(date).locale("ar").format(" h:mm a")
		);
	}

	return moment(date).locale("ar").format("D MMMM YYYY");
};

export default DateAndTimeFormatter;
