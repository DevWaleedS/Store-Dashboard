import React from 'react';
import DateRangePicker from 'rsuite/DateRangePicker';
import 'rsuite/dist/rsuite.min.css';

const DatePickerCopm = () => {
	const [value, setValue] = React.useState(null);

	const handleChange = (newValue) => {
		setValue(newValue);
	};
	return (
		<div className='date-picker'>
			<DateRangePicker dir='rtl' placeholder ='اختر الفترة من - إلي'/>
		</div>
	);
};

export default DatePickerCopm;
