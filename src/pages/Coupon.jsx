import React, { useState } from "react";
import { Helmet } from "react-helmet";
import useFetch from "../Hooks/UseFetch";
import { CouponTable } from "../components";
import { Link, useNavigate } from "react-router-dom";

// iCONS
import { MdAdd } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";
import howIcon from "../data/Icons/icon_24_home.svg";

//Mui
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// filter Coupon by
const filtersTypes = [
	{ id: 1, ar_name: "نوع الكوبون", en_name: "type" },
	{ id: 2, ar_name: "الحالة", en_name: "status" },
	{ id: 3, ar_name: "تاريخ الانتهاء", en_name: "date" },
];

const selectFilterStyles = {
	width: "100%",
	height: "100%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	fontSize: "18px",
	fontWeight: "500",
	backgroundColor: "aliceblue",
	color: "#02466a",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "35px",
		},

	"& .MuiOutlinedInput-root": {
		"& :hover": {
			border: "none",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "none",
	},

	"& .MuiSelect-nativeInput": {
		display: "none",
	},
	"& .MuiSelect-icon": {
		right: "88%",
	},
};

const menuItemStyles = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "aliceblue",
	height: "3rem",
	"&.Mui-selected": {
		backgroundColor: "#d9f2f9",
	},
	"&.Mui-selected:hover ": {
		backgroundColor: "#d9f2f9",
	},
	"&:hover ": {
		backgroundColor: "#d9f2f9",
	},
};

const Coupon = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/coupons"
	);
	const navigate = useNavigate();
	const handleSubmit = (event) => {
		event.preventDefault();
	};
	const [search, setSearch] = useState("");
	let coupons = fetchedData?.data?.coupons;
	const [select, setSelect] = useState("");
	let filterCoupons = fetchedData?.data?.coupons;

	if (search !== "") {
		coupons = fetchedData?.data?.coupons?.filter((item) =>
			item?.code?.toLowerCase()?.includes(search?.toLowerCase())
		);
	} else {
		coupons = fetchedData?.data?.coupons;
	}

	if (select === "type") {
		filterCoupons = coupons?.sort((a, b) =>
			a?.discount_type.localeCompare(b?.discount_type)
		);
	} else if (select === "date") {
		filterCoupons = coupons?.sort((a, b) =>
			a?.expire_date.localeCompare(b?.expire_date)
		);
	} else if (select === "status") {
		filterCoupons = coupons?.sort((a, b) => a?.status.localeCompare(b?.status));
	} else {
		filterCoupons = coupons?.sort((a, b) => a?.id - b?.id);
	}

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الكوبونات</title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
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
								<li className='breadcrumb-item' aria-current='page'>
									التسويق
								</li>
								<li className='breadcrumb-item active' aria-current='page'>
									كوبونات التخفيض
								</li>
							</ol>
						</nav>
					</div>
				</div>
				<div className='coupon-form mb-3'>
					<div className='add-category'>
						<form onSubmit={handleSubmit}>
							<div className='input-group'>
								<div className='search-input input-box'>
									<input
										value={search}
										onChange={(e) => setSearch(e.target.value)}
										type='text'
										name='search'
										id='search'
										placeholder=' ابحث عن طريق اسم الكوبون '
									/>
									<BsSearch className='search-icon' />
								</div>

								{/**/}

								<div className='select-input input-box '>
									<FormControl sx={{ width: "100%" }}>
										<FiFilter className='filter-icon' />
										<Select
											displayEmpty
											value={select}
											onChange={(e) => setSelect(e.target.value)}
											sx={selectFilterStyles}
											IconComponent={IoIosArrowDown}
											inputProps={{ "aria-label": "Without label" }}
											renderValue={(selected) => {
												if (select === "") {
													return <p style={{ color: "#02466a" }}>فرز حسب</p>;
												}
												const result =
													filtersTypes?.filter(
														(item) => item?.en_name === selected
													) || "";
												return result[0]?.ar_name;
											}}>
											<MenuItem sx={menuItemStyles} value=''>
												الكل
											</MenuItem>
											{filtersTypes?.map((item) => (
												<MenuItem
													sx={menuItemStyles}
													key={item?.id}
													value={item?.en_name}>
													{item?.ar_name}
												</MenuItem>
											))}
										</Select>
									</FormControl>
								</div>

								<div className='add-category-bt-box'>
									<button
										className='add-cat-btn'
										onClick={() => {
											navigate("AddCoupon");
										}}>
										<MdAdd />
										<span className='me-2'> اضافه كوبون</span>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div className='row'>
					<div className='coupon-table'>
						<CouponTable
							data={filterCoupons}
							loading={loading}
							reload={reload}
							setReload={setReload}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Coupon;
