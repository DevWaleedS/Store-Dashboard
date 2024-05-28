import React, { Fragment } from "react";

// Third Party
import { Helmet } from "react-helmet";

// Components
import TopSection from "../../components/TopSection";
// Charts
import { PieCharts, LineCharts } from "../../components/Charts";
// Summery Tables
import { OrdersTableData, ProductsTableData } from "../../components/Tables";

// DashboardSummeryDetails
import DashboardSummeryDetails from "./DashboardSummeryDetails";
import { useGetMainPageDataQuery } from "../../store/apiSlices/mainPageApi";

const DashboardHomePage = () => {
	const { data: mainPageData, isLoading } = useGetMainPageDataQuery();

	return (
		<Fragment>
			<Helmet>
				<title>لوحة تحكم اطلبها | الرئيسية</title>
			</Helmet>
			{/** TOP SECTION */}
			<section className='top-section mt-md-5 mb-md-5 mb-4'>
				<TopSection />
			</section>

			{/** Dashboard Summery Details */}
			<section className='details-section mb-3'>
				<DashboardSummeryDetails
					summeryDetails={mainPageData?.data}
					loading={isLoading}
				/>
			</section>

			{/**  CHARTS SECTION */}
			<section className='charts mb-5'>
				<div className='row'>
					<div className='col-lg-8 col-md-12 mb-4'>
						<LineCharts
							array_sales_daily={mainPageData?.data?.array_sales_daily}
							array_sales_monthly={mainPageData?.data?.array_sales_monthly}
							array_sales_weekly={mainPageData?.data?.array_sales_weekly}
						/>
					</div>
					<div className='col-lg-4 col-md-12 '>
						<PieCharts mainPageData={mainPageData?.data} />
					</div>
				</div>
			</section>

			{/**  TABLES SECTION */}
			<section className='tables mb-5'>
				<div className='row'>
					<div className='col-md-6 mb-4'>
						<OrdersTableData ordersDetails={mainPageData?.data?.orders} />
					</div>
					<div className='col-md-6 mb-4'>
						<ProductsTableData productsDetails={mainPageData?.data?.products} />
					</div>
				</div>
			</section>
		</Fragment>
	);
};

export default DashboardHomePage;
