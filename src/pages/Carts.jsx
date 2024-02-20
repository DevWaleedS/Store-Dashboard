import React, { useState, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { HomeIcon } from "../data/Icons";

// Components
import useFetch from "../Hooks/UseFetch";
import { CartsTables } from "../components/Tables";

// Redux
import { useSelector } from "react-redux";

const Carts = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/admin"
	);
	// -----------------------------------------------------------

	//  handle if the store is not verified navigate to home page
	const navigate = useNavigate();
	const { verificationStoreStatus } = useSelector((state) => state.VerifyModal);
	useEffect(() => {
		if (verificationStoreStatus !== "تم التوثيق") {
			navigate("/");
		}
	}, [verificationStoreStatus]);
	// -----------------------------------------------------------
	// to create search
	const [search, setSearch] = useState("");
	let carts = fetchedData?.data?.cart;

	if (search !== "") {
		carts = fetchedData?.data?.cart?.filter((item) =>
			item?.user?.name?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		carts = fetchedData?.data?.cart;
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
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Carts;
