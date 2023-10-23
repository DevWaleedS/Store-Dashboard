import React, { useContext } from "react";

// Use Sidebar Pro to create sidebar
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

// use Nav lINKS
import { NavLink, Link } from "react-router-dom";

// Icons
import { ReactComponent as Eye } from "../data/Icons/icon-24-invisible.svg";
import { ReactComponent as HomeImage } from "../data/Icons/icon-24-dashboard.svg";
import { ReactComponent as Category } from "../data/Icons/icon-24-Category.svg";
import { ReactComponent as Products } from "../data/Icons/product-24.svg";
import { ReactComponent as Orders } from "../data/Icons/icon-24-order.svg";
import { ReactComponent as Marketing } from "../data/Icons/icon-24-marketing.svg";

import { ReactComponent as Rating } from "../data/Icons/icon-24-ratings.svg";
import { ReactComponent as PagesIcon } from "../data/Icons/icon-24-pages.svg";
import { ReactComponent as Academy } from "../data/Icons/icon-24-graduatioin.svg";

import { ReactComponent as Template } from "../data/Icons/icon-24-template.svg";
import { ReactComponent as Layout } from "../data/Icons/layout.svg";
import { ReactComponent as Paint } from "../data/Icons/Paint.svg";
import { ReactComponent as Info } from "../data/Icons/icon-24-info.svg";
import { ReactComponent as Social } from "../data/Icons/icon-24-social.svg";
import { ReactComponent as Support } from "../data/Icons/icon-24-support.svg";
import { ReactComponent as Setting } from "../data/Icons/icon-24-setting.svg";
// import { ReactComponent as Clients } from "../data/Icons/icon-24-client.svg";
import { ReactComponent as Reports } from "../data/Icons/icon-24-report.svg";
import { ReactComponent as Services } from "../data/Icons/service.svg";
import { ReactComponent as Discoint } from "../data/Icons/icon-24-discount.svg";
import { ReactComponent as Shoping } from "../data/Icons/icon-24-design store.svg";
import { ReactComponent as Delevray } from "../data/Icons/icon-24-delivery.svg";
// import { ReactComponent as Offer } from "../data/Icons/icon-24-offer.svg";
import { ReactComponent as Payment } from "../data/Icons/icon-24-payment Getway.svg";
import { ReactComponent as Verification } from "../data/Icons/icon-24-Verification.svg";
import { ReactComponent as BsCart } from "../data/Icons/icon-24-shopping_cart.svg";

import { ReactComponent as Evaluation } from "../data/Icons/evaluation.svg";

import { FaCircle } from "react-icons/fa";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { openMaintenanceModeModal } from "../store/slices/MaintenanceModeModal";
import { openVerifyModal } from "../store/slices/VerifyStoreModal-slice";
import useFetch from "../Hooks/UseFetch";
import Context from "../Context/context";

const SideBar = ({ open, closeSidebar }) => {
	const dispatch = useDispatch(false);
	const dispatchVerifyModal = useDispatch(false);
	const { verificationStoreStatus } = useSelector((state) => state.VerifyModal);

	// To change z-index of navbar when maintain mode is open
	const Z_index = useContext(Context);
	const { setNavbarZindex } = Z_index;

	/**
	 * to set the domain name of store to local storage
	 *To show the store info that come from api
	-------------------------------------------------------------------------------------------
	 */

	const { fetchedData } = useFetch(
		"https://backend.atlbha.com/api/Store/setting_store_show"
	);
	localStorage.setItem("domain", fetchedData?.data?.setting_store?.domain);
	const domain = localStorage.getItem("domain");

	return (
		<Sidebar
			rtl={true}
			className={`sidebar ${open ? "show" : ""}`}
			style={{ height: "100%" }}>
			<Menu>
				{verificationStoreStatus === "تم التوثيق" ? (
					<a
						className='menu-link'
						href={`https://template.atlbha.com/${domain}`}
						target='_blank'
						rel='noreferrer'>
						<MenuItem>
							<Eye />
							<span className='me-2'>عرض المتجر</span>
						</MenuItem>
					</a>
				) : (
					<NavLink
						style={{ pointerEvents: "none" }}
						className='menu-link'
						to='Home'>
						<MenuItem>
							<Eye />
							<span className='me-2'>عرض المتجر</span>
						</MenuItem>
					</NavLink>
				)}
				<NavLink className='menu-link' to='' onClick={() => closeSidebar()}>
					<MenuItem>
						<HomeImage />
						<span className='me-2'>الرئيسية </span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Category'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Category />
						<span className='me-2'> النشاطات و التصنيفات</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Products'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Products />
						<span className='me-2'> المنتجات</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Orders'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Orders />
						<span className='me-2'>الطلبات </span>
					</MenuItem>
				</NavLink>
				{/** Markting Sub menu */}
				<SubMenu label='التسويق' icon={<Marketing />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='Coupon'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<Discoint />
							<span className='me-2'> الكوبونات</span>
						</MenuItem>
					</NavLink>
					{/**
<NavLink className='sub-menu-link' to='Offers' onClick={() => closeSidebar()}>
						<MenuItem>
							<Offer />
							<span className='me-2'> العروض الخاصة</span>
						</MenuItem>
					</NavLink>
*/}

					<NavLink
						className='sub-menu-link'
						to='Carts'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<BsCart />
							<span className='me-2'> السلات المتروكة</span>
						</MenuItem>
					</NavLink>

					<Link
						as='li'
						className='sub-menu-link'
						onClick={() => {
							// dispatch(OpenCelebrityMarketingModal());
						}}>
						<MenuItem>
							<Shoping />
							<span className='me-2'>التسويق عبر المشاهير</span>
						</MenuItem>
					</Link>
					<NavLink
						className='sub-menu-link'
						to='PostalSubscriptions'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<MarkEmailReadIcon style={{ fontSize: "24px" }} />
							<span className='me-2'>الاشتراكات البريدية</span>
						</MenuItem>
					</NavLink>
					<NavLink
						className='sub-menu-link'
						to='SEOStore'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> SEO المتجر </span>
						</MenuItem>
					</NavLink>
					{/*<NavLink
						className='sub-menu-link disabled-menu-link'
						to='MarketingCampaign'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<MarketingCampain />
							<span className='me-2'>الحملة التسويقية</span>
						</MenuItem>
					</NavLink>*/}
				</SubMenu>
				<NavLink
					className='menu-link'
					to='Rating'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Rating className='rating-icon' />
						<span className='me-2'>التقييمات </span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Pages'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<PagesIcon />
						<span className='me-2'> الصفحات</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Academy'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Academy />
						<span className='me-2'> الأكاديمية</span>
					</MenuItem>
				</NavLink>
				<SubMenu label='القالب' icon={<Template />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='Template'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<Layout />
							<span className='me-2'>تنسيق القالب</span>
						</MenuItem>
					</NavLink>
					<NavLink
						className='sub-menu-link'
						to='PaintStore'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<Paint />
							<span className='me-2'>هوية المتجر</span>
						</MenuItem>
					</NavLink>
				</SubMenu>
				{/** Store Sub menu */}
				<SubMenu label='بيانات المتجر' icon={<Info />} as='li'>
					<Link
						as='li'
						className='sub-menu-link'
						onClick={() => {
							closeSidebar();
							dispatchVerifyModal(openVerifyModal());
						}}>
						<MenuItem>
							<Verification />
							<span className='me-2'>توثيق المتجر</span>
						</MenuItem>
					</Link>

					<NavLink
						className='sub-menu-link'
						to='SocialPages'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<Social />
							<span className='me-2'> صفحات التواصل</span>
						</MenuItem>
					</NavLink>

					{/*<NavLink
						className='sub-menu-link'
						to='PackageUpgrade'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<SlRocket />
							<span className='me-2'> ترقية الباقة</span>
						</MenuItem>
					</NavLink>*/}

					{/*<NavLink
						className='sub-menu-link disabled-menu-link'
						to='BranchesAndWarehouses'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<BranchesAndWarehouses />
							<span className='me-2'>الفروع والمستودعات </span>
						</MenuItem>
					</NavLink>*/}
					{/*<NavLink
						className='sub-menu-link disabled-menu-link'
						to='BranchesAndWarehouses'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> المحفظة والفواتير </span>
						</MenuItem>
					</NavLink>*/}
					{/*<NavLink
						className='sub-menu-link disabled-menu-link'
						to='BranchesAndWarehouses'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> نشاط المتجر </span>
						</MenuItem>
					</NavLink>*/}
					{/*<NavLink
						className='sub-menu-link disabled-menu-link'
						to='BranchesAndWarehouses'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> خيارات المتجر </span>
						</MenuItem>
					</NavLink>*/}
				</SubMenu>
				<NavLink
					className='menu-link'
					to='Support'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Support />
						<span className='me-2'> الدعم الفني</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='ShippingCompanies'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Delevray />
						<span className='me-2'> شركات الشحن</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='PaymentGetways'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Payment />
						<span className='me-2'> بوابات الدفع</span>
					</MenuItem>
				</NavLink>
				{/** Setting Sub menu */}
				<SubMenu label=' الاعدادات' icon={<Setting />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='MainInformation'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> بيانات المتجر الاساسية</span>
						</MenuItem>
					</NavLink>
					<Link
						as='li'
						className='sub-menu-link'
						onClick={() => {
							setNavbarZindex(true);
							dispatch(openMaintenanceModeModal());
						}}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'>وضع الصيانة</span>
						</MenuItem>
					</Link>
					<NavLink
						className='sub-menu-link'
						to='Management'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> الإدارة و المستخدمين </span>
						</MenuItem>
					</NavLink>
					<NavLink
						className='sub-menu-link'
						to='Notifications'
						onClick={() => closeSidebar()}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> الإشعارات </span>
						</MenuItem>
					</NavLink>
				</SubMenu>
				<NavLink
					className='menu-link'
					to='PlatformServices'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Services />
						<span className='me-2'> خدمات المنصة</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Report'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Reports />
						<span className='me-2'> التقارير</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='EvaluationThePlatform'
					onClick={() => closeSidebar()}>
					<MenuItem>
						<Evaluation />
						<span className='me-2'> تقييم المنصة</span>
					</MenuItem>
				</NavLink>
			</Menu>
		</Sidebar>
	);
};

export default SideBar;
