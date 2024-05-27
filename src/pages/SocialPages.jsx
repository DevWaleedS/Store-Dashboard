import React, { useContext, useState, useEffect } from "react";

// Third party

import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// Context
import { LoadingContext } from "../Context/LoadingProvider";

// Components

import { TopBarSearchInput } from "../global";
import CircularLoading from "../HelperComponents/CircularLoading";

// MUI
import { Button } from "@mui/material";

// Icons
import {
	TiktokIcon,
	Facebock,
	Instagram,
	SnaChat,
	Twitter,
	Youtube,
	JacoLiveIcon,
} from "../data/Icons";

// RTK Query
import {
	useGetSocialMediaDataQuery,
	useUpdateSocialMediaDataMutation,
} from "../store/apiSlices/socialPagesApi";
import { Breadcrumb } from "../components";

const SocialPages = () => {
	// to get all  data from server
	const { data: socialMedia, isFetching } = useGetSocialMediaDataQuery();

	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [socialValue, setSocialValue] = useState({
		snapchat: "",
		facebook: "",
		twiter: "",
		youtube: "",
		instegram: "",
		tiktok: "",
		jaco: "",
	});

	// To handle all errors
	const [error, setError] = useState({
		snapchat: "",
		facebook: "",
		twiter: "",
		youtube: "",
		instegram: "",
		tiktok: "",
		jaco: "",
	});

	const resetError = () => {
		setError({
			snapchat: "",
			facebook: "",
			twiter: "",
			youtube: "",
			instegram: "",
			tiktok: "",
			jaco: "",
		});
	};

	// to set values to inputs
	const handleSocialLinks = (e) => {
		const { name, value } = e.target;
		setSocialValue((prevSocialValue) => ({
			...prevSocialValue,
			[name]: value,
		}));
	};

	// use this effect to get all seo data from index api
	useEffect(() => {
		setSocialValue({
			...socialValue,
			snapchat: socialMedia?.snapchat,
			facebook: socialMedia?.facebook,
			twiter: socialMedia?.twiter,
			youtube: socialMedia?.youtube,
			instegram: socialMedia?.instegram,
			tiktok: socialMedia?.tiktok,
			jaco: socialMedia?.jaco,
		});
	}, [socialMedia]);

	// handle update social pages data
	const [updateSocialMediaData, { isLoading }] =
		useUpdateSocialMediaDataMutation();

	const handleUpdateSocialMedia = async () => {
		setLoadingTitle("جاري تعديل حسابات التواصل الاجتماعي");
		resetError();

		// data that send to api
		let formData = new FormData();
		formData.append("snapchat", socialValue?.snapchat || "");
		formData.append("facebook", socialValue?.facebook || "");
		formData.append("twiter", socialValue?.twiter || "");
		formData.append("youtube", socialValue?.youtube || "");
		formData.append("instegram", socialValue?.instegram || "");
		formData.append("tiktok", socialValue?.tiktok || "");
		formData.append("jaco", socialValue?.jaco || "");

		// make request...
		try {
			const response = await updateSocialMediaData({
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
				setError({
					snapchat: response?.data?.message?.en?.snapchat?.[0],
					facebook: response?.data?.message?.en?.facebook?.[0],
					twiter: response?.data?.message?.en?.twiter?.[0],
					youtube: response?.data?.message?.en?.youtube?.[0],
					instegram: response?.data?.message?.en?.instegram?.[0],
					tiktok: response?.data?.message?.en?.tiktok?.[0],
					jaco: response?.data?.message?.en?.jaco?.[0],
				});

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
			console.error("Error changing updateSocialMediaData:", error);
		}
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | التواصل الاجتماعي</title>
			</Helmet>
			<section className='social-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<Breadcrumb
					mb={" mb-md-4 mb-3"}
					parentPage={"بيانات المتجر"}
					currentPage={"التواصل الاجتماعي"}
				/>

				<div>
					<div className='social-links-form'>
						{isFetching ? (
							<div
								className='d-flex justify-content-center align-items-center'
								style={{ height: "200px" }}>
								<CircularLoading />
							</div>
						) : (
							<>
								<div className='row mb-3'>
									<div className='col-12'>
										<label htmlFor='snap-chat d-block'>
											<SnaChat />
											<span className='me-2'>سناب شات</span>
										</label>
									</div>
									<div className='col-12'>
										<input
											type='text'
											name='snapchat'
											id='snapchat'
											className='text-start direction-ltr'
											value={socialValue?.snapchat}
											onChange={handleSocialLinks}
										/>
										{error?.snapchat && (
											<div>
												<span className='fs-6 text-danger'>
													{error?.snapchat}
												</span>
											</div>
										)}
									</div>
								</div>
								<div className='row mb-3'>
									<div className='col-12'>
										<label htmlFor='snap-chat d-block'>
											<Twitter width='16' />
											<span className='me-2'> تويتر</span>
										</label>
									</div>
									<div className='col-12'>
										<input
											type='text'
											name='twiter'
											id='twiter'
											className='text-start direction-ltr'
											value={socialValue?.twiter}
											onChange={handleSocialLinks}
										/>
										{error?.twiter && (
											<div>
												<span className='fs-6 text-danger'>
													{error?.twiter}
												</span>
											</div>
										)}
									</div>
								</div>
								<div className='row mb-3'>
									<div className='col-12'>
										<label htmlFor='snap-chat d-block'>
											<Instagram />
											<span className='me-2'> انستجرام</span>
										</label>
									</div>
									<div className='col-12'>
										<input
											type='text'
											name='instegram'
											id='instegram'
											className='text-start direction-ltr'
											value={socialValue?.instegram}
											onChange={handleSocialLinks}
										/>
										{error?.instegram && (
											<div>
												<span className='fs-6 text-danger'>
													{error?.instegram}
												</span>
											</div>
										)}
									</div>
								</div>
								<div className='row mb-3'>
									<div className='col-12'>
										<label htmlFor='snap-chat d-block'>
											<Youtube />
											<span className='me-2'> يوتيوب</span>
										</label>
									</div>
									<div className='col-12'>
										<input
											type='text'
											name='youtube'
											id='youtube'
											className='text-start direction-ltr'
											value={socialValue?.youtube}
											onChange={handleSocialLinks}
										/>
										{error?.youtube && (
											<div>
												<span className='fs-6 text-danger'>
													{error?.youtube}
												</span>
											</div>
										)}
									</div>
								</div>
								<div className='row mb-5'>
									<div className='col-12'>
										<label htmlFor='snap-chat d-block'>
											<Facebock />
											<span className='me-2'>فيسبوك</span>
										</label>
									</div>
									<div className='col-12'>
										<input
											type='text'
											name='facebook'
											id='facebook'
											className='text-start direction-ltr'
											value={socialValue?.facebook}
											onChange={handleSocialLinks}
										/>
										{error?.facebook && (
											<div>
												<span className='fs-6 text-danger'>
													{error?.facebook}
												</span>
											</div>
										)}
									</div>
								</div>

								<div className='row mb-5'>
									<div className='col-12'>
										<label htmlFor='snap-chat d-block'>
											<TiktokIcon
												style={{ width: "19.17px", height: "19px" }}
											/>
											<span className='me-2'>تيك توك</span>
										</label>
									</div>
									<div className='col-12'>
										<input
											type='text'
											name='tiktok'
											id='tiktok'
											className='text-start direction-ltr'
											value={socialValue?.tiktok}
											onChange={handleSocialLinks}
										/>
										{error?.tiktok && (
											<div>
												<span className='fs-6 text-danger'>
													{error?.tiktok}
												</span>
											</div>
										)}
									</div>
								</div>

								<div className='row mb-5'>
									<div className='col-12'>
										<label htmlFor='snap-chat d-block'>
											<JacoLiveIcon style={{ height: "26px" }} />

											<span className='me-2'>جاكو</span>
										</label>
									</div>
									<div className='col-12'>
										<input
											type='text'
											name='jaco'
											id='jaco'
											className='text-start direction-ltr'
											value={socialValue?.jaco}
											onChange={handleSocialLinks}
										/>
										{error?.jaco && (
											<div>
												<span className='fs-6 text-danger'>{error?.jaco}</span>
											</div>
										)}
									</div>
								</div>
								<div className='row'>
									<div className='col-12 d-flex justify-content-center align-items-center '>
										<Button
											disabled={isLoading}
											className='social-save-btn'
											onClick={handleUpdateSocialMedia}>
											حفظ
										</Button>
									</div>
								</div>
							</>
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default SocialPages;
