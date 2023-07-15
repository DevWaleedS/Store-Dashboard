import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useFetch from "../../Hooks/UseFetch";
import Context from "../../Context/context";
import { useNavigate, useParams } from "react-router-dom";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { useCookies } from "react-cookie";

import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

// icons and images
import { ReactComponent as CurrencyIcon } from "../../data/Icons/icon-24-Currency.svg";

import { useForm } from "react-hook-form";
import { UserAuth } from "../../Context/UserAuthorProvider";

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

const ShowImportEtlobhaProduct = () => {
	const navigate = useNavigate();
	const { id } = useParams();
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/etlobhaProductShow/${id}`
	);
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const [product, setProduct] = useState({
		name: "",
		description: "",
		selling_price: "",
		discount_price: "",
		price: "",
		stock: "",
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
			description: "",
			selling_price: "",
			price: "",

			stock: "",
		},
	});
	useEffect(() => {
		if (fetchedData?.data?.products) {
			setProduct({
				...product,
				name: fetchedData?.data?.products?.name,
				description: fetchedData?.data?.products?.description,
				selling_price: fetchedData?.data?.products?.selling_price,
				price: fetchedData?.data?.products?.selling_price,
				stock: fetchedData?.data?.products?.stock,
			});
		}
	}, [fetchedData?.data?.products]);

	useEffect(() => {
		reset(product);
	}, [product, reset]);

	const [productError, setProductError] = useState({
		name: "",
		cover: "",
		description: "",
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
			description: "",
			selling_price: "",
			category_id: "",
			discount_price: "",
			discount_percent: "",
			subcategory_id: "",
			stock: "",
			SEOdescription: "",
		});
	};

	// Use state with useDropzone library to set banners
	const [icon, setIcon] = React.useState([]);

	/* UseEffects TO Handle memory leaks */
	useEffect(() => {
		// Make sure to revoke the data uris to avoid memory leaks, will run on unmount
		return () => icon.forEach((banner) => URL.revokeObjectURL(banner.preview));
	}, []);

	const updateImportProduct = (data) => {
		resetCouponError();
		let formData = new FormData();
		formData.append("price", data?.price);

		axios
			.post(
				`https://backend.atlbha.com/api/Store/updateimportproduct/${fetchedData?.data?.products?.id}`,
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
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Products");
					setReload(!reload);
				} else {
					setReload(!reload);
					setProductError({
						selling_price: res?.data?.message?.en?.selling_price?.[0],
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تعديل منتج مستورد</title>
			</Helmet>
			<div className='add-category-form' open={true}>
				<Modal
					open={true}
					onClose={() => navigate("/Products")}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={style}>
						<div className='add-form-wrapper'>
							<div className='d-flex'>
								<div className='col-12'>
									<div className='form-title'>
										<h5 className='mb-3'> تعديل منتج مستورد </h5>

										<p> قم بتحديث منتجك والمعلومات الضرورية من هنا</p>
									</div>
								</div>
							</div>
							{loading ? (
								<CircularLoading />
							) : (
								<form
									className='form-h-full'
									onSubmit={handleSubmit(updateImportProduct)}>
									<div className='form-body'>
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-image'> صورة المنتج</label>
											</div>
											<div className='col-md-7 col-12'>
												{/** preview banner here */}
												<div className=' banners-preview-container'>
													<img
														className='w-100 h-100'
														src={fetchedData?.data?.products?.cover}
														alt={fetchedData?.data?.products?.name}
													/>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
											<div className='col-md-7 col-12'>
												{productError?.cover && (
													<span className='fs-6 text-danger'>
														{productError?.cover}
													</span>
												)}
											</div>
										</div>

										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-name'> اسم المنتح </label>
											</div>
											<div className='col-md-7 col-12'>
												<input
													disabled={true}
													name='name'
													type='text'
													id='product-name'
													placeholder=' اسم المنتج'
													{...register("name", {
														required: "حقل الاسم مطلوب",
														pattern: {
															value: /^[^-\s][\u0600-\u06FF-A-Za-z0-9 ]+$/i,
															message: "يجب على الحقل الاسم أن يكون نصاّّ",
														},
													})}
												/>
											</div>
											<div className='col-md-3 col-12'></div>
											<div className='col-md-7 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.name}
													{errors?.name && errors.name.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-desc'> وصف المنتح </label>
											</div>
											<div className='col-md-7 col-12'>
												<textarea
													disabled={true}
													name='description'
													id='product-desc'
													placeholder='  قم بكتابه واضح للمنتج'
													{...register("description", {
														required: "حقل الوصف مطلوب",
													})}></textarea>
											</div>
											<div className='col-md-3 col-12'></div>
											<div className='col-md-7 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.description}
													{errors?.description && errors.description.message}
												</span>
											</div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='product-category'>
													{" "}
													التصنيف الرئيسي
												</label>
											</div>
											<div className='col-md-7 col-12'>
												<div className='main-category category mb-3'>
													<input
														className='input'
														type='text'
														value={fetchedData?.data?.products?.category?.name}
														onChange={() => console.log("")}
														disabled={true}
													/>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>
										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='sub-category'>
													{" "}
													التصنيفات الفرعية{" "}
												</label>
											</div>
											<div className='col-md-7 col-12'>
												<div className='sub-category '>
													<div className='d-flex align-items-center justify-content-start gap-3'>
														{fetchedData?.data?.products?.subcategory?.map(
															(sub, index) => (
																<div key={index} className='tags'>
																	{sub?.name}
																</div>
															)
														)}
													</div>
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
														height: "45px",
													}}>
													<div className='currency_icon d-flex justify-content-center align-items-center'>
														<CurrencyIcon />
													</div>
													<div className='price w-100 d-flex justify-content-center align-items-center import_products_input'>
														{fetchedData?.data?.products?.purchasing_price}
													</div>

													<div className='currency d-flex justify-content-center align-items-center'>
														ر.س
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='price'> الكمية في المخزون </label>
											</div>
											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{
														background: "#eeeeef",
														border: "1px solid #a7a7a71a",
														height: "45px",
													}}>
													<div className='price w-100 d-flex justify-content-center align-items-center import_products_input'>
														{" "}
														{fetchedData?.data?.products?.stock}
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
										</div>

										<div className='row mb-md-5 mb-3'>
											<div className='col-md-3 col-12'>
												<label htmlFor='price'>
													{" "}
													سعر البيع<span className='text-danger'>*</span>
												</label>
											</div>
											<div className='col-md-7 col-12'>
												<div
													className='d-flex justify-content-center align-items-center'
													style={{ background: "#FFF" }}>
													<div className='currency_icon d-flex justify-content-center align-items-center'>
														<CurrencyIcon />
													</div>

													<input
														className='import_products_input'
														style={{ background: "#FFF" }}
														name='price'
														type='text'
														id='price'
														{...register("price", {
															required: "حقل سعر البيع مطلوب",
															pattern: {
																value: /^[0-9]+$/i,
																message: "يجب أن يكون سعر البيع رقمًا",
															},
															min: {
																value: 1,
																message: "يجب أن يكون سعر البيع أكبر من 0",
															},
														})}
													/>
													<div className='currency d-flex justify-content-center align-items-center'>
														ر.س
													</div>
												</div>
											</div>
											<div className='col-md-3 col-12'></div>
											<div className='col-md-7 col-12'>
												<span className='fs-6 text-danger'>
													{productError?.selling_price}
													{errors?.selling_price &&
														errors.selling_price.message}
												</span>
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

export default ShowImportEtlobhaProduct;
