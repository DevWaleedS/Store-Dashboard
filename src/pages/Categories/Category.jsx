import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

// Icons
import { MdAdd } from "react-icons/md";
import { HomeIcon } from "../../data/Icons";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown, IoMdInformationCircleOutline } from "react-icons/io";

// MUI
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { CategoryTable } from "../../components/Tables";

//Redux And RTK Query
import {
	useFilterCategoriesMutation,
	useGetCategoriesDataQuery,
	useSearchInEtlbohaCategoriesMutation,
	useSearchInStoreCategoriesMutation,
} from "../../store/apiSlices/categoriesApi";
import { useGetCategoriesQuery } from "../../store/apiSlices/selectCategoriesApi";

const Category = () => {
	const navigate = useNavigate();

	// Categories Selector
	const { data: selectCategories } = useGetCategoriesQuery();

	const [search, setSearch] = useState("");
	const [category_id, setCategory_id] = useState("");
	const [tabSelected, setTabSelected] = useState(1);
	const [categoriesData, setCategoriesData] = useState([]);
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	// Fetch categories based on search query and tabSelected
	const { data: categories, isLoading } = useGetCategoriesDataQuery({
		page: pageTarget,
		number: rowsCount,
	});

	const [searchInStoreCategories] = useSearchInStoreCategoriesMutation();
	const [searchInEtlbohaCategories] = useSearchInEtlbohaCategoriesMutation();
	const [filterCategories] = useFilterCategoriesMutation();

	// handle search categories
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response =
							tabSelected === 1
								? await searchInStoreCategories({
										query: search,
										page: pageTarget,
										number: rowsCount,
								  })
								: await searchInEtlbohaCategories({
										query: search,
										page: pageTarget,
										number: rowsCount,
								  });

						setCategoriesData(
							response.data.data?.store_categories ??
								response.data.data?.etlobha_categories
						);
					} catch (error) {
						console.error("Error fetching categories:", error);
					}
				};

				fetchData();
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [tabSelected, search, pageTarget, rowsCount]);

	// display categories by tapSelect
	useEffect(() => {
		if (categories) {
			setCategoriesData(
				tabSelected === 1
					? categories.data.store_categories
					: categories.data.etlobha_categories
			);
		}
	}, [tabSelected, categories]);

	// handle filtration
	useEffect(() => {
		if (category_id !== "") {
			const fetchData = async () => {
				try {
					const response = await filterCategories(category_id);

					setCategoriesData(
						tabSelected === 1
							? response.data?.data.store_categories
							: response.data?.data.etlobha_categories
					);
				} catch (error) {
					console.error("Error fetching categories:", error);
				}
			};

			fetchData();
		} else {
			setCategoriesData(
				tabSelected === 1
					? categories?.data?.store_categories
					: categories?.data?.etlobha_categories
			);
		}
	}, [category_id, filterCategories, tabSelected]);

	// ----------------------------------------------------

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
						<>
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
													selectCategories?.data?.categories?.filter(
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
											{selectCategories?.data?.categories?.map((cat, index) => {
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
						</>
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
							loading={isLoading}
							rowsCount={rowsCount}
							setRowsCount={setRowsCount}
							pageTarget={pageTarget}
							tabSelectedId={tabSelected}
							categories={categoriesData}
							setPageTarget={setPageTarget}
							pageCount={
								tabSelected === 1
									? categories?.data?.store_page_count
									: categories?.data?.etlobha_page_count
							}
							currentPage={
								tabSelected === 1
									? categories?.data?.store_current_page
									: categories?.data?.etlobha_current_page
							}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Category;
