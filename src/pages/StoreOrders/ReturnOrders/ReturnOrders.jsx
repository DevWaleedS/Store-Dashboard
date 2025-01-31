import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";

// Components
import { TopBarSearchInput } from "../../../global/TopBar";
import { ReturnOrdersTable } from "../../../components/Tables";

import {
	useFilterReturnOrdersByStatusMutation,
	useGetReturnOrdersQuery,
	useSearchInReturnOrdersMutation,
} from "../../../store/apiSlices/ordersApiSlices/returnOrdersApi";
import { Breadcrumb } from "../../../components";

const ReturnOrders = () => {
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	const [returnOrdersData, setReturnOrdersData] = useState([]);

	// get orders data
	const {
		data: returnOrders,
		isLoading,
		refetch,
	} = useGetReturnOrdersQuery({
		page: pageTarget,
		number: rowsCount,
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		if (returnOrders?.ReturnOrders?.length !== 0) {
			setReturnOrdersData(returnOrders);
		}
	}, [returnOrders?.ReturnOrders?.length]);

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

						setReturnOrdersData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching ReturnOrders:", error);
					}
				};

				fetchData();
			} else {
				setReturnOrdersData(returnOrders);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, pageTarget, rowsCount]);

	// -------------------------------------------------------------

	// Filter Orders by Order Status
	const [filterReturnOrdersByStatus] = useFilterReturnOrdersByStatusMutation();
	useEffect(() => {
		if (select !== "") {
			const fetchData = async () => {
				try {
					const response = await filterReturnOrdersByStatus({
						orderStatus: select,
						page: pageTarget,
						number: rowsCount,
					});

					setReturnOrdersData(response?.data?.data);
				} catch (error) {
					console.error("Error fetching Products:", error);
				}
			};

			fetchData();
		} else {
			setReturnOrdersData(returnOrders);
		}
	}, [select, filterReturnOrdersByStatus]);

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

				<Breadcrumb currentPage={"المرتجعات"} />

				{/** Orders table */}
				<div className='tables'>
					<ReturnOrdersTable
						returnOrders={returnOrdersData?.ReturnOrders}
						search={search}
						select={select}
						loading={isLoading}
						rowsCount={rowsCount}
						setSelect={setSelect}
						setSearch={setSearch}
						pageTarget={pageTarget}
						setRowsCount={setRowsCount}
						setPageTarget={setPageTarget}
						pageCount={returnOrdersData?.page_count}
						currentPage={returnOrdersData?.current_page}
					/>
				</div>
			</section>
		</>
	);
};

export default ReturnOrders;
