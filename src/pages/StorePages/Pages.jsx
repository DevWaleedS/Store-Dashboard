import React, { useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { useNavigate } from "react-router-dom";

// ICONS
import { MdAdd } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import { FiFilter } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { Button } from "@mui/material";

// Components
import { Breadcrumb } from "../../components";
import { PagesTable } from "../../components/Tables";

// RTK Query
import {
	useFilterPagesByStatusMutation,
	useGetPagesQuery,
	useSearchInPagesMutation,
} from "../../store/apiSlices/pagesApi";

// filter Pages by
const filtersTypes = [
	{ id: 1, ar_name: "الكل", en_name: "all" },
	{ id: 2, ar_name: "تم النشر", en_name: "active" },
	{ id: 3, ar_name: "محظور", en_name: "not_active" },
];

const selectFilterStyles = {
	width: "100%",
	height: "56px",
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
		right: "90%",
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

const Pages = () => {
	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [select, setSelect] = useState("");
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [pageArray, setPageArray] = useState(null);

	const {
		data: pagesData,
		isLoading,
		refetch,
	} = useGetPagesQuery({
		page: pageTarget,
		number: rowsCount,
	});

	useEffect(() => {
		refetch();
	}, [refetch]);

	useEffect(() => {
		if (pagesData) {
			setPageArray(pagesData.data);
		}
	}, [pagesData]);

	// handle search in Pages
	const [searchInPages] = useSearchInPagesMutation();
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search) {
				const fetchData = async () => {
					try {
						const response = await searchInPages({
							query: search,
						});

						setPageArray(response?.data?.data || []);
					} catch (error) {
						console.error("Error fetching searchInPages:", error);
					}
				};

				fetchData();
			} else {
				if (pagesData) {
					setPageArray(pagesData.data);
				}
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [search, searchInPages, pagesData]);

	// filter by status
	const [filterPagesByStatus] = useFilterPagesByStatusMutation();
	useEffect(() => {
		if (select) {
			const fetchData = async () => {
				try {
					const response = await filterPagesByStatus({
						select,
					});

					setPageArray(response?.data?.data || []);
				} catch (error) {
					console.error("Error fetching filterPagesByStatus:", error);
				}
			};

			fetchData();
		} else {
			if (pagesData) {
				setPageArray(pagesData.data);
			}
		}
	}, [select, filterPagesByStatus, pagesData]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الصفحات</title>
			</Helmet>
			<section className='pages-page p-lg-3'>
				<Breadcrumb mb={"mb-md-4 mb-3"} currentPage={"الصفحات"} />

				<div className='row mb-md-4 mb-3 add-category'>
					{/* Search Input  */}
					<div className='col-md-6 col-12 mb-md-0 mb-3'>
						<div className='pages-search-bx'>
							<BsSearch className='search-icon' />
							<input
								id='search'
								type='text'
								name='search'
								autoComplete='false'
								value={search}
								placeholder='ابحث عن  طريق اسم الصفحة'
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>
					</div>

					{/* Filter Select */}
					<div className='col-md-3 col-12 mb-md-0 mb-3'>
						<div className='pages-filters-bx'>
							<FormControl sx={{ width: "100%", position: "relative" }}>
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
										const result = filtersTypes.find(
											(item) => item.en_name === selected
										);
										return result ? result.ar_name : "";
									}}>
									{filtersTypes.map((item) => (
										<MenuItem
											sx={menuItemStyles}
											key={item.id}
											value={item.en_name}>
											{item.ar_name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</div>
					</div>

					<div className='col-md-3 col-12 '>
						<div className='add-page-btn'>
							<Button
								variant='contained'
								onClick={() => {
									navigate("AddPage");
								}}>
								<MdAdd />
								<span className='me-2'>انشاء صفحة</span>
							</Button>
						</div>
					</div>
				</div>

				<div className='row'>
					<div className='pages-table'>
						<PagesTable
							data={pageArray?.pages || []}
							loading={isLoading}
							search={search}
							setSearch={setSearch}
							rowsCount={rowsCount}
							pageTarget={pageTarget}
							setRowsCount={setRowsCount}
							setPageTarget={setPageTarget}
							pageCount={pageArray?.page_count}
							currentPage={pageArray?.current_page}
						/>
					</div>
				</div>
			</section>
		</>
	);
};

export default Pages;
