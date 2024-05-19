import React, { useState, useContext, useEffect } from "react";

// Third Party
import axios from "axios";
import * as XLSX from "xlsx";
import { Helmet } from "react-helmet";
import * as FileSaver from "file-saver";
import { useNavigate } from "react-router-dom";

// Components
import { DropCSVFiles, FormSearchWeight } from "./index";
import { BigProductsTable } from "../../components/Tables";

// Icons
import { MdAdd } from "react-icons/md";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

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
import { useShowVerificationQuery } from "../../store/apiSlices/verifyStoreApi";

const Products = () => {
	const navigate = useNavigate();
	const storeToken = localStorage.getItem("storeToken");

	// Categories Selector
	const { data: selectCategories } = useGetCategoriesQuery();

	// to Handle if the user is not verify  her account
	const { data: showVerification } = useShowVerificationQuery();
	useEffect(() => {
		if (showVerification?.verification_status !== "تم التوثيق") {
			navigate("/");
		}
	}, [showVerification?.verification_status, navigate]);

	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);
	const [file, setFile] = useState("");
	const [search, setSearch] = useState("");
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [tabSelected, setTabSelected] = useState(1);
	const [productsData, setProductsData] = useState([]);
	const [fileError, setFileError] = useState("");
	const [category_id, setCategory_id] = useState("");

	const [currentPage, setCurrentPage] = useState(1);
	const [pageCount, setPageCount] = useState(1);

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

	// ----------------------------------------------------------------------------------------------
	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";
	const handleFile = (file) => {
		setFile(file[0]);
	};

	// Export the product file
	const exportToCSV = () => {
		const ws = XLSX.utils.json_to_sheet(
			productsData?.map((item) => ({
				id: item?.id,
				name: item?.name,
				description: item?.description,
				short_description: item?.short_description,
				SEOdescription: item?.SEOdescription.map((seo) => seo),
				selling_price: item?.selling_price,
				category_id: item?.category?.name,
				discount_price: item?.discount_price,
				subcategory_id: item?.subcategory?.map((sub) => sub?.name)?.toString(),
				weight: item?.weight,
				stock: item?.stock,
				cover: item?.cover,
			}))
		);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, "StoreProducts" + fileExtension);
	};

	// Import the product file
	const uploadFile = () => {
		setLoadingTitle("جاري رفع الملف");
		setFileError("");
		let formData = new FormData();
		formData.append("file", file);
		axios
			.post(`import-products`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${storeToken}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setFile("");
					// setReload(!reload);
				} else {
					setLoadingTitle("");
					setFileError(res?.data?.message?.en?.file?.[0]);
					// setReload(!reload);
				}
			});
	};

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
					<div className='mange-file d-flex justify-content-between bg-white '>
						<div className='export-upload-btn-group d-flex justify-content-between'>
							<div className='export-files'>
								<button
									onClick={exportToCSV}
									className='export-btn'
									type='button'>
									تصدير
								</button>
							</div>
							<div className='upload-files'>
								<button
									onClick={uploadFile}
									className='w-100 h-100 upload-files-input'>
									رفع ملف
								</button>
							</div>
						</div>

						<div className='drop-files '>
							<DropCSVFiles
								file={file}
								handleFile={handleFile}
								fileError={fileError}
							/>
						</div>
						<div className='add-new-product'>
							<button
								className=' add-new-product-btn w-100'
								type='button'
								onClick={() => {
									navigate("AddProduct");
								}}>
								<MdAdd />
								<span className='me-2'>اضافة منتج جديد</span>
							</button>
						</div>
					</div>
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
						products={productsData}
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
