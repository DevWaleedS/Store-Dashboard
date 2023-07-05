const GetDateOnly = (date) => {
	const datetime = new Date(date);
	const dateOnly = datetime.toLocaleString().slice(0, 9).split('-').reverse().join('/');
	return dateOnly;
};

export default GetDateOnly;
