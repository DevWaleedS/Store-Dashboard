import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// Components

import { TopBarSearchInput } from "../../../global";
import { ReturnOrdersTable } from "../../../components/Tables";

// Icons
import { ArrowBack } from "../../../data/Icons";
import {
	useGetReturnOrdersQuery,
	useSearchInReturnOrdersMutation,
} from "../../../store/apiSlices/ordersApiSlices/returnOrdersApi";

const ReturnOrders = () => {
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	const [returnOrdersData, setReturnOrdersData] = useState([]);

	// get orders data
	const { data: returnOrders, isLoading } = useGetReturnOrdersQuery({
		page: pageTarget,
		number: rowsCount,
	});

	useEffect(() => {
		if (returnOrders?.ReturnOrders?.length !== 0) {
			setReturnOrdersData(returnOrders?.ReturnOrders);
		}
	}, [returnOrders?.ReturnOrders]);

	//handle search in orders
	const [searchInReturnOrders] = useSearchInReturnOrdersMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInReturnOrders({
							query: search,
							page: pageTarget,
							number: rowsCount,
						});

						setReturnOrdersData(response?.data?.data?.ReturnOrders);
					} catch (error) {
						console.error("Error fetching ReturnOrders:", error);
					}
				};

				fetchData();
			} else {
				setReturnOrdersData(returnOrders?.ReturnOrders);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, pageTarget, rowsCount]);

	// -------------------------------------------------------------

	// Filter Orders by Order Status
	// const [filterOrdersByStatus] = useFilterOrdersByStatusMutation();
	// useEffect(() => {
	// 	if (select !== "") {
	// 		const fetchData = async () => {
	// 			try {
	// 				const response = await filterOrdersByStatus({
	// 					orderStatus: select,
	// 					page: pageTarget,
	// 					number: rowsCount,
	// 				});

	// 				setOrdersData(response?.data?.data?.orders);
	// 			} catch (error) {
	// 				console.error("Error fetching Products:", error);
	// 			}
	// 		};

	// 		fetchData();
	// 	} else {
	// 		setOrdersData(orders?.data?.orders);
	// 	}
	// }, [select, filterOrdersByStatus]);

	// ---------------------------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | المرتجعات</title>
			</Helmet>
			<section className='orders-pages p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<ArrowBack />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									المرتجعات
								</li>
							</ol>
						</nav>
					</div>
				</div>

				{/** Orders table */}
				<div className='tables'>
					<ReturnOrdersTable
						returnOrders={returnOrdersData}
						search={search}
						select={select}
						loading={isLoading}
						rowsCount={rowsCount}
						setSelect={setSelect}
						setSearch={setSearch}
						pageTarget={pageTarget}
						setRowsCount={setRowsCount}
						setPageTarget={setPageTarget}
						pageCount={returnOrders?.page_count}
						currentPage={returnOrders?.current_page}
					/>
				</div>
			</section>
		</>
	);
};

export default ReturnOrders;
