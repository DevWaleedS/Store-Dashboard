import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// Components
import { OrdersQuickDetails } from "./index";
import { TopBarSearchInput } from "../../../global";
import { BigOrdersTable } from "../../../components/Tables";

// Icons
import { ArrowBack } from "../../../data/Icons";

import {
	useFilterOrdersByStatusMutation,
	useGetOrdersQuery,
	useSearchInOrdersMutation,
} from "../../../store/apiSlices/ordersApiSlices/ordersApi";

const Orders = () => {
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	const [ordersData, setOrdersData] = useState([]);

	// get orders data
	const { data: orders, isLoading } = useGetOrdersQuery({
		page: pageTarget,
		number: rowsCount,
	});

	useEffect(() => {
		if (orders?.data?.orders?.length !== 0) {
			setOrdersData(orders?.data?.orders);
		}
	}, [orders?.data?.orders]);

	//handle search in orders
	const [searchInOrders] = useSearchInOrdersMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInOrders({
							query: search,
							page: pageTarget,
							number: rowsCount,
						});

						setOrdersData(response?.data?.data?.orders);
					} catch (error) {
						console.error("Error fetching Products:", error);
					}
				};

				fetchData();
			} else {
				setOrdersData(orders?.data?.orders);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, pageTarget, rowsCount]);

	// -------------------------------------------------------------

	// Filter Orders by Order Status
	const [filterOrdersByStatus] = useFilterOrdersByStatusMutation();
	useEffect(() => {
		if (select !== "") {
			const fetchData = async () => {
				try {
					const response = await filterOrdersByStatus({
						orderStatus: select,
						page: pageTarget,
						number: rowsCount,
					});

					setOrdersData(response?.data?.data?.orders);
				} catch (error) {
					console.error("Error fetching Products:", error);
				}
			};

			fetchData();
		} else {
			setOrdersData(orders?.data?.orders);
		}
	}, [select, filterOrdersByStatus]);

	// ---------------------------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الطلبات</title>
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
									الطلبات
								</li>
							</ol>
						</nav>
					</div>
				</div>

				{/* Orders Quick Details */}
				<div className='data-boxes'>
					<div className='row'>
						<OrdersQuickDetails
							loading={isLoading}
							new_order={orders?.data?.new}
							completed={orders?.data?.completed}
							not_completed={orders?.data?.not_completed}
							canceled={orders?.data?.canceled}
							all={orders?.data?.all}
						/>
					</div>
				</div>

				{/** Orders table */}
				<div className='tables'>
					<BigOrdersTable
						orders={ordersData}
						search={search}
						select={select}
						loading={isLoading}
						rowsCount={rowsCount}
						setSelect={setSelect}
						setSearch={setSearch}
						pageTarget={pageTarget}
						setRowsCount={setRowsCount}
						setPageTarget={setPageTarget}
						pageCount={orders?.data?.page_count}
						currentPage={orders?.data?.current_page}
					/>
				</div>
			</section>
		</>
	);
};

export default Orders;
