import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import Context from "../../Context/context";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import ImageUploading from "react-images-uploading";
import AddSubCategory from "./AddSubCategory";
import { useDispatch } from "react-redux";
import { openAddSubCategory } from "../../store/slices/AddSubCategory-slice";
// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// ICONS
import { ReactComponent as UploadIcon } from "../../data/Icons/icon-24-uplad.svg";
import { ReactComponent as DeleteIcon } from "../../data/Icons/icon-24-delete.svg";
import { AiOutlinePlus } from "react-icons/ai";
import { useForm } from "react-hook-form";
import { LoadingContext } from "../../Context/LoadingProvider";

// Modal style
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

const AddCategory = () => {
	const dispatch = useDispatch(true);
	const navigate = useNavigate();
	const [reload, setReload] = useState(false);
	const [cookies] = useCookies(["access_token"]);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const { subCategories, setSubCategories } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	const {
		register,
		handleSubmit,
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

	// Use state with useDropzone library to set banners
	const [icons, setIcons] = React.useState([]);
	const onChange = (imageList, addUpdateIndex) => {
		// data for submit
		setIcons(imageList);
	};

	const resetCategoryError = () => {
		setCategoryError({
			name: "",
			icon: "",
		});
	};

	// to add new category
	const handleCategory = (data) => {
		setLoadingTitle("جاري حفظ النشاط أو التصنيف");
		resetCategoryError();
		let formData = new FormData();
		formData.append("name", data?.name);
		formData.append("icon", icons[0]?.file || null);

		// to select all subcategories names
		for (let i = 0; i < subCategories?.length; i++) {
			if (subCategories[i]?.name !== "") {
				formData.append([`data[${i}][name]`], subCategories[i]?.name || "");
			}
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/category`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
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
						icon: res?.data?.message?.en?.icon?.[0],
					});
				}
			});
	};

	// to edit the sub category
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

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | اضافة تصنيف</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Category")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box component={"div"} sx={style}>
						<div className='add-form-wrapper'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> اضافة تصنيف</h5>
										<p>قم بتحديث النشاط أو التصنيف والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>
							<form
								className='form-h-full'
								onSubmit={handleSubmit(handleCategory)}>
								<div className='form-body'>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='add-icon'>
												ايقونة النشاط أو التصنيف<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<div>
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
																	<span>( سيتم قبول الصور jpeg & png )</span>
																</div>
															</div>
														</div>
													)}
												</ImageUploading>
											</div>
											{icons[0] && (
												<div className='banners-preview-container'>
													<div className='banner-preview'>
														<img
															src={icons[0]?.data_url}
															alt=''
															style={{ objectFit: "cover" }}
														/>
													</div>
												</div>
											)}
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
												النشاط أو التصنيف الرئيسي<span className='text-danger'>*</span>
											</label>
										</div>
										<div className='col-md-7 col-12'>
											<input
												name='name'
												type='text'
												id='category-name'
												placeholder=' أدخل اسم النشاط أو التصنيف الرئيسي'
												{...register("name", {
													required: "حقل الاسم مطلوب",
													pattern: {
														value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
														message: "الاسم يجب أن يكون نصاً",
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
												<span className='me-2'>اضافة تصنيف فرعي جديد</span>
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

export default AddCategory;
