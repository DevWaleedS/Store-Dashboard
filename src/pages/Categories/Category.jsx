import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

// MUI
import { CategoryTable } from "../../components/Tables";

// Components
import { Breadcrumb, PageHint } from "../../components";

// RTK Query
import { useGetCategoriesDataQuery } from "../../store/apiSlices/categoriesApi";
import SearchInCategories from "./SearchInCategories";

const Category = () => {
	const [search, setSearch] = useState("");
	const [categoriesData, setCategoriesData] = useState([]);
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

	useEffect(() => {
		refetch();
	}, [refetch]);

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
						<SearchInCategories
							search={search}
							setSearch={setSearch}
							categories={categories}
							tabSelected={tabSelected}
							setPageCount={setPageCount}
							setPageTarget={setPageTarget}
							setCurrentPage={setCurrentPage}
							setCategoriesData={setCategoriesData}
						/>
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
