import React, { useContext, useState } from "react";

// Third party
import * as XLSX from "xlsx";
import * as FileSaver from "file-saver";
import { toast } from "react-toastify";

// Icons
import { BsBoxSeam } from "react-icons/bs";
import { PiToolboxLight } from "react-icons/pi";

// Context
import { LoadingContext } from "../../Context/LoadingProvider";

// Component
import DropCSVFiles from "./DropCSVFiles";

// RTK Query
import { useImportProductsFileMutation } from "../../store/apiSlices/productsApi";
import { PagesDropdown } from "../../components";

const dropDownData = {
	main_title: "اضافة جديدة",
	subMenu: [
		{
			id: 1,
			sub_path: "addProduct",
			sub_title: "اضافة منتج جديد",
			icon: <BsBoxSeam />,
		},
		{
			id: 2,
			sub_path: "add-service",
			sub_title: "اضافة خدمة جديدة",
			icon: <PiToolboxLight />,
		},
	],
};

const ImportEndExportProducts = ({ productsData }) => {
	const [file, setFile] = useState("");
	const [fileError, setFileError] = useState("");
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const fileType =
		"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
	const fileExtension = ".xlsx";

	// handle add file
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

	// handle import the product file
	const [importProductsFile, { isLoading }] = useImportProductsFileMutation();
	const handleImportProductsFile = async () => {
		setLoadingTitle("جاري رفع الملف");
		setFileError("");

		// data that send to api
		let formData = new FormData();
		formData.append("file", file);

		// make request...
		try {
			const response = await importProductsFile({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				setFile("");
			} else {
				setLoadingTitle("");
				setLoadingTitle("");
				setFileError(response?.data?.message?.en?.file?.[0]);

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);
			}
		} catch (error) {
			console.error("Error changing importProductsFile:", error);
		}
	};

	return (
		<div className='mange-file d-flex justify-content-between bg-white '>
			<div className='export-upload-btn-group d-flex justify-content-between'>
				<div className='export-files'>
					<button onClick={exportToCSV} className='export-btn' type='button'>
						تصدير
					</button>
				</div>
				<div className='upload-files'>
					<button
						disabled={!file || isLoading}
						onClick={handleImportProductsFile}
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
				<PagesDropdown dropDownData={dropDownData} />
			</div>
		</div>
	);
};

export default ImportEndExportProducts;
