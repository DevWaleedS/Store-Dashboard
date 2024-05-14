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
import { Breadcrumb } from "../../components";

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
			setEmptyCartsData(emptyCarts?.data);
		}
	}, [emptyCarts?.data?.carts?.length]);

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
						});

						setEmptyCartsData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching searchInEmptyCarts:", error);
					}
				};

				fetchData();
			} else {
				setEmptyCartsData(emptyCarts?.data);
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
				<Breadcrumb
					mb={"mb-md-4"}
					currentPage={"السلات المتروكة"}
					parentPage={"التسويق"}
				/>

				<div className='row'>
					<div className='carts-table'>
						<CartsTables
							cartsData={emptyCartsData?.carts}
							loading={isLoading}
							search={search}
							setSearch={setSearch}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={emptyCartsData?.page_count}
							currentPage={emptyCartsData?.current_page}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default EmptyCarts;
