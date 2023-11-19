import React, { useState, useContext } from "react";

// Third Party
import axios from "axios";
import * as XLSX from "xlsx";
import { Helmet } from "react-helmet";
import * as FileSaver from "file-saver";
import useFetch from "../../Hooks/UseFetch";
import { useNavigate } from "react-router-dom";

// Components
import { DropCSVFiles, FormSearchWeight } from "./index";
import { BigProductsTable } from "../../components/Tables";

// Icons
import { MdAdd } from "react-icons/md";
import { useCookies } from "react-cookie";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// Components
import { AddProductFromStoreModal } from "../nestedPages/SouqOtlbha";

const Products = () => {
	const [cookies] = useCookies(["access_token"]);

	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";

	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/product"
	);
	const { fetchedData: categories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);

	const navigate = useNavigate();
	const [file, setFile] = useState("");
	const [search, setSearch] = useState("");

	// Context
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [fileError, setFileError] = useState("");
	const [category_id, setCategory_id] = useState("");

	const handleFile = (file) => {
		setFile(file[0]);
	};

	let products = fetchedData?.data?.products;
	let filterProducts = products;

	const getSearchInput = (value) => {
		setSearch(value);
	};
	const getCategorySelected = (value) => {
		setCategory_id(value);
	};

	if (search !== "") {
		products = fetchedData?.data?.products?.filter((item) =>
			item?.name.includes(search)
		);
	} else {
		products = fetchedData?.data?.products;
	}

	if (category_id !== "") {
		filterProducts = products?.filter(
			(item) => item?.category?.id === category_id
		);
	} else {
		filterProducts = products;
	}

	const exportToCSV = () => {
		const ws = XLSX.utils.json_to_sheet(
			filterProducts?.map((item) => ({
				id: item?.id,
				name: item?.name,
				description: item?.description,
				selling_price: item?.selling_price,
				category_id: item?.category?.name,
				discount_price: item?.discount_price,
				subcategory_id: item?.subcategory?.map((sub) => sub?.name)?.toString(),
				stock: item?.stock,
				cover: item?.cover,
				seo: item?.SEOdescription,
			}))
		);
		const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
		const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
		const data = new Blob([excelBuffer], { type: fileType });
		FileSaver.saveAs(data, "StoreProducts" + fileExtension);
	};

	const uploadFile = () => {
		setLoadingTitle("جاري رفع الملف");
		setFileError("");
		let formData = new FormData();
		formData.append("file", file);
		axios
			.post(`https://backend.atlbha.com/api/Store/import-products`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setFile("");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setFileError(res?.data?.message?.en?.file?.[0]);
					setReload(!reload);
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | المنتجات</title>
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
								<span className='me-2'>إضافة منتج جديد</span>
							</button>
						</div>
					</div>
				</div>
				<div className='category-table'>
					<BigProductsTable
						data={filterProducts}
						loading={loading}
						reload={reload}
						setReload={setReload}
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
