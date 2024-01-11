import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { MdAdd } from "react-icons/md";
import { HomeIcon } from "../data/Icons";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

// Components
import useFetch from "../Hooks/UseFetch";

//Mui
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { CategoryTable } from "../components/Tables";

const Category = () => {
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/category"
	);
	const { fetchedData: categories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);

	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [category_id, setCategory_id] = useState("");
	const [tabSelected, setTabSelected] = useState(1);
	const [categoriesData, setCategoriesData] = useState([]);
	const [categoriesFilterSearch, setCategoriesFilterSearch] = useState([]);
	const [categoriesResult, setCategoriesResult] = useState([]);

	useEffect(() => {
		if (tabSelected === 1) {
			setCategoriesData(fetchedData?.data?.categories?.filter((category) => category?.store !== null));
		}
		else {
			setCategoriesData(fetchedData?.data?.categories?.filter((category) => category?.store === null));
		}

	}, [fetchedData?.data?.categories, tabSelected]);

	// Search
	useEffect(() => {
		if (search !== "") {
			setCategoriesFilterSearch(categoriesData?.filter((item) => item?.name?.toLowerCase()?.includes(search?.toLowerCase())));
		} else {
			setCategoriesFilterSearch(categoriesData);
		}
	}, [categoriesData, search])

	// Filter by
	useEffect(() => {
		if (category_id !== "") {
			setCategoriesResult(categoriesFilterSearch?.filter((item) => item?.id === category_id));
		} else {
			setCategoriesResult(categoriesFilterSearch);
		}
	}, [categoriesFilterSearch, category_id]);

	// ----------------------------------------------------

	const handleSubmit = (event) => {
		event.preventDefault();
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الأنشطة</title>
			</Helmet>
			<div className='category p-lg-3'>
				<div className='head-category'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item active ' aria-current='page'>
									الأنشطة
								</li>
							</ol>
						</nav>
					</div>
				</div>

				<div className='mb-3'>
					<div className='shipping-company-hint mb-2'>
						سوف تظهر هذه الأنشطة بمجرد استخدامها في اضافة المنتجات الخاصة بك
					</div>
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
										autoComplete='false'
										placeholder='ابحث في الأنشطة'
									/>
									<BsSearch />
								</div>

								<div className='select-input input-box '>
									<FormControl sx={{ width: "100%" }}>
										<Select
											name='category_id'
											value={category_id}
											onChange={(e) => {
												setCategory_id(e.target.value);
											}}
											sx={{
												fontSize: "18px",
												backgroundColor: "#ededed",
												"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
												{
													paddingRight: "20px",
												},
												"& .MuiOutlinedInput-root": {
													"& :hover": {
														border: "none",
													},
												},
												"& .MuiOutlinedInput-notchedOutline": {
													border: "none",
												},
												"& .MuiSelect-icon": {
													right: "90%",
												},
												"& .MuiSelect-nativeInput": {
													display: "none",
												},
											}}
											IconComponent={IoIosArrowDown}
											displayEmpty
											inputProps={{ "aria-label": "Without label" }}
											renderValue={(selected) => {
												if (category_id === "") {
													return (
														<p className='text-[#ADB5B9]'>
															اختر النشاط
														</p>
													);
												}
												const result =
													categories?.data?.categories?.filter(
														(item) => item?.id === parseInt(selected)
													) || "";
												return result[0]?.name;
											}}>
											<MenuItem
												className='souq_storge_category_filter_items'
												sx={{
													backgroundColor: "rgba(211, 211, 211, 1)",
													height: "3rem",
													"&:hover": {},
												}}
												value={""}>
												الكل
											</MenuItem>
											{categories?.data?.categories?.map((cat, index) => {
												return (
													<MenuItem
														key={index}
														className='souq_storge_category_filter_items'
														sx={{
															backgroundColor:
																cat?.store === null
																	? " #dfe2aa"
																	: " rgba(211, 211, 211, 1)",
															height: "3rem",
															"&:hover": {},
														}}
														value={cat?.id}>
														{cat?.name}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</div>

								<div className='add-category-bt-box'>
									<button
										className='add-cat-btn'
										onClick={() => {
											navigate("AddCategory");
										}}>
										<MdAdd />
										<span className='me-2'> اضافه نشاط</span>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className="filters-btn">
					<button
						className={`btn ${tabSelected === 1 ? 'active' : ''}`}
						onClick={() => setTabSelected(1)}
					>أنشطة التاجر</button>
					<button
						className={`btn ${tabSelected !== 1 ? 'active' : ''}`}
						onClick={() => setTabSelected(2)}
					>أنشطة منصة أطلبها</button>
				</div>
				<div className='row'>
					<div className='category-table'>
						<CategoryTable
							fetchedData={categoriesResult}
							loading={loading}
							reload={reload}
							setReload={setReload}
							tabSelectedId={tabSelected}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Category;
