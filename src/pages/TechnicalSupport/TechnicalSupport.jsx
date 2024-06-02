import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

// icons
import { BiSearch } from "react-icons/bi";

// components
import { Breadcrumb } from "../../components";
import SupportTable from "../../components/Tables/SupportTable";

// RTK Query
import { useGetTechnicalSupportQuery } from "../../store/apiSlices/technicalSupportApi";
import { useSearchInPostalSubscriptionsMutation } from "../../store/apiSlices/postalSubscriptionsApi";

const TechnicalSupport = () => {
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(9);
	const [search, setSearch] = useState("");
	const [technicalSupportData, setTechnicalSupportData] = useState([]);

	const {
		data: technicalSupport,
		isLoading,
		refetch,
	} = useGetTechnicalSupportQuery({
		page: pageTarget,
		number: rowsCount,
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	/** get technical Support data */
	useEffect(() => {
		if (technicalSupport) {
			setTechnicalSupportData(technicalSupport?.data);
		}
	}, [technicalSupport]);

	// handle search in Technical Support
	const [searchInTechnicalSupport] = useSearchInPostalSubscriptionsMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search) {
				const fetchData = async () => {
					try {
						const response = await searchInTechnicalSupport({
							query: search,
						});

						setTechnicalSupportData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching searchInTechnicalSupport:", error);
					}
				};

				fetchData();
			} else {
				setTechnicalSupportData(technicalSupport?.data);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, searchInTechnicalSupport, technicalSupport]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الدعم الفني</title>
			</Helmet>
			<section className='pages-page p-lg-3'>
				<Breadcrumb mb={"mb-md-4 mb-3"} currentPage={"الدعم الفني"} />

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
							data={technicalSupportData?.Technicalsupports}
							loading={isLoading}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={technicalSupportData?.page_count}
							currentPage={technicalSupportData?.current_page}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default TechnicalSupport;
