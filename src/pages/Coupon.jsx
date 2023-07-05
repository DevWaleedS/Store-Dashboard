import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../Hooks/UseFetch';
import { CouponTable } from '../components';
// iCONS
import howIcon from '../data/Icons/icon_24_home.svg';
import { MdAdd } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';

const Coupon = () => {
	const { fetchedData, loading, reload, setReload } = useFetch('https://backend.atlbha.com/api/Store/coupons');
	const navigate = useNavigate();
	const handleSubmit = (event) => {
		event.preventDefault();
	};
	const [search, setSearch] = useState('');
	let coupons = fetchedData?.data?.coupons;
	const [select, setSelect] = useState('');
	let filterCoupons = fetchedData?.data?.coupons;

	if (search !== '') {
		coupons = fetchedData?.data?.coupons?.filter((item) => item?.code?.toLowerCase()?.includes(search?.toLowerCase()));
	} else {
		coupons = fetchedData?.data?.coupons;
	}

	if (select === 'type') {
		filterCoupons = coupons?.sort((a, b) => a?.discount_type.localeCompare(b?.discount_type));
	}

	else if (select === 'date') {
		filterCoupons = coupons?.sort((a, b) => a?.expire_date.localeCompare(b?.expire_date));
	}
	else if (select === 'status') {
		filterCoupons = coupons?.sort((a, b) => a?.status.localeCompare(b?.status));
	}
	else {
		filterCoupons = coupons?.sort((a, b) => a?.id - b?.id);
	}

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الكوبونات</title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item' aria-current='page'>
									التسويق
								</li>
								<li className='breadcrumb-item active' aria-current='page'>
									كوبونات التخفيض
								</li>
							</ol>
						</nav>
					</div>
				</div>
				<div className='coupon-form mb-3'>
					<div className='add-category'>
						<form onSubmit={handleSubmit}>
							<div className='input-group'>
								<div className='search-input input-box'>
									<input value={search} onChange={(e) => setSearch(e.target.value)} type='text' name='search' id='search' placeholder=' ابحث عن طريق اسم الكوبون ' />
									<BsSearch />
								</div>

								<div className='select-input input-box '>
									<select value={select} onChange={(e) => setSelect(e.target.value)} className='form-select' aria-label='Default select example'>
										<option value='' defaultChecked>الكل</option>
										<option value='type'>نوع الكوبون</option>
										<option value='status'>الحالة</option>
										<option value='date'>تاريخ الانتهاء</option>
									</select>
								</div>

								<div className='add-category-bt-box'>
									<button
										className='add-cat-btn'
										onClick={() => {
											navigate('AddCoupon');
										}}
									>
										<MdAdd />
										<span className='me-2'> اضافه كوبون</span>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div className='row'>
					<div className='coupon-table'>
						<CouponTable
							data={filterCoupons}
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

export default Coupon;
