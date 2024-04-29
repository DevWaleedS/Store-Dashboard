import React, { useState, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { HomeIcon } from "../../data/Icons";

// Components
import { CartsTables } from "../../components/Tables";

// RTK Query
import {
	useGetEmptyCartsQuery,
	useSearchInEmptyCartsMutation,
} from "../../store/apiSlices/emptyCartsApi";
import { useShowVerificationQuery } from "../../store/apiSlices/verifyStoreApi";

const EmptyCarts = () => {
	const navigate = useNavigate();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [search, setSearch] = useState("");
	const [emptyCartsData, setEmptyCartsData] = useState([]);

	const { data: emptyCarts, isLoading } = useGetEmptyCartsQuery({
		page: pageTarget,
		number: rowsCount,
	});

	// to Handle if the user is not verify  her account
	const { data: showVerification } = useShowVerificationQuery();
	useEffect(() => {
		if (showVerification?.verification_status !== "تم التوثيق") {
			navigate("/");
		}
	}, [showVerification?.verification_status, navigate]);

	/** get data */
	useEffect(() => {
		if (emptyCarts?.data?.carts?.length !== 0) {
			setEmptyCartsData(emptyCarts?.data?.carts);
		}
	}, [emptyCarts?.data?.carts]);

	// -------------------------------------------------------------------------

	// handle search in empty carts
	const [searchInEmptyCarts] = useSearchInEmptyCartsMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInEmptyCarts({
							query: search,
							page: pageTarget,
							number: rowsCount,
						});

						setEmptyCartsData(response?.data?.data?.carts);
					} catch (error) {
						console.error("Error fetching searchInEmptyCarts:", error);
					}
				};

				fetchData();
			} else {
				setEmptyCartsData(emptyCarts?.data?.carts);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, pageTarget, rowsCount]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | السلات المتروكة</title>
			</Helmet>
			<section className='carts-page p-lg-3'>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item  ' aria-current='page'>
									التسويق
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									السلات المتروكة
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='row'>
					<div className='carts-table'>
						<CartsTables
							cartsData={emptyCartsData}
							loading={isLoading}
							search={search}
							setSearch={setSearch}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={emptyCarts?.data?.page_count}
							currentPage={emptyCarts?.data?.current_page}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default EmptyCarts;
