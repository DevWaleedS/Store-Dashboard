import React, { useContext, useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import useFetch from "../Hooks/UseFetch";
import { useCookies } from "react-cookie";
import Context from "../Context/context";
import { Link } from "react-router-dom";
import howIcon from "../data/Icons/icon_24_home.svg";
import { AiOutlineSearch } from "react-icons/ai";

// import social icons
import { ReactComponent as SnaChat } from "../data/Icons/icon-24-snapchat.svg";
import { ReactComponent as Twitter } from "../data/Icons/icon-24-twitter.svg";
import { ReactComponent as Instagram } from "../data/Icons/icon-24-instagram.svg";
import { ReactComponent as Youtube } from "../data/Icons/icon-24-youtube.svg";
import { ReactComponent as Facebock } from "../data/Icons/icon-24-facebbock.svg";
import CircularLoading from "../HelperComponents/CircularLoading";
import { Button } from "@mui/material";
import { LoadingContext } from "../Context/LoadingProvider";

const SocialPages = () => {
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/socialMedia_store_show`
	);

	const [cookies] = useCookies(["access_token"]);
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
	}, [
		fetchedData?.data?.snapchat,
		fetchedData?.data?.facebook,
		fetchedData?.data?.twiter,
		fetchedData?.data?.youtube,
		fetchedData?.data?.instegram,
	]);

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
						Authorization: `Bearer ${cookies?.access_token}`,
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
					setReload(!reload);
					setError({
						snapchat: res?.data?.message?.en?.snapchat?.[0],
						facebook: res?.data?.message?.en?.facebook?.[0],
						twiter: res?.data?.message?.en?.twiter?.[0],
						youtube: res?.data?.message?.en?.youtube?.[0],
						instegram: res?.data?.message?.en?.instegram?.[0],
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | التواصل الاجتماعي</title>
			</Helmet>
			<section className='social-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
					</div>
				</div>
				<div className='head-category mb-md-4 mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
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
											<Twitter />
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
