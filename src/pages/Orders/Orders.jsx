import React, { useEffect, useState } from "react";

// Third paerty
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch";

// Components
import { OrdersQuickDetails } from "./index";
import { TopBarSearchInput } from "../../global";
import { BigOrdersTable } from "../../components/Tables";

// Icons
import { ArrowBack } from "../../data/Icons";
import {
	OrdersThunk,
	filterOrdersByStatusThunk,
	searchOrderThunk,
} from "../../store/Thunk/OrdersThunk";
import { useDispatch, useSelector } from "react-redux";

const Orders = () => {
	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	const { ordersData, currentPage, pageCount, loading, reload } = useSelector(
		(state) => state.OrdersSlice
	);
	// const { loading, reload, setReload } = useFetch(
	// 	`orders?page=${pageTarget}&number=${rowsCount}`
	// );

	/** get contact data */
	useEffect(() => {
		dispatch(OrdersThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);

	// -----------------------------------------------------------

	// search in Orders
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				dispatch(
					searchOrderThunk({
						query: search,
						page: pageTarget,
						number: rowsCount,
					})
				);
			}
		}, 500);

		return () => {
			clearTimeout(debounce);
		};
	}, [search, dispatch]);
	// -------------------------------------------------------------

	// Filter Orders by Order Status
	useEffect(() => {
		if (select !== "") {
			dispatch(
				filterOrdersByStatusThunk({
					status: select,
					page: pageTarget,
					number: rowsCount,
				})
			);
		}
	}, [select, dispatch]);

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
							loading={loading}
							new_order={ordersData?.new}
							completed={ordersData?.completed}
							not_completed={ordersData?.not_completed}
							canceled={ordersData?.canceled}
							all={ordersData?.all}
						/>
					</div>
				</div>

				{/** Orders table */}
				<div className='tables'>
					<BigOrdersTable
						orders={ordersData}
						search={search}
						select={select}
						reload={reload}
						loading={loading}
						rowsCount={rowsCount}
						setSelect={setSelect}
						setSearch={setSearch}
						pageTarget={pageTarget}
						setRowsCount={setRowsCount}
						setPageTarget={setPageTarget}
						pageCount={pageCount}
						currentPage={currentPage}
					/>
				</div>
			</section>
		</>
	);
};

export default Orders;
