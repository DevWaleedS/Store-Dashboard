import React, { useContext, useEffect, useState } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

// Components

import CircularLoading from "../../../HelperComponents/CircularLoading";

// Context
import Context from "../../../Context/context";
import { LoadingContext } from "../../../Context/LoadingProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Icons
import { IoIosCloseCircleOutline } from "react-icons/io";
import { CurrencyIcon } from "../../../data/Icons";
import { PlayVideo } from "../../../data/images";
import ProductOptions from "./ProductOptions";

// RTK Query
import {
	useImportProductToStoreProductsMutation,
	useShowSouqOtlobhaProductByIdQuery,
} from "../../../store/apiSlices/souqOtlobhaProductsApi";

// Select Styles
const modalStyle = {
	position: "absolute",
	top: "90px",
	left: "50%",
	transform: "translate(-50%, 0%)",
	width: 1042,
	maxWidth: "90%",
	height: "auto",
	bgcolor: "#F4F5F7",
	border: "1px solid #ECECEC",
	borderRadius: "6px",
	boxShadow: 24,
	"@media(max-width:768px)": {
		position: "absolute",
		height: "auto",
		top: "20px",
	},
};

const ProductRefund = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	// get product by id
	const { data: currentProduct, isFetching } =
		useShowSouqOtlobhaProductByIdQuery(id);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [open, setOpen] = useState(true);
	const [imagesPreview, setImagesPreview] = useState([]);
	const [isActive, setIsActive] = useState(null);
	const [optionID, setOptionID] = useState(null);
	const [productPrice, setProductPrice] = useState(
		currentProduct?.purchasing_price
	);
	const [productQty, setProductQty] = useState(currentProduct?.stock);
	const [productLessQty, setProductLessQty] = useState(
		currentProduct?.less_qty
	);
	const [selectedValues, setSelectedValues] = useState([]);

	const handleChangeOptions = (e, index) => {
		const { value } = e.target;
		setSelectedValues((prevSelectedValues) => {
			const updatedValues = [...prevSelectedValues];
			updatedValues[index] = value;
			return updatedValues;
		});
	};

	// Handle product info
	const [productInfo, setProductInfo] = useState({
		id: id,
		price: "",
		qty: "",
	});

	// Handle Errors
	const [productErrors, setProductErrors] = useState({
		price: "",
		qty: "",
		less_qty: "",
	});

	const resetProductErrors = () => {
		setProductErrors({
			price: "",
			qty: "",
			less_qty: "",
		});
	};

	useEffect(() => {
		if (selectedValues?.length === 0) {
			setSelectedValues(getOptions(currentProduct));
		}
	}, [currentProduct, selectedValues?.length]);

	const findMatchingSubArray = (nestedArray, array) => {
		for (let i = 0; i < nestedArray?.length; i++) {
			const subArray = nestedArray[i];
			const subArrayValue = subArray?.name?.ar;
			if (array?.every((value) => subArrayValue?.includes(value))) {
				return {
					id: subArray?.id,
					price: subArray?.price,
					less_qty: subArray?.less_qty,
					quantity: subArray?.quantity,
				};
			}
		}

		return null;
	};

	useEffect(() => {
		if (
			selectedValues?.filter((value) => value !== "")?.length > 0 &&
			currentProduct?.amount === 1
		) {
			const optionNames = currentProduct?.options?.map((option) => option);
			const matchingSubArray = findMatchingSubArray(
				optionNames,
				selectedValues?.filter((value) => value !== "")
			);
			setOptionID(Number(matchingSubArray?.id));
			setProductPrice(Number(matchingSubArray?.price));
			setProductQty(Number(matchingSubArray?.quantity));
			setProductLessQty(Number(matchingSubArray?.less_qty));
		} else {
			setOptionID(null);
			setProductPrice(currentProduct?.purchasing_price);
			setProductQty(currentProduct?.stock);
			setProductLessQty(currentProduct?.less_qty);
		}
	}, [selectedValues, currentProduct]);

	const getOptions = (product) => {
		const attributesName = product?.attributes?.map((attributes) =>
			attributes?.values?.filter((item) => item?.value?.[1] === "1")
		);
		if (attributesName?.length > 0) {
			return attributesName?.map((attribute) => attribute?.[0]?.value?.[0]);
		} else {
			return [];
		}
	};

	// To Get All Info About Product
	useEffect(() => {
		if (currentProduct) {
			setProductInfo({
				...productInfo,
				price: currentProduct?.purchasing_price,
			});

			setImagesPreview(currentProduct?.cover);
		}
	}, [currentProduct]);
	// --------------------------------------------------------------

	// Handle Import Product from souq etlobha products to store products
	const [importProductToStoreProducts, { isLoading }] =
		useImportProductToStoreProductsMutation();

	const handleImportProduct = async () => {
		resetProductErrors();
		setLoadingTitle("جاري اضافة المنتج إلى سلة الاستيراد");

		// Data that send to api...
		let formData = new FormData();
		formData.append("data[0][id]", productInfo?.id);
		formData.append("data[0][price]", productPrice);
		formData.append("data[0][qty]", productInfo?.qty);
		if (optionID !== null) {
			formData.append("data[0][option_id]", optionID);
		}

		// make request...
		try {
			const response = await importProductToStoreProducts({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				setEndActionTitle(response?.data?.message?.ar);
				navigate("/Products/SouqOtlobha");
			} else {
				setLoadingTitle("");
				setProductErrors({
					...productErrors,
					price: response?.data?.message?.en?.["data.0.price"]?.[0],
					qty: response?.data?.message?.en?.["data.0.qty"]?.[0],
					less_qty: response?.data?.message?.ar,
				});

				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);

				toast.error(response?.data?.message?.en?.["data.0.price"]?.[0], {
					theme: "light",
				});
				toast.error(response?.data?.message?.en?.["data.0.qty"]?.[0], {
					theme: "light",
				});
			}
		} catch (error) {
			console.error("Error changing importProductToStoreProducts:", error);
		}
	};

	const handleQut = (less_qty) => {
		if (less_qty === 1) {
			return "قطعة واحدة";
		} else if (less_qty === 2) {
			return "قطعتين";
		} else if (less_qty >= 3 && less_qty <= 10) {
			return `${less_qty} قطع `;
		} else if (less_qty > 10) {
			return `${less_qty} قطعة `;
		}
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | استيراد منتج</title>
			</Helmet>
			<div className='ProductRefund' open={open}>
				<Modal
					open={open}
					onClose={() => {
						navigate(`/Products/SouqOtlobha`);
					}}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={modalStyle}>
						<div className='ProductRefund-wrapper p-md-4 p-3'>
							<div className='header w-100 d-flex justify-content-end align-items-center '>
								<IoIosCloseCircleOutline
									style={{ width: "25px", height: "25px", cursor: "pointer" }}
									className='close-icon '
									onClick={() => {
										navigate(`/Products/SouqOtlobha`);
									}}
								/>
							</div>
							{isFetching ? (
								<div className='mt-5 h-100 d-flex flex-column align-items-center justify-content-cneter'>
									<CircularLoading />
								</div>
							) : (
								<div className='body'>
									<div className='row container-row overflow-hidden'>
										<div className='col-12'>
											<div className='product-title mb-3 '>
												{currentProduct?.name}
											</div>
										</div>
										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<div className='product-images mb-3'>
												<div className='main-image'>
													{imagesPreview?.includes(
														".mp4" || ".avi" || ".mov" || ".mkv"
													) ? (
														<div className='video_wrapper'>
															<video
																src={imagesPreview}
																className='img-fluid'
																autoPlay
																controls
															/>
														</div>
													) : (
														<img
															loading={"lazy"}
															src={imagesPreview}
															alt='product'
															className='img-fluid'
														/>
													)}
												</div>
												<div className='another-image'>
													{currentProduct?.images?.map((item, index) => {
														const isVideo = item?.image.includes(
															".mp4" || ".avi" || ".mov" || ".mkv"
														);
														const handleClick = () => {
															setImagesPreview(item?.image);
															setIsActive(index);
														};

														if (isVideo) {
															return (
																<div
																	key={index}
																	onClick={handleClick}
																	className={`video_wrapper ${
																		isActive === index ? "active" : ""
																	}`}>
																	<video
																		onClick={() => {
																			setImagesPreview(item?.image);
																		}}
																		style={{
																			cursor: "pointer",
																		}}
																		poster={PlayVideo}
																		src={item?.image}
																		className='img-fluid'
																	/>
																</div>
															);
														} else {
															return (
																<div
																	key={index}
																	onClick={handleClick}
																	className={`${
																		isActive === index ? "active" : ""
																	}`}>
																	<img
																		style={{
																			cursor: "pointer",
																			objectFit: "contain",
																		}}
																		onClick={() => {
																			setImagesPreview(item?.image);
																		}}
																		src={item?.image}
																		alt={item?.image}
																		className='img-fluid'
																	/>
																</div>
															);
														}
													})}
												</div>
											</div>

											<div className='product-category'>
												<h3 className='text-center mb-3'>أنشطة المنتج</h3>
												<div className='main-category category mb-3'>
													<div className='label mb-2'>النشاط الرئيسي</div>
													<div className='input'>
														{currentProduct?.category?.name}
													</div>
												</div>
												<div className='sub-category category'>
													<div className='label mb-2'>الأنشطة الفرعية </div>
													<div className='d-flex flex-wrap align-items-center justify-content-start flex-wrap gap-1'>
														{currentProduct?.subcategory?.length === 0 ? (
															<div
																className='tags'
																style={{
																	color: "#1dbbbe",
																}}>
																لا يوجد أنشطة فرعية
															</div>
														) : (
															currentProduct?.subcategory?.map((sub, index) => (
																<div key={index} className='tags'>
																	{sub?.name}
																</div>
															))
														)}
													</div>
												</div>
											</div>
										</div>
										<div className='col-md-6 col-12'>
											{currentProduct?.attributes?.length > 0 && (
												<ProductOptions
													attributes={currentProduct?.attributes}
													selectedValues={selectedValues}
													updateSelectOptions={handleChangeOptions}
												/>
											)}
											{/* purchasing_price */}
											<div className='product-price mb-3'>
												<div className='label mb-1'>سعر الشراء</div>
												<div className='input d-flex justify-content-center align-items-center'>
													<div className='price-icon d-flex align-items-center  p-2 gap-3'>
														<CurrencyIcon />
														<div className='price w-100 d-flex justify-content-center align-items-center'>
															{productPrice}
														</div>
													</div>

													<div className='currency d-flex justify-content-center align-items-center'>
														ر.س
													</div>
												</div>
											</div>

											{/* Selling Price */}
											<div className='product-price mb-3'>
												<div className='label selling-price-label mb-1'>
													أقل كمية يمكنك استيرادها من هذا المنتج
													<span style={{ color: "#ff3838", marginLeft: "5px" }}>
														{" "}
														*{" "}
													</span>
													<span>({handleQut(productLessQty)})</span>
												</div>
												<div className='input d-flex justify-content-center align-items-center'>
													<div className='price-icon d-flex align-items-center p-2 gap-3'>
														<CurrencyIcon className='invisible ' />
														<div className='price w-100 d-flex justify-content-center align-items-center'>
															<input
																className='text-center'
																style={{
																	direction: "ltr",
																}}
																type='text'
																name='qty'
																placeholder='حدد الكمية الخاص بك'
																value={productInfo?.qty}
																onChange={(e) => {
																	setProductInfo({
																		...productInfo,
																		qty: e.target.value.replace(
																			/[^\d.]|\.(?=.*\.)/g,
																			""
																		),
																	});
																	setProductErrors({
																		...productErrors,
																		qty: "",
																	});
																}}
															/>
														</div>
													</div>

													<div className='currency d-flex justify-content-center align-items-center invisible '>
														ر.س
													</div>
												</div>

												{Number(productInfo?.qty) > Number(productQty) && (
													<span className='fs-6 text-danger'>
														الكمية المطلوبة غير متوفرة
													</span>
												)}

												{productInfo?.qty &&
													Number(productInfo?.qty) < Number(productLessQty) && (
														<>
															<span className='fs-6 text-danger'>
																أقل كمية طلب للمنتج {handleQut(productLessQty)}
															</span>
														</>
													)}
												{productErrors?.qty && (
													<>
														<span className='fs-6 text-danger d-block'>
															{productErrors?.qty}
														</span>
													</>
												)}
											</div>

											{/* About This product */}
											<div className='product-price'>
												<div className='label about-product-label mb-2'>
													نبذة عن المنتج
												</div>

												<div
													className='input textarea'
													dangerouslySetInnerHTML={{
														__html: currentProduct?.description,
													}}
												/>
											</div>
										</div>
									</div>
									<div className='d-flex justify-content-center '>
										<button
											className='refund-btn  d-flex justify-content-center align-items-center'
											disabled={isLoading}
											onClick={handleImportProduct}>
											اضافة المنتج إلى سلة الاستيراد
										</button>
									</div>
								</div>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default ProductRefund;
