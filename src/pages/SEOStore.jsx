import React, { useState, useEffect, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

// Components
import useFetch from "../Hooks/UseFetch";
import CircularLoading from "../HelperComponents/CircularLoading";
import TextareaCode from "../components/TextareaCode/TextareaCode";

// Context
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";

// MUI
import Button from "@mui/material/Button";
import { TagsInput } from "react-tag-input-component";
// Redux
import { useSelector } from "react-redux";

// Icons
import {
	HomeIcon,
	BlogIcon,
	InstagramIcon,
	LinkIcon,
	SnapchatIcon,
	TiktokIconColored,
	TwitterIcon,
} from "../data/Icons";

const PaintStore = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/seo`
	);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [updateLinkValue, setUpdateLinkValue] = useState("");
	const [robotLink, setRobotLink] = useState("");
	const [snapchat, setSnapchat] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tiktok, setTiktok] = useState("");
	const [instagram, setInstagram] = useState("");
	const [keyWord, setKeyWord] = useState([]);

	//  handle if the store is not verified navigate to home page
	const navigate = useNavigate();
	const { verificationStoreStatus } = useSelector((state) => state.VerifyModal);
	useEffect(() => {
		if (verificationStoreStatus !== "تم التوثيق") {
			navigate("/");
		}
	}, [verificationStoreStatus]);

	// to handle errors
	const LINK_REGEX =
		/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
	const [validPageLink, setValidPageLink] = useState(false);
	const [pageLinkFocus, setPageLinkFocus] = useState(false);
	const [dataError, setDataError] = useState({
		updateLinkValue: "",
		robotLink: "",
		keyWord: "",
		snapchat: "",
		twitter: "",
		tiktok: "",
		instagram: "",
	});
	const resetDataError = () => {
		setDataError({
			updateLinkValue: "",
			robotLink: "",
			keyWord: "",
			snapchat: "",
			twitter: "",
			tiktok: "",
			instagram: "",
		});
	};
	// --------------------------------------------------------------

	useEffect(() => {
		setUpdateLinkValue(fetchedData?.data?.Seo?.[0]?.google_analytics);
		setRobotLink(fetchedData?.data?.Seo?.[0]?.robot_link || "");
		setSnapchat(fetchedData?.data?.Seo?.[0]?.snappixel || "");
		setTwitter(fetchedData?.data?.Seo?.[0]?.twitterpixel || "");
		setTiktok(fetchedData?.data?.Seo?.[0]?.tiktokpixel || "");
		setInstagram(fetchedData?.data?.Seo?.[0]?.instapixel || "");
		setKeyWord(fetchedData?.data?.Seo?.[0]?.key_words?.map((key) => key) || []);
	}, [fetchedData?.data?.Seo]);

	useEffect(() => {
		const storeLinkValidation = LINK_REGEX.test(updateLinkValue);
		setValidPageLink(storeLinkValidation);
	}, [updateLinkValue]);

	const handleSEOUpdate = () => {
		resetDataError();
		setLoadingTitle("جاري تعديل تحسينات الSEO");
		let formData = new FormData();
		formData.append("google_analytics", updateLinkValue);
		formData.append("robot_link", robotLink);
		formData.append("snappixel", snapchat);
		formData.append("twitterpixel", twitter);
		formData.append("tiktokpixel", tiktok);
		formData.append("instapixel", instagram);
		formData.append("key_words", keyWord.join(","));
		axios
			.post(`https://backend.atlbha.com/api/Store/updateSeo`, formData, {
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

					setDataError({
						...dataError,
						updateLinkValue: res?.data?.message?.en?.google_analytics?.[0],
						robotLink: res?.data?.message?.en?.robot_link?.[0],
						snapchat: res?.data?.message?.en?.snappixel?.[0],
						twitter: res?.data?.message?.en?.twitterpixel?.[0],
						tiktok: res?.data?.message?.en?.tiktokpixel?.[0],
						instagram: res?.data?.message?.en?.instapixel?.[0],
						keyWord: res?.data?.message?.en?.key_words?.[0],
					});
					toast.error(res?.data?.message?.en?.google_analytics?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.robot_link?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.snappixel?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.twitterpixel?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.tiktokpixel?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.instapixel?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.key_words?.[0], {
						theme: "light",
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تحسينات SEO</title>
			</Helmet>
			<section className='seo-store-page'>
				<div className='head-category mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<HomeIcon />
									<Link to='/' className='me-2'>
										الرئيسية
									</Link>
								</li>
								<li className='breadcrumb-item  ' aria-current='page'>
									تحسينات SEO
								</li>
							</ol>
						</nav>
					</div>
				</div>
				{loading ? (
					<div className='data-container'>
						<CircularLoading />
					</div>
				) : (
					<div className='data-container'>
						{/* Google Analytics Link */}
						<div className='inputs-group'>
							<div className='label'>
								<LinkIcon />
								<label>ربط جوجل أناليتكس Google Analytics</label>
							</div>
							<div className='input'>
								<input
									style={{ textAlign: "left", direction: "ltr" }}
									type='text'
									value={updateLinkValue}
									onChange={(e) => {
										setUpdateLinkValue(e.target.value);
									}}
									placeholder='https://analytics.google.com/analytics/web/#/report'
									onFocus={() => setPageLinkFocus(true)}
									onBlur={() => setPageLinkFocus(true)}
									required
									aria-invalid={validPageLink ? "false" : "true"}
									aria-describedby='pageLink'></input>
							</div>
							<p
								id='pageDesc'
								className={
									pageLinkFocus && updateLinkValue && !validPageLink
										? " d-block wrong-text "
										: "d-none"
								}
								style={{ color: "red", padding: "10px", fontSize: "1rem" }}>
								يجب ان يكون الرابط Valid URL
							</p>
							{dataError?.updateLinkValue && (
								<span className='wrong-text'>{dataError?.updateLinkValue}</span>
							)}
						</div>

						{/* Robots File  */}

						<div className='inputs-group'>
							<div className='label'>
								<label> إعدادات ملف Robots </label>
							</div>
							<div className='input'>
								<textarea
									className='robot_link_text_area'
									style={{ textAlign: "left", direction: "ltr" }}
									value={robotLink}
									onChange={(e) => {
										setRobotLink(e.target.value);
									}}
									placeholder='Sitemap: https://utlopha.sa/sitemap.xml User-agent: * Allow: / Disallow: /*<iframe Disallow: /*?currency='
								/>
							</div>

							{dataError?.robotLink && (
								<span className='wrong-text'>{dataError?.robotLink}</span>
							)}
						</div>
						{/* Keywords */}
						<div className='inputs-group'>
							<div className='label'>
								<BlogIcon />
								<label>الكلمات المفتاحية</label>
							</div>
							<div className='input'>
								<TagsInput
									value={keyWord}
									onChange={setKeyWord}
									name='key_words'
									classNames='key_words'
									placeHolder='ضع الكلمة ثم اضغط enter'
								/>
							</div>
							{dataError?.keyWord && (
								<span className='wrong-text'>{dataError?.keyWord}</span>
							)}
						</div>

						{/* Pixel code*/}
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<SnapchatIcon />
									<label>سناب بكسل</label>
								</div>
								<div className='input'>
									<TextareaCode
										value={snapchat}
										setValue={setSnapchat}
										placeholder='Snapchat Pixel Codes ...'
									/>
								</div>
							</div>
							{dataError?.snapchat && (
								<span className='wrong-text'>{dataError?.snapchat}</span>
							)}
						</div>
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<TiktokIconColored />
									<label>تيك توك بكسل</label>
								</div>
								<div className='input'>
									<TextareaCode
										value={tiktok}
										setValue={setTiktok}
										placeholder='Tiktok Pixel Codes ...'
									/>
								</div>
							</div>
							{dataError?.tiktok && (
								<span className='wrong-text'>{dataError?.tiktok}</span>
							)}
						</div>
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<TwitterIcon />
									<label>تويتر بكسل</label>
								</div>
								<div className='input'>
									<TextareaCode
										value={twitter}
										setValue={setTwitter}
										placeholder='Twitter Pixel Codes ...'
									/>
								</div>
							</div>
							{dataError?.twitter && (
								<span className='wrong-text'>{dataError?.twitter}</span>
							)}
						</div>
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs mb-5'>
								<div className='label'>
									<InstagramIcon />
									<label>انستجرام بكسل</label>
								</div>
								<div className='input'>
									<TextareaCode
										value={instagram}
										setValue={setInstagram}
										placeholder='Instagram Pixel Codes ...'
									/>
								</div>
							</div>
							{dataError?.instagram && (
								<span className='wrong-text'>{dataError?.instagram}</span>
							)}
						</div>
						<div className='col-lg-6 col-12 mx-auto'>
							<Button
								variant='contained'
								style={{
									width: "100%",
									height: "56px",
									backgroundColor: "#1dbbbe",
								}}
								onClick={handleSEOUpdate}>
								حفظ
							</Button>
						</div>
					</div>
				)}
			</section>
		</>
	);
};

export default PaintStore;
