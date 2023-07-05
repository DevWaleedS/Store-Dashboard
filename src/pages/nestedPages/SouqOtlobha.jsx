import React, { useState, useContext } from 'react';
import { Helmet } from "react-helmet";
import Context from '../../Context/context';
import useFetch from '../../Hooks/UseFetch';
import { useNavigate } from 'react-router-dom';
import { FilterOperations, ProductBox } from '../../components';
import { ReactComponent as FilterIcon } from '../../data/Icons/icon-24-filter.svg';
import { AiOutlineSearch } from 'react-icons/ai';

const SouqOtlobha = () => {
	const navigate = useNavigate();
	const { fetchedData, loading } = useFetch('https://backend.atlbha.com/api/Store/etlobhaShow');
	const [showFilteringOptions, setShowFilteringOptions] = useState(false);
	const contextStore = useContext(Context);
	const { productsData } = contextStore;

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | سوق أطلبها</title>
			</Helmet>
			<section className='souqOtlobha-page'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input type='text' name='search' id='search' className='input' placeholder='أدخل كلمة البحث' />
					</div>
				</div>
				<div className='souqOtlobha-wrapper p-md-4'>
					<div className='row mb-md-4 mb-3'>
						<div className='col-lg-6 col-12 mb-lg-0 mb-3'>
							<div className='total-products'>
								<span>{loading ? 0 : fetchedData?.data?.count_products}</span>
								<span>عدد المنتجات التي تمت اضافتها</span>
							</div>
						</div>
						<div className='col-lg-6 col-12'>
							<div className='btn-group d-flex gap-3'>
								<button className='d-flex justify-content-center align-items-center' onClick={() => setShowFilteringOptions(!showFilteringOptions)}>
									<FilterIcon />
									<span>فرز</span>
								</button>
								<button
									className='d-flex justify-content-center align-items-center'
									onClick={() => {
										navigate('/Products');
									}}
								>
									العودة الى لوحة التحكم
								</button>
							</div>
						</div>
					</div>
					<div className='mb-md-5 mb-3'>
						<FilterOperations showFilteringOptions={showFilteringOptions} />
					</div>
					<ProductBox data={productsData} loading={loading} />
				</div>
			</section>
		</>
	);
};

export default SouqOtlobha;
