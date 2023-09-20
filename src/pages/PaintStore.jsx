import React, { useState, useEffect, useContext } from "react";
import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import useFetch from "../Hooks/UseFetch";
import axios from "axios";
import Context from "../Context/context";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { LoadingContext } from "../Context/LoadingProvider";
import CircularLoading from "../HelperComponents/CircularLoading";

// import images
import howIcon from "../data/Icons/icon_24_home.svg";
import { ReactComponent as SearchIcon } from '../data/Icons/icon_24_search.svg';
import { ReactComponent as Category } from '../data/Icons/icon-24-Category.svg';
import { ReactComponent as Menuu } from '../data/Icons/menuu.svg';
import { ReactComponent as Background } from '../data/Icons/background.svg';
import { ReactComponent as Icons } from '../data/Icons/icons.svg';
import { ReactComponent as Caaard } from '../data/Icons/caaard.svg';
import { ReactComponent as Filter } from '../data/Icons/icon-24-filter.svg';
import { ReactComponent as Buttons } from '../data/Icons/button.svg';
import { ReactComponent as Footer } from '../data/Icons/footer.svg';
import { ReactComponent as Border } from '../data/Icons/border.svg';
import { ReactComponent as Border01 } from '../data/Icons/border01.svg';

const PaintStore = () => {
	const { fetchedData, loading, reload, setReload } = useFetch(
		`https://backend.atlbha.com/api/Store/theme`
	);
	const [cookies] = useCookies(["access_token"]);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { setLoadingTitle } = LoadingStore;
	const [expanded, setExpanded] = useState(false);
	const handleChange = (panel) => (event, isExpanded) => {
		setExpanded(isExpanded ? panel : false);
	};

	const [search, setSearch] = useState({
		searchBorder: "#e5e5e5",
		searchBg: "#ffffff",
	});
	const [categoriesBg, setCategoriesBg] = useState("#02466a");
	const [menuBg, setMenuBg] = useState("#1dbbbe");
	const [layoutBg, setLayoutBg] = useState("#ffffff");
	const [iconsBg, setIconsBg] = useState("#1dbbbe");
	const [product, setProduct] = useState({
		productBorder: "#ededed",
		productBg: "#ffffff",
	});
	const [filters, setFilters] = useState({
		filtersBorder: "#f0f0f0",
		filtersBg: "#ffffff",
	});
	const [buttons, setButtons] = useState({
		mainButtonBg: "#1dbbbe",
		mainButtonBorder: "#1dbbbe",
		subButtonBg: "#02466a",
		subButtonBorder: "#02466a",
	})
	const [footer, setFooter] = useState({
		footerBorder: "#ebebeb",
		footerBg: "#ffffff",
	});

	useEffect(() => {
		if (fetchedData?.data?.Theme) {
			setSearch({ ...search, searchBorder: fetchedData?.data?.Theme?.searchBorder, searchBg: fetchedData?.data?.Theme?.searchBg });
			setCategoriesBg(fetchedData?.data?.Theme?.categoriesBg);
			setMenuBg(fetchedData?.data?.Theme?.menuBg);
			setLayoutBg(fetchedData?.data?.Theme?.layoutBg);
			setIconsBg(fetchedData?.data?.Theme?.iconsBg);
			setProduct({ ...search, productBorder: fetchedData?.data?.Theme?.productBorder, productBg: fetchedData?.data?.Theme?.productBg });
			setFilters({ ...search, filtersBorder: fetchedData?.data?.Theme?.filtersBorder, filtersBg: fetchedData?.data?.Theme?.filtersBg });
			setButtons({ ...search, mainButtonBg: fetchedData?.data?.Theme?.mainButtonBg, mainButtonBorder: fetchedData?.data?.Theme?.mainButtonBorder, subButtonBorder: fetchedData?.data?.Theme?.subButtonBorder, subButtonBg: fetchedData?.data?.Theme?.subButtonBg });
			setFooter({ ...footer, footerBorder: fetchedData?.data?.Theme?.footerBorder, footerBg: fetchedData?.data?.Theme?.footerBg });
		}
	}, [fetchedData?.data?.Theme]);

	const handleSearchUpdate = () => {
		setLoadingTitle("جاري تعديل مربع البحث");
		let formData = new FormData();
		formData.append("searchBorder", search?.searchBorder);
		formData.append("searchBg", search?.searchBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeSearchUpdate`, formData, {
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
				}
			});
	};

	const handleCategoriesUpdate = () => {
		setLoadingTitle("جاري تعديل التصنيفات");
		let formData = new FormData();
		formData.append("categoriesBg", categoriesBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeCategoriesUpdate`, formData, {
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
				}
			});
	};

	const handleMenuUpdate = () => {
		setLoadingTitle("جاري تعديل القائمة العلوية");
		let formData = new FormData();
		formData.append("menuBg", menuBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeMenuUpdate`, formData, {
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
				}
			});
	};

	const handleLayotUpdate = () => {
		setLoadingTitle("جاري تعديل الخلفية");
		let formData = new FormData();
		formData.append("layoutBg", layoutBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeLayoutUpdate`, formData, {
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
				}
			});
	};

	const handleProductUpdate = () => {
		setLoadingTitle("جاري تعديل مربع المنتج");
		let formData = new FormData();
		formData.append("productBorder", product?.productBorder);
		formData.append("productBg", product?.productBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeProductUpdate`, formData, {
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
				}
			});
	};

	const handleFiltersUpdate = () => {
		setLoadingTitle("جاري تعديل الفرز والفلترة");
		let formData = new FormData();
		formData.append("filtersBorder", filters?.filtersBorder);
		formData.append("filtersBg", filters?.filtersBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeFilterUpdate`, formData, {
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
				}
			});
	};

	const handleButtonsUpdate = () => {
		setLoadingTitle("جاري تعديل الأزرار");
		let formData = new FormData();
		formData.append("mainButtonBorder", buttons?.mainButtonBorder);
		formData.append("mainButtonBg", buttons?.mainButtonBg);
		formData.append("subButtonBorder", buttons?.subButtonBorder);
		formData.append("subButtonBg", buttons?.subButtonBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeMainUpdate`, formData, {
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
				}
			});
	};

	const handleFooterUpdate = () => {
		setLoadingTitle("جاري تعديل القائمة السفلية ");
		let formData = new FormData();
		formData.append("footerBorder", footer?.footerBorder);
		formData.append("footerBg", footer?.footerBg);
		axios
			.post(`https://backend.atlbha.com/api/Store/themeFooterUpdate`, formData, {
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
				}
			});
	};

	const ClickIcon = ({fill}) => {
		return (
			<svg id="click" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
				<rect id="Rectangle_140" data-name="Rectangle 140" width="24" height="24" fill="rgba(255,255,255,0)" />
				<g id="Page-1" transform="translate(1 4)">
					<g id="icon-27-one-finger-click" transform="translate(5)">
						<path id="one-finger-click" d="M9.474,0V2.2h.551V0ZM13,1.419,11.288,2.805l.347.428,1.712-1.386L13,1.419Zm1.1,3.709-2.146-.5-.124.537,2.146.5.124-.537Zm-8.586.537,2.146-.5-.124-.537-2.146.5.124.537Zm.634-3.818L7.864,3.233l.347-.428L6.5,1.419l-.347.428Zm6.9,15.225a4.213,4.213,0,0,0,4.131-4.13h0v-3.3a.826.826,0,1,0-1.652,0v.274h-.551V8.54a.826.826,0,1,0-1.652,0v.823h-.551V7.989a.826.826,0,1,0-1.652,0V9.913h-.551V4.133a.826.826,0,1,0-1.652,0v6.22C7.79,9.142,6.3,7.809,5.686,8.424s.944,2.261,3.1,5.886c.971,1.633,2.2,2.763,4.269,2.763Zm4.682-4.13a4.681,4.681,0,0,1-4.681,4.681,5.313,5.313,0,0,1-4.769-3.069c-1.8-3.274-4.1-5.422-3-6.516.783-.783,2.012-.032,3.089.975h0V4.135a1.377,1.377,0,1,1,2.754,0V6.883a1.379,1.379,0,0,1,2.118.622,1.376,1.376,0,0,1,2.288,1.03v.007a1.379,1.379,0,0,1,2.2,1.1v3.3Z" transform="translate(-5)" fill={fill} fill-rule="evenodd" />
					</g>
				</g>
			</svg>

		)
	}

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
									<img src={howIcon} alt='' />
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
				{
					loading ?
						<div className="data-container">
							<CircularLoading />
						</div>
						:
						<div className="data-container">
							<Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel1bh-content"
									id="panel1bh-header"
								>
									<SearchIcon className="icon" />
									<h6>مربع البحث</h6>
									<p>(يمكنك تغيير لون مربع البحث الموجود في أعلى الصفحة)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-4">
										<div className="text">
											<Border />
											<span>لون الإطار</span>
										</div>
										<label htmlFor="search-border" className="picker" style={{ borderColor: search.searchBorder ? search.searchBorder : '#000000' }}>
											<label htmlFor="search-border-picker">
												<ClickIcon fill={search.searchBorder ? search.searchBorder !== '#ffffff' ? search.searchBorder : '#000000' : '#000000'}/>
												<input id="search-border-picker" type="color" value={search.searchBorder} onChange={(e) => setSearch({ ...search, searchBorder: e.target.value })} />
											</label>
											<input style={{ color: search.searchBorder ? search.searchBorder !== '#ffffff' ? search.searchBorder : '#000000' : '#000000' }} id="search-border" type="text" value={search.searchBorder} onChange={(e) => setSearch({ ...search, searchBorder: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<div className="content mb-2">
										<div className="text">
											<Border01 />
											<span>لون المربع</span>
										</div>
										<label htmlFor="search-bg" className="picker-bg" style={{ backgroundColor: search.searchBg, borderColor: search.searchBg ? search.searchBg : '#000000' }}>
											<label htmlFor="search-bg-picker">
												<ClickIcon fill={search.searchBg ? search.searchBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="search-bg-picker" type="color" value={search.searchBg} onChange={(e) => setSearch({ ...search, searchBg: e.target.value })} />
											</label>
											<input style={{ color: search.searchBg ? search.searchBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="search-bg" type="text" value={search.searchBg} onChange={(e) => setSearch({ ...search, searchBg: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<button type="button" onClick={handleSearchUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel2bh-content"
									id="panel2bh-header"
								>
									<Category />
									<h6>مربع التصنيفات</h6>
									<p>(يمكنك تغيير لون مربع التصنيفات الموجود في أعلى الصفحة)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-2">
										<div className="text">
											<Category />
											<span>لون مربع التصنيفات</span>
										</div>
										<label htmlFor="categories-bg" className="picker-bg" style={{ backgroundColor: categoriesBg, borderColor: categoriesBg ? categoriesBg : '#000000' }}>
											<label htmlFor="categories-bg-picker">
												<ClickIcon fill={categoriesBg ? categoriesBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="categories-bg-picker" type="color" value={categoriesBg} onChange={(e) => setCategoriesBg(e.target.value)} />
											</label>
											<input style={{ color: categoriesBg ? categoriesBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="categories-bg" type="text" value={categoriesBg} onChange={(e) => setCategoriesBg(e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7))} />
										</label>
									</div>
									<button type="button" onClick={handleCategoriesUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel3bh-content"
									id="panel3bh-header"
								>
									<Menuu />
									<h6>القائمة العلوية</h6>
									<p>(يمكنك تغيير لون خلفية القائمة العلوية التي يوجد بها أسماء صفحات متجرك)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-2">
										<div className="text">
											<Menuu />
											<span>لون مربع القائمة العلوية</span>
										</div>
										<label htmlFor="menu-bg" className="picker-bg" style={{ backgroundColor: menuBg, borderColor: menuBg ? menuBg : '#000000' }}>
											<label htmlFor="menu-bg-picker">
											<ClickIcon fill={menuBg ? menuBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="menu-bg-picker" type="color" value={menuBg} onChange={(e) => setMenuBg(e.target.value)} />
											</label>
											<input style={{ color: menuBg ? menuBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="menu-bg" type="text" value={menuBg} onChange={(e) => setMenuBg(e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7))} />
										</label>
									</div>
									<button type="button" onClick={handleMenuUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel4'} onChange={handleChange('panel4')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel4bh-content"
									id="panel4bh-header"
								>
									<Background />
									<h6>الخلفية</h6>
									<p>(يمكنك تغيير لون الخلفية على جميع واجهات متجرك)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-2">
										<div className="text">
											<Background />
											<span>لون الخلفية</span>
										</div>
										<label htmlFor="layout-bg" className="picker-bg" style={{ backgroundColor: layoutBg, borderColor: layoutBg ? layoutBg : '#000000' }}>
											<label htmlFor="layout-bg-picker">
											<ClickIcon fill={layoutBg ? layoutBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="layout-bg-picker" type="color" value={layoutBg} onChange={(e) => setLayoutBg(e.target.value)} />
											</label>
											<input style={{ color: layoutBg ? layoutBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="layout-bg" type="text" value={layoutBg} onChange={(e) => setLayoutBg(e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7))} />
										</label>
									</div>
									<button type="button" onClick={handleLayotUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel5'} onChange={handleChange('panel5')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel5bh-content"
									id="panel5bh-header"
								>
									<Icons />
									<h6>الأيقونات</h6>
									<p>(يمكنك تغيير لون جميع الأيقونات الموجودة في متجرك)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-2">
										<div className="text">
											<Icons />
											<span>لون الأيقونات</span>
										</div>
										<label htmlFor="icons-bg" className="picker-bg" style={{ backgroundColor: iconsBg, borderColor: iconsBg ? iconsBg : '#000000' }}>
											<label htmlFor="icons-bg-picker">
											<ClickIcon fill={iconsBg ? iconsBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="icons-bg-picker" type="color" value={iconsBg} onChange={(e) => setIconsBg(e.target.value)} />
											</label>
											<input style={{ color: iconsBg ? iconsBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="icons-bg" type="text" value={iconsBg} onChange={(e) => setIconsBg(e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7))} />
										</label>
									</div>
									<button type="button" onClick={handleIconUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel6'} onChange={handleChange('panel6')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel6bh-content"
									id="panel6bh-header"
								>
									<Caaard />
									<h6>مربع المنتج</h6>
									<p>(يمكنك تغيير لون مربع المنتجات في متجرك)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-4">
										<div className="text">
											<Border />
											<span>لون الإطار</span>
										</div>
										<label htmlFor="product-border" className="picker" style={{ borderColor: product.productBorder ? product.productBorder : '#000000' }}>
											<label htmlFor="product-border-picker">
											<ClickIcon fill={product.productBorder ? product.productBorder !== '#ffffff' ? product.productBorder : '#000000' : '#000000'}/>
												<input id="product-border-picker" type="color" value={product.productBorder} onChange={(e) => setProduct({ ...product, productBorder: e.target.value })} />
											</label>
											<input style={{ color: product.productBorder ? product.productBorder !== '#ffffff' ? product.productBorder : '#000000' : '#000000' }} id="product-border" type="text" value={product.productBorder} onChange={(e) => setProduct({ ...product, productBorder: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<div className="content mb-2">
										<div className="text">
											<Border01 />
											<span>لون المربع</span>
										</div>
										<label htmlFor="product-bg" className="picker-bg" style={{ backgroundColor: product.productBg, borderColor: product.productBg ? product.productBg : '#000000' }}>
											<label htmlFor="product-bg-picker">
											<ClickIcon fill={product.productBg ? product.productBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="product-bg-picker" type="color" value={product.productBg} onChange={(e) => setProduct({ ...product, productBg: e.target.value })} />
											</label>
											<input style={{ color: product.productBg ? product.productBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="product-bg" type="text" value={product.productBg} onChange={(e) => setProduct({ ...product, productBg: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<button type="button" onClick={handleProductUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel7'} onChange={handleChange('panel7')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel7bh-content"
									id="panel7bh-header"
								>
									<Filter className="icon" />
									<h6>الفرز والفلترة</h6>
									<p>(يمكنك تغيير لون القائمة الجانبية الخاصة بالفرز والفلترة)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-4">
										<div className="text">
											<Border />
											<span>لون الإطار</span>
										</div>
										<label htmlFor="filter-border" className="picker" style={{ borderColor: filters.filtersBorder ? filters.filtersBorder : '#000000' }}>
											<label htmlFor="filter-border-picker">
											<ClickIcon fill={filters.filtersBorder ? filters.filtersBorder !== '#ffffff' ? filters.filtersBorder : '#000000' : '#000000'}/>
												<input id="filter-border-picker" type="color" value={filters.filtersBorder} onChange={(e) => setFilters({ ...filters, filtersBorder: e.target.value })} />
											</label>
											<input style={{ color: filters.filtersBorder ? filters.filtersBorder !== '#ffffff' ? filters.filtersBorder : '#000000' : '#000000' }} id="filter-border" type="text" value={filters.filtersBorder} onChange={(e) => setFilters({ ...filters, filtersBorder: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<div className="content mb-2">
										<div className="text">
											<Border01 />
											<span>لون المربع</span>
										</div>
										<label htmlFor="filter-bg" className="picker-bg" style={{ backgroundColor: filters.filtersBg, borderColor: filters.filtersBg ? filters.filtersBg : '#000000' }}>
											<label htmlFor="filter-bg-picker">
											<ClickIcon fill={filters.filtersBg ? filters.filtersBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="filter-bg-picker" type="color" value={filters.filtersBg} onChange={(e) => setFilters({ ...filters, filtersBg: e.target.value })} />
											</label>
											<input style={{ color: filters.filtersBg ? filters.filtersBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="filter-bg" type="text" value={filters.filtersBg} onChange={(e) => setFilters({ ...filters, filtersBg: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<button type="button" onClick={handleFiltersUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel8'} onChange={handleChange('panel8')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel8bh-content"
									id="panel8bh-header"
								>
									<Buttons />
									<h6>الأزرار</h6>
									<p>(يمكنك تغيير لون الأزرار الرئيسية والثانوية)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="d-flex flex-row align-items-center gap-3 flex-wrap">
										<div className="buttons">
											<h6>الأزرار الرئيسية</h6>
											<div className="content mb-4">
												<div className="text">
													<Border />
													<span>لون الإطار</span>
												</div>
												<label htmlFor="filter-border" className="picker" style={{ borderColor: buttons.mainButtonBorder ? buttons.mainButtonBorder : '#000000' }}>
													<label htmlFor="filter-border-picker">
													<ClickIcon fill={buttons.mainButtonBorder ? buttons.mainButtonBorder !== '#ffffff' ? buttons.mainButtonBorder : '#000000' : '#000000'}/>
														<input id="filter-border-picker" type="color" value={buttons.mainButtonBorder} onChange={(e) => setButtons({ ...buttons, mainButtonBorder: e.target.value })} />
													</label>
													<input style={{ color: buttons.mainButtonBorder ? buttons.mainButtonBorder !== '#ffffff' ? buttons.mainButtonBorder : '#000000' : '#000000' }} id="filter-border" type="text" value={buttons.mainButtonBorder} onChange={(e) => setButtons({ ...buttons, mainButtonBorder: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
												</label>
											</div>
											<div className="content mb-4">
												<div className="text">
													<Border01 />
													<span>لون المربع</span>
												</div>
												<label htmlFor="filter-bg" className="picker-bg" style={{ backgroundColor: buttons.mainButtonBg, borderColor: buttons.mainButtonBg ? buttons.mainButtonBg : '#000000' }}>
													<label htmlFor="filter-bg-picker">
													<ClickIcon fill={buttons.mainButtonBg ? buttons.mainButtonBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
														<input id="filter-bg-picker" type="color" value={buttons.mainButtonBg} onChange={(e) => setButtons({ ...buttons, mainButtonBg: e.target.value })} />
													</label>
													<input style={{ color: buttons.mainButtonBg ? buttons.mainButtonBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="filter-bg" type="text" value={buttons.mainButtonBg} onChange={(e) => setButtons({ ...buttons, mainButtonBg: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
												</label>
											</div>
										</div>
										<div className="buttons">
											<h6>الأزرار الثانوية</h6>
											<div className="content mb-4">
												<div className="text">
													<Border />
													<span>لون الإطار</span>
												</div>
												<label htmlFor="filter-border" className="picker" style={{ borderColor: buttons.subButtonBorder ? buttons.subButtonBorder : '#000000' }}>
													<label htmlFor="filter-border-picker">
													<ClickIcon fill={buttons.subButtonBorder ? buttons.subButtonBorder !== '#ffffff' ? buttons.subButtonBorder : '#000000' : '#000000'}/>
														<input id="filter-border-picker" type="color" value={buttons.subButtonBorder} onChange={(e) => setButtons({ ...buttons, subButtonBorder: e.target.value })} />
													</label>
													<input style={{ color: buttons.subButtonBorder ? buttons.subButtonBorder !== '#ffffff' ? buttons.subButtonBorder : '#000000' : '#000000' }} id="filter-border" type="text" value={buttons.subButtonBorder} onChange={(e) => setButtons({ ...buttons, subButtonBorder: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
												</label>
											</div>
											<div className="content mb-4">
												<div className="text">
													<Border01 />
													<span>لون المربع</span>
												</div>
												<label htmlFor="filter-bg" className="picker-bg" style={{ backgroundColor: buttons.subButtonBg, borderColor: buttons.subButtonBg ? buttons.subButtonBg : '#000000' }}>
													<label htmlFor="filter-bg-picker">
													<ClickIcon fill={buttons.subButtonBg ? buttons.subButtonBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
														<input id="filter-bg-picker" type="color" value={buttons.subButtonBg} onChange={(e) => setButtons({ ...buttons, subButtonBg: e.target.value })} />
													</label>
													<input style={{ color: buttons.subButtonBg ? buttons.subButtonBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="filter-bg" type="text" value={buttons.subButtonBg} onChange={(e) => setButtons({ ...buttons, subButtonBg: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
												</label>
											</div>
										</div>
									</div>
									<button type="button" onClick={handleButtonsUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
							<Accordion expanded={expanded === 'panel9'} onChange={handleChange('panel9')}>
								<AccordionSummary
									expandIcon={<ExpandMoreIcon />}
									aria-controls="panel9bh-content"
									id="panel9bh-header"
								>
									<Footer />
									<h6>القائمة السفلية Footer</h6>
									<p>(يمكنك تغيير لون المربع الموجود في أسفل متجرك)</p>
								</AccordionSummary>
								<AccordionDetails>
									<div className="content mb-4">
										<div className="text">
											<Border />
											<span>لون الإطار</span>
										</div>
										<label htmlFor="footer-border" className="picker" style={{ borderColor: footer.footerBorder ? footer.footerBorder : '#000000' }}>
											<label htmlFor="footer-border-picker">
											<ClickIcon fill={footer.footerBorder ? footer.footerBorder !== '#ffffff' ? footer.footerBorder : '#000000' : '#000000'}/>
												<input id="footer-border-picker" type="color" value={footer.footerBorder} onChange={(e) => setFooter({ ...footer, footerBorder: e.target.value })} />
											</label>
											<input style={{ color: footer.footerBorder ? footer.footerBorder !== '#ffffff' ? footer.footerBorder : '#000000' : '#000000' }} id="footer-border" type="text" value={footer.footerBorder} onChange={(e) => setFooter({ ...footer, footerBorder: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<div className="content mb-2">
										<div className="text">
											<Border01 />
											<span>لون المربع</span>
										</div>
										<label htmlFor="footer-bg" className="picker-bg" style={{ backgroundColor: footer.footerBg, borderColor: footer.footerBg ? footer.footerBg : '#000000' }}>
											<label htmlFor="footer-bg-picker">
											<ClickIcon fill={footer.footerBg ? footer.footerBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000'}/>
												<input id="footer-bg-picker" type="color" value={footer.footerBg} onChange={(e) => setFooter({ ...footer, footerBg: e.target.value })} />
											</label>
											<input style={{ color: footer.footerBg ? footer.footerBg !== '#ffffff' ? '#ffffff' : '#000000' : '#000000' }} id="footer-bg" type="text" value={footer.footerBg} onChange={(e) => setFooter({ ...footer, footerBg: e.target.value.replace(/[^#A-Fa-f0-9]/g, "").slice(0, 7) })} />
										</label>
									</div>
									<button type="button" onClick={handleFooterUpdate}>حـفـظ</button>
								</AccordionDetails>
							</Accordion>
						</div>
				}
			</section>
		</>
	);
};

export default PaintStore;
