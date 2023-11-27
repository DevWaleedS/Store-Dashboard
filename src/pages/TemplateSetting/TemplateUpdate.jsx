import React, { useContext, useState, Fragment, useEffect } from "react";

// Third party
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import ImageUploading from "react-images-uploading";

// MUI
import Button from "@mui/material/Button";
import { FormControl, Switch } from "@mui/material";

// Context
import Context from "../../Context/context";
import { LoadingContext } from "../../Context/LoadingProvider";

// Components
import useFetch from "../../Hooks/UseFetch";
import CircularLoading from "../../HelperComponents/CircularLoading";

//  Icons
import { BsArrowLeft } from "react-icons/bs";
import { MdFileUpload } from "react-icons/md";
import { CommentIcon } from "../../data/Icons";

const TemplateUpdate = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/homepage"
	);

	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// Banners Images
	const [firstBanner, setFirstBanner] = useState([]);
	const [secondBanner, setSecondBanner] = useState([]);
	const [thirdBanner, setThirdBanner] = useState([]);
	const [firstBannerName, setFirstBannerName] = useState("");
	const [secondBannerName, setSecondBannerName] = useState("");
	const [thirdBannerName, setThirdBannerName] = useState("");
	const [previewBanner, setPreviewBanner] = useState("");

	// Sliders Images
	const [firstSlider, setFirstSlider] = useState([]);
	const [secondSlider, setSecondSlider] = useState([]);
	const [thirdSlider, setThirdSlider] = useState([]);
	const [firstSliderName, setFirstSliderName] = useState("");
	const [secondSliderName, setSecondSliderName] = useState("");
	const [thirdSliderName, setThirdSliderName] = useState("");
	const [previewSlider, setPreviewSlider] = useState("");

	// banners status
	const [bannerstatus1, setBannerStatus1] = useState(true);
	const [bannerstatus2, setBannerStatus2] = useState(true);
	const [bannerstatus3, setBannerStatus3] = useState(true);

	// sliders status
	const [sliderstatus1, setSlidersStatus1] = useState(true);
	const [sliderstatus2, setSlidersStatus2] = useState(true);
	const [sliderstatus3, setSlidersStatus3] = useState(true);

	// comment status
	const [commentStatus, setCommentStatus] = useState(true);
	const [clientStatus, setClientStatus] = useState(true);

	useEffect(() => {
		// set comment status
		setCommentStatus(
			fetchedData?.data?.Homepages[0]?.commentstatus === "active" ? true : false
		);
		// set client status
		setClientStatus(
			fetchedData?.data?.Homepages[0]?.clientstatus === "active" ? true : false
		);

		// set banners status
		setBannerStatus1(
			fetchedData?.data?.Homepages[0]?.banarstatus1 === "active" ? true : false
		);
		setFirstBannerName(fetchedData?.data?.Homepages[0]?.banar1);
		setBannerStatus2(
			fetchedData?.data?.Homepages[0]?.banarstatus2 === "active" ? true : false
		);
		setSecondBannerName(fetchedData?.data?.Homepages[0]?.banar2);
		setBannerStatus3(
			fetchedData?.data?.Homepages[0]?.banarstatus3 === "active" ? true : false
		);
		setThirdBannerName(fetchedData?.data?.Homepages[0]?.banar3);
		// set sliders status
		setSlidersStatus1(
			fetchedData?.data?.Homepages[0]?.sliderstatus1 === "active" ? true : false
		);
		setFirstSliderName(fetchedData?.data?.Homepages[0]?.slider1);
		setSlidersStatus2(
			fetchedData?.data?.Homepages[0]?.sliderstatus2 === "active" ? true : false
		);
		setSecondSliderName(fetchedData?.data?.Homepages[0]?.slider2);
		setSlidersStatus3(
			fetchedData?.data?.Homepages[0]?.sliderstatus3 === "active" ? true : false
		);
		setThirdSliderName(fetchedData?.data?.Homepages[0]?.slider3);
	}, [fetchedData?.data?.Homepages]);

	/** --------------------------------------------------------------------------------- */

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
					navigate("/Template");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Template");
					setReload(!reload);
				}
			});
	};
	/** --------------------------------------------------------------------------------- */

	// update Sliders function
	const updateSliders = () => {
		setLoadingTitle("جاري تعديل السلايدرات المتحركة");
		let formData = new FormData();
		if (firstSlider.length !== 0) {
			formData.append("slider1", firstSlider[0]?.file || null);
		}
		if (secondSlider.length !== 0) {
			formData.append("slider2", secondSlider[0]?.file || null);
		}
		if (thirdSlider.length !== 0) {
			formData.append("slider3", thirdSlider[0]?.file || null);
		}
		formData.append("sliderstatus1", sliderstatus1 ? "active" : "not_active");
		formData.append("sliderstatus2", sliderstatus2 ? "active" : "not_active");
		formData.append("sliderstatus3", sliderstatus3 ? "active" : "not_active");
		axios
			.post(`https://backend.atlbha.com/api/Store/sliderUpdate`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Template");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Template");
					setReload(!reload);
				}
			});
	};
	/** --------------------------------------------------------------------------------- */

	// Update comments function
	const updateComments = () => {
		setLoadingTitle("جاري تعديل التعليقات والعملاء");
		let formData = new FormData();
		formData.append("commentstatus", commentStatus ? "active" : "not_active");
		formData.append("clientstatus", clientStatus ? "active" : "not_active");
		axios
			.post(`https://backend.atlbha.com/api/Store/commentUpdate`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Template");
					setReload(!reload);
				} else {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					navigate("/Template");
					setReload(!reload);
				}
			});
	};
	/** --------------------------------------------------------------------------------- */

	return (
		<Fragment>
			{/** upload sliders */}
			<div className='seo-weight-edit-box template-edit-box mb-md-4 mb-3'>
				<div className='title'>
					<h4>
						السلايدر المتحرك (440 * 1110)
						<span>
							{" "}
							( تستطيع تغيير الصورة التي تظهر في السلايدر المتحرك أعلى الموقع )
						</span>
					</h4>
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
														firstSliderName ||
														secondSliderName ||
														thirdSliderName
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
										<label htmlFor='add-banner-1'> سلايدر رقم 1</label>
										<div className='wrapper'>
											<ImageUploading
												value={firstSlider}
												onChange={(imageList) => {
													setFirstSlider(imageList);
													setPreviewSlider(imageList);
												}}
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
													onChange={() => setSlidersStatus1(!sliderstatus1)}
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
													checked={sliderstatus1}
												/>
											</div>
										</div>
									</div>
									<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
										<label htmlFor='add-banner-1'> سلايدر رقم 2</label>
										<div className='wrapper'>
											<ImageUploading
												value={secondSlider}
												onChange={(imageList) => {
													setSecondSlider(imageList);
													setPreviewSlider(imageList);
												}}
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
													onChange={() => setSlidersStatus2(!sliderstatus2)}
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
													checked={sliderstatus2}
												/>
											</div>
										</div>
									</div>
									<div className='add-banner-btn-box d-flex flex-md-row flex-column justify-content-start align-items-md-center'>
										<label htmlFor='add-banner-1'> سلايدر رقم 3</label>
										<div className='wrapper'>
											<ImageUploading
												value={thirdSlider}
												onChange={(imageList) => {
													setThirdSlider(imageList);
													setPreviewSlider(imageList);
												}}
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
													onChange={() => setSlidersStatus3(!sliderstatus3)}
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
													checked={sliderstatus3}
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

			{/** upload banner */}
			<div className='seo-weight-edit-box template-edit-box mb-md-4 mb-3'>
				<div className='title'>
					<h4>
						البنرات الإعلانية (440 * 1110)
						<span>
							{" "}
							( تستطيع تغيير الصورة التي تظهر كإعلانات في وسط الموقع وبين
							الأقسام )
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
														firstBannerName ||
														secondBannerName ||
														thirdBannerName
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
												onChange={(imageList) => {
													setFirstBanner(imageList);
													setPreviewBanner(imageList);
												}}
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
												onChange={(imageList) => {
													setSecondBanner(imageList);
													setPreviewBanner(imageList);
												}}
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
												onChange={(imageList) => {
													setThirdBanner(imageList);
													setPreviewBanner(imageList);
												}}
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

			<div className='seo-weight-edit-box template-edit-box '>
				<div className='title d-flex flex-md-row flex-column justify-content-between align-items-md-center flex-wrap gap-4'>
					<h4>
						التعليقات والعملاء{" "}
						<span> (تستطيع تفعيل وتعطيل العملاء المميزون والتعليقات )</span>
					</h4>
					<div className='view-more-btn mx-md-4 mt-md-0 mt-3'>
						<Link to='/Rating' variant='contained'>
							<span>عرض التفاصيل</span>
							<BsArrowLeft className='me-2' />
						</Link>
					</div>
				</div>

				<FormControl variant='standard' className='edit-robot-teat-area py-4'>
					<div className='row'>
						<div className='col-12 p-4'>
							<div className='input-bx'>
								{/*<div className='switch-widget mb-2 d-flex justify-content-between align-items-center'>
									<div className='widget-text'>
										<Client className='client-icon' />
										<span className='me-3'>العملاء المميزون</span>
									</div>
									<div className='switch-btn'>
										<Switch
											onChange={() => setClientStatus(!clientStatus)}
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
											checked={clientStatus}
										/>
									</div>
										</div>*/}
								<div className='switch-widget d-flex justify-content-between align-items-center'>
									<div className='widget-text'>
										<CommentIcon />
										<span className='me-3'> تعليقات العملاء</span>
									</div>
									<div className='switch-btn'>
										<Switch
											onChange={() => setCommentStatus(!commentStatus)}
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
											checked={commentStatus}
										/>
									</div>
								</div>
							</div>
						</div>

						<div className='col-12 p-4'>
							<div className='btn-bx '>
								<Button onClick={() => updateComments()} variant='contained'>
									حفظ
								</Button>
							</div>
						</div>
					</div>
				</FormControl>
			</div>
		</Fragment>
	);
};

export default TemplateUpdate;
