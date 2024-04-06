import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { MdAdd } from "react-icons/md";
import { HomeIcon } from "../../data/Icons";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown, IoMdInformationCircleOutline } from "react-icons/io";

// Components
import useFetch from "../../Hooks/UseFetch";

//Mui
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { CategoryTable } from "../../components/Tables";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { CategoriesThunk } from "../../store/Thunk/CategoriesThunk";

const Category = () => {
	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const { fetchedData: categories } = useFetch("selector/mainCategories");
	// const { loading, reload, setReload } = useFetch(
	// 	`category?page=${pageTarget}&number=${rowsCount}`
	// );

	const {
		Categories,
		currentPage,
		etlobhaCurrentPage,
		etlobhaPageCount,
		pageCount,
		loading,
		reload,
		storeCategory,
		SouqOtlbhaCategory,
	} = useSelector((state) => state.CategoriesSlice);

	/** get contact data */
	useEffect(() => {
		dispatch(CategoriesThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);

	const navigate = useNavigate();
	const [search, setSearch] = useState("");
	const [category_id, setCategory_id] = useState("");
	const [tabSelected, setTabSelected] = useState(1);
	const [categoriesData, setCategoriesData] = useState([]);
	const [categoriesFilterSearch, setCategoriesFilterSearch] = useState([]);
	const [categoriesResult, setCategoriesResult] = useState([]);

	/* im using this to display store category and atlbha category */
	useEffect(() => {
		if (tabSelected === 1) {
			setCategoriesData(storeCategory);
		} else {
			setCategoriesData(SouqOtlbhaCategory);
		}
	}, [Categories?.categories, tabSelected, storeCategory, SouqOtlbhaCategory]);

	// Search
	useEffect(() => {
		if (search !== "") {
			setCategoriesFilterSearch(
				categoriesData?.filter((item) =>
					item?.name?.toLowerCase()?.includes(search?.toLowerCase())
				)
			);
		} else {
			setCategoriesFilterSearch(categoriesData);
		}
	}, [categoriesData, search]);

	// Filter by
	useEffect(() => {
		if (category_id !== "") {
			setCategoriesResult(
				categoriesFilterSearch?.filter((item) => item?.id === category_id)
			);
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
				<title>لوحة تحكم اطلبها | الأنشطة</title>
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
					<div className='mb-4 option-info-label d-flex  justify-content-start align-items-center gap-2'>
						<IoMdInformationCircleOutline />
						<span>
							سوف تظهر هذه الأنشطة بمجرد استخدامها في اضافة المنتجات الخاصة بك
						</span>
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
													return <p className='text-[#ADB5B9]'>اختر النشاط</p>;
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
										<span className='me-2'> اضافة نشاط</span>
									</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<div className='filters-btn'>
					<button
						className={`btn ${tabSelected === 1 ? "active" : ""}`}
						onClick={() => {
							setTabSelected(1);
						}}>
						أنشطة التاجر
					</button>
					<button
						className={`btn ${tabSelected !== 1 ? "active" : ""}`}
						onClick={() => setTabSelected(2)}>
						أنشطة منصة اطلبها
					</button>
				</div>
				<div className='row'>
					<div className='category-table'>
						<CategoryTable
							reload={reload}
							loading={loading}
							rowsCount={rowsCount}
							setRowsCount={setRowsCount}
							pageTarget={pageTarget}
							tabSelectedId={tabSelected}
							categories={categoriesResult}
							setPageTarget={setPageTarget}
							pageCount={tabSelected === 1 ? pageCount : etlobhaPageCount}
							currentPage={tabSelected === 1 ? currentPage : etlobhaCurrentPage}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Category;
