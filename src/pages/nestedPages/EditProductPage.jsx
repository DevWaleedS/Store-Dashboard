import React, { useState, useEffect, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useCookies } from "react-cookie";
import { useDropzone } from "react-dropzone";
import ImageUploading from "react-images-uploading";
import { TagsInput } from "react-tag-input-component";
import { useNavigate, useParams } from "react-router-dom";

// Components
import useFetch from "../../Hooks/UseFetch";
import CircularLoading from "../../HelperComponents/CircularLoading";
import TextareaCode from "../../components/TextareaCode/TextareaCode";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// MUI

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { useForm, Controller } from "react-hook-form";

// Icons
import { BsPlayCircle } from "react-icons/bs";
import { TiDeleteOutline } from "react-icons/ti";
import CloseIcon from "@mui/icons-material/Close";
import { IoIosArrowDown, IoIosAddCircle } from "react-icons/io";
import {
	InstagramIcon,
	LinkIcon,
	SnapchatIcon,
	TiktokIcon,
	TwitterIcon,
	UploadIcon,
} from "../../data/Icons";
import { PlayVideo } from "../../data/images";

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
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [product, setProduct] = useState({
		name: "",
		short_description: "",
		description: "",
		selling_price: "",
		category_id: "",
		discount_price: "",
		subcategory_id: [],
		stock: "",
		weight: "",
		snapchat: "",
		twitter: "",
		tiktok: "",
		instagram: "",
	});

	// --------------------------------------------
	const [shortDescriptionLength, setShortDescriptionLength] = useState(false);
	const [googleAnalyticsLink, setGoogleAnalyticsLink] = useState("");
	const [SEOdescription, setSEOdescription] = useState([]);
	const [multiImages, setMultiImages] = useState([]);
	const [icon, setIcon] = React.useState([]);
	const [robotLink, setRobotLink] = useState("");
	const [instagram, setInstagram] = useState("");
	const [snapchat, setSnapchat] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tiktok, setTiktok] = useState("");
	const [url, setUrl] = useState("");

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
			short_description: "",
			description: "",
			selling_price: "",
			category_id: "",
			discount_price: "",
			stock: "",
			weight: "",
		},
	});

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setProduct((prevProduct) => {
			return { ...prevProduct, [name]: value };
		});
	};

	// To get All Product info from api
	useEffect(() => {
		if (fetchedData?.data?.product) {
			setProduct({
				...product,
				name: fetchedData?.data?.product?.name,
				short_description: fetchedData?.data?.product?.short_description,
				description: fetchedData?.data?.product?.description,
				selling_price: fetchedData?.data?.product?.selling_price,
				category_id: fetchedData?.data?.product?.category?.id,
				discount_price: fetchedData?.data?.product?.discount_price,
				subcategory_id: fetchedData?.data?.product?.subcategory?.map(
					(sub) => sub?.id
				),
				stock: fetchedData?.data?.product?.stock,
				weight: fetchedData?.data?.product?.weight,
			});
			setGoogleAnalyticsLink(
				fetchedData?.data?.product?.google_analytics || ""
			);
			setRobotLink(fetchedData?.data?.product?.robot_link || "");
			setSnapchat(fetchedData?.data?.product?.snappixel || "");
			setTwitter(fetchedData?.data?.product?.twitterpixel || "");
			setTiktok(fetchedData?.data?.product?.tiktokpixel || "");
			setInstagram(fetchedData?.data?.product?.instapixel || "");
			setSEOdescription(
				fetchedData?.data?.product?.SEOdescription.map((seo) => seo)
			);
			setMultiImages(fetchedData?.data?.product?.images.map((image) => image));
		}
	}, [fetchedData?.data?.product]);

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

	// ---------------------------------------------

	// Handle Errors
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
		SEOdescription: "",
		googleAnalyticsLink: "",
		robotLink: "",
		images: [],
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
			SEOdescription: "",
			googleAnalyticsLink: "",
			robotLink: "",
			images: [],
			snappixel: "",
			twitterpixel: "",
			tiktokpixel: "",
			instapixel: "",
		});
	};

	// To Handle Errors
	useEffect(() => {
		reset(product);
	}, [product, reset]);

	// ---------------------------------------------------
	// handle images size
	const maxFileSize = 2 * 1024 * 1024; // 2 MB;

	// To get multi images
	const emptyMultiImages = [];
	for (let index = 0; index < 5 - multiImages?.length; index++) {
		emptyMultiImages?.push(index);
	}

	const onChangeMultiImages = (imageList) => {
		// Check the size for each image in the list
		const isSizeValid = imageList?.every((image) =>
			image?.image ? true : image?.file?.size <= maxFileSize
		);

		// Check if this file is video
		const isVideo =
			imageList?.[imageList?.length - 1]?.file?.type?.startsWith("video/");

		const errorMessage = isVideo
			? "حجم الفيديو يجب أن لا يزيد عن 2 ميجابايت."
			: "حجم الصورة يجب أن لا يزيد عن 2 ميجابايت.";

		if (!isSizeValid) {
			toast.warning(errorMessage, { theme: "light" });
			setProductError({
				...productError,
				images: errorMessage,
			});
			setMultiImages([...multiImages]);

			// Remove the last uploaded image if it exceeds the size limit
			const updatedImageList = imageList.slice(0, -1);
			setMultiImages(updatedImageList);
		} else {
			setProductError({
				...productError,
				images: null,
			});
			setMultiImages(imageList);
		}
	};

	// Get some methods form useDropZone
	const { getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/jpeg": [],
			"image/jpg": [],
			"image/png": [],
		},

		onDrop: (acceptedFiles) => {
			const updatedIcons = acceptedFiles?.map((file) => {
				const isSizeValid = file.size <= maxFileSize;
				const errorMessage = "حجم الصورة يجب أن لا يزيد عن 2 ميجابايت.";

				if (!isSizeValid) {
					toast.warning(errorMessage, {
						theme: "light",
					});
					setProductError({
						...productError,
						cover: errorMessage,
					});
				} else {
					setProductError({
						...productError,
						cover: null,
					});
				}

				return isSizeValid
					? Object.assign(file, { preview: URL.createObjectURL(file) })
					: null;
			});

			setIcon(updatedIcons?.filter((icon) => icon !== null));
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
	// -------------------------------------------------

	// Handle select Subcategory Array
	const subcategory =
		categories?.data?.categories?.filter(
			(sub) => sub?.id === parseInt(product?.category_id)
		) || [];
	// ---------------------------------------

	// Update the current product
	const updateProduct = (data) => {
		setLoadingTitle("جاري تعديل المنتج");
		resetCouponError();
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("name", data?.name);
		formData.append("short_description", data?.short_description);
		formData.append("description", data?.description);
		formData.append("selling_price", data?.selling_price);
		formData.append("category_id", data?.category_id);
		formData.append("discount_price", data?.discount_price);
		formData.append("stock", data?.stock);
		formData.append("weight", data?.weight);
		formData.append("SEOdescription", SEOdescription.join(","));
		formData.append("google_analytics", googleAnalyticsLink);
		formData.append("robot_link", robotLink);
		formData.append("snappixel", snapchat);
		formData.append("twitterpixel", twitter);
		formData.append("tiktokpixel", tiktok);
		formData.append("instapixel", instagram);
		for (let i = 0; i < product?.subcategory_id?.length; i++) {
			formData.append([`subcategory_id[${i}]`], product?.subcategory_id[i]);
		}
		if (icon?.length !== 0) {
			formData.append("cover", icon[0] || null);
		}

		if (multiImages.length !== 0) {
			for (let i = 0; i < multiImages?.length; i++) {
				formData.append(
					[`images[${i}]`],
					multiImages[i]?.file || multiImages[i]?.image
				);
			}
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
						short_description: res?.data?.message?.en?.short_description?.[0],
						cover: res?.data?.message?.en?.cover?.[0],
						description: res?.data?.message?.en?.description?.[0],
						selling_price: res?.data?.message?.en?.selling_price?.[0],
						category_id: res?.data?.message?.en?.category_id?.[0],
						discount_price: res?.data?.message?.en?.discount_price?.[0],
						subcategory_id: res?.data?.message?.en?.subcategory_id?.[0],
						stock: res?.data?.message?.en?.stock?.[0],
						weight: res?.data?.message?.en?.weight?.[0],
						SEOdescription: res?.data?.message?.en?.SEOdescription?.[0],
						googleAnalyticsLink: res?.data?.message?.en?.google_analytics?.[0],
						robotLink: res?.data?.message?.en?.robot_link?.[0],
						images: res?.data?.message?.en?.["images.0"]?.[0],
						snappixel: res?.data?.message?.en?.snappixel?.[0],
						twitterpixel: res?.data?.message?.en?.twitterpixel?.[0],
						tiktokpixel: res?.data?.message?.en?.tiktokpixel?.[0],
						instapixel: res?.data?.message?.en?.instapixel?.[0],
					});

					toast.error(res?.data?.message?.en?.name?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.short_description?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.cover?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.description?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.selling_price?.[0], {
						theme: "light",
					});

					toast.error(res?.data?.message?.en?.category_id?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.discount_price?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.subcategory_id?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.stock?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.weight?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.google_analytics?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.robot_link?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.SEOdescription?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.images?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.snappixel?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.twitterpixel?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.tiktokpixel?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.instapixel?.[0], {
						theme: "light",
					});
				}
			});
	};
	// --------------------------------------

	// Video modal
	const closeVideoModal = () => {
		setUrl("");
	};

	const videoModal = () => {
		return (
			<>
				<div onClick={closeVideoModal} className='video-modal'></div>
				<div className='video-url-content'>
					<CloseIcon className='close_video_icon' onClick={closeVideoModal} />
					<video src={url} controls />
				</div>
			</>
		);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل منتج</title>
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
										<h5 className='mb-3'> تعديل المنتج </h5>

										<p> قم بتحديث منتجك والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>
							{loading ? (
								<CircularLoading />
							) : (
								<form
									className='form-h-full add-new-product-form'
									onSubmit={handleSubmit(updateProduct)}>
									<div className='form-body'>
										{/* Product name  */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-name'>
													اسم المنتج<span className='important-hint'>*</span>
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

										{/* Description */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-desc'>
													وصف قصير للمنتج{" "}
													<span className='important-hint'>*</span>
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
													وصف المنتج<span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<textarea
													name='description'
													id='product-desc'
													placeholder='قم بكتابة وصف واضح للمنتج'
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
													<span className='important-hint'>*</span>
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
																				اختر النشاط أو التصنيف
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
																	return "النشاط أو التصنيف الفرعي";
																}
																return selected?.map((item) => {
																	const result =
																		subcategory[0]?.subcategory?.filter(
																			(sub) => sub?.id === parseInt(item)
																		) || product?.subcategory_id;
																	return `${result[0]?.name} , `;
																});
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

										{/* Weight */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='price'>
													{" "}
													الوزن <span className='important-hint'>*</span>
												</label>
											</div>

											<div className='col-lg-7 col-md-9 col-12'>
												<div className='tax-text'>
													ضع الوزن التقريبي للمنتج بالجرام
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
													{" "}
													السعر<span className='important-hint'>*</span>{" "}
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

										{/* Discount price */}
										<div className='row mb-md-5 mb-3'>
											<div className='d-flex flex-md-column flex-row align-items-md-start align-items-baseline col-lg-3 col-md-3 col-12'>
												<label htmlFor='low-price'> السعر بعد الخصم </label>
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
													يرجي ادخال السعر الأساسي أولاّّ حتى تتمكن من ادخال سعر
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

										{/* Product Cover image */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-image'>
													{" "}
													صورة المنتج<span className='important-hint'>*</span>
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
														<span>( سيتم قبول الصور jpeg & png & jpg )</span>
														<div className='tax-text '>
															(الحد الأقصي للصورة 2MB)
														</div>
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

										{/* Multi Product Images */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-images'>
													الصور المتعددة او الفيديو
													<br />
													<div
														className='tax-text'
														style={{ whiteSpace: "normal" }}>
														(الحد الأقصي للصورة أو الفيديو 2MB)
													</div>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<ImageUploading
													multiple
													maxNumber={5}
													value={multiImages}
													dataURLKey='data_url'
													allowNonImageType={true}
													onChange={onChangeMultiImages}
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
													]}>
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
															{imageList?.map((image, index) => {
																const isVideo =
																	image?.data_url?.includes(
																		"video/mp4" ||
																			"video/avi" ||
																			"video/mov" ||
																			"video/mkv"
																	) ||
																	image?.image?.includes(
																		".mp4" || ".avi" || ".mov" || ".mkv"
																	);
																if (isVideo) {
																	return (
																		<div
																			key={index}
																			className='add-product-images'>
																			<video
																				style={{ padding: "16px" }}
																				onClick={() =>
																					setUrl(image.data_url || image?.image)
																				}
																				src={image.data_url || image?.image}
																				poster={PlayVideo}
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
																			<img
																				src={image.data_url || image?.image}
																				alt=''
																			/>
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
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default EditProductPage;
