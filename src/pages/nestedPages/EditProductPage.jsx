import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useFetch from "../../Hooks/UseFetch";
import Context from "../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { useCookies } from "react-cookie";

// import Dropzone Library
import { useDropzone } from "react-dropzone";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";

// icons and images
import { ReactComponent as UploadIcon } from "../../data/Icons/icon-24-uplad.svg";
import { IoIosArrowDown } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from "../../Context/LoadingProvider";

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
	"@media(max-width:768px)": {
		position: "absolute",
		top: 0,
		left: 0,
		width: "100%",
		backgroundColor: "#F6F6F6",
		paddingBottom: 0,
	},
};

const EditProductPage = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/product/${id}`
	);
	const { fetchedData: categories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);

	const [cookies] = useCookies(["access_token"]);
	const [openSubCategory, setOpenSubCategory] = useState(false);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [product, setProduct] = useState({
		name: "",
		description: "",
		selling_price: "",
		category_id: "",
		discount_price: "",
		subcategory_id: [],
		stock: "",
		SEOdescription: "",
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
			selling_price: "",
			category_id: "",
			discount_price: "",
			stock: "",
			SEOdescription: "",
		},
	});

	useEffect(() => {
		if (fetchedData?.data?.product) {
			setProduct({
				...product,
				name: fetchedData?.data?.product?.name,
				description: fetchedData?.data?.product?.description,
				selling_price: fetchedData?.data?.product?.selling_price,
				category_id: fetchedData?.data?.product?.category?.id,
				discount_price: fetchedData?.data?.product?.discount_price,
				subcategory_id: fetchedData?.data?.product?.subcategory?.map(
					(sub) => sub?.id
				),
				stock: fetchedData?.data?.product?.stock,
				SEOdescription: fetchedData?.data?.product?.SEOdescription,
			});
		}
	}, [fetchedData?.data?.product]);

	// To Handle Errors
	useEffect(() => {
		reset(product);
	}, [product, reset]);

	const [productError, setProductError] = useState({
		name: "",
		cover: "",
		description: "",
		selling_price: "",
		category_id: "",
		discount_price: "",
		subcategory_id: "",
		stock: "",
		SEOdescription: "",
	});

	const resetCouponError = () => {
		setProductError({
			name: "",
			cover: "",
			description: "",
			selling_price: "",
			category_id: "",
			discount_price: "",
			subcategory_id: "",
			stock: "",
			SEOdescription: "",
		});
	};

	// Use state with useDropzone library to set banners
	const [icon, setIcon] = React.useState([]);

	// Get some methods form useDropZone
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/jpeg": [],
			"image/png": [],
		},

		onDrop: (acceptedFiles) => {
			setIcon(
				acceptedFiles?.map((banners) =>
					Object.assign(banners, {
						preview: URL.createObjectURL(banners),
					})
				)
			);
		},
	});

	// get banners
	const bannersImage = icon?.map((banner) => (
		<div key={banner.name}>
			<div className='banner-preview' key={banner.path}>
				<img
					src={banner.preview}
					alt='upload banner'
					// Revoke data uri after image is loaded
					onLoad={() => {
						URL.revokeObjectURL(banner.preview);
					}}
				/>
			</div>
		</div>
	));

	/* UseEffects TO Handle memory leaks */
	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => icon.forEach((banner) => URL.revokeObjectURL(banner.preview));
	}, []);

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setProduct((prevProduct) => {
			return { ...prevProduct, [name]: value };
		});
	};

	const subcategory =
		categories?.data?.categories?.filter(
			(sub) => sub?.id === parseInt(product?.category_id)
		) || [];

	const updateProduct = (data) => {
		setLoadingTitle("جاري تعديل المنتج");
		resetCouponError();
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("name", data?.name);
		formData.append("description", data?.description);
		formData.append("selling_price", data?.selling_price);
		formData.append("category_id", data?.category_id);
		formData.append("discount_price", data?.discount_price || 0);
		formData.append("stock", data?.stock);
		formData.append("SEOdescription", data?.SEOdescription);
		for (let i = 0; i < product?.subcategory_id?.length; i++) {
			formData.append([`subcategory_id[${i}]`], product?.subcategory_id[i]);
		}
		if (icon?.length !== 0) {
			formData.append("cover", icon[0] || null);
		}
		axios
			.post(
				`https://backend.atlbha.com/api/Store/product/${fetchedData?.data?.product?.id}`,
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
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Products");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setProductError({
						name: res?.data?.message?.en?.name?.[0],
						cover: res?.data?.message?.en?.cover?.[0],
						description: res?.data?.message?.en?.description?.[0],
						selling_price: res?.data?.message?.en?.selling_price?.[0],
						category_id: res?.data?.message?.en?.category_id?.[0],
						discount_price: res?.data?.message?.en?.discount_price?.[0],

						subcategory_id: res?.data?.message?.en?.subcategory_id?.[0],
						stock: res?.data?.message?.en?.stock?.[0],
						SEOdescription: res?.data?.message?.en?.SEOdescription?.[0],
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل منتج</title>
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
										<h5 className='mb-3'> تعديل المنتج </h5>

										<p> قم بتحديث منتجك والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>
							{loading ? (
								<CircularLoading />
							) : (
								<form
									className='form-h-full'
									onSubmit={handleSubmit(updateProduct)}>
									<div className='form-body'>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-image'>
													{" "}
													صورة المنتج<span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<div {...getRootProps()}>
													<div className='add-image-btn-box '>
														<UploadIcon />
														<div className='add-image-btn'>
															<label htmlFor='add-image'>
																{" "}
																اسحب الصورة هنا
															</label>
															<input
																{...getInputProps()}
																id='add-image'
																disabled={
																	fetchedData?.data?.is_import ? true : false
																}
															/>
														</div>
														<span>( سيتم قبول الصور jpeg & png )</span>
													</div>
												</div>

												{/** preview banner here */}

												<div className=' banners-preview-container'>
													{bannersImage.length > 0 && (
														<div className=' banners-preview-container'>
															{bannersImage}
														</div>
													)}

													<img
														className='w-100 h-100'
														src={fetchedData?.data?.product?.cover}
														alt={fetchedData?.data?.product?.name}
													/>
												</div>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												{productError?.cover && (
													<span className='fs-6 text-danger'>
														{productError?.cover}
													</span>
												)}
											</div>
										</div>

										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-name'>
													اسم المنتج<span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<input
													name='name'
													type='text'
													id='product-name'
													placeholder=' اسم المنتج'
													{...register("name", {
														required: "حقل الاسم مطلوب",
													})}
												/>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.name}
													{errors?.name && errors.name.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-desc'>
													{" "}
													وصف المنتح<span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<textarea
													name='description'
													id='product-desc'
													placeholder='  قم بكتابه واضح للمنتج'
													{...register("description", {
														required: "حقل الوصف مطلوب",
													})}></textarea>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.description}
													{errors?.description && errors.description.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-category'>
													{" "}
													التصنيف الرئيسي<span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<FormControl sx={{ m: 0, width: "100%" }}>
													<Controller
														name={"category_id"}
														control={control}
														rules={{ required: "حقل التصنيف الرئيسي مطلوب" }}
														render={({ field: { onChange, value } }) => (
															<Select
																value={value}
																name='category_id'
																sx={{
																	fontSize: "18px",
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
																		right: "95%",
																	},
																}}
																onChange={(e) => {
																	if (product?.category_id !== e.target.value) {
																		setProduct({
																			...product,
																			subcategory_id: [],
																		});
																	}
																	handleOnChange(e);
																	onChange(e);
																}}
																className='h-100'
																IconComponent={IoIosArrowDown}
																displayEmpty
																inputProps={{ "aria-label": "Without label" }}
																renderValue={(selected) => {
																	if (
																		product?.category_id === "" ||
																		!selected
																	) {
																		return (
																			<p className='text-[#ADB5B9]'>
																				اختر التصنيف
																			</p>
																		);
																	}
																	const result =
																		categories?.data?.categories?.filter(
																			(item) =>
																				item?.id === parseInt(selected) ||
																				item?.id === product?.category_id
																		) || "";
																	return result[0]?.name;
																}}>
																{categories?.data?.categories?.map(
																	(cat, idx) => {
																		return (
																			<MenuItem
																				key={idx}
																				className='souq_storge_category_filter_items'
																				sx={{
																					backgroundColor:
																						"rgba(211, 211, 211, 1)",
																					height: "3rem",
																					"&:hover": {},
																				}}
																				value={`${cat?.id}`}>
																				{cat?.name}
																			</MenuItem>
																		);
																	}
																)}
															</Select>
														)}
													/>
												</FormControl>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.category_id}
													{errors?.category_id && errors.category_id.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='sub-category'>التصنيف الفرعي </label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<FormControl sx={{ m: 0, width: "100%" }}>
													{product?.category_id !== "" &&
													subcategory[0]?.subcategory?.length === 0 ? (
														<div
															className='d-flex justify-content-center align-items-center'
															style={{ color: "#1dbbbe" }}>
															لا يوجد تصنيفات فرعية للتصنيف الرئيسي الذي اخترتة
														</div>
													) : (
														<Select
															sx={{
																"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
																	{
																		paddingRight: "20px",
																	},
															}}
															IconComponent={IoIosArrowDown}
															multiple
															displayEmpty
															inputProps={{ "aria-label": "Without label" }}
															name='subcategory_id'
															value={product?.subcategory_id || []}
															onChange={(e) => handleOnChange(e)}
															input={<OutlinedInput />}
															renderValue={(selected) => {
																if (product?.subcategory_id?.length === 0) {
																	return "التصنيف الفرعي";
																}
																return selected?.map((item) => {
																	const result =
																		subcategory[0]?.subcategory?.filter(
																			(sub) => sub?.id === parseInt(item)
																		) || product?.subcategory_id;
																	return `${result[0]?.name} , `;
																});
															}}
															open={openSubCategory}
															onClick={() => {
																setOpenSubCategory(true);
															}}>
															{subcategory[0]?.subcategory?.map(
																(sub, index) => (
																	<MenuItem key={index} value={sub?.id}>
																		<Checkbox
																			checked={
																				product?.subcategory_id?.indexOf(
																					sub?.id
																				) > -1
																			}
																		/>
																		<ListItemText primary={sub?.name} />
																	</MenuItem>
																)
															)}
															<MenuItem className='select-btn d-flex justify-content-center'>
																<Button
																	className='button'
																	onClick={(e) => {
																		e.stopPropagation();
																		e.preventDefault();
																		setOpenSubCategory(false);
																	}}>
																	أختر
																</Button>
															</MenuItem>
														</Select>
													)}
												</FormControl>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												{productError?.subcategory_id && (
													<span className='fs-6 text-danger'>
														{productError?.subcategory_id}
													</span>
												)}
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='price'> المخزون </label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<Controller
													name={"stock"}
													control={control}
													rules={{
														required: "حقل المخزون مطلوب",
														pattern: {
															value: /^[0-9]+$/i,
															message: "يجب على الحقل المخزون أن يكون رقمًا",
														},
														min: {
															value: 1,
															message: "  المخزون يجب ان يكون اكبر من 0",
														},
													}}
													render={({ field: { onChange, value } }) => (
														<input
															name='stock'
															type='text'
															id='stock'
															placeholder='اضف الكمية'
															value={value}
															onChange={(e) =>
																onChange(e.target.value.replace(/[^0-9]/g, ""))
															}
														/>
													)}
												/>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.stock}
													{errors?.stock && errors.stock.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='price'>
													{" "}
													السعر<span className='text-danger'>*</span>{" "}
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<Controller
													name={"selling_price"}
													control={control}
													rules={{
														required: "حقل سعر البيع مطلوب",
														pattern: {
															value: /^[0-9.]+$/i,
															message: "يجب على الحقل سعر البيع أن يكون رقمًا",
														},
														min: {
															value: 1,
															message: " سعر البيع يجب ان يكون اكبر من 0",
														},
													}}
													render={({ field: { onChange, value } }) => (
														<input
															disabled={product?.discount_price}
															name={"selling_price"}
															type='text'
															id='price'
															value={value}
															onChange={(e) => {
																setProduct({
																	...product,
																	selling_price: e.target.value.replace(
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
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.selling_price}
													{errors?.selling_price &&
														errors.selling_price.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='low-price'> السعر بعد الخصم </label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<Controller
													name={"discount_price"}
													control={control}
													render={({ field: { onChange, value } }) => (
														<input
															name={"discount_price"}
															type='text'
															id='low-price'
															value={value}
															onChange={(e) => {
																setProduct({
																	...product,
																	discount_price: e.target.value.replace(
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
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div
												className={
													product?.discount_price && product?.selling_price
														? "col-lg-7 col-md-9 col-12"
														: "d-none"
												}>
												{Number(product?.selling_price) -
													Number(product?.discount_price) <=
													0 && (
													<span className='fs-6' style={{ color: "red" }}>
														يجب ان يكون سعر التخفيض اقل من السعر الأساسي
													</span>
												)}
											</div>

											<div
												className={
													product?.discount_price &&
													product?.selling_price === ""
														? "col-lg-7 col-md-9 col-12"
														: "d-none"
												}>
												<span className='fs-6' style={{ color: "red" }}>
													يرجي ادخال السعر الأساسي أولاّّ حتي تتمكن من ادخال سعر
													الخصم
												</span>
											</div>

											<div className='col-lg-7 col-md-9 col-12'>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
													{productError?.discount_price}
													{errors?.discount_price &&
														errors.discount_price.message}
												</span>
											</div>
										</div>

										<div className='row mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='seo'> وصف محركات البحث SEO </label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<textarea
													name='SEOdescription'
													id='SEOdescription'
													placeholder='يرجى كتابة وصف دقيق للمنتج حتى يمكنك استخدامه في عملية الترويج للمنتج'
													{...register("SEOdescription", {})}></textarea>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.SEOdescription}
													{errors?.SEOdescription &&
														errors.SEOdescription.message}
												</span>
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

export default EditProductPage;
