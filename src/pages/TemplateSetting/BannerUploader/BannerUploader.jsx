import React, { useState, useEffect, useContext } from "react";

// Third party

import { toast } from "react-toastify";
import ImageUploading from "react-images-uploading";

// MUI
import { Button, FormControl, Switch } from "@mui/material";

// Icons
import { MdFileUpload } from "react-icons/md";

// Components
import { CircularLoading } from "../../../HelperComponents";

// Context
import { LoadingContext } from "../../../Context/LoadingProvider";

// RTK Query
import { useUpdateTemplateBannersMutation } from "../../../store/apiSlices/templateSettingApi";

// Switch Style
const switchStyle = {
	width: "35px",
	padding: 0,
	height: "20px",
	borderRadius: "0.75rem",
	"& .MuiSwitch-thumb": {
		width: "12px",
		height: "12px",
	},
	"& .MuiSwitch-switchBase": {
		padding: "0",
		top: "4px",
		left: "4px",
	},
	"& .MuiSwitch-switchBase.Mui-checked": {
		left: "-4px",
	},
	"& .Mui-checked .MuiSwitch-thumb": {
		backgroundColor: "#FFFFFF",
	},
	"& .MuiSwitch-track": {
		height: "100%",
	},
	"&.MuiSwitch-root .Mui-checked+.MuiSwitch-track": {
		backgroundColor: "#3AE374",
		opacity: 1,
	},
};
const BannerUploader = ({ Banners, loading }) => {
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// banners status
	const [bannerstatus1, setBannerStatus1] = useState(true);
	const [bannerstatus2, setBannerStatus2] = useState(true);
	const [bannerstatus3, setBannerStatus3] = useState(true);

	// Banners Images
	const [firstBanner, setFirstBanner] = useState([]);
	const [secondBanner, setSecondBanner] = useState([]);
	const [thirdBanner, setThirdBanner] = useState([]);

	const [firstBannerName, setFirstBannerName] = useState("");
	const [secondBannerName, setSecondBannerName] = useState("");
	const [thirdBannerName, setThirdBannerName] = useState("");
	const [previewBanner, setPreviewBanner] = useState("");

	// To
	useEffect(() => {
		if (Banners) {
			// set banners status
			setBannerStatus1(Banners?.[0]?.banarstatus1 === "active" ? true : false);
			setFirstBannerName(Banners?.[0]?.banar1);
			setBannerStatus2(Banners?.[0]?.banarstatus2 === "active" ? true : false);
			setSecondBannerName(Banners?.[0]?.banar2);
			setBannerStatus3(Banners?.[0]?.banarstatus3 === "active" ? true : false);
			setThirdBannerName(Banners?.[0]?.banar3);
		}
	}, [Banners]);

	// To handle width and height of banners
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	const handleImageUpload =
		(bannerIndex, bannerState, setBannerState, setPreviewBannerState) =>
		async (imageList) => {
			// Check if the image size is valid
			const isSizeValid = imageList?.every(
				(image) => image?.file?.size <= maxFileSize
			);

			// Errors message
			const sizeErrorMessage = "حجم البنر يجب أن لا يزيد عن 1 ميجابايت.";
			const dimensionsErrorMessage =
				"مقاس البنر يجب أن يكون 1110 بكسل عرض و 440 بكسل ارتفاع.";

			const checkImageDimensions = (image) =>
				new Promise((resolve) => {
					const img = new Image();
					img.onload = () => {
						if (img?.width !== 1110 && img?.height !== 440) {
							//  if the image dimensions is not valid
							resolve(false);
						} else {
							resolve(true);
						}
					};
					img.src = image?.data_url;
				});

			const isValidDimensions = await Promise?.all(
				imageList?.map(checkImageDimensions)
			).then((results) => results?.every((result) => result));

			// if the isValidDimensions and  imageSize >= maxFileSize return
			if (!isSizeValid && !isValidDimensions) {
				// Display a warning message and reset the logo state
				toast.warning(sizeErrorMessage, {
					theme: "light",
				});
				toast.warning(dimensionsErrorMessage, {
					theme: "light",
				});
				return;
			} else if (!isValidDimensions && sizeErrorMessage) {
				toast.warning(dimensionsErrorMessage, {
					theme: "light",
				});
				return;
			} else if (!isSizeValid && isValidDimensions) {
				toast.warning(sizeErrorMessage, {
					theme: "light",
				});
				return;
			} else {
				const updatedSliderState = [...bannerState];
				updatedSliderState[bannerIndex] = imageList;
				setBannerState(updatedSliderState);

				const updatedNameState = updatedSliderState[bannerIndex]?.data_url;
				const updatedFileState = updatedSliderState[bannerIndex];

				const bannerNames = [
					setFirstBannerName,
					setSecondBannerName,
					setThirdBannerName,
				];

				const bannerFile = [setFirstBanner, setSecondBanner, setThirdBanner];

				if (bannerNames[bannerIndex]) {
					bannerNames[bannerIndex](updatedNameState);
				}
				if (bannerFile[bannerIndex]) {
					bannerFile[bannerIndex](updatedFileState);
				}
			}
			setPreviewBannerState(imageList);
		};

	// handle update banners function
	const [updateTemplateBanners] = useUpdateTemplateBannersMutation();
	const handleUpdateBanners = async () => {
		setLoadingTitle("جاري تعديل البنرات الإعلانية");

		// data that send to api
		let formData = new FormData();
		formData.append("banar1", firstBanner[0]?.file || firstBannerName || null);
		formData.append(
			"banar2",
			secondBanner[0]?.file || secondBannerName || null
		);
		formData.append("banar3", thirdBanner[0]?.file || thirdBannerName || null);
		formData.append("banarstatus1", bannerstatus1 ? "active" : "not_active");
		formData.append("banarstatus2", bannerstatus2 ? "active" : "not_active");
		formData.append("banarstatus3", bannerstatus3 ? "active" : "not_active");

		// make request...
		try {
			const response = await updateTemplateBanners({
				body: formData,
			});

			// Handle response
			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				setLoadingTitle("");
			} else {
				setLoadingTitle("");

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
			console.error("Error changing updateTemplateBanners:", error);
		}
	};

	return (
		<div className='seo-weight-edit-box template-edit-box mb-md-4 mb-3'>
			<div className='title'>
				<h4>البنرات الإعلانية (440 * 1110)</h4>
				<span className='sub_title'>
					( تستطيع تغيير الصورة التي تظهر كإعلانات في وسط الموقع وبين الأقسام )
				</span>
			</div>

			<FormControl variant='standard' className='px-4'>
				<div className='row'>
					<div className='col-12 p-4'>
						<div className='input-bx banners-box '>
							{/** preview banner here */}
							<div className=' banners-preview-container d-flex flex-column align-items-center justify-content-center'>
								{loading ? (
									<CircularLoading />
								) : (
									<>
										{previewBanner[0] ? (
											<img
												style={{
													borderRadius: "inherit",
													width: "100%",

													maxWidth: "100%",
												}}
												src={previewBanner[0]?.data_url}
												alt=''
											/>
										) : (
											<img
												style={{
													borderRadius: "inherit",
													width: "100%",

													maxWidth: "100%",
												}}
												src={
													firstBannerName || secondBannerName || thirdBannerName
												}
												alt=''
											/>
										)}
									</>
								)}
							</div>
							<div className='tax-text w-100 hint'>
								الحد الأقصى للبنر الواحد هو 1MB
							</div>
						</div>
					</div>
					<div className='col-12 mb-2'>
						<div className='add-banners-bts-wrapper mt-md-0 mt-3 px-md-0 px-2'>
							{/** Btn to upload banners */}

							<div className='add-banners'>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'>بنر إعلاني رقم 1</label>
									<div className='wrapper'>
										<ImageUploading
											value={firstBanner}
											onChange={handleImageUpload(
												0,
												firstBanner,
												setFirstBanner,
												setPreviewBanner
											)}
											maxNumber={2}
											dataURLKey='data_url'
											acceptType={["jpg", "png", "jpeg", "webp"]}>
											{({ onImageUpload, dragProps }) => (
												<div className='upload-files-input mb-2'>
													<button
														className=' d-flex justify-content-between align-items-center w-100'
														onClick={onImageUpload}
														{...dragProps}>
														{firstBanner?.[0]?.file ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={URL.createObjectURL(
																		firstBanner?.[0]?.file
																	)}
																	alt=''
																	className='img-fluid'
																/>
															</div>
														) : firstBannerName ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={firstBannerName}
																	alt=''
																	className=' img-fluid'
																/>
															</div>
														) : (
															<span> تحديث البنر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												sx={switchStyle}
												checked={bannerstatus1}
												onChange={() => {
													if (
														bannerstatus2 === false &&
														bannerstatus3 === false
													) {
														toast.warn("يجب أن يكون على الأقل بنر واحد مفعل");
													} else {
														setBannerStatus1(!bannerstatus1);
													}
												}}
											/>
										</div>
									</div>
								</div>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'>بنر إعلاني رقم 2</label>
									<div className='wrapper'>
										<ImageUploading
											value={secondBanner}
											onChange={handleImageUpload(
												1,
												secondBanner,
												setSecondBanner,
												setPreviewBanner
											)}
											maxNumber={2}
											dataURLKey='data_url'
											acceptType={["jpg", "png", "jpeg", "webp"]}>
											{({ onImageUpload, dragProps }) => (
												<div className='upload-files-input mb-2'>
													<button
														className=' d-flex justify-content-between align-items-center w-100'
														onClick={onImageUpload}
														{...dragProps}>
														{secondBanner?.[0]?.file ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={URL.createObjectURL(
																		secondBanner?.[0]?.file
																	)}
																	alt=''
																	className='img-fluid'
																/>
															</div>
														) : secondBannerName ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={secondBannerName}
																	alt=''
																	className=' img-fluid'
																/>
															</div>
														) : (
															<span> تحديث البنر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												sx={switchStyle}
												checked={bannerstatus2}
												onChange={() => {
													if (
														bannerstatus1 === false &&
														bannerstatus3 === false
													) {
														toast.warn("يجب أن يكون على الأقل بنر واحد مفعل");
													} else {
														setBannerStatus2(!bannerstatus2);
													}
												}}
											/>
										</div>
									</div>
								</div>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'>بنر إعلاني رقم 3</label>
									<div className='wrapper'>
										<ImageUploading
											value={thirdBanner}
											onChange={handleImageUpload(
												2,
												thirdBanner,
												setThirdBanner,
												setPreviewBanner
											)}
											maxNumber={2}
											dataURLKey='data_url'
											acceptType={["jpg", "png", "jpeg", "webp"]}>
											{({ onImageUpload, dragProps }) => (
												<div className='upload-files-input mb-2'>
													<button
														className=' d-flex justify-content-between align-items-center w-100'
														onClick={onImageUpload}
														{...dragProps}>
														{thirdBanner?.[0]?.file ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={URL.createObjectURL(
																		thirdBanner?.[0]?.file
																	)}
																	alt=''
																	className='img-fluid'
																/>
															</div>
														) : thirdBannerName ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={thirdBannerName}
																	alt=''
																	className=' img-fluid'
																/>
															</div>
														) : (
															<span> تحديث البنر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												sx={switchStyle}
												checked={bannerstatus3}
												onChange={() => {
													if (
														bannerstatus1 === false &&
														bannerstatus2 === false
													) {
														toast.warn("يجب أن يكون على الأقل بنر واحد مفعل");
													} else {
														setBannerStatus3(!bannerstatus3);
													}
												}}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-12 p-4'>
						<div className='btn-bx '>
							<Button
								disabled={loading}
								onClick={() => handleUpdateBanners()}
								variant='contained'>
								حفظ
							</Button>
						</div>
					</div>
				</div>
			</FormControl>
		</div>
	);
};

export default BannerUploader;
