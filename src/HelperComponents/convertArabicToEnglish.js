export default function convertArabicToEnglish(value) {
	return value.replace(/[٠-٩]/g, (d) => d.charCodeAt(0) - 1632);
}
