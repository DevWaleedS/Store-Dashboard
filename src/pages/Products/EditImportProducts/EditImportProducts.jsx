import React, { useState, useEffect, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { Link } from "react-router-dom";

// Context
import { TextEditorContext } from "../../../Context/TextEditorProvider";

// Components
import { CircularLoading } from "../../../HelperComponents";
import { TextEditor } from "../../../components/TextEditor";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { FaRegSquarePlus } from "react-icons/fa6";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import IconButton from "@mui/material/IconButton";
import Zoom from "@mui/material/Zoom";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";

// Icons and images
import { Controller, useForm } from "react-hook-form";
import { CurrencyIcon, PlayVideo } from "../../../data/Icons";
import { IoPricetagsOutline } from "react-icons/io5";
import { MdInfoOutline } from "react-icons/md";

// RTK Query
import {
	useEditImportProductByIdMutation,
	useGetProductByIdQuery,
} from "../../../store/apiSlices/productsApi";
import { LoadingContext } from "../../../Context/LoadingProvider";

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

/** product options According  */
const Accordion = styled((props) => (
	<MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
	backgroundColor: "transparent",
	marginBottom: "10px",

	"&:not(:last-child)": {
		borderBottom: 0,
		marginBottom: "10px",
	},
	"&:before": {
		display: "none",
	},
}));

const AccordionSummary = styled((props) => <MuiAccordionSummary {...props} />)(
	({ theme }) => ({
		width: "100%",
		backgroundColor: "#baf3e6",
		borderRadius: "4px 4px 0 0",
		flexDirection: "row-reverse",

		"& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
			display: "none",
		},
		"& .MuiAccordionSummary-content": {
			marginLeft: theme.spacing(1),
		},
	})
);

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: "12px ",
	border: "1px solid #1dbbbe",
	borderTop: "none",
	borderRadius: "0 0 4px 4px",
}));

const BootstrapTooltip = styled(({ className, ...props }) => (
	<Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
	[`& .${tooltipClasses.arrow}`]: {
		color: "#1dbbbe",
	},
	[`& .${tooltipClasses.tooltip}`]: {
		backgroundColor: "#1dbbbe",

		whiteSpace: "normal",
	},
}));

const EditImportProducts = () => {
	const navigate = useNavigate();

	// get product data by id
	const { id } = useParams();
	const { data: currentProduct, isFetching } = useGetProductByIdQuery(id);

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const editorContent = useContext(TextEditorContext);
	const { setEditorValue } = editorContent;

	const [imagesPreview, setImagesPreview] = useState();
	const [isActive, setIsActive] = useState(null);
	const [product, setProduct] = useState({
		name: "",
		description: "",
		short_description: "",
		selling_price: "",
		discount_price: "",
		price: "",
		discount_price_import: "",
		stock: "",
		qty: "",
	});
	const [productOptions, setProductOptions] = useState([]);

	const {
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
			discount_price_import: "",
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
		discount_price_import: "",
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
			discount_price_import: "",
			qty: "",
			category_id: "",
			discount_price: "",
			discount_percent: "",
			subcategory_id: "",
			stock: "",
			SEOdescription: "",
		});
	};

	const [expanded, setExpanded] = useState(false);
	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	/**
	 * --------------------------------------------------------------------
	  to set data that coming from api
	 */
	useEffect(() => {
		if (currentProduct) {
			setProduct({
				...product,
				name: currentProduct?.name,
				short_description: currentProduct?.short_description,
				price:
					currentProduct?.options?.length > 0
						? currentProduct?.options?.[0]?.price
						: currentProduct?.selling_price,
				discount_price_import:
					currentProduct?.options?.length > 0
						? currentProduct?.options?.[0]?.discount_price
						: currentProduct?.discount_price_import,
				qty: currentProduct?.stock,
			});
			setEditorValue(currentProduct?.description);
			setImagesPreview(currentProduct?.cover);
		}
		if (currentProduct?.options?.length > 0) {
			setProductOptions(
				currentProduct?.options?.map((option) => ({
					id: option?.id,
					price: Number(option?.price),
					discount_price: Number(option?.discount_price),
					qty: Number(option?.quantity),
					values: option?.name?.ar?.split(",")?.map((item, index) => ({
						id: index + 1,
						title: item,
					})),
				}))
			);
		}
	}, [currentProduct]);

	const addPriceToAttributes = (e, index) => {
		const updatedAttributes = [...productOptions];
		updatedAttributes[index].price = Number(
			e.target.value.replace(/[^0-9]/g, "")
		);
		setProductOptions(updatedAttributes);
		if (index === 0) {
			setProduct({
				...product,
				price: Number(e.target.value.replace(/[^0-9]/g, "")),
			});
		}
	};

	/** handle add discount_price for attr */
	const addDiscountPrice = (e, index) => {
		const updatedAttributes = [...productOptions];

		updatedAttributes[index].discount_price = Number(
			e.target.value.replace(/[^0-9]/g, "")
		);
		setProductOptions(updatedAttributes);
		if (index === 0) {
			setProduct({
				...product,
				discount_price_import: Number(e.target.value.replace(/[^0-9]/g, "")),
			});
		}
	};

	/**----------------------------------------------------------------------------------------
	 *  Handle update import product */

	const [editImportProductById, { isLoading }] =
		useEditImportProductByIdMutation();
	const handleUpdateImportProduct = async (data) => {
		setLoadingTitle("جاري تعديل المنتج");
		resetCouponError();

		// data that send to api ...
		let formData = new FormData();
		formData.append("price", data?.price);
		if (productOptions?.length !== 0) {
			for (let i = 0; i < productOptions?.length; i++) {
				formData.append([`data[${i}][option_id]`], productOptions[i]?.id);
				formData.append([`data[${i}][price]`], productOptions[i]?.price || 0);
				formData.append(
					[`data[${i}][discount_price]`],
					productOptions[i]?.discount_price || 0
				);
			}
		} else {
			formData.append(`discount_price`, data?.discount_price_import);
		}
		formData.append("qty", data?.qty);

		// make request ...
		try {
			const response = await editImportProductById({
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
			} else {
				setLoadingTitle("");
				setProductError({
					price: response?.data?.message?.en?.price?.[0],
					discount_price_import: response?.data?.message?.en?.[0],
					qty: response?.data?.message?.en?.qty?.[0],
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
			console.error("Error changing editImportProductById:", error);
		}
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تعديل منتج مستورد</title>
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
							{isFetching ? (
								<CircularLoading />
							) : (
								<form
									className='form-h-full'
									onSubmit={handleSubmit(handleUpdateImportProduct)}>
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
										{currentProduct?.images?.length !== 0 && (
											<div className='row mb-md-5 mb-3'>
												<div className='col-md-3 col-12'>
													<label htmlFor='product-name'>
														الصور المتعددة او الفيديو{" "}
													</label>
												</div>

												<div className='col-md-7 col-12 '>
													<div className='d-flex justify-content-start align-items-center gap-2 import-product-multi-images'>
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
														})}
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
													}}>
													<div
														style={{ whiteSpace: "normal" }}
														className='price w-100 d-flex justify-content-start align-items-start p-2'>
														{currentProduct?.name}
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
											<div className='col-md-7 col-12 product-souq-texteditor'>
												<TextEditor ToolBar={"readOnly"} readOnly={true} />
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
														{currentProduct?.short_description}
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										{/* Main category */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-category'>النشاط الرئيسي</label>
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
														{currentProduct?.category?.name}
													</div>
												</div>
											</div>

											<div className='col-md-3 col-12'></div>
										</div>

										{/* sub category */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='sub-category'> الأنشطة الفرعية </label>
											</div>
											<div className='col-md-7 col-12'>
												<div className='sub-category '>
													{currentProduct?.subcategory?.length === 0 ? (
														<div
															className='d-flex align-items-center justify-content-center gap-3 '
															style={{ color: "#1dbbbe", fontSize: "16px" }}>
															(لا يوجد أنشطة فرعية)
														</div>
													) : (
														<div className='d-flex flex-wrap align-items-center justify-content-start gap-1'>
															{currentProduct?.subcategory?.map(
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
														{currentProduct?.purchasing_price}
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
												<label
													htmlFor='price'
													className='d-flex flex-row align-items-center gap-1'>
													سعر البيع<span className='important-hint'>*</span>
													<BootstrapTooltip
														className={"p-0"}
														TransitionProps={{ timeout: 300 }}
														TransitionComponent={Zoom}
														title='سيتم استبدال قيمة سعر البيع الحالية بقيمة سعر البيع للخيار الافتراضي عند وجود خيارات للمنتج ولايمكنك تعديله الا من خلال تعديل سعر الخيار'
														placement='top'>
														<IconButton>
															<MdInfoOutline color='#1DBBBE' size={"14px"} />
														</IconButton>
													</BootstrapTooltip>
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
																disabled={productOptions?.length !== 0}
																value={
																	productOptions?.length !== 0
																		? productOptions?.[0]?.price
																		: value
																}
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
													Number(currentProduct?.purchasing_price) && (
													<span className='fs-6 text-danger'>
														السعر يجب ان يكون اكبر من او يساوي (
														{currentProduct?.purchasing_price})
													</span>
												)}

												<div className='fs-6 text-danger'>
													{errors?.price && errors.price.message}
												</div>
											</div>
										</div>

										{/* Discount price */}
										<div className='row mb-md-5 mb-3'>
											<div className='d-flex flex-md-column flex-row align-items-md-start align-items-baseline col-lg-3 col-md-3 col-12'>
												<label
													htmlFor='low-price'
													className='d-flex flex-row align-items-center gap-1'>
													سعر البيع بعد الخصم
													<BootstrapTooltip
														className={"p-0"}
														TransitionProps={{ timeout: 300 }}
														TransitionComponent={Zoom}
														title='سيتم استبدال قيمة سعر البيع بعد الخصم الحالية بقيمة سعر البيع بعد الخصم للخيار الافتراضي عند وجود خيارات للمنتج ولايمكنك تعديله الا من خلال تعديل سعر الخيار'
														placement='top'>
														<IconButton>
															<MdInfoOutline color='#1DBBBE' size={"14px"} />
														</IconButton>
													</BootstrapTooltip>
												</label>
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
														name={"discount_price_import"}
														control={control}
														rules={{
															pattern: {
																value: /^[0-9.]+$/i,
																message:
																	"يجب أن يكون سعر البيع بعد الخصم رقمًا",
															},
															min: {
																value: 1,
																message:
																	"يجب أن يكون سعر البيع بعد الخصم أكبر من 0",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																className='import_products_input'
																style={{
																	background: "#FFF",
																	height: "48px",
																}}
																name={"discount_price_import"}
																type='text'
																id='discount_price_import'
																value={
																	productOptions?.length !== 0
																		? productOptions?.[0]?.discount_price
																		: value
																}
																disabled={productOptions?.length !== 0}
																onChange={(e) => {
																	setProduct({
																		...product,
																		discount_price_import:
																			e.target.value.replace(
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

											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												{Number(product?.price) -
													Number(product?.discount_price_import) <=
													0 && (
													<span className='fs-6 text-danger'>
														يجب ان يكون سعر البيع بعد الخصم اقل من السعر الأساسي
													</span>
												)}
											</div>

											{product?.discount_price_import &&
											product?.price === "" ? (
												<>
													<div className='col-lg-3 col-md-3 col-12'></div>
													<div className='col-lg-7 col-md-9 col-12'>
														<span className='fs-6 text-danger'>
															يرجى ادخال السعر الأساسي أولاّّ حتى تتمكن من ادخال
															سعر البيع بعد الخصم
														</span>
													</div>
												</>
											) : null}
											<div className='col-lg-3 col-md-3 col-12'></div>
											<div className='col-lg-7 col-md-9 col-12'>
												<span
													className='fs-6 text-danger'
													style={{ whiteSpace: "normal" }}>
													{productError?.discount_price_import}
													{errors?.discount_price_import &&
														errors.discount_price_import.message}
												</span>
											</div>
										</div>

										{/* Stock */}
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label
													htmlFor='price'
													className='d-flex flex-row align-items-center gap-1'>
													الكمية التي قمت باستيرادها
													<BootstrapTooltip
														className={"p-0"}
														TransitionProps={{ timeout: 300 }}
														TransitionComponent={Zoom}
														title='سيتم استبدال قيمة الكمية التي قمت باستيرادها الحالية بقيمة إجمالي الكميات الخاصة بخيارات المنتج  في حال وجود خيارات للمنتج'
														placement='top'>
														<IconButton>
															<MdInfoOutline color='#1DBBBE' size={"14px"} />
														</IconButton>
													</BootstrapTooltip>
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
													<div className='price w-100 d-flex justify-content-center align-items-center import_products_input'>
														{currentProduct?.options?.length > 0
															? currentProduct?.options?.reduce(
																	(accumulator, option) =>
																		Number(accumulator) +
																		Number(option?.quantity),
																	0
															  )
															: product?.qty}
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										{productOptions?.length > 0 && (
											<div className='row mb-md-5 mb-3'>
												<div className='col-md-3 col-12'>
													<label htmlFor='price'>خيارات المنتج</label>
												</div>
												<div className='col-md-7 col-12'>
													{productOptions?.map((option, index) => (
														<div
															key={index}
															className=' flex justify-start items-center gap-3 mb-3 products-attr'>
															<Accordion
																expanded={expanded === index}
																onChange={handleChange(index)}>
																<AccordionSummary
																	aria-controls={`${index}-content`}
																	id={`${index}-header`}
																	expandIcon={
																		<FaRegSquarePlus
																			style={{
																				fontSize: "1.2rem",
																				fill: "#023855",
																				marginLeft: "5px",
																			}}
																		/>
																	}>
																	<div className=' d-flex justify-content-between flex-wrap align-items-center w-100'>
																		<div className='d-flex flex-row align-items-center gap-1'>
																			{option?.values?.map((value, index) => (
																				<>
																					{index !== 0 && <span>/</span>}
																					<Typography
																						key={value?.id}
																						sx={{
																							fontSize: "18px",
																							fontWeight: "400",
																							fontFamily: "Tajawal",
																							color: "#023855",

																							"@media(max-width:768px)": {
																								fontSize: "15px",
																								fontWeight: "500",
																							},
																						}}>
																						{value?.title}
																					</Typography>
																				</>
																			))}
																		</div>
																		<Typography
																			sx={{
																				fontSize: "16px",
																				fontWeight: "400",
																				fontFamily: "Tajawal",
																				color: "#023855",

																				"@media(max-width:768px)": {
																					fontSize: "14px",
																					fontWeight: "500",
																					// margin: "0 auto 0 0",
																				},
																			}}>
																			متوفر عدد: {option?.qty}
																		</Typography>
																	</div>
																</AccordionSummary>
																<AccordionDetails>
																	<div className='option-name-input d-flex justify-content-start align-items-center gap-2 mb-2'>
																		<div className='input-icon'>
																			<IoPricetagsOutline />
																		</div>
																		<input
																			type='text'
																			placeholder='السعر'
																			value={option?.price}
																			onChange={(e) => {
																				addPriceToAttributes(e, index);
																			}}
																		/>
																		<div className='input-type'>ر.س</div>
																	</div>

																	<div className='option-name-input d-flex justify-content-start align-items-center gap-2 mb-2'>
																		<div className='input-icon'>
																			<IoPricetagsOutline />
																		</div>
																		<input
																			type='text'
																			placeholder='السعر بعد الخصم'
																			value={option?.discount_price}
																			onChange={(e) => {
																				addDiscountPrice(e, index);
																			}}
																		/>
																		<div className='input-type'>ر.س</div>
																	</div>

																	<div className='col-12'>
																		{Number(option?.price) -
																			Number(option?.discount_price) <=
																		0 ? (
																			<span
																				style={{
																					color: "red",
																					fontSize: "14px",
																					whiteSpace: "normal",
																				}}>
																				يجب ان يكون سعر الخصم اقل من السعر
																				الأساسي
																			</span>
																		) : null}
																	</div>

																	{option?.discount_price && !option?.price ? (
																		<div className='col-12'>
																			<span
																				style={{
																					color: "red",
																					fontSize: "14px",
																					whiteSpace: "normal",
																				}}>
																				يرجى ادخال السعر الأساسي أولاّّ حتى
																				تتمكن من ادخال سعر الخصم
																			</span>
																		</div>
																	) : null}
																</AccordionDetails>
															</Accordion>
														</div>
													))}
												</div>
											</div>
										)}

										{Number(currentProduct?.stock) <= 1 && (
											<div className='row mb-md-5 mb-3'>
												<div className='col-md-3 col-12'>
													<label htmlFor='price'>
														يمكنك استيراد كمية جديدة
													</label>
												</div>
												<div className='col-md-7 col-12'>
													<div
														className='d-flex justify-content-center align-items-center'
														style={{
															background: "transparent",
															border: "1px solid #a7a7a71a",
															height: "48px",
														}}>
														<div className='price w-100 d-flex justify-content-center align-items-center import_products_input'>
															<Link to={"/Products/SouqOtlobha"}>استيراد</Link>
														</div>
													</div>
												</div>
												<div className='col-md-3 col-12'></div>
											</div>
										)}
									</div>
									<div className='form-footer'>
										<div className='row d-flex justify-content-center align-items-center'>
											<div className='col-lg-4 col-6'>
												<button
													disabled={isLoading}
													className='save-btn'
													type='submit'>
													حفظ
												</button>
											</div>
											<div className='col-lg-4 col-6'>
												<button
													className='close-btn'
													onClick={() => {
														navigate("/Products");
														setEditorValue("");
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
		</>
	);
};

export default EditImportProducts;
