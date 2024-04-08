import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { ArrowBack } from "../data/Icons";
import SupportTable from "../components/Tables/SupportTable";
import { useDispatch, useSelector } from "react-redux";
import {
	TechnicalSupportThunk,
	searchTechnicalSupportThunk,
} from "../store/Thunk/TechnicalSupportThunk";

const Support = () => {
	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(9);
	const [search, setSearch] = useState("");
	const { TechnicalSupportData, currentPage, pageCount, loading, reload } =
		useSelector((state) => state.TechnicalSupportSlice);
	// -----------------------------------------------------------

	console.log(TechnicalSupportData);

	/** get contact data */
	useEffect(() => {
		dispatch(TechnicalSupportThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);

	// const { loading, reload, setReload } = useFetch(
	// 	`technicalSupport?page=${pageTarget}&number=${rowsCount}`
	// );

	// search
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				dispatch(
					searchTechnicalSupportThunk({
						query: search,
						page: pageTarget,
						number: rowsCount,
					})
				);
			}
		}, 500);

		return () => {
			clearTimeout(debounce);
		};
	}, [search, dispatch]);
	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الدعم الفني</title>
			</Helmet>
			<section className='pages-page p-lg-3'>
				<div className='head-category mb-md-4 mb-3'>
					<div className='row '>
						<div className='col-md-6 col-12'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<ArrowBack />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>
									<li className='breadcrumb-item active ' aria-current='page'>
										الدعم الفني
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>
				<div className='row mb-md-5 mb-3'>
					<div className='col-md-6 col-12 d-flex justify-content-end'>
						<div className='pages-search-bx'>
							<BiSearch className='search-icon' />
							<input
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								type='text'
								name='search'
								id='search'
								autoComplete='false'
								placeholder='ابحث عن طريق  عنوان الرسالة'
							/>
						</div>
					</div>
				</div>
				<div className='row'>
					<div className='support-table'>
						<SupportTable
							data={TechnicalSupportData}
							loading={loading}
							reload={reload}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={pageCount}
							currentPage={currentPage}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Support;
