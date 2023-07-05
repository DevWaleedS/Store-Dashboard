import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../Hooks/UseFetch';
import { Button, InputAdornment, TextField } from '@mui/material';
import { MdAdd } from 'react-icons/md';
import { BiSearch } from 'react-icons/bi';
import { GrFormFilter } from 'react-icons/gr';
import arrowBack from '../data/Icons/icon-30-arrwos back.svg';
import PagesTable from '../components/PagesTable';

const Pages = () => {
	const { fetchedData, loading, reload, setReload } = useFetch('https://backend.atlbha.com/api/Store/page');
	const navigate = useNavigate();
	const [search, setSearch] = useState('');
	const [select, setSelect] = useState('');
	let pages = fetchedData?.data?.pages;
	let filterPages = fetchedData?.data?.pages;
	if (search !== '') {
		pages = fetchedData?.data?.pages?.filter((item) => item?.title?.toLowerCase()?.includes(search?.toLowerCase()));
	} else {
		pages = fetchedData?.data?.pages;
	}

	if (select === 'date') {
		filterPages = pages?.sort((a, b) => a?.created_at.localeCompare(b?.created_at));
	}
	else if (select === 'status') {
		filterPages = pages?.sort((a, b) => a?.status.localeCompare(b?.status));
	}
	else {
		filterPages = pages?.sort((a, b) => a?.id - b?.id);
	}

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الصفحات</title>
			</Helmet>
			<section className='pages-page p-lg-3'>
				<div className='head-category mb-md-4 mb-3'>
					<div className='row'>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<img src={arrowBack} alt='' />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>
									<li className='breadcrumb-item active' aria-current='page'>
										الصفحات
									</li>
								</ol>
							</nav>
						</div>
						<div className='col-md-6 col-12 d-flex justify-content-end'>
							<div className='add-page-btn'>
								<Button
									variant='contained'
									onClick={() => {
										navigate('AddPage');
									}}
								>
									<MdAdd />
									<span className='me-2'>انشاء صفحة</span>
								</Button>
							</div>
						</div>
					</div>
				</div>

				<div className='row mb-md-4 mb-3'>
					<div className='col-md-8 col-12 mb-md-0 mb-3'>
						<div className='pages-search-bx'>
							<TextField
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								id='filled-textarea'
								placeholder='ابحث عن صفحة'
								InputProps={{
									startAdornment: (
										<InputAdornment position='start'>
											<BiSearch />
										</InputAdornment>
									),
								}}
							/>
						</div>
					</div>

					<div className='col-md-4 col-12'>
						<div className='pages-filters-bx'>
							<label htmlFor=''>
								<GrFormFilter />
							</label>
							<select value={select} onChange={(e) => setSelect(e.target.value)} className='form-select' aria-label='Default select example'>
								<option value=''>فرز حسب</option>
								<option value='date'>تاريخ الانشاء</option>
								<option value='status'>الحالة</option>
							</select>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='pages-table'>
						<PagesTable
							data={filterPages}
							loading={loading}
							reload={reload}
							setReload={setReload}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Pages;
