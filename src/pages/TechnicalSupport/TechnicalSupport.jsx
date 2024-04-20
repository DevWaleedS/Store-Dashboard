import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
import { ArrowBack } from "../../data/Icons";
import SupportTable from "../../components/Tables/SupportTable";

// RTK Query
import { useGetTechnicalSupportQuery } from "../../store/apiSlices/technicalSupportApi";
import { useSearchInPostalSubscriptionsMutation } from "../../store/apiSlices/postalSubscriptionsApi";

const TechnicalSupport = () => {
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(9);
	const [search, setSearch] = useState("");
	const [technicalSupportData, setTechnicalSupportData] = useState([]);

	const { data: technicalSupport, isLoading } = useGetTechnicalSupportQuery({
		page: pageTarget,
		number: rowsCount,
	});
	// -----------------------------------------------------------

	/** get technical Support data */
	useEffect(() => {
		if (technicalSupport?.data?.Technicalsupports?.length !== 0) {
			setTechnicalSupportData(technicalSupport?.data?.Technicalsupports);
		}
	}, [technicalSupport?.data?.Technicalsupports]);

	// handle search in Technical Support
	const [searchInTechnicalSupport] = useSearchInPostalSubscriptionsMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInTechnicalSupport({
							query: search,
							page: pageTarget,
							number: rowsCount,
						});

						setTechnicalSupportData(response?.data?.data?.Technicalsupports);
					} catch (error) {
						console.error("Error fetching searchInTechnicalSupport:", error);
					}
				};

				fetchData();
			} else {
				setTechnicalSupportData(technicalSupport?.data?.Technicalsupports);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, pageTarget, rowsCount]);

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
							data={technicalSupportData}
							loading={isLoading}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={technicalSupport?.data?.page_count}
							currentPage={technicalSupport?.data?.current_page}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default TechnicalSupport;
