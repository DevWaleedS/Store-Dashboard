import React, { useRef, useEffect, useState } from "react";

// third party
import moment from "moment";
import { Helmet } from "react-helmet";

// MUI
import { Button } from "@mui/material";

// TO print this page
import ReactToPrint from "react-to-print";

import { Link } from "react-router-dom";
import useFetch from "../Hooks/UseFetch";

// Date picker component
import DateRangePicker from "rsuite/DateRangePicker";
import "rsuite/dist/rsuite.min.css";

// import icons and images
import { HomeIcon, PrintIcon, WalletIcon } from "../data/Icons";

// Pages Components
import { SalesReports } from "./nestedPages";
import { TopBarSearchInput } from "../global";

const Report = () => {
	const componentRef = useRef();
	const [dateValue, setDateValue] = useState([]);
	const [url, setUrl] = useState(
		`https://backend.atlbha.com/api/Store/reports?startDate=''&endDate=''`
	);

	// We use this effect to avoid the errors
	useEffect(() => {
		if (dateValue?.length !== 0 && dateValue !== null) {
			setUrl(
				`https://backend.atlbha.com/api/Store/reports?startDate=${moment(
					dateValue[0]
				).format("YYYY-MM-DD")}&endDate=${moment(dateValue[1]).format(
					"YYYY-MM-DD"
				)}`
			);
			console.log(url);
		} else {
			console.log("data not found");
		}
	}, [dateValue]);

	// add url after add the date
	const { fetchedData, loading } = useFetch(url);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | التقارير</title>
			</Helmet>
			<section className='reports-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<div className='col-lg-6 col-md-6 col-sm-12 mb-md-2'>
							<nav aria-label='breadcrumb'>
								<ol className='breadcrumb'>
									<li className='breadcrumb-item'>
										<HomeIcon />
										<Link to='/' className='me-2'>
											الرئيسية
										</Link>
									</li>

									<li className='breadcrumb-item active' aria-current='page'>
										التقارير
									</li>
								</ol>
							</nav>
						</div>
					</div>
				</div>
				<div className='page-actions-row '>
					<div className='row mb-md-4 mb-3'>
						<div className='col-lg-6 col-md-6 col-sm-12 mb-2'>
							<div className='date-picker'>
								<DateRangePicker
									value={dateValue}
									onChange={setDateValue}
									dir='rtl'
									placeholder='اختر الفترة من - إلى'
								/>
							</div>
						</div>
						<div className='col-lg-6 col-md-6 col-sm-12 d-flex justify-content-end'>
							<div className='print-report-btn-box'>
								<ReactToPrint
									trigger={() => {
										return (
											<Button className='print-report-btn' variant='contained'>
												<PrintIcon />
												<span className='me-1'> طباعه التقرير</span>
											</Button>
										);
									}}
									content={() => componentRef.current}
									documentTitle='report'
								/>
							</div>
						</div>
					</div>

					<div className='select-report-links mb-md-5 mb-3'>
						<div className='d-flex align-items-center'>
							<ul
								className='w-100 nav nav-pills  reports-tabs-buttons'
								id='pills-tab'
								role='tablist'>
								<li className='nav-item mb-2' role='presentation'>
									<button
										className='sales-btn active'
										id='sales-tab'
										data-bs-toggle='pill'
										data-bs-target='#pills-sales-tab'
										type='button'
										role='tab'
										aria-controls='pills-home'
										aria-selected='true'>
										<WalletIcon />
										<span className='me-2'>المبيعات</span>
									</button>
								</li>

								{/*
								<li className='nav-item mb-2 me-md-3 ' role='presentation'>
									<button
										className='customers-btn'
										id='pills-custmores-tab'
										data-bs-toggle='pill'
										data-bs-target='#pills-custmores'
										type='button'
										role='tab'
										aria-controls='pills-custmores'
										aria-selected='false'>
										<ClientsIcon />
										<span className='me-2'>العملاء</span>
									</button>
								</li>
							
							*/}
							</ul>
						</div>
					</div>
				</div>

				<div className='reports-wrapper' ref={componentRef}>
					<div className='tab-content reports-content' id='pills-tabContent'>
						<div
							className='tab-pane fade show active'
							id='pills-sales-tab'
							role='tabpanel'
							aria-labelledby='sales-tab'>
							<SalesReports salesReport={fetchedData} loading={loading} />
						</div>

						{/*
					<div
							className='tab-pane fade'
							id='pills-custmores'
							role='tabpanel'
							aria-labelledby='pills-custmores-tab'>
							<CustomersReports />
						</div>
					
					*/}
					</div>
				</div>
			</section>
		</>
	);
};

export default Report;
