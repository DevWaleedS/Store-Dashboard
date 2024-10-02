import React, { useState, useEffect, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import ImageUploading from "react-images-uploading";

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
	UploadIcon,
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
	const [gtm, setGtm] = useState("");
	const [footer, setFooter] = useState("");
	const [keyWord, setKeyWord] = useState([]);
	const [seoSetting, setSeoSetting] = useState({
		google_analytics: "",
		title: "",
		Search: "",
		metaDescription: "",
		og_title: "",
		og_type: "",
		og_description: "",
		og_url: "",
		og_site_name: "",
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
		google_analytics: "",
		title: "",
		Search: "",
		tag: "",
		keyWord: "",
		snapchat: "",
		twitter: "",
		tiktok: "",
		instagram: "",
		og_title: "",
		og_type: "",
		og_description: "",
		og_image: "",
		og_url: "",
		og_site_name: "",
	});
	const resetDataError = () => {
		setDataError({
			google_analytics: "",
			title: "",
			Search: "",
			tag: "",
			metaDescription: "",
			keyWord: "",
			snapchat: "",
			twitter: "",
			tiktok: "",
			instagram: "",
			og_title: "",
			og_type: "",
			og_description: "",
			og_image: "",
			og_url: "",
			og_site_name: "",
		});
	};
	// --------------------------------------------------------------
	useEffect(() => {
		if (Seo) {
			setGtm(Seo?.[0]?.tag || "");
			setFooter(Seo?.[0]?.footer || "");
			setTiktok(Seo?.[0]?.tiktokpixel || "");
			setSnapchat(Seo?.[0]?.snappixel || "");
			setTwitter(Seo?.[0]?.twitterpixel || "");
			setInstagram(Seo?.[0]?.instapixel || "");
			setKeyWord(Seo?.[0]?.key_words?.map((key) => key) || []);
			setSeoSetting({
				...seoSetting,
				title: Seo?.[0]?.title || "",
				Search: Seo?.[0]?.Search || "",
				google_analytics: Seo?.[0]?.title || "",
				metaDescription: Seo?.[0]?.metaDescription || "",
				og_title: Seo?.[0]?.og_title || "",
				og_type: Seo?.[0]?.og_type || "",
				og_description: Seo?.[0]?.og_description || "",
				og_url: Seo?.[0]?.og_url || "",
				og_site_name: Seo?.[0]?.og_site_name || "",
			});
			setOgImage([Seo?.ogImage]);
		}
	}, [Seo]);

	useEffect(() => {
		const storeLinkValidation = LINK_REGEX.test(seoSetting?.google_analytics);
		setValidPageLink(storeLinkValidation);
	}, [seoSetting?.google_analytics]);

	// handle images size
	const [ogImage, setOgImage] = React.useState([]);
	const maxFileSize = 1 * 1024 * 1024; // 1 MB;
	const onChange = (imageList, addUpdateIndex) => {
		// Check image size before updating state
		const isSizeValid = imageList.every(
			(image) => image.file.size <= maxFileSize
		);
		const errorMessage = "حجم الصورة يجب أن لا يزيد عن 1 ميجابايت.";

		if (!isSizeValid) {
			toast.warning(errorMessage, {
				theme: "light",
			});
			setDataError({
				...dataError,
				og_image: errorMessage,
			});
			setOgImage([]);
		} else {
			setOgImage(imageList);
			setDataError({ ...dataError, og_image: null });
		}
	};

	// HANDLE UPDATE SEO DATA
	const [updateSeo] = useUpdateSeoMutation();
	const handleSEOUpdate = async () => {
		resetDataError();
		setLoadingTitle("جاري تعديل تحسينات الSEO");

		// data that send to api
		let formData = new FormData();
		formData.append("title", seoSetting?.title);
		formData.append("Search", seoSetting?.Search);
		formData.append("google_analytics", seoSetting?.google_analytics);
		formData.append("metaDescription", seoSetting?.metaDescription);
		formData.append("tag", gtm);
		formData.append("footer", footer);
		formData.append("snappixel", snapchat);
		formData.append("twitterpixel", twitter);
		formData.append("tiktokpixel", tiktok);
		formData.append("instapixel", instagram);
		formData.append("og_title", seoSetting?.og_title);
		formData.append("og_type", seoSetting?.og_type);
		formData.append("og_description", seoSetting?.og_description);
		formData.append("og_url", seoSetting?.og_url);
		formData.append("og_site_name", seoSetting?.og_site_name);
		formData.append("key_words", keyWord.join(","));
		if (ogImage?.length > 0) {
			formData.append("og_image", ogImage[0]?.file);
		}

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
					google_analytics: response?.data?.message?.en?.google_analytics?.[0],
					Search: response?.data?.message?.en?.Search?.[0],
					snapchat: response?.data?.message?.en?.snappixel?.[0],
					twitter: response?.data?.message?.en?.twitterpixel?.[0],
					tiktok: response?.data?.message?.en?.tiktokpixel?.[0],
					instagram: response?.data?.message?.en?.instapixel?.[0],
					keyWord: response?.data?.message?.en?.key_words?.[0],

					og_title: response?.data?.message?.en?.og_title?.[0],
					og_type: response?.data?.message?.en?.og_type?.[0],
					og_description: response?.data?.message?.en?.og_description?.[0],
					og_image: response?.data?.message?.en?.og_image?.[0],
					og_url: response?.data?.message?.en?.og_url?.[0],
					og_site_name: response?.data?.message?.en?.og_site_name?.[0],
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

	console.log(seoSetting);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | تحسينات SEO </title>
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
									name='google_analytics'
									value={seoSetting?.google_analytics}
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
									pageLinkFocus &&
									seoSetting?.google_analytics &&
									!validPageLink
										? " d-block wrong-text pt-0"
										: "d-none"
								}
								style={{ color: "red", padding: "10px", fontSize: "1rem" }}>
								يجب ان يكون الرابط Valid URL
							</p>
							{dataError?.google_analytics && (
								<span className='wrong-text'>
									{dataError?.google_analytics}
								</span>
							)}
						</div>

						{/* Google search console */}
						<div className='inputs-group'>
							<div className='label'>
								<LinkIcon />
								<label>ربط Google search console</label>
							</div>
							<div className='input'>
								<input
									style={{ textAlign: "left", direction: "ltr" }}
									type='text'
									name='Search'
									value={seoSetting?.Search}
									onChange={handleOnChange}
									placeholder='قم بنسخ الرابط وضعه هنا'
									required
								/>
							</div>

							{dataError?.Search && (
								<span className='wrong-text'>{dataError?.Search}</span>
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

						{/* Google Tag manager  */}
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<FaCode style={{ color: "#1dbbbe" }} />
									<label>ربط Google Tag manager في الـ head </label>
								</div>
								<div className='input'>
									<TextareaCode
										name='gtm'
										value={gtm}
										setValue={setGtm}
										placeholder='google tag manager in head tag'
									/>
								</div>
							</div>
							{dataError?.gtm && (
								<span className='wrong-text'>{dataError?.gtm}</span>
							)}
						</div>

						{/* footer code */}
						<div className='d-flex flex-column gap-3'>
							<div className='social-media-inputs'>
								<div className='label'>
									<FaCode style={{ color: "#1dbbbe" }} />
									<label>
										<label>ربط Google Tag manager في الـ body</label>
									</label>
								</div>
								<div className='input'>
									<TextareaCode
										name='footer'
										value={footer}
										setValue={setFooter}
										placeholder='google tag manager in body tag'
									/>
								</div>
							</div>
							{dataError?.footer && (
								<span className='wrong-text'>{dataError?.footer}</span>
							)}
						</div>

						{/* handle open graph code  */}
						<div className='inputs-group'>
							<h5>اعدادات اكواد open graph</h5>
						</div>
						<div className='inputs-group'>
							<div className='label'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>og:title </label>
							</div>
							<div className='input'>
								<input
									type='text'
									name='og_title'
									value={seoSetting?.og_title}
									onChange={handleOnChange}
									placeholder='ادخل العنوان الخاص بالمتجر'
								/>
							</div>

							{dataError?.og_title && (
								<span className='wrong-text'>{dataError?.og_title}</span>
							)}
						</div>
						{/* seo title */}
						<div className='inputs-group'>
							<div className='label'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>og:site_name</label>
							</div>
							<div className='input'>
								<input
									type='text'
									name='og_site_name'
									value={seoSetting?.og_site_name}
									onChange={handleOnChange}
									placeholder='ادخل العنوان الخاص بالمتجر'
								/>
							</div>

							{dataError?.og_site_name && (
								<span className='wrong-text'>{dataError?.og_site_name}</span>
							)}
						</div>
						{/* seo title */}
						<div className='inputs-group'>
							<div className='label'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>og:url</label>
							</div>
							<div className='input'>
								<input
									type='url'
									name='og_url'
									value={seoSetting?.og_url}
									onChange={handleOnChange}
									placeholder='ادخل العنوان الخاص بالمتجر'
								/>
							</div>

							{dataError?.og_url && (
								<span className='wrong-text'>{dataError?.og_url}</span>
							)}
						</div>
						{/* seo title */}
						<div className='inputs-group'>
							<div className='label'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>og:description</label>
							</div>
							<div className='input'>
								<input
									type='text'
									name='og_description'
									value={seoSetting?.og_description}
									onChange={handleOnChange}
									placeholder='ادخل العنوان الخاص بالمتجر'
								/>
							</div>

							{dataError?.og_description && (
								<span className='wrong-text'>{dataError?.og_description}</span>
							)}
						</div>
						{/* seo title */}
						<div className='inputs-group'>
							<div className='label'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>og:type</label>
							</div>
							<div className='input'>
								<input
									type='text'
									name='og_type'
									value={seoSetting?.og_type}
									onChange={handleOnChange}
									placeholder='ادخل العنوان الخاص بالمتجر'
								/>
							</div>

							{dataError?.og_type && (
								<span className='wrong-text'>{dataError?.og_type}</span>
							)}
						</div>
						{/* seo title */}
						<div className='inputs-group upload_og_image'>
							<div className='label mb-2'>
								<IoText style={{ color: "#1dbbbe" }} />
								<label>og:image</label>
							</div>
							<div className='image_preview_wrapper'>
								{ogImage[0] ? (
									<div className='og_image_preview_box'>
										<img
											className='img-fluid'
											src={ogImage[0]?.data_url || ogImage[0]}
											alt=''
										/>
									</div>
								) : null}
								<div className='upload_image_box'>
									<ImageUploading
										value={ogImage}
										onChange={onChange}
										dataURLKey='data_url'
										acceptType={["jpg", "png", "jpeg"]}>
										{({ onImageUpload, dragProps }) => (
											<div
												className='add-image-btn-box '
												onClick={() => {
													onImageUpload();
												}}
												{...dragProps}>
												<div className='d-flex flex-column justify-center align-items-center'>
													<div className='add-image-btn d-flex flex-column justify-center align-items-center'>
														<UploadIcon />
														<label
															htmlFor='add-image'
															className='d-flex justify-center align-items-center'>
															اسحب الصورة هنا
														</label>
													</div>
													<span>( سيتم قبول الصور jpeg & png & jpg)</span>
													<div className='tax-text '>
														(الحد الأقصى للصورة 1MB)
													</div>
												</div>
											</div>
										)}
									</ImageUploading>
								</div>
								{dataError?.ogImage && (
									<span className='wrong-text'>{dataError?.ogImage}</span>
								)}
							</div>
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
