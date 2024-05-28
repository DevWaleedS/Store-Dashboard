import React, { useState, useEffect } from "react";

// Third party
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

// Icons
import { MdAdd } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";

// Components
import { Breadcrumb } from "../../components";
import { CouponTable } from "../../components/Tables";

// RTK Query
import {
	useFilterCouponsByStatusMutation,
	useGetCouponsQuery,
	useSearchInCouponsMutation,
} from "../../store/apiSlices/couponApi";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";

// filter Coupon by
const filtersTypes = [
	{ id: 1, ar_name: "الكل", en_name: "all" },
	{ id: 2, ar_name: "مبلغ ثابت", en_name: "fixed" },
	{ id: 3, ar_name: "نسبة مئوية", en_name: "percent" },
	{ id: 4, ar_name: "منتهي", en_name: "expired" },
	{ id: 4, ar_name: "نشط", en_name: "active" },
	{ id: 4, ar_name: "غير نشط", en_name: "not_active" },
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
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	const navigate = useNavigate();
	const [couponsData, setCouponsData] = useState([]);
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");

	//get all coupons data
	const { data: coupons, isLoading } = useGetCouponsQuery({
		page: pageTarget,
		number: rowsCount,
	});

	/** get contact data */
	useEffect(() => {
		if (coupons?.data) {
			setCouponsData(coupons?.data);
		}
	}, [coupons?.data]);
	// -----------------------------------------------------------

	// handle search in Coupons
	const [searchInCoupons] = useSearchInCouponsMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response = await searchInCoupons({
							query: search,
						});

						setCouponsData(response?.data?.data);
					} catch (error) {
						console.error("Error fetching searchInCoupons:", error);
					}
				};

				fetchData();
			} else {
				setCouponsData(coupons?.data);
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, pageTarget, rowsCount]);
	// -------------------------------------------------------------------------------

	// filter by status or discount type
	const [filterCouponsByStatus] = useFilterCouponsByStatusMutation();
	useEffect(() => {
		if (select !== "") {
			const fetchData = async () => {
				try {
					const response = await filterCouponsByStatus({
						select,
					});

					setCouponsData(response.data?.data);
				} catch (error) {
					console.error("Error fetching Products:", error);
				}
			};

			fetchData();
		} else {
			setCouponsData(coupons?.data);
		}
	}, [select, filterCouponsByStatus, coupons?.data]);

	// -------------------------------------------------------------------------------

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | أكواد الخصم</title>
			</Helmet>
			<section className='coupon-page p-lg-3'>
				<Breadcrumb currentPage={"أكواد الخصم"} parentPage={"التسويق"} />
				<div className='coupon-form mb-3'>
					<div className='add-category'>
						<div className='input-group'>
							<div className='search-input input-box'>
								<input
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									type='text'
									name='search'
									id='search'
									autoComplete='false'
									placeholder=' ابحث عن طريق اسم كود الخصم '
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
									<span className='me-2'> اضافة كود خصم</span>
								</button>
							</div>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='coupon-table'>
						<CouponTable
							coupons={couponsData?.coupons}
							search={search}
							select={select}
							loading={isLoading}
							rowsCount={rowsCount}
							setSelect={setSelect}
							setSearch={setSearch}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={couponsData?.page_count}
							currentPage={couponsData?.current_page}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Coupon;
