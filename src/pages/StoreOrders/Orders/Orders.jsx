import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";

// Components
import { OrdersQuickDetails } from "./index";
import { Breadcrumb } from "../../../components";
import { TopBarSearchInput } from "../../../global/TopBar";
import { BigOrdersTable } from "../../../components/Tables";

// RTK Query
import {
	useFilterOrdersByStatusMutation,
	useGetOrdersQuery,
	useSearchInOrdersMutation,
} from "../../../store/apiSlices/ordersApiSlices/ordersApi";

const Orders = () => {
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	const [rowsCount, setRowsCount] = useState(10);
	const [pageTarget, setPageTarget] = useState(1);
	const [ordersData, setOrdersData] = useState(null);

	// get orders data
	const {
		data: orders,
		isLoading,
		refetch,
	} = useGetOrdersQuery({
		page: pageTarget,
		number: rowsCount,
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		if (orders) {
			setOrdersData(orders?.data);
		}
	}, [orders]);

	// handle search in orders
	const [searchInOrders] = useSearchInOrdersMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search) {
				const fetchData = async () => {
					try {
						const response = await searchInOrders({
							query: search,
						});

						setOrdersData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching orders:", error);
					}
				};

				fetchData();
			} else {
				setOrdersData(orders?.data);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search]);

	// Filter Orders by Order Status
	const [filterOrdersByStatus] = useFilterOrdersByStatusMutation();
	useEffect(() => {
		if (select) {
			const fetchData = async () => {
				try {
					const response = await filterOrdersByStatus({
						orderStatus: select,
					});

					setOrdersData(response?.data?.data);
				} catch (error) {
					console.error("Error filtering orders:", error);
				}
			};

			fetchData();
		} else {
			setOrdersData(orders?.data);
		}
	}, [select, filterOrdersByStatus]);

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

				<Breadcrumb currentPage={"الطلبات"} />

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

				{/* Orders table */}
				<div className='tables'>
					<BigOrdersTable
						orders={ordersData?.orders}
						search={search}
						select={select}
						loading={isLoading}
						rowsCount={rowsCount}
						setSelect={setSelect}
						setSearch={setSearch}
						pageTarget={pageTarget}
						setRowsCount={setRowsCount}
						setPageTarget={setPageTarget}
						pageCount={ordersData?.page_count}
						currentPage={ordersData?.current_page}
					/>
				</div>
			</section>
		</>
	);
};

export default Orders;
