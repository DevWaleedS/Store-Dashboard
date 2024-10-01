import React, { useState, useEffect, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// Components
import CircularLoading from "../HelperComponents/CircularLoading";
import TextareaCode from "../components/TextareaCode/TextareaCode";

// Context
import { LoadingContext } from "../Context/LoadingProvider";

// MUI
import Button from "@mui/material/Button";
import { TagsInput } from "react-tag-input-component";

// Icons
import {
	BlogIcon,
	InstagramIcon,
	LinkIcon,
	SnapchatIcon,
	TiktokIconColored,
	TwitterIcon,
} from "../data/Icons";
import { FaCode } from "react-icons/fa6";
import { IoText } from "react-icons/io5";

// RTK Query
import {
	useGetSEODataQuery,
	useUpdateSeoMutation,
} from "../store/apiSlices/SEOImprovementsApi";

// Components
import { Breadcrumb } from "../components";

// custom hook
import UseAccountVerification from "../Hooks/UseAccountVerification";
import { set } from "react-hook-form";

const SEOStoreSetting = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	// get seo data
	const { data: Seo, isLoading } = useGetSEODataQuery();
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [snapchat, setSnapchat] = useState("");
	const [twitter, setTwitter] = useState("");
	const [tiktok, setTiktok] = useState("");
	const [instagram, setInstagram] = useState("");
	const [robotLink, setRobotLink] = useState("");
	const [siteMap, setSiteMap] = useState("");
	const [header, setHeader] = useState("");
	const [footer, setFooter] = useState("");
	const [keyWord, setKeyWord] = useState([]);
	const [seoSetting, setSeoSetting] = useState({
		updateLinkValue: "",
		title: "",
		metaDescription: "",
		keyword: [],
	});

	const handleOnChange = (e) => {
		const { name, value } = e.target;
		setSeoSetting((prevData) => {
			return { ...prevData, [name]: value };
		});
	};

	// Handle Regex
	const LINK_REGEX =
		/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
	const [validPageLink, setValidPageLink] = useState(false);
	const [pageLinkFocus, setPageLinkFocus] = useState(false);

	// Handle errors
	const [dataError, setDataError] = useState({
		updateLinkValue: "",
		title: "",
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
			title: "",
			metaDescription: "",
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
		if (Seo) {
			setHeader(Seo?.[0]?.header || "");
			setFooter(Seo?.[0]?.footer || "");
			setTiktok(Seo?.[0]?.tiktokpixel || "");
			setSnapchat(Seo?.[0]?.snappixel || "");
			setTwitter(Seo?.[0]?.twitterpixel || "");
			setInstagram(Seo?.[0]?.instapixel || "");
			setSiteMap(Seo?.[0]?.siteMap || "");
			setRobotLink(Seo?.[0]?.robot_link || "");

			setKeyWord(Seo?.[0]?.key_words?.map((key) => key) || []);

			setSeoSetting({
				...seoSetting,
				title: Seo?.[0]?.title || "",

				metaDescription: Seo?.[0]?.metaDescription || "",
				updateLinkValue: Seo?.[0]?.google_analytics || "",
			});
		}
	}, [Seo]);

	useEffect(() => {
		const storeLinkValidation = LINK_REGEX.test(seoSetting?.updateLinkValue);
		setValidPageLink(storeLinkValidation);
	}, [seoSetting?.updateLinkValue]);

	// HANDLE UPDATE SEO DATA
	const [updateSeo] = useUpdateSeoMutation();
	const handleSEOUpdate = async () => {
		resetDataError();
		setLoadingTitle("جاري تعديل تحسينات الSEO");

		// data that send to api
		let formData = new FormData();
		formData.append("google_analytics", seoSetting?.updateLinkValue);
		formData.append("title", seoSetting?.title);
		formData.append("metaDescription", seoSetting?.metaDescription);
		formData.append("header", header);
		formData.append("footer", footer);
		formData.append("siteMap", siteMap);
		formData.append("robot_link", robotLink);
		formData.append("snappixel", snapchat);
		formData.append("twitterpixel", twitter);
		formData.append("tiktokpixel", tiktok);
		formData.append("instapixel", instagram);
		formData.append("key_words", keyWord.join(","));

		// make request...
		try {
			const response = await updateSeo({
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

				setDataError({
					...dataError,
					updateLinkValue: response?.data?.message?.en?.google_analytics?.[0],
					robotLink: response?.data?.message?.en?.robot_link?.[0],
					snapchat: response?.data?.message?.en?.snappixel?.[0],
					twitter: response?.data?.message?.en?.twitterpixel?.[0],
					tiktok: response?.data?.message?.en?.tiktokpixel?.[0],
					instagram: response?.data?.message?.en?.instapixel?.[0],
					keyWord: response?.data?.message?.en?.key_words?.[0],
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
			console.error("Error changing updateSeo:", error);
		}
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تحسينات SEO الـ</title>
			</Helmet>
			<section className='seo-store-page'>
				<Breadcrumb mb={"mb-3"} currentPage={"تحسينات الـ SEO"} />

				{isLoading ? (
					<div className='data-container'>
						<CircularLoading />
					</div>
				) : (
					<div className='data-container'>
						{/* seo title */}
						<div className='inputs-group'>
							<div className='label'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>SEO Title</label>
							</div>
							<div className='input'>
								<input
									type='text'
									name='title'
									value={seoSetting?.title}
									onChange={handleOnChange}
									placeholder='ادخل العنوان الخاص بالمتجر'
									required
								/>
							</div>

							{dataError?.title && (
								<span className='wrong-text'>{dataError?.title}</span>
							)}
						</div>

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
									name='updateLinkValue'
									value={seoSetting?.updateLinkValue}
									onChange={handleOnChange}
									placeholder='https://analytics.google.com/analytics/web/#/report'
									onFocus={() => setPageLinkFocus(true)}
									onBlur={() => setPageLinkFocus(true)}
									required
									aria-invalid={validPageLink ? "false" : "true"}
									aria-describedby='pageLink'
								/>
							</div>
							<p
								id='pageDesc'
								className={
									pageLinkFocus && seoSetting?.updateLinkValue && !validPageLink
										? " d-block wrong-text pt-0"
										: "d-none"
								}
								style={{ color: "red", padding: "10px", fontSize: "1rem" }}>
								يجب ان يكون الرابط Valid URL
							</p>
							{dataError?.updateLinkValue && (
								<span className='wrong-text'>{dataError?.updateLinkValue}</span>
							)}
						</div>

						{/* seo Description */}
						<div className='inputs-group'>
							<div className='label'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>الوصف الخاص بالمتجر</label>
							</div>
							<div className='input'>
								<textarea
									style={{ textAlign: "right", direction: "rtl" }}
									className='robot_link_text_area'
									name='metaDescription'
									value={seoSetting?.metaDescription}
									onChange={handleOnChange}
									placeholder='ادخل الوصف الخاص بالمتجر'
									required
								/>
							</div>

							{dataError?.metaDescription && (
								<span className='wrong-text'>{dataError?.metaDescription}</span>
							)}
						</div>

						{/* Robots File  */}
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<FaCode style={{ color: "#1dbbbe" }} />
									<label> إعدادات ملف Robots </label>
								</div>
								<div className='input'>
									<TextareaCode
										name='robotLink'
										value={robotLink}
										setValue={setRobotLink}
										placeholder='siteMap: https://atlbha.sa/siteMap.xml User-agent: * Allow: / Disallow: /*<iframe Disallow: /*?currency='
									/>
								</div>
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
									name='keyWord'
									value={keyWord}
									onChange={setKeyWord}
									classNames='key_words'
									placeHolder='ضع الكلمة ثم اضغط enter'
								/>
							</div>
							{dataError?.keyWord && (
								<span className='wrong-text'>{dataError?.keyWord}</span>
							)}
						</div>

						{/* siteMap file */}
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<FaCode style={{ color: "#1dbbbe" }} />
									<label>إعدادات ملف الـ siteMap</label>
								</div>
								<div className='input'>
									<TextareaCode
										name='siteMap'
										value={siteMap}
										setValue={setSiteMap}
										placeholder='siteMap: https://atlpha.sa/siteMap.xml'
									/>
								</div>
							</div>
							{dataError?.siteMap && (
								<span className='wrong-text'>{dataError?.siteMap}</span>
							)}
						</div>

						{/* header code */}
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<FaCode style={{ color: "#1dbbbe" }} />
									<label>خانة Html/Javascript للهيدر:</label>
								</div>
								<div className='input'>
									<TextareaCode
										name='header'
										value={header}
										setValue={setHeader}
										placeholder='خانة Html/Javascript للهيدر: يوضع فيها أية أكواد يحتاج موظف السيو أن يضيفها للمتجر في الهيدر مثل (Google Tag manager) و (Google Search Console) و (Open Graph) وغيرها'
									/>
								</div>
							</div>
							{dataError?.header && (
								<span className='wrong-text'>{dataError?.header}</span>
							)}
						</div>

						{/* footer code */}
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<FaCode style={{ color: "#1dbbbe" }} />
									<label>
										<label>خانة Html/Javascript للفوتر:</label>
									</label>
								</div>
								<div className='input'>
									<TextareaCode
										name='footer'
										value={footer}
										setValue={setFooter}
										placeholder='خانة Html/Javascript للفوتر: يوضع فيها أية أكواد يحتاج موظف السيو أن يضيفها للمتجر في الفوتر'
									/>
								</div>
							</div>
							{dataError?.footer && (
								<span className='wrong-text'>{dataError?.footer}</span>
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
										name='snapchat'
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
										name='tiktok'
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
										name='twitter'
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
										name='instagram'
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
								disabled={isLoading}
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

export default SEOStoreSetting;
