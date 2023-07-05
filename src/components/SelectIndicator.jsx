import * as React from 'react';

export default function SelectIndicator() {
	return (
		<select className='form-select' aria-label='Default select example'>
			<option defaultChecked>الكل</option>
			<option value='accessories'>اكسسورات</option>
			<option value='laptop'>لابتوب</option>
			<option value='mobile'>اجهزه جوال</option>
			<option value='powerBank'>بوربانك</option>
		</select>
	);
}
