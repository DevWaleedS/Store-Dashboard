import React, { useContext, useEffect, useState } from "react";

// third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import useFetch from "../../Hooks/UseFetch";
import ImageUploading from "react-images-uploading";
import { useNavigate, useParams } from "react-router-dom";

// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// Redux
import { useDispatch } from "react-redux";
import { openAddSubCategory } from "../../store/slices/AddSubCategory-slice";

// Components
import AddSubCategory from "../nestedPages/AddSubCategory";

// Icons
import { AiOutlinePlus } from "react-icons/ai";
import { DeleteIcon, UploadIcon } from "../../data/Icons";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

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

const EditCategory = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const { id } = useParams();
	const dispatch = useDispatch(true);
	const navigate = useNavigate();
	const { fetchedData, reload, setReload } = useFetch(`category/${id}`);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const { subCategories, setSubCategories } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [category, setCategory] = useState({
		name: "",
	});
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm({
		mode: "onBlur",
		defaultValues: {
			name: "",
		},
	});

	const [categoryError, setCategoryError] = useState({
		name: "",
		icon: "",
	});

	// handle images size
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	// Use state  set banners
	const [icons, setIcons] = React.useState([]);
	const onChange = (imageList, addUpdateIndex) => {
		// Check image size before updating state
		const isSizeValid = imageList.every(
			(image) => image.file.size <= maxFileSize
		);
		const errorMessage = "حجم الصورة يجب أن لا يزيد عن 1 ميجابايت.";

		if (!isSizeValid) {
			setIcons([]);
			toast.warning(errorMessage, {
				theme: "light",
			});
			setCategoryError({
				...categoryError,
				icon: errorMessage,
			});
		} else {
			setIcons(imageList);
			setCategoryError({ ...categoryError, icon: null });
		}
	};

	/** to get all data from api */
	useEffect(() => {
		setCategory({
			...category,
			name: fetchedData?.data?.categories?.name,
		});
	}, [fetchedData?.data?.categories]);

	useEffect(() => {
		reset(category);
	}, [category, reset]);

	/** update category function */
	const updateCategory = (data) => {
		setLoadingTitle("جاري تعديل النشاط");
		let formData = new FormData();
		formData.append("_method", "PUT");
		formData.append("name", data?.name);
		if (icons?.length !== 0) {
			formData.append("icon", icons[0]?.file || null);
		}

		/** to select all subcategories */
		for (let i = 0; i < subCategories?.length; i++) {
			if (subCategories[i]?.name !== "") {
				formData.append([`data[${i}][name]`], subCategories[i]?.name || "");
				formData.append([`data[${i}][id]`], subCategories[i]?.id || "");
			}
		}
		axios
			.post(`category/${fetchedData?.data?.categories?.id}`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Category");
					setReload(!reload);
					setSubCategories([]);
				} else {
					setLoadingTitle("");

					setCategoryError({
						...categoryError,
						name: res?.data?.message?.en?.name?.[0],
						icon: res?.res?.data?.message?.en?.name?.[0],
					});
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.name?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.name?.[0], {
						theme: "light",
					});
				}
			});
	};

	/** to edit the sub category */
	const updateSubCatChanged = (e, index) => {
		const newArray = subCategories?.map((item, i) => {
			if (index === i) {
				return { ...item, name: e.target.value };
			} else {
				return item;
			}
		});
		setSubCategories(newArray);
	};

	/**	 to get all subcategoris */
	useEffect(() => {
		if (fetchedData?.data?.categories) {
			for (
				let i = 0;
				i < fetchedData?.data?.categories?.subcategory?.length;
				i++
			) {
				setSubCategories((subCategories) => [
					...subCategories,
					{
						id: fetchedData?.data?.categories?.subcategory[i]?.id,
						name: fetchedData?.data?.categories?.subcategory[i]?.name,
					},
				]);
			}
		}
	}, [fetchedData?.data?.categories]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تعديل نشاط</title>
			</Helmet>
			<div className='' open={true}>
				<Modal
					open={true}
					onClose={() => {
						setSubCategories([]);
						navigate("/Category");
					}}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style}>
						<div className='add-form-wrapper'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> تعديل نشاط</h5>
										<p>قم بتحديث النشاط والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>

							<form
								className='form-h-full'
								onSubmit={handleSubmit(updateCategory)}>
								<div className='form-body'>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='add-icon'>
												ايقونة النشاط
												<span className='important-hint'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<div class='uplod-wrap'>
												<ImageUploading
													value={icons}
													onChange={onChange}
													dataURLKey='data_url'
													acceptType={["jpg", "png", "jpeg"]}>
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
														<div>
															<div
																className='add-image-btn-box '
																onClick={() => {
																	onImageUpload();
																}}
																{...dragProps}>
																<div className='d-flex flex-column justify-center align-items-center'>
																	<div className='add-image-btn d-flex flex-column justify-center align-items-center'>
																		<UploadIcon />
																		<label
																			htmlFor='add-image'
																			className='d-flex justify-center align-items-center'>
																			اسحب الصورة هنا
																		</label>
																	</div>
																	<span>
																		( سيتم قبول الصور jpeg & png & jpg)
																	</span>
																	<div className='tax-text '>
																		(الحد الأقصى للصورة 1MB)
																	</div>
																</div>
															</div>

															<div className='tax-text '>
																المقاس الأنسب 110 بكسل عرض و 110 بكسل ارتفاع
															</div>
														</div>
													)}
												</ImageUploading>
											</div>

											<div className='banners-preview-container'>
												<div className='banner-preview'>
													{icons[0] && <img src={icons[0]?.data_url} alt='' />}
													{fetchedData?.data?.categories && (
														<img
															src={fetchedData?.data?.categories?.icon}
															alt=''
														/>
													)}
												</div>
											</div>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											{categoryError?.icon && (
												<span className='fs-6 text-danger'>
													{categoryError?.icon}
												</span>
											)}
										</div>
									</div>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='category-name'>
												{" "}
												النشاط الرئيسي
												<span className='important-hint'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<input
												type='text'
												id='category-name'
												placeholder='أدخل اسم النشاط الرئيسي'
												name='name'
												{...register("name", {
													required: "حقل الاسم مطلوب",
													pattern: {
														value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
														message:
															"الاسم يجب أن يكون نصاً ولا يحتوي على حروف خاصه مثل الأقوس والرموز",
													},
												})}
											/>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<span className='fs-6 text-danger'>
												{categoryError?.name}
												{errors?.name && errors.name.message}
											</span>
										</div>
									</div>
									{subCategories &&
										subCategories.map(
											(subCategory, index) =>
												subCategory?.name && (
													<div className='row mb-md-5 mb-3' key={index}>
														<div className='col-md-3 col-12'>
															<label
																htmlFor='category-name'
																style={{
																	color: "#1DBBBE",
																}}>
																فرعي رقم {index + 1}
															</label>
														</div>
														<div className='col-md-7 col-12 d-flex justify-content-end align-items-center gap-2'>
															<input
																className='flex-1'
																type='text'
																id='category-name'
																value={subCategory?.name}
																onChange={(e) => updateSubCatChanged(e, index)}
																style={{
																	color: "#1DBBBE",
																	border: "1px solid #1DBBBE",
																}}
															/>
															<DeleteIcon
																onClick={() => {
																	setSubCategories((subCategories) => [
																		...subCategories.filter(
																			(sub) => sub?.name !== subCategory?.name
																		),
																	]);
																}}
																style={{
																	width: "25px",
																	height: "25px",
																	cursor: "pointer",
																}}
															/>
														</div>
													</div>
												)
										)}

									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<button
												type='button'
												className='add-new-cate-btn w-100'
												onClick={() => {
													dispatch(openAddSubCategory());
												}}>
												<AiOutlinePlus />
												<span className='me-2'>اضافة نشاط فرعي جديد</span>
											</button>
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
												type='button'
												className='close-btn'
												onClick={() => {
													navigate("/Category");
													setSubCategories([]);
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
				<AddSubCategory />
			</div>
		</>
	);
};

export default EditCategory;
