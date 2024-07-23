import React, { useState, useEffect } from "react";

// Third Party
import { Helmet } from "react-helmet";

// Components
import { FormSearchWeight, ImportEndExportProducts } from "./index";
import { BigProductsTable } from "../../components/Tables";

// Components
import { AddProductFromStoreModal } from "../nestedPages/SouqOtlbha";

// RTK Query
import { useGetCategoriesQuery } from "../../store/apiSlices/selectorsApis/selectCategoriesApi";
import {
	useFilterImportedProductsByCategoriesMutation,
	useFilterStoreProductsByCategoriesMutation,
	useGetImportedProductsQuery,
	useGetStoreProductsQuery,
	useSearchInImportedProductsMutation,
	useSearchInStoreProductsMutation,
} from "../../store/apiSlices/productsApi";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification";

const Products = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	// Categories Selector
	const { data: selectCategories } = useGetCategoriesQuery();

	const [search, setSearch] = useState("");
	const [pageCount, setPageCount] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [pageTarget, setPageTarget] = useState(1);
	const [tabSelected, setTabSelected] = useState(1);
	const [currentPage, setCurrentPage] = useState(1);
	const [category_id, setCategory_id] = useState("");
	const [productsData, setProductsData] = useState([]);

	// Fetch store Products
	const { data: storeProducts, isLoading: storeProductsIsLoading } =
		useGetStoreProductsQuery({
			page: pageTarget,
			number: rowsCount,
		});

	// Fetch Imported Products
	const { data: importedProducts, isLoading: importedProductsIsLoading } =
		useGetImportedProductsQuery({
			page: pageTarget,
			number: rowsCount,
		});

	const [searchInStoreProducts] = useSearchInStoreProductsMutation();
	const [searchInImportedProducts] = useSearchInImportedProductsMutation();
	const [filterStoreProductsByCategories] =
		useFilterStoreProductsByCategoriesMutation();

	const [filterImportedProductsByCategories] =
		useFilterImportedProductsByCategoriesMutation();
	// ---------------------------------------------------------------------------------------------------------

	// display Products by tapSelect
	useEffect(() => {
		if (storeProducts || importedProducts) {
			setProductsData(
				tabSelected === 1
					? storeProducts?.data?.products
					: importedProducts?.data?.import_products
			);
			setCurrentPage(
				tabSelected === 1
					? storeProducts?.data?.current_page
					: importedProducts?.data?.current_page
			);
			setPageCount(
				tabSelected === 1
					? storeProducts?.data?.page_count
					: importedProducts?.data?.page_count
			);
		}
	}, [tabSelected, storeProducts, importedProducts]);

	// handle search in products
	const getSearchInput = (value) => {
		setSearch(value);
	};

	useEffect(() => {
		const debounce = setTimeout(() => {
			if (search !== "") {
				const fetchData = async () => {
					try {
						const response =
							tabSelected === 1
								? await searchInStoreProducts({
										query: search,
								  })
								: await searchInImportedProducts({
										query: search,
								  });

						setProductsData(
							response.data.data?.products ??
								response.data.data?.import_products
						);

						setCurrentPage(
							tabSelected === 1
								? response.data.data?.current_page
								: response.data.data?.current_page
						);
						setPageCount(
							tabSelected === 1
								? response.data.data?.page_count
								: response.data.data?.page_count
						);
					} catch (error) {
						console.error("Error fetching Products:", error);
					}
				};

				fetchData();
			}
		}, 500);
		return () => {
			clearTimeout(debounce);
		};
	}, [tabSelected, search, pageTarget, rowsCount]);
	// --------------------------------------------------------------------------------------------------------

	// handle filtration
	const getCategorySelected = (value) => {
		setCategory_id(value);
	};
	useEffect(() => {
		if (category_id !== "") {
			const fetchData = async () => {
				try {
					const response =
						tabSelected === 1
							? await filterStoreProductsByCategories({
									category_id,
							  })
							: await filterImportedProductsByCategories({
									category_id,
							  });
					const responseData = response.data?.data;

					setProductsData(
						tabSelected === 1
							? responseData.products
							: responseData.import_products
					);
					setCurrentPage(
						tabSelected === 1
							? responseData?.current_page
							: responseData?.current_page
					);
					setPageCount(
						tabSelected === 1
							? responseData?.page_count
							: responseData?.page_count
					);
				} catch (error) {
					console.error("Error fetching Products:", error);
				}
			};

			fetchData();
		} else {
			setProductsData(
				tabSelected === 1
					? storeProducts?.data?.products
					: importedProducts?.data?.import_products
			);

			setCurrentPage(
				tabSelected === 1
					? storeProducts?.data?.current_page
					: importedProducts?.data?.current_page
			);
			setPageCount(
				tabSelected === 1
					? storeProducts?.data?.page_count
					: importedProducts?.data?.page_count
			);
		}
	}, [
		category_id,
		tabSelected,
		filterImportedProductsByCategories,
		filterStoreProductsByCategories,
	]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | المنتجات</title>
			</Helmet>
			<div className='products p-lg-3'>
				<div className='mb-3'>
					<FormSearchWeight
						categories={selectCategories}
						categorySelected={getCategorySelected}
						searchInput={getSearchInput}
						type='product'
					/>
				</div>
				<div className='mb-3'>
					<ImportEndExportProducts productsData={productsData} />
				</div>

				<div className='filters-btn'>
					<button
						className={`btn ${tabSelected === 1 ? "active" : ""}`}
						onClick={() => setTabSelected(1)}>
						منتجات التاجر
					</button>
					<button
						className={`btn ${tabSelected !== 1 ? "active" : ""}`}
						onClick={() => setTabSelected(2)}>
						منتجات سوق اطلبها
					</button>
				</div>
				<div className='category-table'>
					<BigProductsTable
						products={productsData || []}
						loading={
							tabSelected === 1
								? storeProductsIsLoading
								: importedProductsIsLoading
						}
						rowsCount={rowsCount}
						setRowsCount={setRowsCount}
						pageTarget={pageTarget}
						tabSelectedId={tabSelected}
						setPageTarget={setPageTarget}
						pageCount={pageCount}
						currentPage={currentPage}
					/>
				</div>

				{/** Add Product Form store page Modal */}
				<AddProductFromStoreModal />
			</div>
		</>
	);
};

export default Products;
