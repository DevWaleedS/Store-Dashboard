import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../../Context/context";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import useFetch from "../../Hooks/UseFetch";
// import Dropzone Library
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { TagsInput } from "react-tag-input-component";
import ImageUploading from "react-images-uploading";
//
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
// import { Button } from "@mui/material";
import { LoadingContext } from "../../Context/LoadingProvider";
import TextareaCode from "../../components/TextareaCode/TextareaCode";

// icons and images
import { ReactComponent as UploadIcon } from "../../data/Icons/icon-24-uplad.svg";
import { ReactComponent as LinkIcon } from "../../data/Icons/link.svg";
import { ReactComponent as SnapchatIcon } from "../../data/Icons/icon-24-snapchat-yellow.svg";
import { ReactComponent as TwitterIcon } from "../../data/Icons/Xx.svg";
import { ReactComponent as InstagramIcon } from "../../data/Icons/instagramm.svg";
import { ReactComponent as TiktokIcon } from "../../data/Icons/tiktok.svg";

import { IoIosArrowDown, IoIosAddCircle } from "react-icons/io";
import { BsPlayCircle } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import CloseIcon from "@mui/icons-material/Close";

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
	const {
		register,
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			name: "",
			short_description: "",
			description: "",
			selling_price: "",
			category_id: "",
			discount_price: "",
			stock: "",
			weight: "",
			SEOdescription: "",
		},
	});
	const [product, setProduct] = useState({
		selling_price: "",
		discount_price: "",
		stock: "",
		weight: "",
		category_id: "",
		subcategory_id: [],
	});
	const [shortDescriptionLength, setShortDescriptionLength] = useState(false);
	const [googleAnalyticsLink, setGoogleAnalyticsLink] = useState("");
	const [robotLink, setRobotLink] = useState("");
	const [SEOdescription, setSEOdescription] = useState([]);
	const [instagram, setInstagram] = useState("");
	const [snapchat, setSnapchat] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tiktok, setTiktok] = useState("");
	const [url, setUrl] = useState("");

	// to handle close video privew
	const closeVideoModal = () => {
		setUrl("");
	};

	// to handle errors of Google Analytics Link
	const LINK_REGEX =
		/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
	const [validGoogleAnalyticsLink, setValidGoogleAnalyticsLink] =
		useState(false);
	const [validGoogleAnalyticsLinkFocus, setValidGoogleAnalyticsLinkFocus] =
		useState(false);

	useEffect(() => {
		const storeLinkValidation = LINK_REGEX.test(googleAnalyticsLink);
		setValidGoogleAnalyticsLink(storeLinkValidation);
	}, [googleAnalyticsLink]);

	// to get multi images
	const [multiImages, setMultiImages] = useState([]);
	const emptyMultiImages = [];
	for (let index = 0; index < 5 - multiImages.length; index++) {
		emptyMultiImages.push(index);
	}

	const onChangeMultiImages = (imageList, addUpdateIndex) => {
		setMultiImages(imageList);
	};

	const [productError, setProductError] = useState({
		name: "",
		cover: "",
		short_description: "",
		description: "",
		selling_price: "",
		category_id: "",
		discount_price: "",
		subcategory_id: "",
		stock: "",
		weight: "",
		googleAnalyticsLink: "",
		robotLink: "",
		SEOdescription: "",
		images: "",
		snappixel: "",
		twitterpixel: "",
		tiktokpixel: "",
		instapixel: "",
	});

	const resetCouponError = () => {
		setProductError({
			name: "",
			cover: "",
			short_description: "",
			description: "",
			selling_price: "",
			category_id: "",
			discount_price: "",
			subcategory_id: "",
			stock: "",
			weight: "",
			googleAnalyticsLink: "",
			robotLink: "",
			SEOdescription: "",
			images: "",
			snappixel: "",
			twitterpixel: "",
			tiktokpixel: "",
			instapixel: "",
		});
	};

	// Use state with useDropzone library to set banners
	const [icons, setIcons] = React.useState([]);
	// Get some methods form useDropZone
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/jpeg": [],
			"image/png": [],
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
		) || [];

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
		formData.append("short_description", data?.short_description);
		formData.append("description", data?.description);
		formData.append("selling_price", data?.selling_price);
		formData.append("category_id", data?.category_id);
		formData.append("discount_price", data?.discount_price);
		formData.append("stock", data?.stock);
		formData.append("weight", data?.weight);
		formData.append("google_analytics", googleAnalyticsLink);
		formData.append("robot_link", robotLink);
		formData.append("SEOdescription", SEOdescription.join(","));
		formData.append("snappixel", snapchat);
		formData.append("twitterpixel", twitter);
		formData.append("tiktokpixel", tiktok);
		formData.append("instapixel", instagram);
		formData.append("cover", icons[0]);
		for (let i = 0; i < product?.subcategory_id?.length; i++) {
			formData.append([`subcategory_id[${i}]`], product?.subcategory_id[i]);
		}
		if (multiImages.length !== 0) {
			for (let i = 0; i < multiImages?.length; i++) {
				formData.append([`images[${i}]`], multiImages[i]?.file);
			}
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/product`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
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
					setProductError({
						name: res?.data?.message?.en?.name?.[0],
						short_description: res?.data?.message?.en?.short_description?.[0],
						cover: res?.data?.message?.en?.cover?.[0],
						description: res?.data?.message?.en?.description?.[0],
						selling_price: res?.data?.message?.en?.selling_price?.[0],
						category_id: res?.data?.message?.en?.category_id?.[0],
						discount_price: res?.data?.message?.en?.discount_price?.[0],
						subcategory_id: res?.data?.message?.en?.subcategory_id?.[0],
						stock: res?.data?.message?.en?.stock?.[0],
						weight: res?.data?.message?.en?.weight?.[0],
						googleAnalyticsLink: res?.data?.message?.en?.google_analytics?.[0],
						robotLink: res?.data?.message?.en?.robot_link?.[0],
						SEOdescription: res?.data?.message?.en?.SEOdescription?.[0],
						images: res?.data?.message?.en?.images?.[0],
						snappixel: res?.data?.message?.en?.snappixel?.[0],
						twitterpixel: res?.data?.message?.en?.twitterpixel?.[0],
						tiktokpixel: res?.data?.message?.en?.tiktokpixel?.[0],
						instapixel: res?.data?.message?.en?.instapixel?.[0],
					});
				}
			});
	};

	const videoModal = () => {
		return (
			<>
				<div onClick={closeVideoModal} className='video-modal'></div>
				<div className='video-url-content'>
					<CloseIcon onClick={closeVideoModal} />
					<video src={url} controls />
				</div>
			</>
		);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | اضافة منتج</title>
			</Helmet>
			{url !== "" && videoModal()}
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
										<h5 className='mb-3'> اضافة منتج</h5>
										<p>قم بإضافة منتجك والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>

							<form
								className='form-h-full add-new-product-form'
								onSubmit={handleSubmit(addNewProduct)}>
								<div className='form-body'>
									{/* Product name  */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-name'>
												{" "}
												اسم المنتج <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<input
												type='text'
												id='product-name'
												placeholder=' اسم المنتج'
												name='name'
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

									{/* Description */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-desc'>
												وصف قصير للمنتج <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<Controller
												name={"short_description"}
												control={control}
												rules={{
													required: "حقل وصف قصير للمنتج مطلوب",
												}}
												render={({ field: { onChange, value } }) => (
													<textarea
														name='short_description'
														placeholder='اكتب وصف قصير للمنتج لا يتعدي 100 حرف'
														rows={5}
														value={value}
														onChange={(e) => {
															if (e.target.value.length <= 100) {
																onChange(e.target.value.substring(0, 100));
																setShortDescriptionLength(false);
															} else {
																setShortDescriptionLength(true);
															}
														}}></textarea>
												)}
											/>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.short_description}
												{errors?.short_description &&
													errors.short_description.message}
											</span>
											{shortDescriptionLength && (
												<span className='fs-6 text-danger'>
													الوصف يجب إلا يتعدي 100 حرف
												</span>
											)}
										</div>
									</div>

									{/* Description  */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-desc'>
												{" "}
												وصف المنتج <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<textarea
												id='product-desc'
												placeholder='قم بكتابة وصف واضح للمنتج'
												name='description'
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

									{/* Main catagories */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-category'>
												{" "}
												النشاط أو التصنيف الرئيسي
												<span className='text-danger'>*</span>{" "}
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<FormControl sx={{ m: 0, width: "100%" }}>
												<Controller
													name={"category_id"}
													control={control}
													rules={{
														required: "حقل النشاط أو التصنيف الرئيسي مطلوب",
													}}
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
																			اختر النشاط أو التصنيف
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
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.category_id}
												{errors?.category_id && errors.category_id.message}
											</span>
										</div>
									</div>

									{/* Sub catagories */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='sub-category'>
												النشاط أو التصنيف الفرعي
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<FormControl sx={{ m: 0, width: "100%" }}>
												{product?.category_id !== "" &&
												subcategory[0]?.subcategory.length === 0 ? (
													<div
														className='d-flex justify-content-center align-items-center'
														style={{ color: "#1dbbbe" }}>
														لا يوجد نشاطات أو تصنيفات فرعية للتصنيف الرئيسي الذي
														اخترتة
													</div>
												) : (
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
																return "النشاط أو التصنيف الفرعي";
															}
															return selected.map((item) => {
																const result =
																	subcategory[0]?.subcategory?.filter(
																		(sub) => sub?.id === parseInt(item)
																	);

																return `${result[0]?.name} ,`;
															});
														}}>
														{subcategory[0]?.subcategory?.map((sub, index) => (
															<MenuItem key={index} value={sub?.id}>
																<Checkbox
																	checked={
																		product?.subcategory_id?.indexOf(sub?.id) >
																		-1
																	}
																/>
																<ListItemText primary={sub?.name} />
															</MenuItem>
														))}
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

									{/* Stock */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='price'>
												{" "}
												المخزون <span className='text-danger'>*</span>
											</label>
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
														type='text'
														id='stock'
														placeholder='اضف الكمية'
														name='stock'
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

									{/* Weight */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='price'>
												{" "}
												الوزن <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<div className='tax-text'>
												ضع الوزن التقديري للمنتج بالجرام
											</div>
											<Controller
												name={"weight"}
												control={control}
												rules={{
													required: "حقل الوزن مطلوب",
													pattern: {
														value: /^[0-9]+$/i,
														message: "يجب على الحقل الوزن أن يكون رقمًا",
													},
													min: {
														value: 1,
														message: "  المخزون يجب ان يكون اكبر من 0",
													},
												}}
												render={({ field: { onChange, value } }) => (
													<input
														type='text'
														id='weight'
														placeholder='1000 جرام'
														name='weight'
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
												{productError?.weight}
												{errors?.weight && errors.weight.message}
											</span>
										</div>
									</div>

									{/* Selling price */}
									<div className='row mb-md-5 mb-3'>
										<div className='d-flex flex-md-column flex-row align-items-md-start align-items-baseline col-lg-3 col-md-3 col-12'>
											<label htmlFor='price'>
												السعر <span className='text-danger'>*</span>{" "}
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<div className='tax-text'>السعر يشمل الضريبة</div>
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
																e.target.value.replace(/[^\d.]|\.(?=.*\.)/g, "")
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
												{errors?.selling_price && errors.selling_price.message}
											</span>
										</div>
									</div>

									{/* Discount price */}
									<div className='row mb-md-5 mb-3'>
										<div className='d-flex flex-md-column flex-row align-items-md-start align-items-baseline col-lg-3 col-md-3 col-12'>
											<label htmlFor='low-price'>السعر بعد الخصم</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<div className='tax-text'>السعر يشمل الضريبة</div>
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
																e.target.value.replace(/[^\d.]|\.(?=.*\.)/g, "")
															);
														}}
													/>
												)}
											/>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										{product?.discount_price && product?.selling_price && (
											<div className='col-lg-7 col-md-9 col-12'>
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
												<div className='col-lg-7 col-md-9 col-12'>
													<span className='fs-6' style={{ color: "red" }}>
														يرجي ادخال السعر الأساسي أولاّّ حتى تتمكن من ادخال
														سعر الخصم
													</span>
												</div>
											)}
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

									{/* Product Cover image */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-image'>
												{" "}
												صورة المنتج <span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
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
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											{productError?.cover && (
												<span className='fs-6 text-danger'>
													{productError?.cover}
												</span>
											)}
										</div>
									</div>

									{/* Multi Product Images */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-images'>
												الصور المتعددة او الفيديو
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<ImageUploading
												value={multiImages}
												onChange={onChangeMultiImages}
												multiple
												maxNumber={5}
												dataURLKey='data_url'
												acceptType={[
													"jpg",
													"png",
													"jpeg",
													"svg",
													"gif",
													"mp4",
													"avi",
													"mov",
													"mkv",
												]}
												allowNonImageType={true}>
												{({
													imageList,
													onImageUpload,
													onImageRemoveAll,
													onImageUpdate,
													onImageRemove,
													isDragging,
													dragProps,
												}) => (
													// write your building UI
													<div className='d-flex flex-row align-items-center gap-4'>
														{imageList.map((image, index) => {
															const isVideo =
																image?.data_url?.includes(
																	"video/mp4" ||
																		"video/avi" ||
																		"video/mov" ||
																		"video/mkv"
																) || image?.data_url?.endsWith(".mp4");
															if (isVideo) {
																return (
																	<div
																		key={index}
																		className='add-product-images'>
																		<video
																			src={image.data_url}
																			poster={image.data_url}
																		/>

																		<BsPlayCircle
																			onClick={() => setUrl(image.data_url)}
																			className='play-video'
																		/>

																		<div className='delete-video-icon'>
																			<TiDeleteOutline
																				onClick={() => onImageRemove(index)}
																				style={{
																					fontSize: "1.2rem",
																					color: "red",
																				}}
																			/>
																		</div>
																	</div>
																);
															} else {
																return (
																	<div
																		key={index}
																		className='add-product-images'>
																		<img src={image.data_url} alt='' />
																		<div
																			onClick={() => onImageRemove(index)}
																			className='delete-icon'>
																			<TiDeleteOutline
																				style={{
																					fontSize: "1.5rem",
																					color: "red",
																				}}></TiDeleteOutline>
																		</div>
																	</div>
																);
															}
														})}
														{emptyMultiImages.map((image, idx) => {
															return (
																<div
																	key={idx}
																	className='add-product-images'
																	onClick={() => {
																		onImageUpload();
																	}}>
																	<IoIosAddCircle className='add-icon' />
																</div>
															);
														})}
													</div>
												)}
											</ImageUploading>

											<div className='tax-text' style={{ color: "red" }}>
												الحد الأقصي للفيديو 2MB
											</div>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											{productError?.images && (
												<span className='fs-6 text-danger'>
													{productError?.images}
												</span>
											)}
										</div>
									</div>

									{/* Key words */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='seo'>الكلمات المفتاحيه للمنتج </label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<TagsInput
												classNames={"d-flex flex-row"}
												value={SEOdescription}
												onChange={setSEOdescription}
												name='SEOdescription'
												placeHolder='ضع الكلمة ثم اضغط enter'
											/>
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

									{/* Google Analytics Link */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label>
												<LinkIcon className='ms-2' />
												ربط جوجل أناليتكس
											</label>
										</div>

										<div className='col-lg-7 col-md-9 col-12'>
											<div className='input'>
												<input
													type='text'
													style={{ textAlign: "left", direction: "ltr" }}
													value={googleAnalyticsLink}
													onChange={(e) => {
														setGoogleAnalyticsLink(e.target.value);
													}}
													placeholder='https://analytics.google.com/analytics/web/#/report'
													onFocus={() => setValidGoogleAnalyticsLinkFocus(true)}
													onBlur={() => setValidGoogleAnalyticsLinkFocus(true)}
													aria-invalid={
														validGoogleAnalyticsLink ? "false" : "true"
													}
													aria-describedby='pageLink'></input>
											</div>
											<p
												id='pageDesc'
												className={
													validGoogleAnalyticsLinkFocus &&
													googleAnalyticsLink &&
													!validGoogleAnalyticsLink
														? " d-block wrong-text "
														: "d-none"
												}
												style={{
													color: "red",
													padding: "10px",
													fontSize: "1rem",
												}}>
												يجب ان يكون الرابط Valid URL
											</p>
											{productError?.googleAnalyticsLink && (
												<span className='wrong-text'>
													{productError?.googleAnalyticsLink}
												</span>
											)}
										</div>
									</div>

									{/* Robots links */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label>إعدادات ملف Robots </label>
										</div>

										<div className='col-lg-7 col-md-9 col-12'>
											<div className='input'>
												<textarea
													style={{ textAlign: "left", direction: "ltr" }}
													id='product-desc'
													value={robotLink}
													onChange={(e) => {
														setRobotLink(e.target.value);
													}}
													placeholder='Sitemap: https://utlopha.sa/sitemap.xml User-agent: * Allow: / Disallow: /*<iframe Disallow: /*?currency='
												/>
											</div>

											{productError?.robotsLink && (
												<span className='wrong-text'>
													{productError?.robotsLink}
												</span>
											)}
										</div>
									</div>

									{/* Snap pixle */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label>
												<SnapchatIcon className='ms-2' />
												سناب بكسل
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<div className='input-pixel'>
												<TextareaCode
													value={snapchat}
													setValue={setSnapchat}
													placeholder='Snapchat Pixel Code'
												/>
											</div>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.snappixel}
											</span>
										</div>
									</div>

									{/* Tikto pixle */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label>
												<TiktokIcon className='ms-2' />
												تيك توك بكسل
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<div className='input-pixel'>
												<TextareaCode
													value={tiktok}
													setValue={setTiktok}
													placeholder='Tiktok Pixel Code'
												/>
											</div>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.tiktokpixel}
											</span>
										</div>
									</div>

									{/* Twitter pixle */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label>
												<TwitterIcon className='ms-2' />
												تويتر بكسل
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<div className='input-pixel'>
												<TextareaCode
													value={twitter}
													setValue={setTwitter}
													placeholder='Twitter Pixel Code'
												/>
											</div>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.twitterpixel}
											</span>
										</div>
									</div>

									{/* Instagram pixle */}
									<div className='row mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label>
												<InstagramIcon className='ms-2' />
												انستقرام بكسل
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<div className='input-pixel'>
												<TextareaCode
													value={instagram}
													setValue={setInstagram}
													placeholder='Instagram Pixel Code'
												/>
											</div>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.instapixel}
											</span>
										</div>
									</div>
								</div>

								{/* Save and cancle buttons */}
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
