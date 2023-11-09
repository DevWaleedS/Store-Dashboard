import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { CartsTables } from "../components";

// icons
import howIcon from "../data/Icons/icon_24_home.svg";
// custom hooks to get data from server
import useFetch from "../Hooks/UseFetch";

const Carts = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/admin"
	);

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
				<title>لوحة تحكم أطلبها | السلات المتروكة</title>
			</Helmet>
			<section className='carts-page p-lg-3'>
				<div className='head-category mb-md-4'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' loading='lazy' />
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
