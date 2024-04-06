import React, { useState, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";

// Icons
import { HomeIcon } from "../data/Icons";

// Components
import useFetch from "../Hooks/UseFetch";
import { CartsTables } from "../components/Tables";
import { useDispatch, useSelector } from "react-redux";
import { EmptyCartsThunk } from "../store/Thunk/EmptyCartsThunk";

const Carts = () => {
	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [search, setSearch] = useState("");

	const { EmptyCartsData, currentPage, pageCount } = useSelector(
		(state) => state.EmptyCartsSlice
	);
	const { loading, reload, setReload } = useFetch(
		`admin?page=${pageTarget}&number=${rowsCount}`
	);
	// -----------------------------------------------------------

	/** get contact data */
	useEffect(() => {
		dispatch(EmptyCartsThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);

	// -----------------------------------------------------------

	let carts = EmptyCartsData?.carts;

	if (search !== "") {
		carts = EmptyCartsData?.carts?.filter((item) =>
			item?.user?.name?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		carts = EmptyCartsData?.carts;
	}

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
							cartsData={carts}
							loading={loading}
							reload={reload}
							setReload={setReload}
							search={search}
							setSearch={setSearch}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={pageCount}
							currentPage={currentPage}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Carts;
