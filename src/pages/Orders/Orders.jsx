import React, { useState } from "react";

// Third paerty
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import useFetch from "../../Hooks/UseFetch";

// Components
import { OrdersQuickDetails } from "./index";
import { BigOrdersTable } from "../../components/Tables";

// Icons
import { ArrowBack } from "../../data/Icons";
import { AiOutlineSearch } from "react-icons/ai";

const Orders = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/orders"
	);

	// to create search
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	let orders = fetchedData?.data?.orders;
	let filterOrders = orders;

	// Search
	if (search !== "") {
		orders = fetchedData?.data?.orders?.filter(
			(order) =>
				order?.shipping?.track_id
					?.toLowerCase()
					?.includes(search?.toLowerCase()) ||
				order?.shippingtypes?.name
					?.toLowerCase()
					?.includes(search?.toLowerCase())
		);
	} else {
		orders = fetchedData?.data?.orders;
	}

	if (select === "shipping_company") {
		filterOrders = orders?.sort((a, b) =>
			a?.shippingtypes?.name?.localeCompare(b?.shippingtypes?.name)
		);
	} else if (select === "quantity") {
		filterOrders = orders?.sort((a, b) => a?.quantity - b?.quantity);
	} else if (select === "status") {
		filterOrders = orders?.sort((a, b) => a?.status.localeCompare(b?.status));
	} else {
		filterOrders = orders;
	}

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الطلبات</title>
			</Helmet>
			<section className='orders-pages p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
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
							new_order={fetchedData?.data?.new}
							completed={fetchedData?.data?.completed}
							not_completed={fetchedData?.data?.not_completed}
							canceled={fetchedData?.data?.canceled}
							all={fetchedData?.data?.all}
						/>
					</div>
				</div>

				{/** Orders table */}
				<div className='tables'>
					<BigOrdersTable
						data={filterOrders}
						loading={loading}
						reload={reload}
						setReload={setReload}
						search={search}
						setSearch={setSearch}
						select={select}
						setSelect={setSelect}
					/>
				</div>
			</section>
		</>
	);
};

export default Orders;
