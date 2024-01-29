import React, { useContext, useState, useEffect } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useDropzone } from "react-dropzone";
import { useForm, Controller } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// Components
import useFetch from "../../Hooks/UseFetch";
import { TextEditor } from "../../components/TextEditor";
import CircularLoading from "../../HelperComponents/CircularLoading";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Checkbox } from "@mui/material";
import FormGroup from "@mui/material/FormGroup";
import { CloseOutlined } from "@mui/icons-material";
import FormControlLabel from "@mui/material/FormControlLabel";

// ICONS
import { AiOutlineCloseCircle } from "react-icons/ai";
import { DocsIcon, PaperIcon } from "../../data/Icons";
import { TextEditorContext } from "../../Context/TextEditorProvider";
// Modal Style
const style = {
	position: "fixed",
	top: "88px",
	left: "50%",
	transform: "translate(-50%, 0%)",
	width: "70%",
	height: "100%",
	overflowY: "auto",

	bgcolor: "#f8f9fa",
	borderRadius: "8px 8px 0 0",
	paddingBottom: "110px",
	"@media(max-width:992px)": {
		width: "90%",
	},
	"@media(max-width:768px)": {
		width: "100%",
		maxWidth: "90%",
		top: "73px",
	},
};

const EditPage = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];

	const { id } = useParams();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/page/${id}`
	);
	const { fetchedData: pageCategories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/page-categories"
	);
	const navigate = useNavigate();

	// To get the editor content
	const editorContent = useContext(TextEditorContext);
	const { editorValue, setEditorValue } = editorContent;

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const [page, setPage] = useState({
		title: "",
		page_desc: "",
		page_content: "",
		seo_title: "",
		seo_link: "",
		seo_desc: "",
		tags: [],
		pageCategory: [],
		image: "",
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
			title: "",
			page_desc: "",
			seo_title: "",
			seo_link: "",
			seo_desc: "",
		},
	});

	const [tag, setTag] = useState("");
	const [titleLength, setTitleLength] = useState(false);
	const [descriptionLength, setDescriptionLength] = useState(false);
	const itsPost = page?.pageCategory?.includes(1);

	// ---------------------------------------------------------
	const addTags = () => {
		setPage({ ...page, tags: [...page?.tags, tag] });
		setTag("");
	};

	const updateTags = (i) => {
		const newTags = page?.tags?.filter((tag, index) => index !== i);
		setPage({ ...page, tags: newTags });
	};
	// ------------------------------------------------------

	const [pageError, setPageError] = useState({
		title: "",
		page_desc: "",
		page_content: "",
		seo_title: "",
		seo_link: "",
		seo_desc: "",
		tags: "",
		images: "",
	});

	const resetCouponError = () => {
		setPageError({
			title: "",
			page_desc: "",
			page_content: "",
			seo_title: "",
			seo_link: "",
			seo_desc: "",
			tags: "",
			images: "",
		});
	};
	// -----------------------------------------------------

	useEffect(() => {
		setPage({
			...page,
			title: fetchedData?.data?.pages?.title,
			page_desc: fetchedData?.data?.pages?.page_desc,
			page_content: fetchedData?.data?.pages?.page_content || "",
			seo_title: fetchedData?.data?.pages?.seo_title,
			seo_link: fetchedData?.data?.pages?.seo_link,
			seo_desc: fetchedData?.data?.pages?.seo_desc,
			tags: fetchedData?.data?.pages?.tags,
			pageCategory: fetchedData?.data?.pages?.pageCategory?.map(
				(item) => item?.id
			),
			image: fetchedData?.data?.pages?.image,
		});
		setEditorValue(fetchedData?.data?.pages?.page_content);
	}, [fetchedData?.data?.pages]);

	useEffect(() => {
		reset(page);
	}, [page, reset]);
	// -------------------------------------------------

	// Add Post image
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	const [images, setImages] = useState([]);
	const errMsgStyle = {
		whiteSpace: "normal",
		padding: "0",
		fontSize: "14px",
	};
	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/jpeg": [],
			"image/jpg": [],
			"image/png": [],
		},

		onDrop: (acceptedFiles) => {
			const updatedIcons = acceptedFiles?.map((file) => {
				const isSizeValid = file.size <= maxFileSize;
				const errorMessage = "حجم الصورة يجب أن لا يزيد عن 1 ميجابايت.";
				const requireMindWidth = 300;
				const requireMaxdWidth = 600;
				const requireMindHeight = 150;
				const requireMaxdHeight = 300;
				const img = new Image();

				const errorMes = `
				<span> - الحد الأدنى للأبعاد هو 300بكسل عرض و 150بكسل ارتفاع</span>
				 <br />
				<span> - الحد الأقصى للأبعاد هو 600بكسل عرض و 300بكسل ارتفاع</span> `;

				img.onload = () => {
					const isDimensionsValid =
						img.width >= requireMindWidth &&
						img.width <= requireMaxdWidth &&
						img.height >= requireMindHeight &&
						img.height <= requireMaxdHeight;

					if (!isDimensionsValid && isSizeValid) {
						toast.warning(
							<div
								className='wrign-dimensions'
								style={errMsgStyle}
								dangerouslySetInnerHTML={{ __html: errorMes }}
							/>,
							{
								theme: "light",
							}
						);
						setImages([]);
						setPageError({
							...pageError,
							images: (
								<div
									className='wrign-dimensions'
									style={errMsgStyle}
									dangerouslySetInnerHTML={{ __html: errorMes }}
								/>
							),
						});
					} else if (!isSizeValid && !isDimensionsValid) {
						toast.warning(errorMessage, {
							theme: "light",
						});

						toast.warning(
							<div
								className='wrign-dimensions'
								style={errMsgStyle}
								dangerouslySetInnerHTML={{ __html: errorMes }}
							/>,
							{
								theme: "light",
							}
						);
						setImages([]);
					} else if (!isSizeValid && isDimensionsValid) {
						toast.warning(errorMessage, {
							theme: "light",
						});
						setImages([]);
						setPageError({
							...pageError,
							images: errorMessage,
						});
					} else {
						setPageError({
							...pageError,
							images: null,
						});
					}
				};

				img.src = URL.createObjectURL(file);

				return isSizeValid
					? Object.assign(file, { preview: URL.createObjectURL(file) })
					: null;
			});

			setImages(updatedIcons?.filter((image) => image !== null));
		},
	});

	const updatePage = (data) => {
		setLoadingTitle("جاري تعديل الصفحة");
		resetCouponError();
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("title", data?.title);
		formData.append("page_desc", data?.page_desc);
		formData.append("page_content", editorValue || page?.page_content);
		formData.append("seo_title", data?.seo_title);
		formData.append("seo_link", data?.seo_link);
		formData.append("seo_desc", data?.seo_desc);

		formData.append("tags", page?.tags?.join(","));
		for (let i = 0; i < page?.pageCategory?.length; i++) {
			formData.append([`pageCategory[${i}]`], page?.pageCategory[i]);
		}

		if (images.length !== 0) {
			formData.append("image", itsPost ? images[0] || "" : "");
		}

		axios
			.post(`https://backend.atlbha.com/api/Store/page/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Pages");
					setReload(!reload);
					setEditorValue(null);
				} else {
					setLoadingTitle("");
					setPageError({
						title: res?.data?.message?.en?.title?.[0],
						page_desc: res?.data?.message?.en?.page_desc?.[0],
						page_content: res?.data?.message?.en?.page_content?.[0],
						seo_title: res?.data?.message?.en?.seo_title?.[0],
						seo_link: res?.data?.message?.en?.seo_link?.[0],
						seo_desc: res?.data?.message?.en?.seo_desc?.[0],
						tags: res?.data?.message?.en?.tags?.[0],
						images: res?.data?.message?.en?.image?.[0],
					});

					toast.error(res?.data?.message?.en?.title?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.page_desc?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.page_content?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.seo_title?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.seo_link?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.seo_desc?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.tags?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.image?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.postcategory_id?.[0], {
						theme: "light",
					});
				}
			});
	};
	console.log(images[0]?.preview, page?.image);
	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تعديل صفحة</title>
			</Helmet>
			<div open={true}>
				<Modal
					open={true}
					onClose={() => {
						navigate("/Pages");
						setEditorValue(null);
					}}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={style} className='create-pages-modal'>
						<form onSubmit={handleSubmit(updatePage)}>
							{/** Offers Details */}
							<div className='create-pages-form-wrapper'>
								<div className='d-flex'>
									<div className='col-12'>
										<div className='form-title  d-flex justify-content-between align-items-center'>
											<h5 className=''>{page?.title}</h5>
											<AiOutlineCloseCircle
												onClick={() => {
													navigate("/Pages");
													setEditorValue(null);
												}}
											/>
										</div>
									</div>
								</div>
								{loading ? (
									<div className='mt-5 h-100 d-flex flex-column align-items-center'>
										<CircularLoading />
									</div>
								) : (
									<>
										<div className='form-body'>
											<div className='row mb-md-5 mb-3'>
												<div className='col-12'>
													<div className='input-icon'>
														<DocsIcon />
													</div>
													<Controller
														name={"title"}
														control={control}
														rules={{
															required: " حقل العنوان مطلوب",
															pattern: {
																value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
																message:
																	"يجب أن يكون العنوان عبارة عن نصاً ولا يحتوي علي حروف خاصه مثل الأقوس والرموز",
															},
														}}
														render={({ field: { onChange, value } }) => (
															<input
																name='title'
																type='text'
																className='w-100'
																placeholder='عنوان الصفحة'
																value={value}
																onChange={(e) => {
																	if (e.target.value.length <= 15) {
																		onChange(e.target.value.substring(0, 15));
																		setTitleLength(false);
																	} else {
																		setTitleLength(true);
																	}
																}}
															/>
														)}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{pageError?.title}
															{errors?.title && errors.title.message}
														</span>
														{titleLength && (
															<span className='fs-6 text-danger'>
																العنوان يجب ان لا يتجاوز 15 حرف
															</span>
														)}
													</div>
												</div>
												<div className='col-12 mt-3'>
													<Controller
														name={"page_desc"}
														control={control}
														rules={{
															required: "حقل وصف الصفحة مطلوب",
														}}
														render={({ field: { onChange, value } }) => (
															<textarea
																name='page_desc'
																className='w-100 h-auto p-3'
																placeholder='اكتب وصف قصير للصفحة لا يتجاوز 100 حرف'
																rows={5}
																value={value}
																onChange={(e) => {
																	if (e.target.value.length <= 100) {
																		onChange(e.target.value.substring(0, 100));
																		setDescriptionLength(false);
																	} else {
																		setDescriptionLength(true);
																	}
																}}></textarea>
														)}
													/>
													<div
														className='col-12'
														style={{ marginTop: "-13px" }}>
														<span className='fs-6 text-danger'>
															{pageError?.page_desc}
															{errors?.page_desc && errors.page_desc.message}
														</span>
														{descriptionLength && (
															<span className='fs-6 text-danger'>
																الوصف يجب ان لا يتجاوز 100 حرف
															</span>
														)}
													</div>
												</div>
											</div>
											<div className='row'>
												<div className='col-12'>
													<div className='py-4'>
														<TextEditor
															ToolBar={"createOrEditPages"}
															placeholder={"محتوى الصفحة..."}
														/>
													</div>
												</div>
												<div className='col-12'>
													{pageError?.page_content && (
														<span className='fs-6 text-danger'>
															{pageError?.page_content}
														</span>
													)}
												</div>
											</div>

											<div className='row mb-md-5 mb-3 seo-inputs'>
												<div className='col-12 mb-md-4 mb-3'>
													<h4>تحسينات SEO</h4>
												</div>
												<div className='col-12 mb-md-4 mb-3'>
													<label
														htmlFor='page-title-input'
														className='d-block mb-1'>
														عنوان صفحة تعريفية ( Page Title)
													</label>
													<div className='input-icon'>
														<DocsIcon />
													</div>
													<input
														name='seo_title'
														className='w-100'
														type='text'
														placeholder='عنوان صفحة تعريفية ( Page Title)'
														{...register("seo_title", {})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{pageError?.seo_title}
															{errors?.seo_title && errors.seo_title.message}
														</span>
													</div>
												</div>
												<div className='col-12 mb-md-4 mb-3'>
													<label
														htmlFor='page-title-input'
														className='d-block mb-1'>
														رابط صفحة تعريفية ( SEO Page URL )
													</label>
													<div className='input-icon'>
														<DocsIcon />
													</div>
													<input
														name='seo_link'
														className='w-100 seo_link'
														type='text'
														placeholder='رابط صفحة تعريفية ( SEO Page URL )'
														{...register("seo_link", {})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{pageError?.seo_link}
															{errors?.seo_link && errors.seo_link.message}
														</span>
													</div>
												</div>
												<div className='col-12'>
													<label
														htmlFor='page-title-input'
														className='d-block mb-1'>
														وصف صفحة تعريفية ( Page Description)
													</label>
													<div className='input-icon'>
														<PaperIcon />
													</div>
													<input
														name='seo_desc'
														className='w-100'
														type='text'
														placeholder='وصف صفحة تعريفية ( Page Description)'
														{...register("seo_desc", {})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{pageError?.seo_desc}
															{errors?.seo_desc && errors.seo_desc.message}
														</span>
													</div>
												</div>
											</div>
											<div className='row mb-md-5 mb-3 check-box-inputs'>
												<div className='col-md-6 col-12 mb-3'>
													<div className='wrapper'>
														<div className='title'>
															<h4>
																تصنيف الصفحة
																<span className='important-hint'> * </span>
															</h4>
														</div>
														<div className='body page-category '>
															<FormGroup
																className=''
																sx={{ overflow: "hidden" }}>
																{pageCategories?.data?.pagesCategory?.map(
																	(cat, index) =>
																		loading ? (
																			<p>...</p>
																		) : (
																			<FormControlLabel
																				value={cat?.id}
																				key={index}
																				sx={{
																					py: 1,
																					mr: 0,
																					borderBottom: "1px solid #ECECEC",
																					"& .MuiTypography-root": {
																						fontSize: "18px",
																						fontWeight: "500",
																						"@media(max-width:767px)": {
																							fontSize: "16px",
																						},
																					},
																				}}
																				control={
																					<Checkbox
																						checked={
																							page?.pageCategory?.includes(
																								cat?.id
																							) || false
																						}
																						onChange={(e) => {
																							const categoryId = parseInt(
																								e.target.value
																							);
																							const isChecked =
																								e.target.checked;

																							if (isChecked) {
																								setPage((prevPage) => ({
																									...prevPage,
																									pageCategory: [
																										...prevPage.pageCategory,
																										categoryId,
																									],
																								}));
																							} else {
																								setPage((prevPage) => ({
																									...prevPage,
																									pageCategory:
																										prevPage.pageCategory.filter(
																											(item) =>
																												item !== categoryId
																										),
																								}));
																							}
																						}}
																						sx={{
																							"& path": { fill: "#000000" },
																						}}
																					/>
																				}
																				label={cat?.name}
																			/>
																		)
																)}
															</FormGroup>
														</div>
													</div>
												</div>
												<div className='col-md-6 col-12'>
													<div className='wrapper'>
														<div className='title'>
															<h4> الكلمات المفتاحية </h4>
														</div>
														<div className='body'>
															<div className='row p-md-4 p-2'>
																<div className='col-md-4 col-4'>
																	<button
																		type='button'
																		onClick={addTags}
																		className='w-100'>
																		اضافة
																	</button>
																</div>
																<div className='col-md-8 col-8'>
																	<input
																		value={tag}
																		onChange={(e) => setTag(e.target.value)}
																		className='w-100'
																		type='text'
																		name='contact-tag'
																		id='contact-tag'
																	/>
																</div>
																<div className='mt-2'>
																	<div className='tags-boxes'>
																		{page?.tags?.map((tag, index) => (
																			<div key={index} className='tag'>
																				<CloseOutlined
																					onClick={() => updateTags(index)}
																				/>
																				<span>{tag}</span>
																			</div>
																		))}
																	</div>
																</div>
																{pageError?.tags && (
																	<div>
																		<span className='fs-6 text-danger'>
																			{pageError?.tags}
																		</span>
																	</div>
																)}
															</div>
														</div>
													</div>
												</div>
												{itsPost && (
													<>
														<div className='col-md-6 col-12'>
															<div className='wrapper h-auto'>
																<div className='title'>
																	<h4>
																		صورة المدونة
																		<span className='important-hint'> * </span>
																	</h4>
																	<span
																		style={{
																			display: "block",
																			fontSize: "1rem",
																			color: "#7e7e7e",
																			whiteSpace: "break-spaces",
																			fontWight: "600",
																		}}>
																		الأبعاد المناسبة:
																	</span>
																	<span
																		style={{
																			fontSize: "0.9rem",
																			color: "#7e7e7e",

																			whiteSpace: "break-spaces",
																		}}>
																		- (الحد الادني للابعاد 300 بكسل عرض - 150
																		بكسل ارتفاع)
																	</span>
																	<span
																		style={{
																			display: "block",
																			fontSize: "0.9rem",
																			color: "#7e7e7e",

																			whiteSpace: "break-spaces",
																		}}>
																		- (الحد الأقصى للابعاد 600 بكسل عرض - 300
																		بكسل ارتفاع)
																	</span>
																</div>
																<div
																	{...getRootProps({
																		className:
																			"d-flex justify-content-between p-3 gap-2",
																	})}>
																	<input
																		{...getInputProps()}
																		id='personal-image'
																		name='personal-image'
																	/>
																	{images?.length <= 0 ? (
																		<p
																			role='button'
																			style={{ fontSize: "16px" }}>
																			اختر صورة PNG أو JPG فقط{" "}
																		</p>
																	) : (
																		<p
																			className='d-none'
																			style={{ fontSize: "16px" }}>
																			اختر صورة PNG أو JPG فقط{" "}
																		</p>
																	)}

																	<span
																		style={{
																			fontSize: "16px",
																			color: "#1dbbbe",
																			cursor: "pointer",
																		}}>
																		{" "}
																		استعراض
																	</span>
																	{images?.length !== 0 && (
																		<ul
																			style={{
																				fontSize: "14px",
																				overflow: "hidden",
																			}}
																			className='m-0'>
																			{images[0]?.name}
																		</ul>
																	)}
																</div>

																{(images[0]?.preview || page?.image) && (
																	<div
																		className='p-3 d-flex justify-content-center align-items-center'
																		style={{
																			width: "100%",

																			borderRadius: "8px",
																		}}>
																		<img
																			style={{
																				borderRadius: "8px",
																			}}
																			className='img-fluid'
																			src={images[0]?.preview || page?.image}
																			alt='img-page'
																		/>
																	</div>
																)}
															</div>

															<div className='col-12'>
																<span className='fs-6 text-danger'>
																	{pageError?.images}
																</span>
															</div>
														</div>
													</>
												)}
											</div>
										</div>
										<div className='form-footer-btn'>
											<div className='row d-flex justify-content-center align-items-center'>
												<div className='col-md-2 col-6'>
													<button
														type='submit'
														className='create-page-btn save-btn'>
														تعديل
													</button>
												</div>
											</div>
										</div>
									</>
								)}
							</div>
						</form>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default EditPage;
