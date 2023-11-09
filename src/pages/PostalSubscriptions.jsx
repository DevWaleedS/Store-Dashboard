import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";
import useFetch from "../Hooks/UseFetch";
import { PostalSubscriptionsTable } from "../components";
// iCONS
import howIcon from "../data/Icons/icon_24_home.svg";
import { BsSearch } from "react-icons/bs";
// Export File
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const PostalSubscriptions = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/subsicriptions"
	);
	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";
	const handleSubmit = (event) => {
		event.preventDefault();
	};
	const [search, setSearch] = useState("");
	let subsicriptions = fetchedData?.data?.subsicriptions;

	if (search !== "") {
		subsicriptions = fetchedData?.data?.subsicriptions?.filter((item) =>
			item?.email?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		subsicriptions = fetchedData?.data?.subsicriptions;
	}

	const exportToCSV = () => {
		const ws = XLSX.utils.json_to_sheet(
			subsicriptions?.map((item) => ({
				email: item?.email,
			}))
		);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, "subscriptions_emails" + fileExtension);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الاشتراكات البريدية</title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' loading='lazy' />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item' aria-current='page'>
									التسويق
								</li>
								<li className='breadcrumb-item active' aria-current='page'>
									الاشتراكات البريدية
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
									<input
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										type='text'
										name='search'
										id='search'
										placeholder=' ابحث عن طريق البريد الالكتروني '
									/>
									<BsSearch />
								</div>
								<div className='add-category-bt-box'>
									<button className='add-cat-btn' onClick={exportToCSV}>
										<span className='me-2'>تصدير</span>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div className='row'>
					<div className='coupon-table'>
						<PostalSubscriptionsTable
							data={subsicriptions}
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

export default PostalSubscriptions;
