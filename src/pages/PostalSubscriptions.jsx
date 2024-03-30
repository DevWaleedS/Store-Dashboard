import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// Components
import useFetch from "../Hooks/UseFetch";
import { PostalSubscriptionsTable } from "../components/Tables";

// Icons
import { HomeIcon } from "../data/Icons";
import { BsSearch } from "react-icons/bs";

// Export File
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { useDispatch, useSelector } from "react-redux";
import { PostalSubscriptionsThunk } from "../store/Thunk/PostalSubscriptionsThunk";

const PostalSubscriptions = () => {
	const dispatch = useDispatch();
	const [search, setSearch] = useState("");
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	const { PostalSubscriptionsData, currentPage, pageCount } = useSelector(
		(state) => state.PostalSubscriptionsSlice
	);

	const { loading, reload, setReload } = useFetch(
		`subsicriptions?page=${pageTarget}&number=${rowsCount}`
	);
	console.log(PostalSubscriptionsData);

	// -----------------------------------------------------------

	/** get contact data */
	useEffect(() => {
		dispatch(PostalSubscriptionsThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget]);

	// -----------------------------------------------------------

	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";

	// Handle Search
	let subsicriptions = PostalSubscriptionsData?.subsicriptions;

	if (search !== "") {
		subsicriptions = PostalSubscriptionsData?.subsicriptions?.filter((item) =>
			item?.email?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		subsicriptions = PostalSubscriptionsData?.subsicriptions;
	}

	// Export To CSV
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
				<title>لوحة تحكم اطلبها | الاشتراكات البريدية</title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
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
						<div className='input-group'>
							<div className='search-input input-box'>
								<input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									type='text'
									name='search'
									id='search'
									autoComplete='false'
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
					</div>
				</div>

				<div className='row'>
					<div className='coupon-table'>
						<PostalSubscriptionsTable
							data={subsicriptions}
							loading={loading}
							reload={reload}
							setReload={setReload}
							search={search}
							setSearch={setSearch}
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

export default PostalSubscriptions;
