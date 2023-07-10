import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useNavigate, useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { useDispatch } from 'react-redux';
import { openAddSubCategory } from '../../store/slices/AddSubCategory-slice';
import ImageUploading from 'react-images-uploading';
import AddSubCategory from './AddSubCategory';
// ICONS

import { ReactComponent as UploadIcon } from '../../data/Icons/icon-24-uplad.svg';
import { ReactComponent as DeleteIcon } from '../../data/Icons/icon-24-delete.svg';
import { AiOutlinePlus } from 'react-icons/ai';

import { useCookies } from 'react-cookie';
import useFetch from '../../Hooks/UseFetch';
import Context from '../../Context/context';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { LoadingContext } from '../../Context/LoadingProvider';

const style = {
	position: 'fixed',
	top: '80px',
	left: '0%',
	transform: 'translate(0%, 0%)',
	width: '70%',
	height: '100%',
	overflow: 'auto',
	bgcolor: '#fff',
	paddingBottom: '80px',
	'@media(max-width:768px)': {
		position: 'absolute',
		top: 0,
		left: 0,
		width: '100%',
		backgroundColor: '#F6F6F6',
		paddingBottom: 0,
	},
};

const EditCategory = () => {
	const { id } = useParams();
	const dispatch = useDispatch(true);
	const navigate = useNavigate();
	const [cookies] = useCookies(['access_token']);
	const { fetchedData, reload, setReload } = useFetch(`https://backend.atlbha.com/api/Store/category/${id}`);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const { subCategories, setSubCategories } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [category, setCategory] = useState({
		name: '',
	});
	const { register, handleSubmit, reset, formState: { errors } } = useForm({
		mode: "onBlur",
		defaultValues: {
			name: '',
		}
	});

	const [categoryError, setCategoryError] = useState({
		name: '',
		icon: '',
	});

	// Use state  set banners
	const [icons, setIcons] = React.useState([]);
	const onChange = (imageList, addUpdateIndex) => {
		// data for submit
		setIcons(imageList);
	};

	// to get all data from api
	useEffect(() => {
		setCategory({
			...category,
			name: fetchedData?.data?.categories?.name,
		});
	}, [fetchedData?.data?.categories]);

	useEffect(() => {
		reset(category);
	}, [category, reset]);

	// update category function
	const updateCategory = (data) => {
		setLoadingTitle('جاري تعديل التصنيف');
		let formData = new FormData();
		formData.append('_method', 'PUT');
		formData.append('name', data?.name);
		if (icons?.length !== 0) {
			formData.append('icon', icons[0]?.file || null);
		}

		// to select all subcategories names
		for (let i = 0; i < subCategories?.length; i++) {
			formData.append([`data[${i}][name]`], subCategories[i]?.name || '');
			formData.append([`data[${i}][id]`], subCategories[i]?.id || '');
		}
		axios
			.post(`https://backend.atlbha.com/api/Store/category/${fetchedData?.data?.categories?.id}`, formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					navigate('/Category');
					setReload(!reload);

				} else {
					setLoadingTitle('');
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
					setCategoryError({
						...categoryError,
						name: res?.data?.message?.en?.name?.[0],
						icon: res?.data?.message?.en?.icon?.[0],
					});
				}
			});
		setSubCategories([]);
	};

	// to get the value from inputs
	const handleCategory = (e) => {
		const { name, value } = e.target;
		setCategory((prevState) => {
			return { ...prevState, [name]: value };
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

	// to get all subcategoris
	useEffect(() => {
		if (fetchedData?.data?.categories) {
			for (let i = 0; i < fetchedData?.data?.categories?.subcategory?.length; i++) {
				setSubCategories((subCategories) => [...subCategories, { id: fetchedData?.data?.categories?.subcategory[i]?.id, name: fetchedData?.data?.categories?.subcategory[i]?.name }]);
			}
		}
	}, [fetchedData?.data?.categories]);


	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل تصنيف</title>
			</Helmet>
			<div className='' open={true}>
				<Modal open={true} onClose={() => navigate('/Category')} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='add-form-wrapper'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> تعديل تصنيف</h5>
										<p>قم بتحديث التصنيف والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>

							<form className='form-h-full' onSubmit={handleSubmit(updateCategory)}>
								<div className='form-body'>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='add-icon'>ايقونة التصنيف<span className='text-danger'>*</span></label>
										</div>
										<div className='col-md-7 col-12'>
											<div>
												<ImageUploading value={icons} onChange={onChange} dataURLKey='data_url' acceptType={['jpg', 'png', 'jpeg']}>
													{({ imageList, onImageUpload, onImageRemoveAll, onImageUpdate, onImageRemove, isDragging, dragProps }) => (
														// write your building UI
														<div>
															<div
																className='add-image-btn-box '
																onClick={() => {
																	onImageUpload();
																}}
																{...dragProps}
															>
																<div className='d-flex flex-column justify-center align-items-center'>
																	<div className='add-image-btn d-flex flex-column justify-center align-items-center'>
																		<UploadIcon />
																		<label htmlFor='add-image' className='d-flex justify-center align-items-center'>
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

											<div className='banners-preview-container'>
												<div className='banner-preview'>
													{icons[0] && <img src={icons[0]?.data_url} alt='' style={{ objectFit: 'cover' }} />}
													{fetchedData?.data?.categories && <img src={fetchedData?.data?.categories?.icon} alt='' style={{ objectFit: 'cover' }} />}
												</div>
											</div>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>{categoryError?.icon && <span className='fs-6 text-danger'>{categoryError?.icon}</span>}</div>
									</div>
									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'>
											<label htmlFor='category-name'> التصنيف الرئيسي<span className='text-danger'>*</span></label>
										</div>
										<div className='col-md-7 col-12'>
											<input
												type='text'
												id='category-name'
												placeholder='أدخل اسم التصنيف الرئيسي'
												name='name'
												{...register('name', {
													required: "حقل الاسم مطلوب",
													pattern: {
														value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
														message: "الاسم يجب ان يكون نص"
													},
												})}
											/>
										</div>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'><span className='fs-6 text-danger'>{categoryError?.name}{errors?.name && errors.name.message}</span></div>
									</div>
									{subCategories &&
										subCategories.map((subCategory, index) => (
											<div className='row mb-md-5 mb-3' key={index}>
												<div className='col-md-3 col-12'>
													<label
														htmlFor='category-name'
														style={{
															color: '#1DBBBE',
														}}
													>
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
															color: '#1DBBBE',
															border: '1px solid #1DBBBE',
														}}
													/>
													<DeleteIcon
														onClick={() => {
															setSubCategories((subCategories) => [...subCategories.filter((sub) => sub?.name !== subCategory?.name)]);
														}}
														style={{
															width: '25px',
															height: '25px',
															cursor: 'pointer',
														}}
													/>
												</div>
											</div>
										))}

									<div className='row mb-md-5 mb-3'>
										<div className='col-md-3 col-12'></div>
										<div className='col-md-7 col-12'>
											<button
												type='button'
												className='add-new-cate-btn w-100'
												onClick={() => {
													dispatch(openAddSubCategory());
												}}
											>
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
											<button type='button' className='close-btn'
												onClick={() => {
													navigate('/Category');
													setSubCategories([]);
												}}
											>
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
