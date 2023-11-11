import React, { Fragment } from "react";

// Third Party
import { Helmet } from "react-helmet";
import useFetch from "../Hooks/UseFetch";

// Components
import Details from "../components/Details";
import TopSection from "../components/TopSection";
import { PieCharts, LineCharts } from "../components/Charts";
import { OrdersTableData, ProductsTableData } from "../components/Tables";

const Home = () => {
	const { fetchedData, loading } = useFetch(
		"https://backend.atlbha.com/api/Store/index"
	);
	return (
		<Fragment>
			<Helmet>
				<title>لوحة تحكم أطلبها | الرئيسية</title>
			</Helmet>
			{/** TOP SECTION */}
			<section className='top-section mt-md-5 mb-md-5 mb-4'>
				<TopSection />
			</section>

			{/** DETAILS SECTION */}
			<section className='details-section mb-3'>
				<Details summeryDetails={fetchedData?.data} loading={loading} />
			</section>

			{/**  CHARTS SECTION */}
			<section className='charts mb-5'>
				<div className='row'>
					<div className='col-lg-8 col-md-12 mb-4'>
						<LineCharts
							array_sales_daily={fetchedData?.data?.array_sales_daily}
							array_sales_monthly={fetchedData?.data?.array_sales_monthly}
							array_sales_weekly={fetchedData?.data?.array_sales_weekly}
						/>
					</div>
					<div className='col-lg-4 col-md-12 '>
						<PieCharts fetchedData={fetchedData} />
					</div>
				</div>
			</section>

			{/**  TABLES SECTION */}
			<section className='tables mb-5'>
				<div className='row'>
					<div className='col-md-6 mb-4'>
						<OrdersTableData ordersDetails={fetchedData?.data?.orders} />
					</div>
					<div className='col-md-6 mb-4'>
						<ProductsTableData productsDetails={fetchedData?.data?.products} />
					</div>
				</div>
			</section>
		</Fragment>
	);
};

export default Home;
