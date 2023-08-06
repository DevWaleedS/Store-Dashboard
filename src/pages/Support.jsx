import { InputAdornment, TextField } from "@mui/material";
import { Helmet } from "react-helmet";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import arrowBack from "../data/Icons/icon-30-arrwos back.svg";
import { BiSearch } from "react-icons/bi";
import { SupportTable } from "../components";
import useFetch from "../Hooks/UseFetch";

const Support = () => {
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/technicalSupport"
	);
	const [search, setSearch] = useState("");
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
										<img src={arrowBack} alt='' />
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
						<div className='pages-search-bx w-100'>
							<TextField
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								id='filled-textarea'
								placeholder='ابحث عن رسالة '
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
				</div>
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
