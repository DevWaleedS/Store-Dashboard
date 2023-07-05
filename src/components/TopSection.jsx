import * as React from 'react';
import DatePickerCopm from './DatePickerCopm';
import { AiOutlineSearch } from 'react-icons/ai';

// ICON
import { ReactComponent as HomeIcon } from '../data/Icons/icon_24_home.svg';

const TopSection = () => {
	const [value, setValue] = React.useState(null);

	const handleChange = (newValue) => {
		setValue(newValue);
	};
	return (
		<div className='row'>
			<div className='col-12 d-md-none d-flex'>
				<div className='search-header-box'>
					<div className='search-icon'>
						<AiOutlineSearch color='#02466A'/>
					</div>
					<input type='text' name='search' id='search' className='input' placeholder='أدخل كلمة البحث' />
				</div>
			</div>
			<div className='col-lg-6 col-12 mb-md-0 mb-2'>
				<div className='page-title d-flex justify-content-start align-items-baseline'>
					<HomeIcon className='home-icon' />
					<h5 className='d-flex align-self-end mb-0 me-2 h5'>الرئيسية</h5>
				</div>
			</div>

			{/** 
		<div className='col-lg-6 col-12'>
				<div className='date-picker home-page-date-picker'>
				<DatePickerCopm />
				</div>
			</div>
			
			
			
		*/}
		</div>
			
	);
};

export default TopSection;
