import React, { useContext, useState, useEffect } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import ImageUploading from "react-images-uploading";
import { TagsInput } from "react-tag-input-component";

// Context
import Context from "../../../Context/context";
import { LoadingContext } from "../../../Context/LoadingProvider";
import { TextEditorContext } from "../../../Context/TextEditorProvider";
// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { useForm, Controller } from "react-hook-form";
import ListItemText from "@mui/material/ListItemText";
import OutlinedInput from "@mui/material/OutlinedInput";

// Components
import useFetch from "../../../Hooks/UseFetch";
import AddProductOptions from "./AddProductOptions";
import { TextEditor } from "../../../components/TextEditor";

// icons and images
import { FiPlus } from "react-icons/fi";
import { UploadIcon } from "../../../data/Icons";
import { PlayVideo } from "../../../data/images";
import { TiDeleteOutline } from "react-icons/ti";
import CloseIcon from "@mui/icons-material/Close";
import { IoIosArrowDown, IoIosAddCircle } from "react-icons/io";

// Redux
import { useDispatch } from "react-redux";
import { openProductOptionModal } from "../../../store/slices/ProductOptionModal";

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

const selectStyle = {
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
};

const AddNewProduct = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const { fetchedData: categories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);
	const dispatch = useDispatch(false);
	const navigate = useNavigate();
	const [reload, setReload] = useState(false);

	const contextStore = useContext(Context);
	const {
		setEndActionTitle,
		productHasOptions,

		attributes,
		optionsSection,
		clearOptions,
	} = contextStore;
	const LoadingStore = useContext(LoadingContext);

	const { setLoadingTitle } = LoadingStore;
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;
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

	const [productNameLength, setProductNameLength] = useState(false);
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
		images: "",
	});

	const resetCouponError = () => {
		setProductError({
			name: "",
			cover: "",
			short_description: "",
			description: "",
			selling_price: "",
			stock: "",
			weight: "",
			images: "",
			category_id: "",
			discount_price: "",
			subcategory_id: "",
			SEOdescription: "",
		});
	};
	const [url, setUrl] = useState("");
	const [SEOdescription, setSEOdescription] = useState([]);
	const [shortDescriptionLength, setShortDescriptionLength] = useState(false);

	// to handle close video preview
	const closeVideoModal = () => {
		setUrl("");
	};

	// handle images size
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	// to get multi images
	const [multiImages, setMultiImages] = useState([]);
	const emptyMultiImages = [];
	for (let index = 0; index < 5 - multiImages.length; index++) {
		emptyMultiImages.push(index);
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
			? "حجم الفيديو يجب أن لا يزيد عن 1 ميجابايت."
			: "حجم الصورة يجب أن لا يزيد عن 1 ميجابايت.";

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
	// --------------------------------------------

	// Use state with useDropzone library to set banners
	const [icons, setIcons] = React.useState([]);
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
				const errorMessage = "حجم الصورة يجب أن لا يزيد عن 1 ميجابايت.";

				if (!isSizeValid) {
					toast.warning(errorMessage, {
						theme: "light",
					});
					setProductError({
						...productError,
						cover: errorMessage,
					});
					setIcons([]);
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

			setIcons(updatedIcons?.filter((icon) => icon !== null));
		},
	});

	// get banners
	const bannersImage = icons?.map((banner) => (
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
		formData.append("description", editorValue);
		formData.append("selling_price", data?.selling_price);
		formData.append("category_id", data?.category_id);
		formData.append("discount_price", data?.discount_price);
		formData.append("stock", data?.stock);
		formData.append("weight", data?.weight);

		formData.append("cover", icons[0]);
		for (let i = 0; i < product?.subcategory_id?.length; i++) {
			formData.append([`subcategory_id[${i}]`], product?.subcategory_id[i]);
		}
		if (multiImages.length !== 0) {
			for (let i = 0; i < multiImages?.length; i++) {
				formData.append([`images[${i}]`], multiImages[i]?.file);
			}
		}

		formData.append(
			"SEOdescription",
			SEOdescription?.length === 0 ? "" : SEOdescription?.join(",")
		);

		formData.append("product_has_options", productHasOptions === true ? 1 : 0);
		formData.append("amount", 1);
		if (productHasOptions === true) {
			for (let i = 0; i < optionsSection?.length; i++) {
				formData.append([`attribute[${i}][title]`], optionsSection[i]?.name);
				formData.append(
					[`attribute[${i}][type]`],
					optionsSection[i]?.select_value
				);
				for (let v = 0; v < optionsSection[i]?.values?.length; v++) {
					formData.append(
						[`attribute[${i}][value][${v}][title]`],
						optionsSection[i]?.values[v]?.title
					);
					optionsSection[i]?.values[v]?.color &&
						optionsSection[i]?.select_value === "نص و لون" &&
						formData.append(
							[`attribute[${i}][value][${v}][color]`],
							optionsSection[i]?.values[v]?.color
						);
					optionsSection[i]?.values[v]?.image &&
						optionsSection[i]?.select_value === "نص و صورة" &&
						formData.append(
							[`attribute[${i}][value][${v}][image]`],

							optionsSection[i]?.values[v]?.image
						);
				}
			}
			for (let i = 0; i < attributes?.length; i++) {
				formData.append([`data[${i}][price]`], attributes[i]?.price || 0);
				formData.append([`data[${i}][quantity]`], attributes[i]?.qty);
				for (let v = 0; v < attributes[i]?.values?.length; v++) {
					formData.append(
						[`data[${i}][name][${v}]`],
						attributes[i]?.values[v]?.title
					);
				}
			}
		}

		axios
			.post(`https://backend.atlbha.com/api/Store/product`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Products");
					setReload(!reload);
					setEditorValue(null);
					clearOptions();
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
						images: res?.data?.message?.en?.images?.[0],
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

					toast.error(res?.data?.message?.en?.SEOdescription?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.images?.[0], {
						theme: "light",
					});
				}
			});
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
				<title>لوحة تحكم اطلبها | اضافة منتج</title>
			</Helmet>
			{url !== "" && videoModal()}
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => {
						navigate("/Products");
						setEditorValue(null);
					}}
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
												اسم المنتج <span className='important-hint'>*</span>
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<Controller
												name={"name"}
												control={control}
												rules={{
													required: "حقل اسم المنتج مطلوب ",
												}}
												render={({ field: { onChange, value } }) => (
													<input
														placeholder=' اسم المنتج'
														type='text'
														name='name'
														id='product-name'
														value={value}
														onChange={(e) => {
															if (e.target.value.length <= 25) {
																onChange(e.target.value.substring(0, 25));
																setProductNameLength(false);
															} else {
																setProductNameLength(true);
															}
														}}
													/>
												)}
											/>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.name}
												{errors?.name && errors.name.message}
											</span>

											{productNameLength && (
												<span className='fs-6 text-danger'>
													اسم المنتج يجب ان لا يتجاوز 25 حرف
												</span>
											)}
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
														placeholder='اكتب وصف قصير للمنتج لا يتجاوز 100 حرف'
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
													الوصف لا يتجاوز 100 حرف
												</span>
											)}
										</div>
									</div>

									{/* Description  */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-desc'>
												{" "}
												وصف المنتج <span className='important-hint'>*</span>
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12 product-texteditor'>
											<TextEditor
												ToolBar={"product"}
												placeholder={"قم بكتابة وصف واضح للمنتج"}
											/>
										</div>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<span className='fs-6 text-danger'>
												{productError?.description}
												{errors?.description && errors.description.message}
											</span>
										</div>
									</div>

									{/* Product Cover image */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-image'>
												{" "}
												صورة المنتج <span className='important-hint'>*</span>
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
													<span>( سيتم قبول الصور jpeg & png & jpg )</span>

													<div className='tax-text '>
														(الحد الأقصى للصورة 1MB)
													</div>
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
												<br />
												<div
													className='tax-text'
													style={{ whiteSpace: "normal" }}>
													(الحد الأقصى للصورة أو الفيديو 1MB)
												</div>
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
													<div className='d-flex flex-row align-items-center gap-1 gap-md-4'>
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
																			style={{ padding: "16px" }}
																			onClick={() => setUrl(image.data_url)}
																			src={image.data_url}
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
																			src={image.data_url}
																			alt=''
																			lazy={true}
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

									{/* Main catagories */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='product-category'>
												{" "}
												النشاط الرئيسي
												<span className='important-hint'>*</span>{" "}
											</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<FormControl sx={{ m: 0, width: "100%" }}>
												<Controller
													name={"category_id"}
													control={control}
													rules={{
														required: "حقل النشاط الرئيسي مطلوب",
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
															sx={selectStyle}
															IconComponent={IoIosArrowDown}
															displayEmpty
															inputProps={{ "aria-label": "Without label" }}
															renderValue={(selected) => {
																if (product?.category_id === "" || !selected) {
																	return (
																		<p className='text-[#ADB5B9]'>
																			اختر النشاط
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
																					cat?.store === null
																						? " #dfe2aa"
																						: " rgba(211, 211, 211, 1)",
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
											<label htmlFor='sub-category'>النشاط الفرعي</label>
										</div>
										<div className='col-lg-7 col-md-9 col-12'>
											<FormControl sx={{ m: 0, width: "100%" }}>
												{product?.category_id !== "" &&
												subcategory[0]?.subcategory.length === 0 ? (
													<div
														className='d-flex justify-content-center align-items-center'
														style={{
															color: "#1dbbbe",
															whiteSpace: "break-spaces",
														}}>
														لا يوجد أنشطة فرعية للنشاط الرئيسي الذي اخترتة
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
																return "النشاط الفرعي";
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

									{/* Selling price */}
									<div className='row mb-md-5 mb-3'>
										<div className='d-flex flex-md-column flex-row align-items-md-start align-items-baseline col-lg-3 col-md-3 col-12'>
											<label htmlFor='price'>
												السعر <span className='important-hint'>*</span>{" "}
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

									{/* Stock */}
									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'>
											<label htmlFor='price'>
												{" "}
												المخزون <span className='important-hint'>*</span>
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

									{/* Add Product options */}

									<div className='row mb-md-5 mb-3'>
										<div className='col-lg-3 col-md-3 col-12'></div>
										<div className='col-lg-7 col-md-9 col-12'>
											<button
												className='product-option-btn w-100'
												type='button'
												onClick={() => {
													dispatch(openProductOptionModal());
												}}>
												إضافة خيارات المنتج
												<FiPlus />
											</button>
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
												onClick={() => {
													navigate("/Products");
													setEditorValue(null);
												}}>
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

			{/* The Product Opthons Modal */}
			<AddProductOptions />
		</>
	);
};

export default AddNewProduct;
