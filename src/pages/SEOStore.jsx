import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import useFetch from "../Hooks/UseFetch";
import axios from "axios";
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";
import CircularLoading from "../HelperComponents/CircularLoading";
import { TagsInput } from "react-tag-input-component";
import Button from "@mui/material/Button";
import TextareaCode from "../components/TextareaCode/TextareaCode";

// import images
import howIcon from "../data/Icons/icon_24_home.svg";
import { ReactComponent as LinkIcon } from '../data/Icons/link.svg';
import { ReactComponent as UploadFileIcon } from '../data/Icons/upload file.svg';
import { ReactComponent as BlogIcon } from '../data/Icons/Blog.svg';
import { ReactComponent as SnapchatIcon } from '../data/Icons/blue-snapchat.svg';
import { ReactComponent as TwitterIcon } from '../data/Icons/blue-Xx.svg';
import { ReactComponent as InstagramIcon } from '../data/Icons/blue-instagram.svg';
import { ReactComponent as TiktokIcon } from "../data/Icons/blue-tiktok.svg";

const LINK_REGEX =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const PaintStore = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/seo`
	);
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [updateLinkValue, setUpdateLinkValue] = useState("");
	const [metaTags, setMetaTags] = useState("");
	const [snapchat, setSnapchat] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tiktok, setTiktok] = useState("");
	const [instagram, setInstagram] = useState("");
	const [keyWord, setKeyWord] = useState([]);
	const [validPageLink, setValidPageLink] = useState(false);
	const [pageLinkFocus, setPageLinkFocus] = useState(false);

	const [dataError, setDataError] = useState({
		updateLinkValue: "",
		metaTags: "",
		keyWord: "",
		snapchat: "",
		twitter: "",
		tiktok: "",
		instagram: "",
	});

	const resetDataError = () => {
		setDataError({
			updateLinkValue: "",
			metaTags: "",
			keyWord: "",
			snapchat: "",
			twitter: "",
			tiktok: "",
			instagram: "",
		});
	};

	useEffect(() => {
		setUpdateLinkValue(fetchedData?.data?.Seo?.[0]?.google_analytics);
		setMetaTags(fetchedData?.data?.Seo?.[0]?.metatags || "");
		setSnapchat(fetchedData?.data?.Seo?.[0]?.snappixel || "");
		setTwitter(fetchedData?.data?.Seo?.[0]?.twitterpixel || "");
		setTiktok(fetchedData?.data?.Seo?.[0]?.tiktokpixel || "");
		setInstagram(fetchedData?.data?.Seo?.[0]?.instapixel || "");
		setKeyWord(fetchedData?.data?.Seo?.[0]?.key_words?.map(key => key) || []);
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
		formData.append("metatags", metaTags);
		formData.append("snappixel", snapchat);
		formData.append("twitterpixel", twitter);
		formData.append("tiktokpixel", tiktok);
		formData.append("instapixel", instagram);
		formData.append("key_words", keyWord.join(" , "));
		axios
			.post(`https://backend.atlbha.com/api/Store/updateSeo`, formData, {
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
					setReload(!reload);
					setDataError({
						...dataError,
						updateLinkValue: res?.data?.message?.en?.google_analytics?.[0],
						metaTags: res?.data?.message?.en?.metatags?.[0],
						snapchat: res?.data?.message?.en?.snappixel?.[0],
						twitter: res?.data?.message?.en?.twitterpixel?.[0],
						tiktok: res?.data?.message?.en?.tiktokpixel?.[0],
						instagram: res?.data?.message?.en?.instapixel?.[0],
						keyWord: res?.data?.message?.en?.key_words?.[0],
					});
				}
			});
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | تحسينات SEO</title>
			</Helmet>
			<section className='seo-store-page'>
				<div className='head-category mb-3'>
					<div className='row'>
						<nav aria-label='breadcrumb'>
							<ol className='breadcrumb'>
								<li className='breadcrumb-item'>
									<img src={howIcon} alt='' />
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
				{
					loading ?
						<div className="data-container">
							<CircularLoading />
						</div>
						:
						<div className="data-container">
							<div className="inputs-group">
								<div className="label">
									<LinkIcon />
									<label>ربط جوجل أناليتكس Google Analytics</label>
								</div>
								<div className="input">
									<input
										type="text"
										value={updateLinkValue}
										onChange={(e) => { setUpdateLinkValue(e.target.value) }}
										placeholder="https://analytics.google.com/analytics/web/#/report"
										onFocus={() => setPageLinkFocus(true)}
										onBlur={() => setPageLinkFocus(true)}
										required
										aria-invalid={validPageLink ? "false" : "true"}
										aria-describedby='pageLink'
									>
									</input>
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
								{dataError?.updateLinkValue && <span className="wrong-text">{dataError?.updateLinkValue}</span>}
							</div>
							<div className="inputs-group">
								<div className="label">
									<UploadFileIcon />
									<label>Meta tags</label>
								</div>
								<div className="file-input-content">
									<div className="file-wrapper">
										<TextareaCode value={metaTags} setValue={setMetaTags} placeholder="Meta tags Codes ..." />
									</div>
								</div>
								{dataError?.metaTags && <span className="wrong-text">{dataError?.metaTags}</span>}
							</div>
							<div className="inputs-group">
								<div className="label">
									<BlogIcon />
									<label>الكلمات المفتاحية</label>
								</div>
								<div className="input">
									<TagsInput
										value={keyWord}
										onChange={setKeyWord}
										name='key_words'
										classNames="key_words"
										placeHolder='الكلمات المفتاحية'
									/>
								</div>
								{dataError?.keyWord && <span className="wrong-text">{dataError?.keyWord}</span>}
							</div>
							<div className="d-flex flex-column gap-3">
								<div className="social-media-inputs">
									<div className="label">
										<SnapchatIcon />
										<label>سناب بكسل</label>
									</div>
									<div className="input">
										<TextareaCode value={snapchat} setValue={setSnapchat} placeholder="Snapchat Pixel Codes ..." />
									</div>
								</div>
								{dataError?.snapchat && <span className="wrong-text">{dataError?.snapchat}</span>}
							</div>
							<div className="d-flex flex-column gap-3">
								<div className="social-media-inputs">
									<div className="label">
										<TiktokIcon />
										<label>تيك توك بكسل</label>
									</div>
									<div className="input">
										<TextareaCode value={tiktok} setValue={setTiktok} placeholder="Tiktok Pixel Codes ..." />
									</div>
								</div>
								{dataError?.tiktok && <span className="wrong-text">{dataError?.tiktok}</span>}
							</div>
							<div className="d-flex flex-column gap-3">
								<div className="social-media-inputs">
									<div className="label">
										<TwitterIcon />
										<label>تويتر بكسل</label>
									</div>
									<div className="input">
										<TextareaCode value={twitter} setValue={setTwitter} placeholder="Twitter Pixel Codes ..." />
									</div>
								</div>
								{dataError?.twitter && <span className="wrong-text">{dataError?.twitter}</span>}
							</div>
							<div className="d-flex flex-column gap-3">
								<div className="social-media-inputs mb-5">
									<div className="label">
										<InstagramIcon />
										<label>انستجرام بكسل</label>
									</div>
									<div className="input">
										<TextareaCode value={instagram} setValue={setInstagram} placeholder="Instagram Pixel Codes ..." />
									</div>
								</div>
								{dataError?.instagram && <span className="wrong-text">{dataError?.instagram}</span>}
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
				}
			</section>
		</>
	);
};

export default PaintStore;
