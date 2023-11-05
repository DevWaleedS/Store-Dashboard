import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import useFetch from "../../Hooks/UseFetch";
import { useDropzone } from "react-dropzone";
import CircularLoading from "../../HelperComponents/CircularLoading";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { Checkbox } from "@mui/material";
import { Editor } from "react-draft-wysiwyg";
import {
	EditorState,
	convertToRaw,
	ContentState,
	convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

// ICONS
import { AiOutlineCloseCircle } from "react-icons/ai";
import { ReactComponent as DocsIcon } from "../../data/Icons/icon-24-write.svg";
import { ReactComponent as PaperIcon } from "../../data/Icons/icon-24- details.svg";
import { IoIosArrowDown } from "react-icons/io";
import { useForm, Controller } from "react-hook-form";
import { LoadingContext } from "../../Context/LoadingProvider";
import { CloseOutlined } from "@mui/icons-material";

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
	const { id } = useParams();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/page/${id}`
	);
	const { fetchedData: pageCategories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/page-categories"
	);
	const { fetchedData: postCategories } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/post-categories"
	);
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);
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
		postCategory_id: "",
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

	const itsPost = page?.pageCategory?.includes(1);
	const [tag, setTag] = useState("");
	const [descriptionLength, setDescriptionLength] = useState(false);
	const [description, setDescription] = useState({
		htmlValue: "",
		editorState: EditorState.createEmpty(),
	});

	const addTags = () => {
		setPage({ ...page, tags: [...page?.tags, tag] });
		setTag("");
	};

	const updateTags = (i) => {
		const newTags = page?.tags?.filter((tag, index) => index !== i);
		setPage({ ...page, tags: newTags });
	};

	const onEditorStateChange = (editorValue) => {
		const editorStateInHtml = draftToHtml(
			convertToRaw(editorValue.getCurrentContent())
		);
		setDescription({
			htmlValue: editorStateInHtml,
			editorState: editorValue,
		});
	};

	const [pageError, setPageError] = useState({
		title: "",
		page_desc: "",
		page_content: "",
		seo_title: "",
		seo_link: "",
		seo_desc: "",
		tags: "",
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
		});
	};

	useEffect(() => {
		setPage({
			...page,
			title: fetchedData?.data?.pages?.title,
			page_desc: fetchedData?.data?.pages?.page_desc,
			page_content: fetchedData?.data?.pages?.page_content,
			seo_title: fetchedData?.data?.pages?.seo_title,
			seo_link: fetchedData?.data?.pages?.seo_link,
			seo_desc: fetchedData?.data?.pages?.seo_desc,
			tags: fetchedData?.data?.pages?.tags,
			pageCategory: fetchedData?.data?.pages?.pageCategory?.map(
				(item) => item?.id
			),
			postCategory_id: fetchedData?.data?.pages?.postCategory?.id,
			image: fetchedData?.data?.pages?.image,
		});
		setDescription({
			...description,
			editorState: EditorState.createWithContent(
				ContentState.createFromBlockArray(
					convertFromHTML(fetchedData?.data?.pages?.page_content || "")
				)
			),
		});
	}, [fetchedData?.data?.pages]);

	useEffect(() => {
		reset(page);
	}, [page, reset]);

	const [images, setImages] = useState([]);

	const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
		accept: {
			"image/jpeg": [],
			"image/png": [],
		},
		onDrop: (acceptedFiles) => {
			setImages(
				acceptedFiles.map((file) =>
					Object.assign(file, {
						preview: URL.createObjectURL(file),
					})
				)
			);
		},
	});

	const files = acceptedFiles.map((file) => (
		<li key={file.path}>
			{file.path} - {file.size} bytes
		</li>
	));

	const handleOnChange = (e) => {
		setPage({ ...page, [e.target.name]: e.target.value });
	};

	const updatePage = (data) => {
		setLoadingTitle("جاري تعديل الصفحة");
		resetCouponError();
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("title", data?.title);
		formData.append("page_desc", data?.page_desc);
		formData.append(
			"page_content",
			description?.htmlValue || page?.page_content
		);
		formData.append("seo_title", data?.seo_title);
		formData.append("seo_link", data?.seo_link);
		formData.append("seo_desc", data?.seo_desc);
		formData.append("tags", page?.tags?.join(","));
		for (let i = 0; i < page?.pageCategory?.length; i++) {
			formData.append([`pageCategory[${i}]`], page?.pageCategory[i]);
		}
		formData.append("postCategory_id", itsPost ? page?.postCategory_id : null);
		if (images.length !== 0) {
			formData.append("image", itsPost ? images[0] || null : null);
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/page/${id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Pages");
					setReload(!reload);
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
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل صفحة</title>
			</Helmet>
			<div open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Pages")}
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
												onClick={() => navigate("/Pages")}
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
													<input
														name='title'
														className='w-100'
														type='text'
														placeholder='عنوان الصفحة'
														{...register("title", {
															required: " حقل العنوان مطلوب",
															pattern: {
																value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
																message: "يجب أن يكون العنوان عبارة عن نصاً",
															},
														})}
													/>
													<div className='col-12'>
														<span className='fs-6 text-danger'>
															{pageError?.title}
															{errors?.title && errors.title.message}
														</span>
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
																placeholder='اكتب وصف قصير للصفحة لا يتعدي 100 حرف'
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
																الوصف يجب إلا يتعدي 100 حرف
															</span>
														)}
													</div>
												</div>
											</div>
											<div className='row'>
												<div className='col-12'>
													<div className=''>
														<div className='d-flex flex-row align-items-center gap-4 py-4'>
															<Editor
																toolbarHidden={false}
																editorState={description.editorState}
																onEditorStateChange={onEditorStateChange}
																inDropdown={true}
																placeholder={
																	<div
																		className='d-flex flex-column  '
																		style={{ color: "#ADB5B9" }}>
																		محتوي الصفحة
																	</div>
																}
																wrapperClassName='demo-wrapper'
																editorClassName='demo-editor'
																toolbar={{
																	options: [
																		"inline",
																		"textAlign",
																		"image",
																		"list",
																	],
																	inline: {
																		options: ["bold"],
																	},
																	list: {
																		options: ["unordered", "ordered"],
																	},
																}}
															/>
														</div>
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
															<h4>تصنيف الصفحة</h4>
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
																	<h4>تصنيف المدونة</h4>
																</div>
																<FormControl sx={{ m: 0, width: "100%" }}>
																	<Select
																		name='postCategory_id'
																		value={page?.postCategory_id}
																		onChange={(e) => {
																			handleOnChange(e);
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
																		inputProps={{
																			"aria-label": "Without label",
																		}}
																		renderValue={(selected) => {
																			if (page?.postCategory_id === "") {
																				return (
																					<p className='text-[#ADB5B9]'>
																						اختر التصنيف
																					</p>
																				);
																			}
																			const result =
																				postCategories?.data?.categories?.filter(
																					(item) =>
																						item?.id === parseInt(selected)
																				) || "";
																			return result[0]?.name;
																		}}>
																		{postCategories?.data?.categories?.map(
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
																						value={cat?.id}>
																						{cat?.name}
																					</MenuItem>
																				);
																			}
																		)}
																	</Select>
																</FormControl>
															</div>
														</div>
														<div className='col-md-6 col-12'>
															<div className='wrapper h-auto'>
																<div className='title'>
																	<h4>صورة المدونة</h4>
																</div>
																<div
																	{...getRootProps({
																		className:
																			"d-flex justify-content-between p-3",
																	})}>
																	<input
																		{...getInputProps()}
																		id='personal-image'
																		name='personal-image'
																	/>
																	{files.length <= 0 ? (
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
																		}}>
																		{" "}
																		استعراض
																	</span>
																	{files?.length !== 0 && (
																		<ul
																			style={{ fontSize: "14px" }}
																			className='m-0'>
																			{files}
																		</ul>
																	)}
																</div>
															</div>
															{page?.image !== "" && (
																<img
																	style={{ objectFit: "contain" }}
																	className='mt-3'
																	src={images[0]?.preview || page?.image}
																	width={200}
																	height={100}
																	alt='img-page'
																/>
															)}
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
