import * as React from 'react';
import Box from '@mui/material/Box';



export default function FilterSelect() {
	const [age, setAge] = React.useState('');
	const handleChange = (event) => {
		setAge(event.target.value);
	};

	return (
		<Box sx={{ minWidth: 150,width:'100%' }}>
			<select className='form-select filter-select' aria-label='Default select example' value={age} onChange={handleChange}>
				<option defaultValue='Filter'>Filter</option>
				<option value='1'>الأحدث</option>
				<option value='2'>الأقدم</option>
				<option value='3'>الموقع</option>
				<option value='4'>الحالة</option>
				<option value='5'>شركة الشحن</option>
				<option value='6'>نوع الطلب</option>
				<option value='7'>طريقة الدفع</option>
			</select>
		</Box>
	);
}
