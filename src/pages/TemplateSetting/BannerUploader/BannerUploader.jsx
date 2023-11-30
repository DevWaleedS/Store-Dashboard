import React, { useState, useEffect, useContext } from "react";
// Third party
import axios from "axios";
import { useCookies } from "react-cookie";
import ImageUploading from "react-images-uploading";

// MUI
import { Button, FormControl, Switch } from "@mui/material";

// Icons
import { MdFileUpload } from "react-icons/md";

// Components
import CircularLoading from "../../../HelperComponents/CircularLoading";

// Context
import Context from "../../../Context/context";
import { LoadingContext } from "../../../Context/LoadingProvider";
import { toast } from "react-toastify";

const BannerUploader = ({ Banners, loading, reload, setReload }) => {
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
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

	// handle images size
	const maxFileSize = 2 * 1024 * 1024; // 2 MB;
	const handleImageUpload =
		(
			bannerIndex,
			bannerState,
			setBannerState,
			previewBannerState,
			setPreviewBannerState,
			bannerNameState
		) =>
		async (imageList) => {
			const imageSize = imageList[0]?.file.size;

			const maxSizeErrorMessage = "حجم البنر يجب أن لا يزيد عن 2 ميجابايت.";
			const dimensionsErrorMessage =
				"مقاس البنر يجب أن يكون 1110 بكسل عرض و440 بكسل ارتفاع.";

			const checkImageDimensions = (image) =>
				new Promise((resolve) => {
					const img = new Image();
					img.onload = () => {
						if (img.width !== 1110 && img.height !== 440) {
							toast.warning(dimensionsErrorMessage, {
								theme: "light",
							});
							//  if the image dimensions is not valid
							resolve(false);
						} else {
							resolve(true);
						}
					};
					img.src = image?.data_url;
				});

			const isValidDimensions = await Promise.all(
				imageList.map(checkImageDimensions)
			).then((results) => results.every((result) => result));

			// if the isValidDimensions and  imageSize >= maxFileSize return
			if (!isValidDimensions) {
				return;
			}

			if (imageSize >= maxFileSize && !isValidDimensions) {
				toast.warning(maxSizeErrorMessage, {
					theme: "light",
				});
				toast.warning(dimensionsErrorMessage, {
					theme: "light",
				});
			} else if (imageSize >= maxFileSize && isValidDimensions) {
				toast.warning(maxSizeErrorMessage, {
					theme: "light",
				});
			} else {
				const updatedSliderState = [...bannerState];
				updatedSliderState[bannerIndex] = imageList;
				setBannerState(updatedSliderState);
				setPreviewBannerState(imageList);

				const updatedNameState = updatedSliderState[bannerIndex]?.[0]?.data_url;
				const bannerNames = [
					setFirstBannerName,
					setSecondBannerName,
					setThirdBannerName,
				];

				if (bannerNames[bannerIndex]) {
					bannerNames[bannerIndex](updatedNameState);
				}
			}
		};
	useEffect(() => {
		if (Banners) {
			// set banners status
			setBannerStatus1(Banners[0]?.banarstatus1 === "active" ? true : false);
			setFirstBannerName(Banners[0]?.banar1);
			setBannerStatus2(Banners[0]?.banarstatus2 === "active" ? true : false);
			setSecondBannerName(Banners[0]?.banar2);
			setBannerStatus3(Banners?.banarstatus3 === "active" ? true : false);
			setThirdBannerName(Banners[0]?.banar3);
		}
	}, [Banners]);

	// update banners function
	const updateBanners = () => {
		setLoadingTitle("جاري تعديل البنرات الإعلانية");
		let formData = new FormData();
		if (firstBanner.length !== 0) {
			formData.append("banar1", firstBanner[0]?.file || null);
		}
		if (secondBanner.length !== 0) {
			formData.append("banar2", secondBanner[0]?.file || null);
		}
		if (thirdBanner.length !== 0) {
			formData.append("banar3", thirdBanner[0]?.file || null);
		}
		formData.append("banarstatus1", bannerstatus1 ? "active" : "not_active");
		formData.append("banarstatus2", bannerstatus2 ? "active" : "not_active");
		formData.append("banarstatus3", bannerstatus3 ? "active" : "not_active");
		axios
			.post(`https://backend.atlbha.com/api/Store/banarUpdate`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
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
				}
			});
	};

	return (
		<div className='seo-weight-edit-box template-edit-box mb-md-4 mb-3'>
			<div className='title'>
				<h4>
					البنرات الإعلانية (440 * 1110)
					<span>
						{" "}
						( تستطيع تغيير الصورة التي تظهر كإعلانات في وسط الموقع وبين الأقسام
						)
					</span>
				</h4>
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
						</div>
					</div>
					<div className='col-12 mb-2'>
						<div className='add-banners-bts-wrapper mt-md-0 mt-3 px-md-0 px-2'>
							{/** Btn to upload banners */}
							<div className='add-banners'>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'>بانر إعلاني رقم 1</label>
									<div className='wrapper'>
										<ImageUploading
											value={firstBanner}
											onChange={handleImageUpload(
												0,
												firstBanner,
												setFirstBanner,
												previewBanner,
												setPreviewBanner,
												setFirstBannerName
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
															<span> تحديث البانر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												onChange={() => setBannerStatus1(!bannerstatus1)}
												sx={{
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
												}}
												checked={bannerstatus1}
											/>
										</div>
									</div>
								</div>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'>بانر إعلاني رقم 2</label>
									<div className='wrapper'>
										<ImageUploading
											value={secondBanner}
											onChange={handleImageUpload(
												0,
												firstBanner,
												setFirstBanner,
												previewBanner,
												setPreviewBanner,
												setFirstBannerName
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
															<span> تحديث البانر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												onChange={() => setBannerStatus2(!bannerstatus2)}
												sx={{
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
												}}
												checked={bannerstatus2}
											/>
										</div>
									</div>
								</div>
								<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
									<label htmlFor='add-banner-1'>بانر إعلاني رقم 3</label>
									<div className='wrapper'>
										<ImageUploading
											value={thirdBanner}
											onChange={handleImageUpload(
												0,
												firstBanner,
												setFirstBanner,
												previewBanner,
												setPreviewBanner,
												setFirstBannerName
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
															<span> تحديث البانر </span>
														)}
														<MdFileUpload />
													</button>
												</div>
											)}
										</ImageUploading>
										<div className='switches-group'>
											<Switch
												onChange={() => setBannerStatus3(!bannerstatus3)}
												sx={{
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
												}}
												checked={bannerstatus3}
											/>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className='col-12 p-4'>
						<div className='btn-bx '>
							<Button onClick={() => updateBanners()} variant='contained'>
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
