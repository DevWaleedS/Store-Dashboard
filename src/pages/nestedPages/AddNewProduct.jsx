import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../../Context/context";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import useFetch from "../../Hooks/UseFetch";
// import Dropzone Library
import { useDropzone } from "react-dropzone";
//
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Button } from "@mui/material";
import { LoadingContext } from "../../Context/LoadingProvider";

// icons and images
import { ReactComponent as UploadIcon } from "../../data/Icons/icon-24-uplad.svg";
import { IoIosArrowDown } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";

const style = {
	position: "fixed",
	top: "80px",
	left: "0%",
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

const AddNewProduct = () => {
	const { fetchedData: categories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);

	const navigate = useNavigate();
	const [reload, setReload] = useState(false);
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [openSubCategory, setOpenSubCategory] = useState(false);
	const {
		register,
		handleSubmit,
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
	const [product, setProduct] = useState({
		selling_price: "",
		discount_price: "",
		stock: "",
		category_id: "",
		subcategory_id: [],
	});
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
	const [icons, setIcons] = React.useState([]);
	// Get some methods form useDropZone
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/*": ["jpg", "png"],
		},

		onDrop: (acceptedFiles) => {
			setIcons(
				acceptedFiles.map((banners) =>
					Object.assign(banners, {
						preview: URL.createObjectURL(banners),
					})
				)
			);
		},
	});

	// get banners
	const bannersImage = icons.map((banner) => (
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

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setProduct((prevProduct) => {
			return { ...prevProduct, [name]: value };
		});
	};

	const subcategory =
		categories?.data?.categories?.filter(
			(sub) => sub?.id === parseInt(product?.category_id)
		) || "";

	/* UseEffects TO Handle memory leaks */
	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => icons.forEach((banner) => URL.revokeObjectURL(banner.preview));
	}, []);

	const addNewProduct = (data) => {
		setLoadingTitle("جاري اضافة المنتج");
		resetCouponError();
		let formData = new FormData();
		formData.append("name", data?.name);
		formData.append("description", data?.description);
		formData.append("selling_price", data?.selling_price);
		formData.append("category_id", data?.category_id);
		formData.append("discount_price", data?.discount_price);
		formData.append("stock", data?.stock);
		formData.append("SEOdescription", data?.SEOdescription);
		formData.append("cover", icons[0]);
		for (let i = 0; i < product?.subcategory_id?.length; i++) {
			formData.append([`subcategory_id[${i}]`], product?.subcategory_id[i]);
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/product`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Products");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setReload(!reload);
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
				<title>لوحة تحكم أطلبها | اضافة منتج</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Products")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='add-form-wrapper'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> اضافة منتج</h5>
										<p>قم بإضافة منتجك والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>

							<form
								className='form-h-full'
								onSubmit={handleSubmit(addNewProduct)}>
								<div className='form-body'>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='product-image'>
												{" "}
												صورة المنتج <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<div {...getRootProps()}>
												<div className='add-image-btn-box'>
													<UploadIcon />
													<div className='add-image-btn'>
														<label htmlFor='add-image'> اسحب الصورة هنا</label>
														<input {...getInputProps()} id='add-image' />
													</div>
													<span>( سيتم قبول الصور jpeg & png )</span>
												</div>
											</div>

											{/** preview banner here */}
											{bannersImage.length > 0 && (
												<div className=' banners-preview-container'>
													{bannersImage}
												</div>
											)}
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											{productError?.cover && (
												<span className='fs-6 text-danger'>
													{productError?.cover}
												</span>
											)}
										</div>
									</div>

									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='product-name'>
												{" "}
												اسم المنتح <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<input
												type='text'
												id='product-name'
												placeholder=' اسم المنتج'
												name='name'
												{...register("name", {
													required: "حقل الاسم مطلوب",
													pattern: {
														value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
														message: "يجب على الحقل الاسم أن يكون نصاّّ",
													},
												})}
											/>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.name}
												{errors?.name && errors.name.message}
											</span>
										</div>
									</div>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='product-desc'>
												{" "}
												وصف المنتج <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<textarea
												id='product-desc'
												placeholder='  قم بكتابه واضح للمنتج'
												name='description'
												{...register("description", {
													required: "حقل الوصف مطلوب",
												})}></textarea>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.description}
												{errors?.description && errors.description.message}
											</span>
										</div>
									</div>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='product-category'>
												{" "}
												التصنيف الرئيسي<span className='text-danger'>
													*
												</span>{" "}
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<FormControl sx={{ m: 0, width: "100%" }}>
												<Controller
													name={"category_id"}
													control={control}
													rules={{ required: "حقل التصنيف الرئيسي مطلوب" }}
													render={({ field: { onChange, value } }) => (
														<Select
															name='category_id'
															value={value}
															onChange={(e) => {
																if (value !== e.target.value) {
																	setProduct({
																		...product,
																		subcategory_id: [],
																	});
																}
																handleOnChange(e);
																onChange(e);
															}}
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
															IconComponent={IoIosArrowDown}
															displayEmpty
															inputProps={{ "aria-label": "Without label" }}
															renderValue={(selected) => {
																if (product?.category_id === "" || !selected) {
																	return (
																		<p className='text-[#ADB5B9]'>
																			اختر التصنيف
																		</p>
																	);
																}
																const result =
																	categories?.data?.categories?.filter(
																		(item) => item?.id === parseInt(selected)
																	) || "";
																return result[0]?.name;
															}}>
															{categories?.data?.categories?.map(
																(cat, index) => {
																	return (
																		<MenuItem
																			key={index}
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
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.category_id}
												{errors?.category_id && errors.category_id.message}
											</span>
										</div>
									</div>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='sub-category'>التصنيف الفرعي</label>
										</div>
										<div className='col-md-7 col-12'>
											<FormControl sx={{ m: 0, width: "100%" }}>
												<Select
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
													IconComponent={IoIosArrowDown}
													multiple
													displayEmpty
													inputProps={{ "aria-label": "Without label" }}
													name='subcategory_id'
													value={product?.subcategory_id}
													onChange={(e) => handleOnChange(e)}
													input={<OutlinedInput />}
													renderValue={(selected) => {
														if (product?.subcategory_id.length === 0) {
															return "التصنيف الفرعي";
														}
														return selected.map((item) => {
															const result =
																subcategory[0]?.subcategory?.filter(
																	(sub) => sub?.id === parseInt(item)
																);

															return `${result[0]?.name} ,`;
														});
													}}
													open={openSubCategory}
													onClick={() => {
														setOpenSubCategory(true);
													}}>
													{subcategory[0]?.subcategory?.map((sub, index) => (
														<MenuItem key={index} value={sub?.id}>
															<Checkbox
																checked={
																	product?.subcategory_id?.indexOf(sub?.id) > -1
																}
															/>
															<ListItemText primary={sub?.name} />
														</MenuItem>
													))}
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
											</FormControl>
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
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='price'>
												{" "}
												المخزون <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<input
												type='number'
												id='stock'
												placeholder='اضف الكمية'
												name='stock'
												{...register("stock", {
													required: "حقل المخزون مطلوب",
													pattern: {
														value: /^[0-9]+$/i,
														message: "يجب على الحقل المخزون أن يكون رقمًا",
													},
													min: {
														value: 1,
														message: "  المخزون يجب ان يكون اكبر من 0",
													},
												})}
											/>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.stock}
												{errors?.stock && errors.stock.message}
											</span>
										</div>
									</div>

									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='price'>
												{" "}
												السعر <span className='text-danger'>*</span>{" "}
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<Controller
												name={"selling_price"}
												control={control}
												rules={{
													required: "حقل سعر البيع مطلوب",
													pattern: {
														value: /^[0-9]+$/i,
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
														type='number'
														id='price'
														value={value}
														onChange={(e) => {
															handleOnChange(e);
															onChange(e);
														}}
													/>
												)}
											/>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.selling_price}
												{errors?.selling_price && errors.selling_price.message}
											</span>
										</div>
									</div>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='low-price'> السعر بعد الخصم </label>
										</div>
										<div className='col-md-7 col-12'>
											<Controller
												name={"discount_price"}
												control={control}
												render={({ field: { onChange, value } }) => (
													<input
														name={"discount_price"}
														type='number'
														id='low-price'
														value={value}
														onChange={(e) => {
															handleOnChange(e);
															onChange(e);
														}}
													/>
												)}
											/>
										</div>
										<div className='col-md-3 col-12'></div>
										{product?.discount_price && product?.selling_price && (
											<div className='col-md-7 col-12'>
												{Number(product?.selling_price) -
													Number(product?.discount_price) <=
													0 && (
													<span className='fs-6' style={{ color: "red" }}>
														يجب ان يكون سعر التخفيض اقل من السعر الأساسي
													</span>
												)}
											</div>
										)}

										{product?.discount_price &&
											product?.selling_price === "" && (
												<div className='col-md-7 col-12'>
													<span className='fs-6' style={{ color: "red" }}>
														يرجي ادخال السعر الأساسي أولاّّ حتي تتمكن من ادخال
														سعر الخصم
													</span>
												</div>
											)}
										<div className='col-md-7 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.discount_price}
												{errors?.discount_price &&
													errors.discount_price.message}
											</span>
										</div>
									</div>

									<div className='row mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='seo'> وصف محركات البحث SEO </label>
										</div>
										<div className='col-md-7 col-12'>
											<textarea
												id='SEOdescription'
												name='SEOdescription'
												placeholder='يرجى كتابة وصف دقيق للمنتج حتى يمكنك استخدامه في عملية الترويج للمنتج'
												{...register("SEOdescription", {})}></textarea>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
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
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default AddNewProduct;
