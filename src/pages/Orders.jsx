import React from 'react';
import { Helmet } from "react-helmet";
import { Link } from 'react-router-dom';
import useFetch from '../Hooks/UseFetch';
// MUI
import { DataBox, BigOrdersTable } from '../components';

// Icons
import arrowBack from '../data/Icons/icon-30-arrwos back.svg';
import { AiOutlineSearch } from 'react-icons/ai';

const Orders = () => {
	const { fetchedData, loading, reload, setReload } = useFetch('https://backend.atlbha.com/api/Store/orders');
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الطلبات</title>
			</Helmet>
			<section className='orders-pages p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input type='text' name='search' id='search' className='input' placeholder='أدخل كلمة البحث' />
					</div>
				</div>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={arrowBack} alt='' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									الطلبات
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='data-boxes'>
					<div className='row'>
						<DataBox
							loading={loading}
							new_order={fetchedData?.data?.new}
							completed={fetchedData?.data?.completed}
							not_completed={fetchedData?.data?.not_completed}
							canceled={fetchedData?.data?.canceled}
							all={fetchedData?.data?.all}

						/>
					</div>
				</div>
				{/** Orders table */}
				<div className='tables'>
					<BigOrdersTable data={fetchedData?.data?.orders} loading={loading} reload={reload} setReload={setReload} />
				</div>
			</section>
		</>
	);
};

export default Orders;
