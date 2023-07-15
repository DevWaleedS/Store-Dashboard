import React from 'react';
import { Helmet } from "react-helmet";
import useFetch from '../../Hooks/UseFetch';
import { Link } from 'react-router-dom';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// ICONS
import howIcon from '../../data/Icons/icon_24_home.svg';
import { IoIosArrowDown } from 'react-icons/io';
import { DelegateTable } from '../../components';
import { AiOutlineSearch } from 'react-icons/ai';

const Delegate = () => {
	const { fetchedData } = useFetch('https://backend.atlbha.com/api/Store/selector/cities');
	const [cityId, setCityId] = React.useState('');

	const handleCategoryChange = (event) => {
		setCityId(event.target.value);
	};
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | المندوبين</title>
			</Helmet>
			<section className=' delegate-page p-md-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input type='text' name='search' id='search' className='input' placeholder='أدخل كلمة البحث' />
					</div>
				</div>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item ' aria-current='page'>
									خدمات المنصة
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									المندوبين
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div id='select-delegate' className='select-delegate px-md-5 pt-md-4 pb-md-0 mb-md-5 mb-3'>
					<h4 className='select-delegate-title text-center mb-4'>قم باختيار المدينة التي تحتاج فيها الى مندوبين</h4>
					<div className='select-delegate-input'>
						<FormControl
							sx={{
								width: '100%',
							}}
						>
							<Select
								MenuProps={{
									sx: {
										'& .MuiPaper-root ': {
											height: '350px',
											top: '325px',
										},
									},
								}}
								sx={{
									height: '70px',
									backgroundColor: '#DDF2FF ',
									borderRadius: '8px ',
									fontSize: '18px',
									'@media(max-width:768px)': {
										height: '50px',
									},

									'& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input':
									{
										paddingRight: '20px',
									},
									'& .MuiOutlinedInput-root': {
										'& :hover': {
											border: 'none',
										},
									},
									'& .MuiOutlinedInput-notchedOutline': {
										border: 'none',
									},
									'& .MuiSelect-icon': {
										right: '95%',
										'@media(max-width:768px)': {
											right: '90%',
										},
									},
								}}
								IconComponent={IoIosArrowDown}
								value={cityId}
								displayEmpty
								onChange={handleCategoryChange}
								inputProps={{ 'aria-label': 'Without label' }}
								renderValue={(selected) => {
									if (cityId === '') {
										return <span> اختر المدينة</span>;
									}
									const result = fetchedData?.data?.cities?.filter((item) => item?.id === parseInt(selected)) || '';
									return result[0]?.name;
								}}
							>
								{fetchedData?.data?.cities?.map((item, idx) => {
									return (
										<MenuItem
											key={idx}
											className='souq_storge_category_filter_items'
											sx={{
												backgroundColor: 'rgba(211, 211, 211, 1)',
												height: '3rem',
												'&:hover': {},
											}}
											value={`${item?.id}`}
										>
											{item?.name}
										</MenuItem>
									);
								})}
							</Select>
						</FormControl>
					</div>
				</div>

				<div className='delegate-table'>
					<DelegateTable cityId={cityId} />
				</div>
			</section>
		</>
	);
};

export default Delegate;
