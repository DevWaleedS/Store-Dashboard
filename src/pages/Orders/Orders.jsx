import React, { useState } from "react";

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

const Orders = () => {
	const { fetchedData, loading, reload, setReload } = useFetch("orders");
	// -----------------------------------------------------------

	// To create search
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	let orders = fetchedData?.data?.orders;
	let filterOrders = orders;
	// ------------------------------------------------------------

	// Search
	if (search !== "") {
		orders = fetchedData?.data?.orders?.filter(
			(order) =>
				order?.shipping?.track_id
					?.toLowerCase()
					?.includes(search?.toLowerCase()) ||
				order?.shippingtypes?.name
					?.toLowerCase()
					?.includes(search?.toLowerCase()) ||
				order?.user?.name?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		orders = fetchedData?.data?.orders;
	}
	// -------------------------------------------------------------

	// Filter
	if (select === "new") {
		filterOrders = orders?.filter((order) => order?.status === "جديد");
	} else if (select === "canceled") {
		filterOrders = orders?.filter((order) => order?.status === "الغاء الشحنة");
	} else if (select === "completed") {
		filterOrders = orders?.filter((order) => order?.status === "مكتمل");
	} else if (select === "ready") {
		filterOrders = orders?.filter((order) => order?.status === "قيد التجهيز");
	} else if (select === "Imile") {
		filterOrders = orders?.filter(
			(order) => order?.shippingtypes?.name === "ارامكس"
		);
	} else {
		filterOrders = orders;
	}
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
