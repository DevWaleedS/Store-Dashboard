import React, { useContext, useState, useEffect } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Context
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";

// Components
import useFetch from "../Hooks/UseFetch";
import { TopBarSearchInput } from "../global";
import CircularLoading from "../HelperComponents/CircularLoading";

// MUI
import { Button } from "@mui/material";

// Icons
import {
	Facebock,
	HomeIcon,
	Instagram,
	SnaChat,
	Twitter,
	Youtube,
} from "../data/Icons";

const SocialPages = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/socialMedia_store_show`
	);

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [socialValue, setSocialValue] = useState({
		snapchat: "",
		facebook: "",
		twiter: "",
		youtube: "",
		instegram: "",
	});

	// To handle all errors
	const [error, setError] = useState({
		snapchat: "",
		facebook: "",
		twiter: "",
		youtube: "",
		instegram: "",
	});

	const resetError = () => {
		setError({
			snapchat: "",
			facebook: "",
			twiter: "",
			youtube: "",
			instegram: "",
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
			snapchat: fetchedData?.data?.snapchat,
			facebook: fetchedData?.data?.facebook,
			twiter: fetchedData?.data?.twiter,
			youtube: fetchedData?.data?.youtube,
			instegram: fetchedData?.data?.instegram,
		});
	}, [fetchedData]);

	// to update Seo values
	const updateSocialMedia = () => {
		setLoadingTitle("جاري تعديل التواصل الاجتماعي");
		resetError();
		let formData = new FormData();
		formData.append("snapchat", socialValue?.snapchat || "");
		formData.append("facebook", socialValue?.facebook || "");
		formData.append("twiter", socialValue?.twiter || "");
		formData.append("youtube", socialValue?.youtube || "");
		formData.append("instegram", socialValue?.instegram || "");

		axios
			.post(
				`https://backend.atlbha.com/api/Store/socialMedia_store_update`,
				formData,
				{
					headers: {
						"Content-Type": "multipart/form-data",
						Authorization: `Bearer ${store_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setLoadingTitle("");
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setLoadingTitle("");

					setError({
						snapchat: res?.data?.message?.en?.snapchat?.[0],
						facebook: res?.data?.message?.en?.facebook?.[0],
						twiter: res?.data?.message?.en?.twiter?.[0],
						youtube: res?.data?.message?.en?.youtube?.[0],
						instegram: res?.data?.message?.en?.instegram?.[0],
					});
					toast.error(res?.data?.message?.en?.snapchat?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.facebook?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.twiter?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.youtube?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.instegram?.[0], {
						theme: "light",
					});
				}
			});
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
				<div className='head-category mb-md-4 mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item ' aria-current='page'>
									بيانات المتجر
								</li>
								<li className='breadcrumb-item active' aria-current='page'>
									التواصل الاجتماعي
								</li>
							</ol>
						</nav>
					</div>
				</div>
				<div>
					<div className='social-links-form'>
						{loading ? (
							<div
								className='d-flex justify-content-center align-items-center'
								style={{ height: "200px" }}>
								<CircularLoading />
							</div>
						) : (
							<form onSubmit={(event) => event.preventDefault()}>
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
								<div className='row'>
									<div className='col-12 d-flex justify-content-center align-items-center '>
										<Button
											className='social-save-btn'
											type='submit'
											onClick={updateSocialMedia}>
											حفظ
										</Button>
									</div>
								</div>
							</form>
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default SocialPages;
