import React, { useContext, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useFetch from "../../Hooks/UseFetch";
import { useNavigate, useParams } from "react-router-dom";
import Context from "../../Context/context";
// MUI
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { ReactComponent as CurrencyIcon } from "../../data/Icons/icon-24-Currency.svg";
import { useCookies } from "react-cookie";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { LoadingContext } from "../../Context/LoadingProvider";
import { BsPlayCircle } from "react-icons/bs";
const modalStyle = {
	position: "absolute",
	top: "90px",
	left: "50%",
	transform: "translate(-50%, 0%)",
	width: 1042,
	maxWidth: "90%",
	height: "auto",
	bgcolor: "#F4F5F7",
	border: "1px solid #ECECEC",
	borderRadius: "6px",
	boxShadow: 24,
	"@media(max-width:768px)": {
		position: "absolute",
		height: "auto",
		top: "20px",
	},
};

const ProductRefund = () => {
	const [cookies] = useCookies(["access_token"]);

	const { id } = useParams();
	const navigate = useNavigate();

	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/etlobhaProductShow/${id}`
	);
	console.log(fetchedData?.data);
	const [open, setOpen] = React.useState(true);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [price, setPrice] = React.useState();
	const [priceError, setPriceError] = React.useState("");
	const [imagesPreview, setImagesPreview] = useState();

	useEffect(() => {
		if (fetchedData?.data?.products) {
			setPrice(fetchedData?.data?.products?.selling_price);
			setImagesPreview(fetchedData?.data?.products?.cover);
		}
	}, [fetchedData?.data?.products]);

	const importProduct = () => {
		setPriceError("");
		setLoadingTitle("جاري استيراد المنتج");
		let formData = new FormData();
		formData.append("product_id", id);
		formData.append("price", price);

		axios
			.post(`https://backend.atlbha.com/api/Store/importproduct`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Products/SouqOtlobha");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setPriceError(res?.data?.message?.en?.price[0]);
					setEndActionTitle(res?.data?.message?.ar);
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | استيراد منتج</title>
			</Helmet>
			<div className='ProductRefund' open={open}>
				<Modal
					open={open}
					onClose={() => {
						navigate(`/Products/SouqOtlobha`);
					}}
					aria-labelledby='modal-modal-title'
					aria-describedby='modal-modal-description'>
					<Box sx={modalStyle}>
						<div className='ProductRefund-wrapper p-md-4 p-3'>
							<div className='header w-100 d-flex justify-content-end align-items-center '>
								<IoIosCloseCircleOutline
									style={{ width: "25px", height: "25px", cursor: "pointer" }}
									className='close-icon '
									onClick={() => {
										navigate(`/Products/SouqOtlobha`);
									}}
								/>
							</div>
							{loading ? (
								<div className='mt-5 h-100 d-flex flex-column align-items-center justify-content-cneter'>
									<CircularLoading />
								</div>
							) : (
								<div className='body'>
									<div className='row container-row'>
										<div className='col-md-5 col-12 mb-md-0 mb-3'>
											<div className='product-title mb-3 '>
												{fetchedData?.data?.products?.name}
											</div>
											<div className='product-images mb-3'>
												<div className='main-image'>
													{imagesPreview?.includes(
														".mp4" || ".avi" || ".mov" || ".mkv"
													) ? (
														<div className='video_wrapper'>
															<video
																src={imagesPreview}
																className='img-fluid'
																autoPlay
																controls
															/>
														</div>
													) : (
														<img
															src={imagesPreview}
															alt='product'
															className='img-fluid'
														/>
													)}
												</div>
												<div className='another-image'>
													{fetchedData?.data?.products?.images?.map(
														(item, index) => {
															const isVideo = item?.image.includes(
																".mp4" || ".avi" || ".mov" || ".mkv"
															);

															if (isVideo) {
																return (
																	<div className='video_wrapper'>
																		<div className='play-video-icon'>
																			<BsPlayCircle
																				onClick={() => {
																					setImagesPreview(item?.image);
																				}}
																			/>
																		</div>
																		<video
																			style={{ cursor: "pointer" }}
																			key={index}
																			src={item?.image}
																			className='img-fluid'
																		/>
																	</div>
																);
															} else {
																return (
																	<img
																		style={{ cursor: "pointer" }}
																		onClick={() => {
																			setImagesPreview(item?.image);
																		}}
																		key={index}
																		src={item?.image}
																		alt={item?.image}
																		className='img-fluid'
																	/>
																);
															}
														}
													)}
												</div>
											</div>

											<div className='product-category'>
												<h3 className='text-center mb-3'>تصنيفات المنتج</h3>
												<div className='main-category category mb-3'>
													<div className='label mb-2'>التصنيف الرئيسي</div>
													<div className='input'>
														{fetchedData?.data?.products?.category?.name}
													</div>
												</div>
												<div className='sub-category category'>
													<div className='label mb-2'>التصنيفات الفرعية </div>
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
										</div>
										<div
											className='col-md-6 col-12'
											style={{ alignSelf: "end" }}>
											<div className='product-price mb-3'>
												<div className='label mb-1'>سعر الشراء</div>
												<div className='input d-flex justify-content-center align-items-center'>
													<div className='price-icon d-flex align-items-center  p-2 gap-3'>
														<CurrencyIcon />
														<div className='price w-100 d-flex justify-content-center align-items-center'>
															{fetchedData?.data?.products?.purchasing_price}
														</div>
													</div>

													<div className='currency d-flex justify-content-center align-items-center'>
														ر.س
													</div>
												</div>
											</div>
											<div className='product-price mb-3'>
												<div className='label mb-1'> الكمية في المخزن</div>
												<div className='input d-flex justify-content-center align-items-center'>
													<div className='price-icon d-flex  p-2 gap-3'>
														<CurrencyIcon className='invisible ' />
														<div
															className='price w-100 d-flex justify-content-center align-items-center'
															style={{ color: "#67747B" }}>
															{fetchedData?.data?.products?.stock}
														</div>
													</div>

													<div className='currency d-flex justify-content-center align-items-center invisible '>
														ر.س
													</div>
												</div>
											</div>

											<div className='product-price mb-3'>
												<div className='label selling-price-label mb-1'>
													سعر البيع<span className='text-danger'>*</span>{" "}
													<span>(قم بإضافة السعر الخاص بك)</span>
												</div>
												<div className='input d-flex justify-content-center align-items-center'>
													<div className='price-icon d-flex align-items-center p-2 gap-3'>
														<CurrencyIcon />
														<div className='price w-100 d-flex justify-content-center align-items-center'>
															<input
																className='text-center'
																style={{
																	direction: "ltr",
																}}
																type='number'
																name='price'
																value={price}
																onChange={(e) => setPrice(e.target.value)}
															/>
														</div>
													</div>

													<div className='currency d-flex justify-content-center align-items-center'>
														ر.س
													</div>
												</div>

												{price <
													fetchedData?.data?.products?.purchasing_price && (
													<span className='fs-6 text-danger'>
														السعر يجب ان يكون اكبر من او يساوي (
														{fetchedData?.data?.products?.purchasing_price})
													</span>
												)}
												{priceError && (
													<span className='fs-6 text-danger'>{priceError}</span>
												)}
											</div>

											<div className='product-price'>
												<div className='label about-product-label mb-2'>
													نبذة عن المنتج
												</div>
												<div className='input textarea d-flex justify-content-center align-items-center'>
													{fetchedData?.data?.products?.description}
												</div>
											</div>
										</div>
									</div>
									<div className='d-flex justify-content-center '>
										<button
											className='refund-btn  d-flex justify-content-center align-items-center'
											onClick={() => {
												importProduct();
											}}>
											استيراد
										</button>
									</div>
								</div>
							)}
						</div>
					</Box>
				</Modal>
			</div>
		</>
	);
};

export default ProductRefund;
