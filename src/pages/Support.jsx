import React, { useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// Icons
import { BiSearch } from "react-icons/bi";
import { ArrowBack } from "../data/Icons";

// Components
import useFetch from "../Hooks/UseFetch";
import SupportTable from "../components/Tables/SupportTable";

const Support = () => {
	const [search, setSearch] = useState("");

	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/technicalSupport"
	);

	// Handle search
	let Technicalsupports = fetchedData?.data?.Technicalsupports;

	if (search !== "") {
		Technicalsupports = fetchedData?.data?.Technicalsupports?.filter((item) =>
			item?.title?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		Technicalsupports = fetchedData?.data?.Technicalsupports;
	}
	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الدعم الفني</title>
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
				{/* Search Input */}
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
				{/* Support Table */}

				<div className='row'>
					<div className='support-table'>
						<SupportTable
							fetchedData={Technicalsupports}
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

export default Support;
