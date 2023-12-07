import React, { useState, useEffect, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useNavigate, useParams } from "react-router-dom";

// Context
import Context from "../../../Context/context";

// Components
import useFetch from "../../../Hooks/UseFetch";
import CircularLoading from "../../../HelperComponents/CircularLoading";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// icons and images
import { Controller, useForm } from "react-hook-form";
import { CurrencyIcon, PlayVideo } from "../../../data/Icons";

const style = {
	position: "fixed",
	top: "80px",
	left: "-1%",
	transform: "translate(0%, 0%)",
	width: "70%",
	height: "100%",
	overflow: "auto",
	bgcolor: "#fff",
	paddingBottom: "80px",
	"@media(max-width:992px)": {
		width: "80%",
	},
	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		backgroundColor: "#F6F6F6",
		paddingBottom: 0,
	},
};

const ShowImportEtlobhaProduct = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/product/${id}`
	);
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const [imagesPreview, setImagesPreview] = useState();
	const [isActive, setIsActive] = useState(null);
	const [product, setProduct] = useState({
		name: "",
		description: "",
		short_description: "",
		selling_price: "",
		discount_price: "",
		price: "",
		stock: "",
		qty: "",
	});

	const {
		register,
		handleSubmit,
		reset,
		control,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			name: "",
			description: "",
			short_description: "",
			selling_price: "",
			price: "",
			stock: "",
			qty: "",
		},
	});

	/**
	 * --------------------------------------------------------------------
	 * to handle errors
	 * --------------------------------------------------------------------
	 */

	useEffect(() => {
		reset(product);
	}, [product, reset]);

	const [productError, setProductError] = useState({
		name: "",
		cover: "",
		price: "",
		qty: "",
		selling_price: "",
		category_id: "",
		discount_price: "",
		discount_percent: "",
		subcategory_id: "",
		stock: "",
		SEOdescription: "",
	});

	const resetCouponError = () => {
		setProductError({
			name: "",
			cover: "",

			selling_price: "",
			price: "",
			qty: "",
			category_id: "",
			discount_price: "",
			discount_percent: "",
			subcategory_id: "",
			stock: "",
			SEOdescription: "",
		});
	};

	/**
	 * --------------------------------------------------------------------
	 * to set data that coming from api
	 * --------------------------------------------------------------------
	 */
	useEffect(() => {
		if (fetchedData?.data?.product) {
			setProduct({
				...product,

				name: fetchedData?.data?.product?.name,
				description: fetchedData?.data?.product?.description,
				short_description: fetchedData?.data?.product?.short_description,
				price: fetchedData?.data?.product?.selling_price,
				qty: fetchedData?.data?.product?.stock,
			});
			setImagesPreview(fetchedData?.data?.product?.cover);
		}
	}, [fetchedData?.data?.product]);

	/**
	 * --------------------------------------------------------------------
	 * Update Import Product Function
	 * --------------------------------------------------------------------
	 */
	const updateImportProduct = (data) => {
		resetCouponError();
		let formData = new FormData();
		formData.append("price", data?.price);
		formData.append("qty", data?.qty);

		axios
			.post(
				`https://backend.atlbha.com/api/Store/updateimportproduct/${fetchedData?.data?.product?.id}`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Products");
					setReload(!reload);
				} else {
					setProductError({
						price: res?.data?.message?.en?.price?.[0],
						qty: res?.data?.message?.en?.qty?.[0],
					});
					toast.error(res?.data?.message?.en?.price?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.qty?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل منتج مستورد</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Products")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style}>
						<div className='add-form-wrapper'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> تعديل منتج مستورد </h5>

										<p> قم بتحديث منتجك والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>
							{loading ? (
								<CircularLoading />
							) : (
								<form
									className='form-h-full'
									onSubmit={handleSubmit(updateImportProduct)}>
									<div className='form-body'>
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-image'>
													{" "}
													الصورة الرئيسية للمنتج
												</label>
											</div>
											{/** preview banner here */}
											<div className='col-md-7 col-12'>
												<div className='import-product-main-image'>
													{imagesPreview?.includes(
														".mp4" || ".avi" || ".mov" || ".mkv"
													) ? (
														<div className='wrapper'>
															<video
																src={imagesPreview}
																className='img-fluid'
																autoPlay
																controls
															/>
														</div>
													) : (
														<div className='wrapper'>
															<img
																loading={"lazy"}
																src={imagesPreview}
																className='img-fluid'
																alt={""}
															/>
														</div>
													)}
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										{/* Multi images */}
										{fetchedData?.data?.product?.images?.length !== 0 && (
											<div className='row mb-md-5 mb-3'>
												<div className='col-md-3 col-12'>
													<label htmlFor='product-name'>
														الصور المتعددة او الفيديو{" "}
													</label>
												</div>

												<div className='col-md-7 col-12 '>
													<div className='d-flex justify-content-start align-items-center gap-2 import-product-multi-images'>
														{fetchedData?.data?.product?.images?.map(
															(item, index) => {
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
																				src={item?.image}
																				className='img-fluid'
																			/>

																			<PlayVideo
																				onClick={() => {
																					setImagesPreview(item?.image);
																				}}
																				style={{
																					fill: "#fff",
																					cursor: "pointer",
																					position: "absolute",
																				}}
																			/>
																		</div>
																	);
																} else {
																	return (
																		<div
																			key={index}
																			onClick={handleClick}
																			className={` d-flex justify-content-center align-items-center ${
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
															}
														)}
													</div>
												</div>
											</div>
										)}

										{/* Product name */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-name'> اسم المنتج </label>
											</div>

											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{
														background: "#eeeeef",
														border: "1px solid #a7a7a71a",
														height: "48px",
														overflowY: "auto",
													}}>
													<div
														style={{ whiteSpace: "normal" }}
														className='price w-100 d-flex justify-content-start align-items-start p-2'>
														{fetchedData?.data?.product?.name}
													</div>
												</div>
											</div>

											<div className='col-md-3 col-12'></div>
										</div>

										{/* Product description */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-desc'> وصف المنتج </label>
											</div>
											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-start'
													style={{
														background: "#eeeeef",
														border: "1px solid #a7a7a71a",
														height: "140px",
														overflowY: "auto",
													}}>
													<div
														style={{ whiteSpace: "normal" }}
														className='price w-100 d-flex justify-content-start align-items-start p-2'>
														{fetchedData?.data?.product?.description}
													</div>
												</div>
											</div>

											<div className='col-md-3 col-12'></div>
										</div>

										{/* Short description */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-desc'>وصف قصير للمنتج</label>
											</div>
											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-start'
													style={{
														background: "#eeeeef",
														border: "1px solid #a7a7a71a",
														height: "140px",
													}}>
													<div
														style={{ whiteSpace: "normal" }}
														className='price w-100 d-flex justify-content-start align-items-start p-2'>
														{fetchedData?.data?.product?.short_description}
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										{/* Main category */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-category'>
													{" "}
													النشاط أو التصنيف الرئيسي
												</label>
											</div>
											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{
														background: "#eeeeef",
														border: "1px solid #a7a7a71a",
														height: "48px",
													}}>
													<div className='price w-100 d-flex justify-content-center align-items-center p-2'>
														{fetchedData?.data?.product?.category?.name}
													</div>
												</div>
											</div>

											<div className='col-md-3 col-12'></div>
										</div>

										{/* sub category */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='sub-category'>
													{" "}
													النشاطات و التصنيفات الفرعية{" "}
												</label>
											</div>
											<div className='col-md-7 col-12'>
												<div className='sub-category '>
													{fetchedData?.data?.product?.subcategory?.length ===
													0 ? (
														<div
															className='d-flex align-items-center justify-content-center gap-3 '
															style={{ color: "#1dbbbe", fontSize: "16px" }}>
															(لا يوجد تصنيفات فرعية)
														</div>
													) : (
														<div className='d-flex flex-wrap align-items-center justify-content-start gap-1'>
															{fetchedData?.data?.product?.subcategory?.map(
																(sub, index) => (
																	<div key={index} className='tags'>
																		{sub?.name}
																	</div>
																)
															)}
														</div>
													)}
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
											<div className='col-md-7 col-12'>
												{productError?.subcategory_id && (
													<span className='fs-6 text-danger'>
														{productError?.subcategory_id}
													</span>
												)}
											</div>
										</div>

										{/* purchasing_price */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='price'> سعر الشراء </label>
											</div>
											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{
														background: "#eeeeef",
														border: "1px solid #a7a7a71a",
														height: "48px",
													}}>
													<div className='currency_icon d-flex justify-content-center align-items-center'>
														<CurrencyIcon />
													</div>
													<div className='price w-100 d-flex justify-content-center align-items-center import_products_input'>
														{fetchedData?.data?.product?.purchasing_price}
													</div>

													<div
														className='currency d-flex justify-content-center align-items-center'
														style={{ fontSize: "18px" }}>
														ر.س
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										{/* Selling Price */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='price'>
													سعر البيع<span className='important-hint'>*</span>
												</label>
												<br />
											</div>
											<div className='col-md-7 col-12'>
												<div className='tax-text'>السعر يشمل الضريبة</div>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{ background: "#FFF" }}>
													<div className='currency_icon d-flex justify-content-center align-items-center'>
														<CurrencyIcon />
													</div>
													<Controller
														name={"price"}
														control={control}
														rules={{
															required: "حقل سعر البيع مطلوب",
															pattern: {
																value: /^[0-9.]+$/i,
																message: "يجب أن يكون سعر البيع رقمًا",
															},
															min: {
																value: 1,
																message: "يجب أن يكون سعر البيع أكبر من 0",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																className='import_products_input'
																style={{
																	background: "#FFF",
																	height: "48px",
																}}
																name={"price"}
																type='text'
																id='price'
																value={value}
																onChange={(e) => {
																	setProduct({
																		...product,
																		price: e.target.value.replace(
																			/[^\d.]|\.(?=.*\.)/g,
																			""
																		),
																	});
																	onChange(
																		e.target.value.replace(
																			/[^\d.]|\.(?=.*\.)/g,
																			""
																		)
																	);
																}}
															/>
														)}
													/>

													<div
														className='currency d-flex justify-content-center align-items-center'
														style={{ fontSize: "18px" }}>
														ر.س
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
											<div className='col-md-7 col-12'>
												{Number(product?.price) <
													Number(
														fetchedData?.data?.product?.purchasing_price
													) && (
													<span className='fs-6 text-danger'>
														السعر يجب ان يكون اكبر من او يساوي (
														{fetchedData?.data?.product?.purchasing_price})
													</span>
												)}

												<div className='fs-6 text-danger'>
													{errors?.price && errors.price.message}
												</div>
											</div>
										</div>

										{/* Stock */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='price'>الكمية في المخزون </label>
											</div>

											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{
														background: "#eeeeef",
														border: "1px solid #a7a7a71a",
														height: "48px",
													}}>
													<div className='price w-100 d-flex justify-content-center align-items-center import_products_input'>
														{fetchedData?.data?.product?.mainstock}
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										{/* Stock */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='price'>
													{" "}
													الكمية التي قمت باستيرادها{" "}
												</label>
											</div>

											<div className='col-md-7 col-12'>
												<div className='tax-text'>
													يمكنك تعديل الكمية التي قمت باستيرادها{" "}
												</div>
												<div className='price w-100 d-flex justify-content-center align-items-center import_products_input'>
													{" "}
													<Controller
														name={"qty"}
														control={control}
														rules={{
															required: "حقل الكمية في المخزون  مطلوب",
															pattern: {
																value: /^[0-9.]+$/i,
																message: "يجب أن تكون الكمية في المخزون  رقمًا",
															},
															min: {
																value: 1,
																message:
																	"يجب أن تكون  الكمية في المخزون أكبر من 0",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																className='import_products_input'
																style={{
																	background: "#FFF",
																	height: "48px",
																	borderRadius: "0",
																}}
																name={"qty"}
																type='text'
																id='qty'
																value={value}
																onChange={(e) => {
																	setProduct({
																		...product,
																		qty: e.target.value.replace(
																			/[^\d.]|\.(?=.*\.)/g,
																			""
																		),
																	});
																	onChange(
																		e.target.value.replace(
																			/[^\d.]|\.(?=.*\.)/g,
																			""
																		)
																	);
																}}
															/>
														)}
													/>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
											<div className='col-md-7 col-12'>
												{Number(product?.qty) >
													Number(fetchedData?.data?.product?.stock) && (
													<span className='fs-6 text-danger'>
														الكمية المطلوبة غير متوفرة
													</span>
												)}

												<div className='fs-6 text-danger'>
													{errors?.qty && errors.qty.message}
												</div>
											</div>
										</div>
									</div>
									<div className='form-footer'>
										<div className='row d-flex justify-content-center align-items-center'>
											<div className='col-lg-4 col-6'>
												<button className='save-btn' type='submit'>
													حفظ
												</button>
											</div>
											<div className='col-lg-4 col-6'>
												<button
													className='close-btn'
													onClick={() => navigate("/Products")}>
													إلغاء
												</button>
											</div>
										</div>
									</div>
								</form>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default ShowImportEtlobhaProduct;
