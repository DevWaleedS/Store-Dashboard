import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

// Icons
import { BsSearch } from "react-icons/bs";
import { BsBoxSeam } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";
import { PiToolboxLight } from "react-icons/pi";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { CategoryTable } from "../../components/Tables";

// Components
import { Breadcrumb, PageHint, PagesDropdown } from "../../components";

// RTK Query
import {
	useFilterCategoriesMutation,
	useGetCategoriesDataQuery,
	useSearchInEtlbohaCategoriesMutation,
	useSearchInStoreCategoriesMutation,
} from "../../store/apiSlices/categoriesApi";
import { useGetCategoriesQuery } from "../../store/apiSlices/selectorsApis/selectCategoriesApi";

const selectStyle = {
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
};

const dropDownData = {
	main_title: "اضافة جديدة",
	subMenu: [
		{
			id: 1,
			sub_path: "AddCategory",
			sub_title: " اضافة نشاط منتجات",
			icon: <BsBoxSeam />,
		},
		{
			id: 2,
			sub_path: "add-service-category",
			sub_title: " اضافة نشاط خدمات",
			icon: <PiToolboxLight />,
		},
	],
};

const Category = () => {
	// Categories Selector
	const { data: selectCategories } = useGetCategoriesQuery();

	const [search, setSearch] = useState("");
	const [categoriesData, setCategoriesData] = useState([]);
	const [category_id, setCategory_id] = useState("");
	const [tabSelected, setTabSelected] = useState(1);
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [currentPage, setCurrentPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);

	// Fetch categories based on search query and tabSelected
	const {
		data: categories,
		isLoading,
		refetch,
	} = useGetCategoriesDataQuery({
		page: pageTarget,
		number: rowsCount,
	});

	const [searchInStoreCategories] = useSearchInStoreCategoriesMutation();
	const [searchInEtlbohaCategories] = useSearchInEtlbohaCategoriesMutation();
	const [filterCategories] = useFilterCategoriesMutation();

	useEffect(() => {
		refetch();
	}, [refetch]);

	// Display categories by tapSelect
	useEffect(() => {
		if (categories) {
			setCategoriesData(
				tabSelected === 1
					? categories.data.store_categories
					: categories.data.etlobha_categories
			);

			setCurrentPage(
				tabSelected === 1
					? categories?.data?.store_current_page
					: categories?.data?.etlobha_current_page
			);
			setPageCount(
				tabSelected === 1
					? categories?.data?.store_page_count
					: categories?.data?.etlobha_page_count
			);
		}
	}, [tabSelected, categories]);

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
								  })
								: await searchInEtlbohaCategories({
										query: search,
								  });

						setCategoriesData(
							response.data.data?.store_categories ??
								response.data.data?.etlobha_categories
						);

						setCurrentPage(
							tabSelected === 1
								? response.data?.data?.store_current_page
								: response.data?.data?.etlobha_current_page
						);
						setPageCount(
							tabSelected === 1
								? response.data?.data?.store_page_count
								: response.data?.data?.etlobha_page_count
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

	// Handle filtration
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

					setCurrentPage(
						tabSelected === 1
							? response.data?.data?.store_current_page
							: response.data?.data?.etlobha_current_page
					);
					setPageCount(
						tabSelected === 1
							? response.data?.data?.store_page_count
							: response.data?.data?.etlobha_page_count
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
			setCurrentPage(
				tabSelected === 1
					? categories?.data?.store_current_page
					: categories?.data?.etlobha_current_page
			);
			setPageCount(
				tabSelected === 1
					? categories?.data?.store_page_count
					: categories?.data?.etlobha_page_count
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
				<Breadcrumb currentPage={"الأنشطة"} />

				<div className='mb-3'>
					<PageHint
						hint={`سوف تظهر هذه الأنشطة بمجرد استخدامها في اضافة المنتجات الخاصة بك`}
						flex={"d-flex  justify-content-start align-items-center gap-2"}
					/>

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
											sx={selectStyle}
											displayEmpty
											IconComponent={IoIosArrowDown}
											inputProps={{ "aria-label": "Without label" }}
											renderValue={(selected) => {
												if (category_id === "") {
													return <p className='text-[#ADB5B9]'>اختر النشاط</p>;
												}
												const result =
													selectCategories?.filter(
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
											{selectCategories?.map((cat, index) => {
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
									<PagesDropdown dropDownData={dropDownData} />
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
							categories={categoriesData || []}
							setPageTarget={setPageTarget}
							pageCount={pageCount}
							currentPage={currentPage}
						/>
					</div>
				</div>
			</div>
		</>
	);
};

export default Category;
