import React, { useEffect, useState } from "react";

// Icons

import { BsBoxSeam } from "react-icons/bs";
import { PiToolboxLight } from "react-icons/pi";
import { BsSearch } from "react-icons/bs";
import { IoIosArrowDown } from "react-icons/io";

// MUI
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import {
	useFilterCategoriesMutation,
	useSearchInEtlbohaCategoriesMutation,
	useSearchInStoreCategoriesMutation,
	useSelectCategoriesQuery,
} from "../../store/apiSlices/categoriesApi";
import { PagesDropdown } from "../../components";

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

const SearchInCategories = (props) => {
	const {
		setCategoriesData,
		tabSelected,
		setCurrentPage,
		setPageCount,
		categories,
		search,
		setSearch,
		pageTarget,
		rowsCount,
	} = props;

	const [productsCategory_id, setProductsCategory_id] = useState("");
	const [serviceCategory_id, setServiceCategory_id] = useState("");

	const { data: selectProductsCategories } = useSelectCategoriesQuery({
		is_service: 0,
	});
	const { data: selectServicesCategories } = useSelectCategoriesQuery({
		is_service: 1,
	});
	const [searchInStoreCategories] = useSearchInStoreCategoriesMutation();
	const [searchInEtlbohaCategories] = useSearchInEtlbohaCategoriesMutation();
	const [filterCategories] = useFilterCategoriesMutation();

	// Handle filtration of products categories
	useEffect(() => {
		if (productsCategory_id !== "") {
			const fetchData = async () => {
				try {
					const response = await filterCategories(productsCategory_id);

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
	}, [productsCategory_id, filterCategories, tabSelected]);

	// Handle filtration of services categories
	useEffect(() => {
		if (serviceCategory_id !== "") {
			const fetchData = async () => {
				try {
					const response = await filterCategories(serviceCategory_id);

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
	}, [serviceCategory_id, filterCategories, tabSelected]);

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

	return (
		<>
			<div className='d-flex flex-md-row flex-column-reverse  justify-content-start align-items-center gap-3 mb-2'>
				<div className='search-input input-box w-100 w-md-49'>
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
				<div className='add-category-bt-box  w-100  w-md-49'>
					<PagesDropdown dropDownData={dropDownData} />
				</div>
			</div>

			<div className=' d-flex flex-md-row flex-column  justify-content-start align-items-center gap-3 mb-2 gap-2'>
				<div className='select-input w-100 w-md-49'>
					<FormControl sx={{ width: "100%" }}>
						<Select
							name='serviceCategory_id'
							value={serviceCategory_id}
							onChange={(e) => {
								setServiceCategory_id(e.target.value);
							}}
							sx={selectStyle}
							displayEmpty
							IconComponent={IoIosArrowDown}
							inputProps={{ "aria-label": "Without label" }}
							renderValue={(selected) => {
								if (serviceCategory_id === "") {
									return <p className='text-[#ADB5B9]'>اختر نشاط الخدمات</p>;
								}
								const result =
									selectServicesCategories?.filter(
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
							{selectServicesCategories?.map((cat, index) => {
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

				<div className='select-input  w-100 w-md-49'>
					<FormControl sx={{ width: "100%" }}>
						<Select
							name='productsCategory_id'
							value={productsCategory_id}
							onChange={(e) => {
								setProductsCategory_id(e.target.value);
							}}
							sx={selectStyle}
							displayEmpty
							IconComponent={IoIosArrowDown}
							inputProps={{ "aria-label": "Without label" }}
							renderValue={(selected) => {
								if (productsCategory_id === "") {
									return <p className='text-[#ADB5B9]'>اختر نشاط المنتجات</p>;
								}
								const result =
									selectProductsCategories?.filter(
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
							{selectProductsCategories?.map((cat, index) => {
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
			</div>
		</>
	);
};

export default SearchInCategories;
