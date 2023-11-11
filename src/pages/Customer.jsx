import React, { useState } from "react";
import { Link } from "react-router-dom";
import useFetch from "../Hooks/UseFetch";
import { CustomersDataTable } from "../components/Tables";
import { AddCustomer } from "./nestedPages";
import { useDispatch } from "react-redux";

// icons
import howIcon from "../data/Icons/icon_24_home.svg";
import { MdAdd } from "react-icons/md";
import { BsSearch } from "react-icons/bs";

import { openCustomerDataModal } from "../store/slices/CustomerDataModal-slice";

const Customer = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/client"
	);

	const [search, setSearch] = useState("");
	let clients = fetchedData?.data?.clients;
	let filterClients = fetchedData?.data?.clients;

	const dispatch = useDispatch(true);
	const handleSubmit = (event) => {
		event.preventDefault();
	};
	const [category_id, setCategory_id] = useState("");
	if (search !== "") {
		clients = fetchedData?.data?.clients?.filter((item) => {
			return (
				item?.ID_number?.toLowerCase()?.includes(search?.toLowerCase()) ||
				item?.phonenumber?.toLowerCase()?.includes(search?.toLowerCase()) ||
				item?.first_name?.toLowerCase()?.includes(search?.toLowerCase()) ||
				item?.last_name?.toLowerCase()?.includes(search?.toLowerCase())
			);
		});
	} else {
		clients = fetchedData?.data?.clients;
	}

	if (category_id !== 5) {
		filterClients = clients?.sort((a, b) =>
			a?.country?.name?.localeCompare(b?.country?.name)
		);
	} else {
		filterClients = clients?.sort((a, b) => a?.id - b?.id);
	}

	return (
		<section className='customer-page p-lg-3'>
			<div className='head-category'>
				<div className='row'>
					<nav aria-label='breadcrumb'>
						<ol className='breadcrumb'>
							<li className='breadcrumb-item'>
								<img src={howIcon} alt='' loading='lazy' />
								<Link to='/' className='me-2'>
									الرئيسية
								</Link>
							</li>

							<li className='breadcrumb-item active ' aria-current='page'>
								العملاء
							</li>
						</ol>
					</nav>
				</div>
			</div>
			<div className='mb-3'>
				<div className='add-category'>
					<form onSubmit={handleSubmit}>
						<div className='input-group'>
							<div className='search-input input-box'>
								<input
									value={search}
									onChange={(e) => {
										setSearch(e.target.value);
									}}
									type='text'
									name='search'
									id='search'
									placeholder='ابحث بواسطة الرقم ID / الاسم/ رقم الجوال'
								/>
								<BsSearch />
							</div>

							<div className='add-category-bt-box'>
								<button
									className='add-cat-btn'
									onClick={() => {
										dispatch(openCustomerDataModal());
									}}>
									<MdAdd />
									اضافه عميل
								</button>
							</div>
						</div>
					</form>
				</div>
			</div>

			<div className='customer-table'>
				<CustomersDataTable
					fetchedData={filterClients}
					loading={loading}
					reload={reload}
					setReload={setReload}
				/>
			</div>

			{/** AddCustomer page */}
			<AddCustomer reload={reload} setReload={setReload} />
		</section>
	);
};

export default Customer;
