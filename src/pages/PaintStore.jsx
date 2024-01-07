import React, { useState, useEffect, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// components
import useFetch from "../Hooks/UseFetch";
import CircularLoading from "../HelperComponents/CircularLoading";

// context
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";

// MUI
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Icons
import {
	Background,
	Border,
	Border01,
	Caaard,
	Category,
	Footer,
	HomeIcon,
	Icons,
	Menuu,
} from "../data/Icons";
import FontDownloadOutlinedIcon from "@mui/icons-material/FontDownloadOutlined";

const PaintStore = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/theme`
	);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [expanded, setExpanded] = useState(false);
	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const [primaryBg, setPrimaryBg] = useState("#e5e5e5");
	const [secondaryBg, setSecondaryBg] = useState("#02466a");
	const [fontColor, setFontColor] = useState("#3d464d");
	const [headerBg, setHeaderBg] = useState("#1dbbbe");
	const [layoutBg, setLayoutBg] = useState("#ffffff");
	const [iconsBg, setIconsBg] = useState("#1dbbbe");
	const [footer, setFooter] = useState({
		footerBorder: "#ebebeb",
		footerBg: "#ffffff",
	});

	useEffect(() => {
		if (fetchedData?.data?.Theme) {
			setPrimaryBg(fetchedData?.data?.Theme?.primaryBg);
			setSecondaryBg(fetchedData?.data?.Theme?.secondaryBg);
			setFontColor(fetchedData?.data?.Theme?.fontColor);
			setHeaderBg(fetchedData?.data?.Theme?.headerBg);
			setLayoutBg(fetchedData?.data?.Theme?.layoutBg);
			setIconsBg(fetchedData?.data?.Theme?.iconsBg);
			setFooter({
				...footer,
				footerBorder: fetchedData?.data?.Theme?.footerBorder,
				footerBg: fetchedData?.data?.Theme?.footerBg,
			});
		}
	}, [fetchedData?.data?.Theme]);

	// Handle Primary
	const handlePrimaryUpdate = () => {
		setLoadingTitle("جاري تعديل اللون الأساسي");

		let formData = new FormData();
		formData.append("primaryBg", primaryBg);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/themePrimaryUpdate`,
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
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.primaryBg?.[0], {
						theme: "light",
					});
				}
			});
	};

	const handleSecondaryUpdate = () => {
		setLoadingTitle("جاري تعديل اللون الفرعي");
		let formData = new FormData();
		formData.append("secondaryBg", secondaryBg);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/themeSecondaryUpdate`,
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
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.secondaryBg?.[0], {
						theme: "light",
					});
				}
			});
	};

	const handleFontColorUpdate = () => {
		setLoadingTitle("جاري تعديل لون الخط");

		let formData = new FormData();
		formData.append("fontColor", fontColor);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/themeFontColorUpdate`,
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
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.primaryBg?.[0], {
						theme: "light",
					});
				}
			});
	};

	const handleHeaderUpdate = () => {
		setLoadingTitle(" (الهيدر) جاري تعديل القائمة العلوية");
		let formData = new FormData();
		formData.append("headerBg", headerBg);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/themeHeaderUpdate`,
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
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.headerBg?.[0], {
						theme: "light",
					});
				}
			});
	};

	const handleLayotUpdate = () => {
		setLoadingTitle("جاري تعديل الخلفية");
		let formData = new FormData();
		formData.append("layoutBg", layoutBg);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/themeLayoutUpdate`,
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
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.layoutBg?.[0], {
						theme: "light",
					});
				}
			});
	};

	const handleIconUpdate = () => {
		setLoadingTitle("جاري تعديل الايقونات");
		let formData = new FormData();
		formData.append("iconsBg", iconsBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeIconUpdate`, formData, {
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
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.iconsBg?.[0], {
						theme: "light",
					});
				}
			});
	};

	const handleFooterUpdate = () => {
		setLoadingTitle("جاري تعديل القائمة السفلية ");
		let formData = new FormData();
		formData.append("footerBorder", footer?.footerBorder);
		formData.append("footerBg", footer?.footerBg);
		axios
			.post(
				`https://backend.atlbha.com/api/Store/themeFooterUpdate`,
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
					toast.error(res?.data?.message?.ar, {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.footerBorder?.[0], {
						theme: "light",
					});
					toast.error(res?.data?.message?.en?.footerBg?.[0], {
						theme: "light",
					});
				}
			});
	};

	const resetPrimaryColor = () => {
		setPrimaryBg("#1dbbbe");
	};

	const resetSecondaryColor = () => {
		setSecondaryBg("#02466a");
	};

	const resetFontColor = () => {
		setFontColor("#3d464d");
	};

	const resetHeaderColor = () => {
		setHeaderBg("#1dbbbe");
	};

	const resetLayoutColor = () => {
		setLayoutBg("#ffffff");
	};

	const resetIconsColor = () => {
		setIconsBg("#1dbbbe");
	};

	const resetFooterColor = () => {
		setFooter({ ...footer, footerBorder: "#ebebeb", footerBg: "#ffffff" });
	};

	const ClickIcon = ({ fill }) => {
		return (
			<svg
				id='click'
				xmlns='http://www.w3.org/2000/svg'
				width='24'
				height='24'
				viewBox='0 0 24 24'>
				<rect
					id='Rectangle_140'
					data-name='Rectangle 140'
					width='24'
					height='24'
					fill='rgba(255,255,255,0)'
				/>
				<g id='Page-1' transform='translate(1 4)'>
					<g id='icon-27-one-finger-click' transform='translate(5)'>
						<path
							id='one-finger-click'
							d='M9.474,0V2.2h.551V0ZM13,1.419,11.288,2.805l.347.428,1.712-1.386L13,1.419Zm1.1,3.709-2.146-.5-.124.537,2.146.5.124-.537Zm-8.586.537,2.146-.5-.124-.537-2.146.5.124.537Zm.634-3.818L7.864,3.233l.347-.428L6.5,1.419l-.347.428Zm6.9,15.225a4.213,4.213,0,0,0,4.131-4.13h0v-3.3a.826.826,0,1,0-1.652,0v.274h-.551V8.54a.826.826,0,1,0-1.652,0v.823h-.551V7.989a.826.826,0,1,0-1.652,0V9.913h-.551V4.133a.826.826,0,1,0-1.652,0v6.22C7.79,9.142,6.3,7.809,5.686,8.424s.944,2.261,3.1,5.886c.971,1.633,2.2,2.763,4.269,2.763Zm4.682-4.13a4.681,4.681,0,0,1-4.681,4.681,5.313,5.313,0,0,1-4.769-3.069c-1.8-3.274-4.1-5.422-3-6.516.783-.783,2.012-.032,3.089.975h0V4.135a1.377,1.377,0,1,1,2.754,0V6.883a1.379,1.379,0,0,1,2.118.622,1.376,1.376,0,0,1,2.288,1.03v.007a1.379,1.379,0,0,1,2.2,1.1v3.3Z'
							transform='translate(-5)'
							fill={fill}
							fill-rule='evenodd'
						/>
					</g>
				</g>
			</svg>
		);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | هوية المتجر</title>
			</Helmet>
			<section className='paint-store-page'>
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
									هوية المتجر
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
						<Accordion
							expanded={expanded === "panel1"}
							onChange={handleChange("panel1")}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel1bh-content'
								id='panel1bh-header'>
								<Caaard />
								<h6>اللون الأساسي</h6>
								<p>(يمكنك تغيير اللون الأساسي للقالب)</p>
							</AccordionSummary>
							<AccordionDetails>
								<div className='content mb-2'>
									<div className='text'>
										<Caaard />
										<span>اللون الأساسي</span>
									</div>
									<label
										htmlFor='primary-bg'
										className='picker-bg'
										style={{
											backgroundColor: primaryBg,
											borderColor: primaryBg ? primaryBg : "#000000",
										}}>
										<label htmlFor='primary-bg-picker'>
											<ClickIcon
												fill={
													primaryBg
														? primaryBg !== "#ffffff"
															? "#ffffff"
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='primary-bg-picker'
												type='color'
												value={primaryBg}
												onChange={(e) => setPrimaryBg(e.target.value)}
											/>
										</label>
										<input
											style={{
												color: primaryBg
													? primaryBg !== "#ffffff"
														? "#ffffff"
														: "#000000"
													: "#000000",
											}}
											id='primary-bg'
											type='text'
											value={primaryBg}
											onChange={(e) =>
												setPrimaryBg(
													e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7)
												)
											}
										/>
									</label>
								</div>
								<button
									className='reset'
									type='button'
									onClick={resetPrimaryColor}>
									اعادة اللون الإفتراضي
								</button>
								<button type='button' onClick={handlePrimaryUpdate}>
									حـفـظ
								</button>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={expanded === "panel2"}
							onChange={handleChange("panel2")}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel2bh-content'
								id='panel2bh-header'>
								<Category />
								<h6>اللون الفرعي</h6>
								<p>(يمكنك تغيير اللون الفرعي للقالب)</p>
							</AccordionSummary>
							<AccordionDetails>
								<div className='content mb-2'>
									<div className='text'>
										<Category />
										<span>اللون الفرعي</span>
									</div>
									<label
										htmlFor='secondary-bg'
										className='picker-bg'
										style={{
											backgroundColor: secondaryBg,
											borderColor: secondaryBg ? secondaryBg : "#000000",
										}}>
										<label htmlFor='secondary-bg-picker'>
											<ClickIcon
												fill={
													secondaryBg
														? secondaryBg !== "#ffffff"
															? "#ffffff"
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='secondary-bg-picker'
												type='color'
												value={secondaryBg}
												onChange={(e) => setSecondaryBg(e.target.value)}
											/>
										</label>
										<input
											style={{
												color: secondaryBg
													? secondaryBg !== "#ffffff"
														? "#ffffff"
														: "#000000"
													: "#000000",
											}}
											id='secondary-bg'
											type='text'
											value={secondaryBg}
											onChange={(e) =>
												setSecondaryBg(
													e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7)
												)
											}
										/>
									</label>
								</div>
								<button
									className='reset'
									type='button'
									onClick={resetSecondaryColor}>
									اعادة اللون الإفتراضي
								</button>
								<button type='button' onClick={handleSecondaryUpdate}>
									حـفـظ
								</button>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={expanded === "panel7"}
							onChange={handleChange("panel7")}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel7bh-content'
								id='panel7bh-header'>
								<FontDownloadOutlinedIcon fontSize='1.3rem' />
								<h6>لون الخط</h6>
								<p>(يمكنك تغيير لون الخط في القالب)</p>
							</AccordionSummary>
							<AccordionDetails>
								<div className='content mb-2'>
									<div className='text'>
										<FontDownloadOutlinedIcon fontSize='1.3rem' />
										<span>لون الخط</span>
									</div>
									<label
										htmlFor='font-color'
										className='picker-bg'
										style={{
											backgroundColor: fontColor,
											borderColor: fontColor ? fontColor : "#000000",
										}}>
										<label htmlFor='font-color-picker'>
											<ClickIcon
												fill={
													fontColor
														? fontColor !== "#ffffff"
															? "#ffffff"
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='font-color-picker'
												type='color'
												value={fontColor}
												onChange={(e) => setFontColor(e.target.value)}
											/>
										</label>
										<input
											style={{
												color: fontColor
													? fontColor !== "#ffffff"
														? "#ffffff"
														: "#000000"
													: "#000000",
											}}
											id='font-color'
											type='text'
											value={fontColor}
											onChange={(e) =>
												setFontColor(
													e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7)
												)
											}
										/>
									</label>
								</div>
								<button
									className='reset'
									type='button'
									onClick={resetFontColor}>
									اعادة اللون الإفتراضي
								</button>
								<button type='button' onClick={handleFontColorUpdate}>
									حـفـظ
								</button>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={expanded === "panel3"}
							onChange={handleChange("panel3")}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel3bh-content'
								id='panel3bh-header'>
								<Menuu />
								<h6>خلفية الهيدر</h6>
								<p>
									(يمكنك تغيير لون خلفية الهيدر أو القائمة العلوية التي يوجد بها
									أسماء صفحات متجرك)
								</p>
							</AccordionSummary>
							<AccordionDetails>
								<div className='content mb-2'>
									<div className='text'>
										<Menuu />
										<span>خلفية الهيدر</span>
									</div>
									<label
										htmlFor='menu-bg'
										className='picker-bg'
										style={{
											backgroundColor: headerBg,
											borderColor: headerBg ? headerBg : "#000000",
										}}>
										<label htmlFor='menu-bg-picker'>
											<ClickIcon
												fill={
													headerBg
														? headerBg !== "#ffffff"
															? "#ffffff"
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='menu-bg-picker'
												type='color'
												value={headerBg}
												onChange={(e) => setHeaderBg(e.target.value)}
											/>
										</label>
										<input
											style={{
												color: headerBg
													? headerBg !== "#ffffff"
														? "#ffffff"
														: "#000000"
													: "#000000",
											}}
											id='menu-bg'
											type='text'
											value={headerBg}
											onChange={(e) =>
												setHeaderBg(
													e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7)
												)
											}
										/>
									</label>
								</div>
								<button
									className='reset'
									type='button'
									onClick={resetHeaderColor}>
									اعادة اللون الإفتراضي
								</button>
								<button type='button' onClick={handleHeaderUpdate}>
									حـفـظ
								</button>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={expanded === "panel4"}
							onChange={handleChange("panel4")}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel4bh-content'
								id='panel4bh-header'>
								<Background />
								<h6>الخلفية</h6>
								<p>(يمكنك تغيير لون الخلفية على جميع واجهات متجرك)</p>
							</AccordionSummary>
							<AccordionDetails>
								<div className='content mb-2'>
									<div className='text'>
										<Background />
										<span>لون الخلفية</span>
									</div>
									<label
										htmlFor='layout-bg'
										className='picker-bg'
										style={{
											backgroundColor: layoutBg,
											borderColor: layoutBg ? layoutBg : "#000000",
										}}>
										<label htmlFor='layout-bg-picker'>
											<ClickIcon
												fill={
													layoutBg
														? layoutBg !== "#ffffff"
															? "#ffffff"
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='layout-bg-picker'
												type='color'
												value={layoutBg}
												onChange={(e) => setLayoutBg(e.target.value)}
											/>
										</label>
										<input
											style={{
												color: layoutBg
													? layoutBg !== "#ffffff"
														? "#ffffff"
														: "#000000"
													: "#000000",
											}}
											id='layout-bg'
											type='text'
											value={layoutBg}
											onChange={(e) =>
												setLayoutBg(
													e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7)
												)
											}
										/>
									</label>
								</div>
								<button
									className='reset'
									type='button'
									onClick={resetLayoutColor}>
									اعادة اللون الإفتراضي
								</button>
								<button type='button' onClick={handleLayotUpdate}>
									حـفـظ
								</button>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={expanded === "panel5"}
							onChange={handleChange("panel5")}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel5bh-content'
								id='panel5bh-header'>
								<Icons />
								<h6>الأيقونات</h6>
								<p>(يمكنك تغيير لون جميع الأيقونات الموجودة في متجرك)</p>
							</AccordionSummary>
							<AccordionDetails>
								<div className='content mb-2'>
									<div className='text'>
										<Icons />
										<span>لون الأيقونات</span>
									</div>
									<label
										htmlFor='icons-bg'
										className='picker-bg'
										style={{
											backgroundColor: iconsBg,
											borderColor: iconsBg ? iconsBg : "#000000",
										}}>
										<label htmlFor='icons-bg-picker'>
											<ClickIcon
												fill={
													iconsBg
														? iconsBg !== "#ffffff"
															? "#ffffff"
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='icons-bg-picker'
												type='color'
												value={iconsBg}
												onChange={(e) => setIconsBg(e.target.value)}
											/>
										</label>
										<input
											style={{
												color: iconsBg
													? iconsBg !== "#ffffff"
														? "#ffffff"
														: "#000000"
													: "#000000",
											}}
											id='icons-bg'
											type='text'
											value={iconsBg}
											onChange={(e) =>
												setIconsBg(
													e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7)
												)
											}
										/>
									</label>
								</div>
								<button
									className='reset'
									type='button'
									onClick={resetIconsColor}>
									اعادة اللون الإفتراضي
								</button>
								<button type='button' onClick={handleIconUpdate}>
									حـفـظ
								</button>
							</AccordionDetails>
						</Accordion>
						<Accordion
							expanded={expanded === "panel6"}
							onChange={handleChange("panel6")}>
							<AccordionSummary
								expandIcon={<ExpandMoreIcon />}
								aria-controls='panel6bh-content'
								id='panel6bh-header'>
								<Footer />
								<h6>القائمة السفلية Footer</h6>
								<p>(يمكنك تغيير لون المربع الموجود في أسفل متجرك)</p>
							</AccordionSummary>
							<AccordionDetails>
								<div className='content mb-4'>
									<div className='text'>
										<Border />
										<span>لون الإطار</span>
									</div>
									<label
										htmlFor='footer-border'
										className='picker'
										style={{
											borderColor: footer.footerBorder
												? footer.footerBorder
												: "#000000",
										}}>
										<label htmlFor='footer-border-picker'>
											<ClickIcon
												fill={
													footer.footerBorder
														? footer.footerBorder !== "#ffffff"
															? footer.footerBorder
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='footer-border-picker'
												type='color'
												value={footer.footerBorder}
												onChange={(e) =>
													setFooter({ ...footer, footerBorder: e.target.value })
												}
											/>
										</label>
										<input
											style={{
												color: footer.footerBorder
													? footer.footerBorder !== "#ffffff"
														? footer.footerBorder
														: "#000000"
													: "#000000",
											}}
											id='footer-border'
											type='text'
											value={footer.footerBorder}
											onChange={(e) =>
												setFooter({
													...footer,
													footerBorder: e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7),
												})
											}
										/>
									</label>
								</div>
								<div className='content mb-2'>
									<div className='text'>
										<Border01 />
										<span>لون المربع</span>
									</div>
									<label
										htmlFor='footer-bg'
										className='picker-bg'
										style={{
											backgroundColor: footer.footerBg,
											borderColor: footer.footerBg
												? footer.footerBg
												: "#000000",
										}}>
										<label htmlFor='footer-bg-picker'>
											<ClickIcon
												fill={
													footer.footerBg
														? footer.footerBg !== "#ffffff"
															? "#ffffff"
															: "#000000"
														: "#000000"
												}
											/>
											<input
												id='footer-bg-picker'
												type='color'
												value={footer.footerBg}
												onChange={(e) =>
													setFooter({ ...footer, footerBg: e.target.value })
												}
											/>
										</label>
										<input
											style={{
												color: footer.footerBg
													? footer.footerBg !== "#ffffff"
														? "#ffffff"
														: "#000000"
													: "#000000",
											}}
											id='footer-bg'
											type='text'
											value={footer.footerBg}
											onChange={(e) =>
												setFooter({
													...footer,
													footerBg: e.target.value
														.replace(/[^#A-Fa-f0-9]/g, "")
														.slice(0, 7),
												})
											}
										/>
									</label>
								</div>
								<button
									className='reset'
									type='button'
									onClick={resetFooterColor}>
									اعادة اللون الإفتراضي
								</button>
								<button type='button' onClick={handleFooterUpdate}>
									حـفـظ
								</button>
							</AccordionDetails>
						</Accordion>
					</div>
				)}
			</section>
		</>
	);
};

export default PaintStore;
