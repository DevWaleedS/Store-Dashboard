import React, { useState, useContext, useEffect } from "react";

// Third Party
import axios from "axios";
import * as XLSX from "xlsx";
import { Helmet } from "react-helmet";
import * as FileSaver from "file-saver";
import useFetch from "../../Hooks/UseFetch";
import { useLocation, useNavigate } from "react-router-dom";

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
import { useDispatch, useSelector } from "react-redux";
import {
	ImportedProductsThunk,
	ProductsThunk,
	searchImportProductThunk,
	searchProductThunk,
} from "../../store/Thunk/ProductsThunk";

const Products = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const navigate = useNavigate();
	const dispatch = useDispatch();
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
	const {
		loading,
		reload,
		storeProducts,
		storeProductsPageCount,
		storeProductsCurrentPage,
		souqOtlbhaProducts,
		souqOtlbhaCurrentPage,
		souqOtlbhaPageCount,
	} = useSelector((state) => state.ProductsSlice);
	const { fetchedData: categories } = useFetch("selector/mainCategories");
	// const { loading, reload, setReload } = useFetch(
	// 	`product?page=${pageTarget}&number=${rowsCount}`
	// );

	/** get contact data */
	useEffect(() => {
		dispatch(ProductsThunk({ page: pageTarget, number: rowsCount }));
		dispatch(ImportedProductsThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);

	//---------------------------------------------------------------------------------
	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";
	const handleFile = (file) => {
		setFile(file[0]);
	};
	const getSearchInput = (value) => {
		setSearch(value);
	};
	const getCategorySelected = (value) => {
		setCategory_id(value);
	};
	//-----------------------------------------------------------------------------------------

	// to get Products by
	useEffect(() => {
		if (tabSelected === 1) {
			setProductsData(storeProducts);
		} else {
			setProductsData(souqOtlbhaProducts);
		}
	}, [tabSelected, storeProducts, souqOtlbhaProducts]);

	// search in products
	useEffect(() => {
		if (tabSelected === 1) {
			const debounce = setTimeout(() => {
				if (search !== "") {
					dispatch(
						searchProductThunk({
							query: search,
							page: pageTarget,
							number: rowsCount,
						})
					);
				}
			}, 500);

			return () => {
				clearTimeout(debounce);
			};
		} else {
			const debounce = setTimeout(() => {
				if (search !== "") {
					dispatch(
						searchImportProductThunk({
							query: search,
							page: pageTarget,
							number: rowsCount,
						})
					);
				}
			}, 500);

			return () => {
				clearTimeout(debounce);
			};
		}
	}, [search, tabSelected]);

	// Filter by
	// useEffect(() => {
	// 	if (category_id !== "") {
	// 		setProductsResult(
	// 			productsFilterSearch?.filter(
	// 				(item) => item?.category?.id === category_id
	// 			)
	// 		);
	// 	} else {
	// 		setProductsResult(productsFilterSearch);
	// 	}
	// }, [productsFilterSearch, category_id]);

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
					Authorization: `Bearer ${store_token}`,
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
						categories={categories?.data?.categories}
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
						reload={reload}
						loading={loading}
						rowsCount={rowsCount}
						setRowsCount={setRowsCount}
						pageTarget={pageTarget}
						tabSelectedId={tabSelected}
						setPageTarget={setPageTarget}
						pageCount={
							tabSelected === 1 ? storeProductsPageCount : souqOtlbhaPageCount
						}
						currentPage={
							tabSelected === 1
								? storeProductsCurrentPage
								: souqOtlbhaCurrentPage
						}
					/>
				</div>

				{/** Add Product Form store page Modal*/}
				<AddProductFromStoreModal />
				{/** Add new Product */}
			</div>
		</>
	);
};

export default Products;
