import React, { useState, useEffect, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import ImageUploading from "react-images-uploading";
import { TagsInput } from "react-tag-input-component";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
// Components
import EditServiceOptions from "./EditServiceOptions";
import CircularLoading from "../../../HelperComponents/CircularLoading";
import { TextEditor } from "../../../components/TextEditor";
import { useForm, Controller } from "react-hook-form";

// Redux
import { useDispatch } from "react-redux";
import { openProductOptionModal } from "../../../store/slices/ProductsSlice";

// Context
import Context from "../../../Context/context";
import { LoadingContext } from "../../../Context/LoadingProvider";
import { TextEditorContext } from "../../../Context/TextEditorProvider";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";

// Icons
import { UploadIcon } from "../../../data/Icons";
import { PlayVideo } from "../../../data/images";
import { TiDeleteOutline } from "react-icons/ti";
import CloseIcon from "@mui/icons-material/Close";
import { IoIosArrowDown, IoIosAddCircle } from "react-icons/io";
import { FiPlus } from "react-icons/fi";

// RTK Query
import { useGetCategoriesQuery } from "../../../store/apiSlices/selectorsApis/selectCategoriesApi";
import {
	useEditProductByIdMutation,
	useGetProductByIdQuery,
} from "../../../store/apiSlices/productsApi";

// Style Select Mui
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

	"@media(max-width:1400px)": {
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

const EditService = () => {
	const { id } = useParams();
	const { data: currentProduct, isFetching } = useGetProductByIdQuery(id);

	// get categories selector
	const { data: selectCategories } = useGetCategoriesQuery();
	const navigate = useNavigate();
	const dispatch = useDispatch(false);
	const contextStore = useContext(Context);
	const {
		serviceOptionsSection,
		setServiceOptionsSection,
		clearServicesOptions,
		serviceHasOptions,
		setServiceHasOptions,
	} = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;
	const [service, setService] = useState({
		name: "",
		short_description: "",
		description: "",
		selling_price: "",
		period: "",
		category_id: "",
		discount_price: "",
		subcategory_id: [],
	});

	// --------------------------------------------
	const [shortDescriptionLength, setShortDescriptionLength] = useState(false);
	const [SEOdescription, setSEOdescription] = useState([]);
	const [multiImages, setMultiImages] = useState([]);
	const [icon, setIcon] = React.useState([]);
	const [url, setUrl] = useState("");

	const {
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
			period: "",
		},
	});

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setService((prevProduct) => {
			return { ...prevProduct, [name]: value };
		});
	};

	// To get All Product info from api
	useEffect(() => {
		if (currentProduct) {
			setService({
				...service,
				name: currentProduct?.name,
				short_description: currentProduct?.short_description,
				selling_price: currentProduct?.selling_price,
				category_id: currentProduct?.category?.id,
				discount_price: currentProduct?.discount_price,
				subcategory_id: currentProduct?.subcategory?.map((sub) => sub?.id),
				period: currentProduct?.period,
			});
			setEditorValue(currentProduct?.description);
			setSEOdescription(currentProduct?.SEOdescription?.map((seo) => seo));
			setMultiImages(currentProduct?.images?.map((image) => image));

			setServiceHasOptions(
				currentProduct?.product_has_options === 1 ? true : false
			);

			setServiceOptionsSection(
				currentProduct?.attributes?.length !== 0
					? currentProduct?.attributes?.map((attribute) => ({
							id: attribute?.id,
							name: attribute?.name,
							select_value: attribute?.type,
							values: attribute?.values?.map((value) => ({
								id: value?.id,
								title: value?.value?.[0],
								period: value?.value[1],
								price: value?.value[2],
								discount_price: value?.value[3],
							})),
					  }))
					: [
							{
								name: "",
								select_value: "نص",
								values: [
									{
										id: uuidv4() + 1,
										title: "",
										price: "",
										period: "",
										discount_price: "",
									},
								],
							},
					  ]
			);
		}
	}, [currentProduct]);

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
		period: "",
		SEOdescription: "",
		images: [],
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
			period: "",
			SEOdescription: "",
			images: [],
		});
	};

	// To update product data
	//--------------------------------------------------
	useEffect(() => {
		reset(service);
	}, [service, reset]);

	// ---------------------------------------------------
	// handle images size
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;

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
		selectCategories?.filter(
			(sub) => sub?.id === parseInt(service?.category_id)
		) || [];
	// ---------------------------------------

	/**  Update the current product */

	const [editProductById] = useEditProductByIdMutation();
	const handleEditProduct = async (data) => {
		setLoadingTitle("جاري تعديل الخدمة");
		resetCouponError();

		// data that send to api
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("is_service", 1);
		formData.append("name", data?.name);
		formData.append("period", data?.period);
		formData.append("description", editorValue);
		formData.append("category_id", data?.category_id);
		formData.append("selling_price", data?.selling_price);
		formData.append("discount_price", data?.discount_price);
		formData.append("short_description", data?.short_description);
		formData.append(
			"SEOdescription",
			SEOdescription?.length === 0 ? "" : SEOdescription?.join(",")
		);
		if (icon?.length !== 0) {
			formData.append("cover", icon[0] || null);
		}
		service?.subcategory_id?.forEach((subcategory_id, i) => {
			formData.append([`subcategory_id[${i}]`], subcategory_id || null);
		});

		if (multiImages.length !== 0) {
			multiImages?.forEach((image, i) => {
				formData.append(`images[${i}]`, image?.file || image?.image);
			});
		}
		formData.append(
			"product_has_options",
			serviceOptionsSection === true ? 1 : 0
		);
		formData.append("amount", 1);

		if (serviceHasOptions === true) {
			serviceOptionsSection?.forEach((option, i) => {
				formData.append([`attribute[${i}][title]`], option?.name);
				formData.append([`attribute[${i}][type]`], option?.select_value);

				option?.values?.forEach((value, v) => {
					formData.append(
						[`attribute[${i}][value][${v}][title]`],
						value?.title
					);
					formData.append(
						[`attribute[${i}][value][${v}][period]`],
						value?.period
					);
					formData.append(
						[`attribute[${i}][value][${v}][price]`],
						value?.price
					);
					formData.append(
						[`attribute[${i}][value][${v}][discount_price]`],
						value?.discount_price
					);
				});
			});
		}

		// make request ...
		try {
			const response = await editProductById({
				id: currentProduct?.id,
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
				navigate("/Products");

				setEditorValue("");
				clearServicesOptions();
			} else {
				setLoadingTitle("");
				setProductError({
					name: response?.data?.message?.en?.name?.[0],
					short_description:
						response?.data?.message?.en?.short_description?.[0],
					cover: response?.data?.message?.en?.cover?.[0],
					description: response?.data?.message?.en?.description?.[0],
					selling_price: response?.data?.message?.en?.selling_price?.[0],
					category_id: response?.data?.message?.en?.category_id?.[0],
					discount_price: response?.data?.message?.en?.discount_price?.[0],
					subcategory_id: response?.data?.message?.en?.subcategory_id?.[0],
					period: response?.data?.message?.en?.period?.[0],
					SEOdescription: response?.data?.message?.en?.SEOdescription?.[0],
					images: response?.data?.message?.en?.["images.0"]?.[0],
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

				Object.entries(response?.data?.message?.en)?.forEach(
					([key, message]) => {
						toast.error(message[0], { theme: "light" });
					}
				);
			}
		} catch (error) {
			console.error("Error changing edit Product:", error);
		}
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
				<title>لوحة تحكم اطلبها | تعديل خدمة</title>
			</Helmet>
			{url !== "" && videoModal()}
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => {
						navigate("/Products");
						setEditorValue("");
						clearServicesOptions();
					}}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style}>
						<div className='add-form-wrapper'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> تعديل الخدمة </h5>

										<p> قم بتحديث الخدمة والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>
							{isFetching ? (
								<CircularLoading />
							) : (
								<form
									className='form-h-full add-new-product-form'
									onSubmit={handleSubmit(handleEditProduct)}>
									<div className='form-body'>
										{/* Product name  */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-name'>
													اسم الخدمة<span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<Controller
													name={"name"}
													control={control}
													rules={{
														required: "حقل اسم الخدمة مطلوب ",
													}}
													render={({ field: { onChange, value } }) => (
														<input
															placeholder=' اسم الخدمة'
															type='text'
															name='name'
															id='product-name'
															value={value}
															onChange={(e) => {
																onChange(e.target.value);
															}}
														/>
													)}
												/>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
													{productError?.name}
													{errors?.name && errors.name.message}
												</span>
											</div>
										</div>

										{/* Description */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-desc'>
													وصف قصير للخدمة{" "}
													<span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<Controller
													name={"short_description"}
													control={control}
													rules={{
														required: "حقل وصف قصير الخمدمة مطلوب",
													}}
													render={({ field: { onChange, value } }) => (
														<textarea
															name='short_description'
															placeholder='اكتب وصف قصير للخدمة لا يتجاوز 100 حرف'
															rows={5}
															value={value}
															onChange={(e) => {
																if (e.target.value.length <= 100) {
																	onChange(e.target.value.substring(0, 100));
																	setShortDescriptionLength(false);
																} else {
																	setShortDescriptionLength(true);
																}
															}}
														/>
													)}
												/>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
													{productError?.short_description}
													{errors?.short_description &&
														errors.short_description.message}
												</span>
												{shortDescriptionLength && (
													<span
														className='fs-6 text-danger'
														style={{ whiteSpace: "normal" }}>
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
													وصف الخدمة<span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12 product-texteditor'>
												<TextEditor
													ToolBar={"product"}
													placeholder={"قم بكتابة وصف واضح للخدمة"}
												/>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
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
													صورة الخدمة<span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<div {...getRootProps()}>
													<div className='add-image-btn-box mb-3'>
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
																	currentProduct?.is_import ? true : false
																}
															/>
														</div>
														<span
															style={{
																whiteSpace: "normal",
															}}>
															( سيتم قبول الصور jpeg & png & jpg )
														</span>
														<div className='tax-text '>
															(الحد الأقصى للصورة 1MB)
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
														src={currentProduct?.cover}
														alt={currentProduct?.product?.name}
													/>
												</div>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												{productError?.cover && (
													<span
														className='fs-6 text-danger'
														style={{ whiteSpace: "normal" }}>
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
														<div className='d-flex flex-row align-items-center gap-1 gap-md-4'>
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
															{emptyMultiImages?.map((image, idx) => {
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
													<span
														className='fs-6 text-danger'
														style={{ whiteSpace: "normal" }}>
														{productError?.images}
													</span>
												)}
											</div>
										</div>

										{/* Main catagories */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='product-category'>
													النشاط الرئيسي
													<span className='important-hint'>*</span>
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
																value={value}
																name='category_id'
																sx={selectStyle}
																onChange={(e) => {
																	if (service?.category_id !== e.target.value) {
																		setService({
																			...service,
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
																		service?.category_id === "" ||
																		!selected
																	) {
																		return (
																			<p className='text-[#ADB5B9]'>
																				اختر النشاط
																			</p>
																		);
																	}
																	const result =
																		selectCategories?.filter(
																			(item) =>
																				item?.id === parseInt(selected) ||
																				item?.id === service?.category_id
																		) || "";
																	return result[0]?.name;
																}}>
																{selectCategories?.map((cat, idx) => {
																	return (
																		<MenuItem
																			key={idx}
																			className='souq_storge_category_filter_items'
																			sx={{
																				backgroundColor:
																					cat?.store === null
																						? " #dfe2aa"
																						: " rgba(211, 211, 211, 1)",
																				height: "3rem",
																				"&:hover": {},
																			}}
																			value={cat?.id}>
																			{cat?.name}
																		</MenuItem>
																	);
																})}
															</Select>
														)}
													/>
												</FormControl>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
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
													{service?.category_id !== "" &&
													subcategory[0]?.subcategory?.length === 0 ? (
														<div
															className='d-flex justify-content-center align-items-center'
															style={{ color: "#1dbbbe" }}>
															لا يوجد أنشطة فرعية للنشاط الرئيسي الذي اخترتة
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
															value={service?.subcategory_id || []}
															onChange={(e) => handleOnChange(e)}
															input={<OutlinedInput />}
															renderValue={(selected) => {
																if (service?.subcategory_id?.length === 0) {
																	return "النشاط الفرعي";
																}

																return (
																	<div className=' d-flex justify-content-start flex-wrap gap-1'>
																		{selected.map((item) => {
																			const result =
																				subcategory[0]?.subcategory?.filter(
																					(sub) => sub?.id === parseInt(item)
																				) || service?.subcategory_id;
																			return (
																				<div className='multiple_select_items'>
																					{result[0]?.name}
																				</div>
																			);
																		})}
																	</div>
																);
															}}>
															{subcategory[0]?.subcategory?.map(
																(sub, index) => (
																	<MenuItem key={index} value={sub?.id}>
																		<Checkbox
																			checked={
																				service?.subcategory_id?.indexOf(
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
													<span
														className='fs-6 text-danger'
														style={{ whiteSpace: "normal" }}>
														{productError?.subcategory_id}
													</span>
												)}
											</div>
										</div>

										{/* Selling price */}
										<div className='row mb-md-5 mb-3'>
											<div className='d-flex flex-md-column flex-row align-items-md-start align-items-baseline col-lg-3 col-md-3 col-12'>
												<label>
													السعر<span className='important-hint'>*</span>
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
																setService({
																	...service,
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
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
													{productError?.selling_price}
													{errors?.selling_price &&
														errors.selling_price.message}
												</span>
											</div>
										</div>

										{/* Discount price */}
										<div className='row mb-md-5 mb-3'>
											<div className='d-flex flex-md-column flex-row align-items-md-start align-items-baseline col-lg-3 col-md-3 col-12'>
												<label>السعر بعد الخصم</label>
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
																setService({
																	...service,
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
													service?.discount_price && service?.selling_price
														? "col-lg-7 col-md-9 col-12"
														: "d-none"
												}>
												{service?.selling_price &&
												service?.discount_price &&
												Number(service?.selling_price) -
													Number(service?.discount_price) <=
													0 ? (
													<span
														className='fs-6 text-danger'
														style={{ whiteSpace: "normal" }}>
														يجب ان يكون سعر الخصم اقل من السعر الأساسي
													</span>
												) : null}
											</div>

											<div
												className={
													service?.discount_price &&
													service?.selling_price === ""
														? "col-lg-7 col-md-9 col-12"
														: "d-none"
												}>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
													يرجى ادخال السعر الأساسي أولاّّ حتى تتمكن من ادخال سعر
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

										{/* Stock */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label>
													المدة <span className='important-hint'>*</span>
												</label>
											</div>
											<div className='col-lg-7 col-md-9 col-12'>
												<div className='tax-text'>
													ضع مدة التنفيذ الخاصة بالخدمة بالأيام
												</div>
												<div className='period-input'>
													<Controller
														name={"period"}
														control={control}
														rules={{
															required: "حقل المدة مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message: "يجب أن يكون حقل المدة رقمًا",
															},
															min: {
																value: 1,
																message: "  المدة يجب أن تكون اكبر من 0",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																name='period'
																type='text'
																id='period'
																placeholder='ادخل مدة التنفيذ الخاصة بالخدمة بالأيام'
																value={value}
																onChange={(e) =>
																	onChange(
																		e.target.value.replace(/[^0-9]/g, "")
																	)
																}
															/>
														)}
													/>
													<span className='input-type d-flex justify-content-center align-items-center'>
														يوم
													</span>
												</div>
											</div>
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
													{productError?.period}
													{errors?.period && errors.period.message}
												</span>
											</div>
										</div>

										{/* Key words */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-lg-3 col-md-3 col-12'>
												<label htmlFor='seo'>الكلمات المفتاحية للخدمة </label>
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
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
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
													onClick={() => dispatch(openProductOptionModal())}>
													تعديل خيارات الخدمة
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
														setEditorValue("");
														clearServicesOptions();
													}}>
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

			{/* The Edit Service Options Modal */}
			<EditServiceOptions />
		</>
	);
};

export default EditService;
