import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

// Components
import { Breadcrumb } from "../components";
import { PostalSubscriptionsTable } from "../components/Tables";

// Icons

import { BsSearch } from "react-icons/bs";

// Export File
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

// RTK Query
import {
	useGetPostalSubscriptionsQuery,
	useSearchInPostalSubscriptionsMutation,
} from "../store/apiSlices/postalSubscriptionsApi";
import { useShowVerificationQuery } from "../store/apiSlices/verifyStoreApi";

const PostalSubscriptions = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [postalSubscriptionsData, setPostalSubscriptionsData] = useState([]);

	const { data: postalSubscriptions, isLoading } =
		useGetPostalSubscriptionsQuery({
			page: pageTarget,
			number: rowsCount,
		});
	// --------------------------------------------------------------------------

	// to Handle if the user is not verify  her account
	const { data: showVerification } = useShowVerificationQuery();
	useEffect(() => {
		if (showVerification?.verification_status !== "تم التوثيق") {
			navigate("/");
		}
	}, [showVerification?.verification_status, navigate]);

	/** get data */
	useEffect(() => {
		if (postalSubscriptions?.data?.subsicriptions?.length !== 0) {
			setPostalSubscriptionsData(postalSubscriptions?.data);
		}
	}, [postalSubscriptions?.data?.subsicriptions?.length]);

	// -------------------------------------------------------------------------------------------

	// handle search in postalSubscriptions
	const [searchInPostalSubscriptions] =
		useSearchInPostalSubscriptionsMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInPostalSubscriptions({
							query: search,
						});

						setPostalSubscriptionsData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching searchInPostalSubscriptions:", error);
					}
				};

				fetchData();
			} else {
				setPostalSubscriptionsData(postalSubscriptions?.data);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, pageTarget, rowsCount]);

	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";

	// Export To CSV
	const exportToCSV = () => {
		const ws = XLSX.utils.json_to_sheet(
			postalSubscriptionsData?.map((item) => ({
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
				<Breadcrumb
					parentPage={"التسويق"}
					currentPage={"الاشتراكات البريدية"}
				/>

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
							data={postalSubscriptionsData?.subsicriptions}
							loading={isLoading}
							search={search}
							setSearch={setSearch}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={postalSubscriptionsData?.page_count}
							currentPage={postalSubscriptionsData?.current_page}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default PostalSubscriptions;
