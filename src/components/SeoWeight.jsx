import React, { Fragment, useState, useContext, useEffect } from "react";

import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Context from "../Context/context";
// import { useCookies } from "react-cookie";
import { TagsInput } from "react-tag-input-component";
import axios from "axios";
import useFetch from "../Hooks/UseFetch";
import { LoadingContext } from "../Context/LoadingProvider";

// ICONS
import { ReactComponent as HomeIcon } from "../data/Icons/icon_24_home.svg";
import { ReactComponent as DocumentIcon } from "../data/Icons/document_text_outlined.svg";
import { ReactComponent as EditIcon } from "../data/Icons/icon-24-write.svg";
import { ReactComponent as CreatedIcon } from "../data/Icons/icon-24-create link.svg";
import CircularLoading from "../HelperComponents/CircularLoading";
import { UserAuth } from "../Context/UserAuthorProvider";

const TITLE_REGEX = /^[^-\s][A-Za-zأ-ي0-9-ء ]+$/i;
const DESC_REGEX = /^[^-\s][A-Za-zأ-ي0-9-ء ]+$/i;
const LINK_REGEX =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;
const ROBOTS_REGEX =
	/^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_\+.~#?&\/=]*)$/;

const SeoWeight = () => {
	// to get all  data from server
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/seo`
	);
	const userAuthored = useContext(UserAuth);
	const { userAuthor } = userAuthored;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;

	// get all data from api
	const index_page_title =
		fetchedData?.data?.Seo?.map((item) => item?.index_page_title) || [];
	const index_page_description =
		fetchedData?.data?.Seo?.map((item) => item?.index_page_description) || [];
	const show_pages =
		fetchedData?.data?.Seo?.map((item) => item?.show_pages) || [];
	const keyWords =
		fetchedData?.data?.Seo?.map((item) => item?.key_words?.[0]) || [];
	const link = fetchedData?.data?.Seo?.map((item) => item?.link) || [];
	const robots = fetchedData?.data?.Seo?.map((item) => item?.robots) || [];

	// set data to state
	const [updateLinkValue, setUpdateLink] = useState("");
	const [updateRobotsValue, setUpdateRobotsValue] = useState("");
	const [keyWord, setKeyWord] = useState([]);
	const [showPageValue, setShowPageValue] = useState("short_link");
	const [seoValue, setSeoValue] = useState({
		index_page_title: "",
		index_page_description: "",
	});
	const [validPAGETITLE, setValidPageTitle] = useState(false);
	const [pageTitleFocus, setPageTitleFocus] = useState(false);

	const [validPAGEDESC, setValidPageDesc] = useState(false);
	const [pageDescFocus, setPageDescFocus] = useState(false);

	const [validPageLink, setValidPageLink] = useState(false);
	const [pageLinkFocus, setPageLinkFocus] = useState(false);

	const [validPageRobots, setValidPageRobots] = useState(false);
	const [pageRobotsFocus, setPageRobotsFocus] = useState(false);

	const [dataError, setDataError] = useState({
		index_page_title: "",
		index_page_description: "",
		show_pages: "",
		key_words: "",
	});
	const resetDataError = () => {
		setDataError({
			index_page_title: "",
			index_page_description: "",
			show_pages: "",
			key_words: "",
		});
	};
	const [dataError1, setDataError1] = useState({
		link: "",
	});
	const resetDataError1 = () => {
		setDataError1({
			link: "",
		});
	};
	const [dataError2, setDataError2] = useState({
		robots: "",
	});
	const resetDataError2 = () => {
		setDataError2({
			robots: "",
		});
	};

	// on change functions
	const HandleSeoValues = (e) => {
		const { name, value } = e.target;
		setSeoValue((prevState) => {
			return { ...prevState, [name]: value };
		});
	};

	const handleShowPages = (e) => {
		setShowPageValue(e.target.value);
	};

	// use this effect to get all seo data from index api
	useEffect(() => {
		if (fetchedData?.data?.Seo) {
			setSeoValue({
				...seoValue,
				index_page_title: index_page_title,
				index_page_description: index_page_description,
			});

			setShowPageValue(show_pages);
			setKeyWord(keyWords);
			setUpdateRobotsValue(robots);
			setUpdateLink(link);
		}
	}, [fetchedData?.data?.Seo]);

	useEffect(() => {
		const storeTitleValidation = TITLE_REGEX.test(seoValue?.index_page_title);
		setValidPageTitle(storeTitleValidation);
	}, [seoValue?.index_page_title]);

	useEffect(() => {
		const storeDescValidation = DESC_REGEX.test(
			seoValue?.index_page_description
		);
		setValidPageDesc(storeDescValidation);
	}, [seoValue?.index_page_description]);

	useEffect(() => {
		const storeLinkValidation = LINK_REGEX.test(updateLinkValue);
		setValidPageLink(storeLinkValidation);
	}, [updateLinkValue]);

	useEffect(() => {
		const storeRobotsValidation = ROBOTS_REGEX.test(updateRobotsValue);
		setValidPageRobots(storeRobotsValidation);
	}, [updateRobotsValue]);

	// to update Seo values
	const updateSeo = () => {
		setLoadingTitle("جاري تعديل الكلمات المفتاحية");
		resetDataError();
		let formData = new FormData();
		formData.append("index_page_title", seoValue?.index_page_title);
		formData.append("index_page_description", seoValue?.index_page_description);
		formData.append("index_page_description", seoValue?.index_page_description);
		formData.append("show_pages", showPageValue);
		formData.append("key_words", keyWord.join(" , "));

		axios
			.post(`https://backend.atlbha.com/api/Store/updateSeo`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${userAuthor}`,
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
						index_page_title: res?.data?.message?.en?.index_page_title?.[0],
						index_page_description:
							res?.data?.message?.en?.index_page_description?.[0],
						show_pages: res?.data?.message?.en?.show_pages?.[0],
						key_words: res?.data?.message?.en?.key_words?.[0],
					});
				}
			});
	};

	// to update Seo values
	const updateLink = () => {
		setLoadingTitle("جاري تعديل ربط جوجل انليتكس");
		resetDataError1();
		let formData = new FormData();
		formData.append("link", updateLinkValue);
		axios
			.post(`https://backend.atlbha.com/api/Store/updateLink`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${userAuthor}`,
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
					setDataError1({
						...dataError1,
						link: res?.data?.message?.en?.link?.[0],
					});
				}
			});
	};

	// to update updateRobots values
	const updateRobots = () => {
		setLoadingTitle("جاري تعديل إعدادات ملف Robots");
		resetDataError2();
		let formData = new FormData();
		formData.append("robots", updateRobotsValue);

		axios
			.post(`https://backend.atlbha.com/api/Store/updateRobots`, formData, {
				headers: {
					"Content-Type": "multipart/form-data",
					Authorization: `Bearer ${userAuthor}`,
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
					setDataError2({
						...dataError2,
						robots: res?.data?.message?.en?.robots?.[0],
					});
				}
			});
	};

	return (
		<Fragment>
			<div className='seo-weight-edit-box mb-md-4 mb-3'>
				<div className='title'>
					<h4>الكلمات المفتاحية SEO</h4>
				</div>

				<div className='row p-3'>
					{loading ? (
						<div
							className='d-flex justify-content-center align-items-center'
							style={{ height: "200px" }}>
							<CircularLoading />
						</div>
					) : (
						<Fragment>
							<div className='col-12 mb-md-4 mb-3'>
								<div className='input-bx'>
									<TextField
										name='index_page_title'
										value={seoValue?.index_page_title}
										onChange={HandleSeoValues}
										className='seo-input'
										id=''
										placeholder='عنوان الصفحة الرئيسية'
										onFocus={() => setPageTitleFocus(true)}
										onBlur={() => setPageTitleFocus(true)}
										required
										aria-invalid={validPAGETITLE ? "false" : "true"}
										aria-describedby='pageTitle'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<HomeIcon />
												</InputAdornment>
											),
										}}
									/>
									<br />
									<span className='fs-6 text-danger'>
										{dataError?.index_page_title}
									</span>
									<p
										id='pageTitle'
										className={
											pageTitleFocus &&
											seoValue?.index_page_title &&
											!validPAGETITLE
												? " d-block wrong-text "
												: "d-none"
										}
										style={{ color: "red", padding: "10px", fontSize: "1rem" }}>
										يجب ان يكون عنوان الصفحة احرف عربية او انجليزية
									</p>
								</div>
							</div>

							<div className='col-12 mb-4'>
								<div className='input-bx'>
									<TextField
										name='index_page_description'
										value={seoValue?.index_page_description}
										onChange={HandleSeoValues}
										placeholder='وصف الصفحة الرئيسية'
										onFocus={() => setPageDescFocus(true)}
										onBlur={() => setPageDescFocus(true)}
										required
										aria-invalid={validPAGEDESC ? "false" : "true"}
										aria-describedby='pageDesc'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<DocumentIcon />
												</InputAdornment>
											),
										}}
									/>
									<br />
									<span className='fs-6 text-danger'>
										{dataError?.index_page_description}
									</span>
									<p
										id='pageDesc'
										className={
											pageDescFocus &&
											seoValue?.index_page_description &&
											!validPAGEDESC
												? " d-block wrong-text "
												: "d-none"
										}
										style={{ color: "red", padding: "10px", fontSize: "1rem" }}>
										يجب ان يكون وصف الصفحة احرف عربية او انجليزية
									</p>
								</div>
							</div>

							<div className='col-12 mb-4'>
								<div className='input-bx'>
									<TagsInput
										value={keyWord}
										onChange={setKeyWord}
										name='key_words'
										placeHolder='الكلمات المفتاحية'
									/>
									<EditIcon className='key-word-icons' />
									<br />
									<span className='fs-6 text-danger'>
										{dataError?.key_words}
									</span>
								</div>
							</div>

							<div className='col-12 mb-5'>
								<div className='input-bx'>
									<FormLabel id='demo-radio-buttons-group-label'>
										طريقة عرض روابط صفحات المتجر
									</FormLabel>
									<RadioGroup
										aria-labelledby='demo-controlled-radio-buttons-group'
										defaultValue='short_link'
										name='controlled-radio-buttons-group'
										value={showPageValue}
										onChange={handleShowPages}>
										<div className='seo-form-check mb-2'>
											<FormControlLabel
												className='mb-md-0 mb-3'
												name='short_link'
												value='short_link'
												control={<Radio />}
											/>
											<label
												className='seo-form-check-label me-md-2'
												htmlFor='shortLink'>
												<span>رابط مختصر</span>
												<span className='link me-2'>
													(https://sample.utlopha.com){" "}
												</span>
											</label>
										</div>
										<div className='seo-form-check '>
											<FormControlLabel
												className='mb-md-0 mb-3'
												name='name_link'
												value='name_link'
												control={<Radio />}
											/>
											<label
												className='seo-form-check-label  me-md-2'
												htmlFor='normalLink'>
												<span> رابط باسم الصفحة</span>
												<span className='link me-2'>
													(الرئيسية//https://sample.utlopha.com){" "}
												</span>
											</label>
										</div>
									</RadioGroup>
								</div>
								<br />
								<span className='fs-6 text-danger'>
									{dataError?.show_pages}
								</span>
							</div>

							<div className='col-12 mb-5'>
								<div className='btn-bx'>
									<Button variant='contained' onClick={updateSeo}>
										حفظ
									</Button>
								</div>
							</div>
						</Fragment>
					)}
				</div>
			</div>

			<div className='seo-weight-edit-box mb-md-4 mb-3'>
				<div className='title'>
					<h4> ربط جوجل انليتكس Google Analytics </h4>
				</div>

				{loading ? (
					<div
						className='d-flex justify-content-center align-items-center'
						style={{ height: "200px" }}>
						<CircularLoading />
					</div>
				) : (
					<FormControl variant='standard'>
						<div className='row p-3'>
							<div className='col-12 mb-5'>
								<div className='input-bx'>
									<TextField
										name='link'
										value={updateLinkValue}
										onChange={(e) => {
											setUpdateLink(e.target.value);
										}}
										id='outlined-textarea'
										placeholder=' توليد رابط خاص بجوجل انليتكس'
										onFocus={() => setPageLinkFocus(true)}
										onBlur={() => setPageLinkFocus(true)}
										required
										aria-invalid={validPageLink ? "false" : "true"}
										aria-describedby='pageLink'
										InputProps={{
											startAdornment: (
												<InputAdornment position='start'>
													<CreatedIcon />
												</InputAdornment>
											),
										}}
									/>
									<br />
									<span className='fs-6 text-danger'>{dataError1?.link}</span>
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
								</div>
							</div>
							<div className='col-12 mb-5'>
								<div className='btn-bx'>
									<Button variant='contained' onClick={updateLink}>
										حفظ
									</Button>
								</div>
							</div>
						</div>
					</FormControl>
				)}
			</div>

			<div className='seo-weight-edit-box'>
				<div className='title'>
					<h4> إعدادات ملف Robots </h4>
				</div>
				{loading ? (
					<div
						className='d-flex justify-content-center align-items-center'
						style={{ height: "200px" }}>
						<CircularLoading />
					</div>
				) : (
					<FormControl variant='standard' className='edit-robot-teat-area'>
						<div className='row p-3'>
							<div className='col-12 mb-4'>
								<div className='input-bx'>
									<h5 className='mb-2'>تعديل ملف txt.Robots</h5>
									<TextField
										id='outlined-textarea'
										multiline
										value={updateRobotsValue}
										onChange={(e) => setUpdateRobotsValue(e.target.value)}
									/>
									<br />
									<span className='fs-6 text-danger'>{dataError2?.robots}</span>
									<p
										id='pageDesc'
										className={
											pageRobotsFocus && updateRobotsValue && !validPageRobots
												? " d-block wrong-text "
												: "d-none"
										}
										style={{ color: "red", padding: "10px", fontSize: "1rem" }}>
										يجب ان يكون ملف Robots Valid URL
									</p>
								</div>
							</div>
							<div className='col-12 mb-5'>
								<div className='btn-bx'>
									<Button variant='contained' onClick={updateRobots}>
										حفظ
									</Button>
								</div>
							</div>
						</div>
					</FormControl>
				)}
			</div>
		</Fragment>
	);
};

export default SeoWeight;
