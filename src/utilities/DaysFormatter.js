// utils/DaysFormatter.js

/**
 * Formats a given number of days into a human-readable string.
 * @param {number} days - The number of days to format.
 * @returns {string} - The formatted string (e.g., "2 weeks", "3 months").
 */
const DaysFormatter = (days) => {
	let daysValue = Number(days);
	if (daysValue < 0) {
		return "الايام غير صحيحة";
	}

	if (daysValue === 0) {
		return "اليوم";
	}

	if (daysValue === 1) {
		return "يوم واحد";
	}
	if (daysValue === 2) {
		return "يومين";
	}

	if (daysValue < 7) {
		return `${days} أيام`;
	}

	if (daysValue >= 3 && daysValue <= 10) {
		return `${daysValue} أيام`;
	}

	if (daysValue >= 11 && daysValue <= 30) {
		return `${daysValue} يوم`;
	}

	if (daysValue < 365) {
		const months = Math.floor(daysValue / 30);
		return months === 1 ? "شهر واحد" : `${months} أشهر`;
	}

	const years = Math.floor(daysValue / 365);
	return years === 1 ? "سنة واحدة" : `${years} سنوات`;
};

export default DaysFormatter;
