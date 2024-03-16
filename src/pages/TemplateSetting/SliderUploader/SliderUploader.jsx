import React, { useState, useEffect, useContext } from "react";

// Third party
import axios from "axios";
import { toast } from "react-toastify";
import ImageUploading from "react-images-uploading";

// Icons
import { MdFileUpload } from "react-icons/md";

// Components
import CircularLoading from "../../../HelperComponents/CircularLoading";

// MUI
import { Button, FormControl, Switch } from "@mui/material";

// Context
import Context from "../../../Context/context";
import { LoadingContext } from "../../../Context/LoadingProvider";

// switchStyle
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

const SliderUploader = ({ sliders, loading, reload, setReload }) => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// Sliders Images
	const [firstSlider, setFirstSlider] = useState([]);
	const [secondSlider, setSecondSlider] = useState([]);
	const [thirdSlider, setThirdSlider] = useState([]);

	const [firstSliderName, setFirstSliderName] = useState("");
	const [secondSliderName, setSecondSliderName] = useState("");
	const [thirdSliderName, setThirdSliderName] = useState("");
	const [previewSlider, setPreviewSlider] = useState("");

	// sliders status
	const [sliderstatus1, setSlidersStatus1] = useState(true);
	const [sliderstatus2, setSlidersStatus2] = useState(true);
	const [sliderstatus3, setSlidersStatus3] = useState(true);

	useEffect(() => {
		if (sliders) {
			// set sliders status
			setSlidersStatus1(
				sliders?.[0]?.sliderstatus1 === "active" ? true : false
			);
			setFirstSliderName(sliders?.[0]?.slider1);
			setSlidersStatus2(
				sliders?.[0]?.sliderstatus2 === "active" ? true : false
			);
			setSecondSliderName(sliders?.[0]?.slider2);
			setSlidersStatus3(
				sliders?.[0]?.sliderstatus3 === "active" ? true : false
			);
			setThirdSliderName(sliders?.[0]?.slider3);
		}
	}, [sliders]);

	// To handle width and height of banners
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	const handleImageUpload =
		(sliderIndex, sliderState, setSliderState, setPreviewSliderState) =>
		async (imageList) => {
			// Check if the image size is valid
			const isSizeValid = imageList?.every(
				(image) => image?.file?.size <= maxFileSize
			);

			// Errors message
			const sizeErrorMessage = "حجم السلايدر يجب أن لا يزيد عن 1 ميجابايت.";
			const dimensionsErrorMessage =
				"مقاس السلايدر يجب أن يكون 1110 بكسل عرض و 440 بكسل ارتفاع.";

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
				const updatedSliderState = [...sliderState];
				updatedSliderState[sliderIndex] = imageList;
				setSliderState(updatedSliderState);

				const updatedNameState = updatedSliderState[sliderIndex]?.data_url;
				const updatedFileState = updatedSliderState[sliderIndex];

				const sliderNames = [
					setFirstSliderName,
					setSecondSliderName,
					setThirdSliderName,
				];

				const sliderFile = [setFirstSlider, setSecondSlider, setThirdSlider];

				if (sliderNames[sliderIndex]) {
					sliderNames[sliderIndex](updatedNameState);
				}
				if (sliderFile[sliderIndex]) {
					sliderFile[sliderIndex](updatedFileState);
				}
			}
			setPreviewSliderState(imageList);
		};

	// update Sliders function
	const updateSliders = () => {
		setLoadingTitle("جاري تعديل السلايدرات المتحركة");
		let formData = new FormData();
		formData.append("slider1", firstSlider[0]?.file || firstSliderName || null);
		formData.append(
			"slider2",
			secondSlider[0]?.file || secondSliderName || null
		);
		formData.append("slider3", thirdSlider[0]?.file || thirdSliderName || null);
		formData.append("sliderstatus1", sliderstatus1 ? "active" : "not_active");
		formData.append("sliderstatus2", sliderstatus2 ? "active" : "not_active");
		formData.append("sliderstatus3", sliderstatus3 ? "active" : "not_active");
		axios
			.post(`sliderUpdate`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					toast.error(res?.data?.message?.en?.slider1?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.slider2?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.slider3?.[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<div className='seo-weight-edit-box template-edit-box mb-md-4 mb-3'>
			<div className='title'>
				<h4>السلايدر المتحرك (440 * 1110)</h4>
				<span className='sub_title'>
					( تستطيع تغيير الصورة التي تظهر في السلايدر المتحرك أعلى الموقع )
				</span>
			</div>

			<FormControl variant='standard' className='px-4'>
				<div className='row'>
					<div className='col-12 p-4'>
						<div className='input-bx banners-box first-one'>
							{/** preview banner here */}
							<div className=' banners-preview-container d-flex flex-column align-items-center justify-content-center'>
								{loading ? (
									<CircularLoading />
								) : (
									<>
										{previewSlider[0] ? (
											<img
												style={{
													borderRadius: "inherit",
													width: "100%",

													maxWidth: "100%",
												}}
												src={previewSlider[0]?.data_url}
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
													firstSliderName || secondSliderName || thirdSliderName
												}
												alt=''
											/>
										)}
									</>
								)}
							</div>
							<div className='tax-text w-100 hint'>
								الحد الأقصى للسلايدر الواحد هو 1MB
							</div>
						</div>
					</div>
					<div className='col-12 mb-2'>
						<div className='add-banners-bts-wrapper mt-md-0 mt-3 px-md-0 px-2'>
							{/** Btn to upload banners */}
							<div className='add-banners'>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'> سلايدر رقم 1</label>
									<div className='wrapper'>
										<ImageUploading
											value={firstSlider}
											onChange={handleImageUpload(
												0,
												firstSlider,
												setFirstSlider,
												setPreviewSlider
											)}
											maxNumber={2}
											dataURLKey='data_url'
											acceptType={["jpg", "png", "jpeg"]}>
											{({ onImageUpload, dragProps }) => (
												<div className='upload-files-input mb-2'>
													<button
														className=' d-flex justify-content-between align-items-center w-100'
														onClick={onImageUpload}
														{...dragProps}>
														{firstSlider?.[0]?.file ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={URL.createObjectURL(
																		firstSlider?.[0]?.file
																	)}
																	alt=''
																	className='img-fluid'
																/>
															</div>
														) : firstSliderName ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={firstSliderName}
																	alt=''
																	className=' img-fluid'
																/>
															</div>
														) : (
															<span> تحديث السلايدر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												sx={switchStyle}
												checked={sliderstatus1}
												onChange={() => {
													if (
														sliderstatus2 === false &&
														sliderstatus3 === false
													) {
														toast.warn(
															"يجب أن يكون على الأقل سلايدر واحد مفعل"
														);
													} else {
														setSlidersStatus1(!sliderstatus1);
													}
												}}
											/>
										</div>
									</div>
								</div>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'> سلايدر رقم 2</label>
									<div className='wrapper'>
										<ImageUploading
											value={secondSlider}
											onChange={handleImageUpload(
												1,
												secondSlider,
												setSecondSlider,
												setPreviewSlider
											)}
											maxNumber={2}
											dataURLKey='data_url'
											acceptType={["jpg", "png", "jpeg"]}>
											{({ onImageUpload, dragProps }) => (
												<div className='upload-files-input mb-2'>
													<button
														className=' d-flex justify-content-between align-items-center w-100'
														onClick={onImageUpload}
														{...dragProps}>
														{secondSlider?.[0]?.file ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={URL.createObjectURL(
																		secondSlider?.[0]?.file
																	)}
																	alt=''
																	className='img-fluid'
																/>
															</div>
														) : secondSliderName ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={secondSliderName}
																	alt=''
																	className=' img-fluid'
																/>
															</div>
														) : (
															<span> تحديث السلايدر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												sx={switchStyle}
												checked={sliderstatus2}
												onChange={() => {
													if (
														sliderstatus1 === false &&
														sliderstatus3 === false
													) {
														toast.warn(
															"يجب أن يكون على الأقل سلايدر واحد مفعل"
														);
													} else {
														setSlidersStatus2(!sliderstatus2);
													}
												}}
											/>
										</div>
									</div>
								</div>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'> سلايدر رقم 3</label>
									<div className='wrapper'>
										<ImageUploading
											value={thirdSlider}
											onChange={handleImageUpload(
												2,
												thirdSlider,
												setThirdSlider,
												setPreviewSlider
											)}
											maxNumber={2}
											dataURLKey='data_url'
											acceptType={["jpg", "png", "jpeg"]}>
											{({ onImageUpload, dragProps }) => (
												<div className='upload-files-input mb-2'>
													<button
														className=' d-flex justify-content-between align-items-center w-100'
														onClick={onImageUpload}
														{...dragProps}>
														{thirdSlider?.[0]?.file ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={URL.createObjectURL(
																		thirdSlider?.[0]?.file
																	)}
																	alt=''
																	className='img-fluid'
																/>
															</div>
														) : thirdSliderName ? (
															<div className='' style={{ width: "55px" }}>
																<img
																	src={thirdSliderName}
																	alt=''
																	className=' img-fluid'
																/>
															</div>
														) : (
															<span> تحديث السلايدر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												sx={switchStyle}
												checked={sliderstatus3}
												onChange={() => {
													if (
														sliderstatus1 === false &&
														sliderstatus2 === false
													) {
														toast.warn(
															"يجب أن يكون على الأقل سلايدر واحد مفعل"
														);
													} else {
														setSlidersStatus3(!sliderstatus3);
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
							<Button onClick={() => updateSliders()} variant='contained'>
								حفظ
							</Button>
						</div>
					</div>
				</div>
			</FormControl>
		</div>
	);
};

export default SliderUploader;
