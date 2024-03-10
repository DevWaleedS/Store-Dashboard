import React, { useContext, useEffect } from "react";

// Use Sidebar Pro to create sidebar
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

// use Nav lINKS
import { NavLink, Link } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { openVerifyModal } from "../store/slices/VerifyStoreModal-slice";
import { openMaintenanceModeModal } from "../store/slices/MaintenanceModeModal";

// Third party
import useFetch from "../Hooks/UseFetch";

// Context
import Context from "../Context/context";

// Icons
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { IoWallet } from "react-icons/io5";
import {
	Academy,
	BsCart,
	Category,
	Delevray,
	Discoint,
	Evaluation,
	Eye,
	HomeImage,
	Info,
	Layout,
	Marketing,
	Orders,
	PagesIcon,
	Paint,
	Payment,
	Products,
	Rating,
	Reports,
	Services,
	Setting,
	Shoping,
	Social,
	Support,
	Template,
	Verification,
} from "../data/Icons";
import { FaCircle, FaUserCheck } from "react-icons/fa";
import { openDelegateRequestAlert } from "../store/slices/DelegateRequestAlert-slice";

const SideBar = ({ open, closeSidebar }) => {
	const dispatch = useDispatch(false);
	const dispatchVerifyModal = useDispatch(false);
	const { verificationStoreStatus } = useSelector((state) => state.VerifyModal);

	// To change z-index of navbar when maintain mode is open
	const Z_index = useContext(Context);
	const { setNavbarZindex, setStoreLogo } = Z_index;

	/**
	 * to set the domain name of store to local storage
	 *To show the store info that come from api
	-------------------------------------------------------------------------------------------
	 */

	const { fetchedData } = useFetch(
		"https://backend.atlbha.com/api/Store/setting_store_show"
	);
	useEffect(() => {
		if (fetchedData) {
			setStoreLogo(fetchedData?.data?.setting_store?.logo);
		}
	}, [fetchedData]);
	localStorage.setItem("domain", fetchedData?.data?.setting_store?.domain);
	localStorage.setItem("storeLogo", fetchedData?.data?.setting_store?.logo);
	const domain = localStorage.getItem("domain");

	return (
		<Sidebar
			rtl={true}
			className={`sidebar ${open ? "show" : ""}`}
			style={{ height: "100%" }}>
			<Menu>
				{verificationStoreStatus === "تم التوثيق" ? (
					<a
						as='li'
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
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Category />
						<span className='me-2'> الأنشطة</span>
					</MenuItem>
				</NavLink>
				<NavLink
					// location.pathname.slice(1)
					to='Products'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Products />
						<span className='me-2'> المنتجات</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Orders'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Orders />
						<span className='me-2'>الطلبات </span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='PlatformServices'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Services />
						<span className='me-2'> خدمات المنصة</span>
					</MenuItem>
				</NavLink>
				{/** Markting Sub menu */}
				<SubMenu label='التسويق' icon={<Marketing />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='Coupon'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
						<MenuItem>
							<Discoint />
							<span className='me-2'> أكواد الخصم</span>
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
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
						<MenuItem>
							<BsCart />
							<span className='me-2'> السلات المتروكة</span>
						</MenuItem>
					</NavLink>

					<a
						as='li'
						href='https://celebrity.sa/'
						target='_blank'
						rel='noreferrer'
						className='sub-menu-link'>
						<MenuItem>
							<Shoping />
							<span className='me-2'>التسويق عبر المشاهير</span>
						</MenuItem>
					</a>
					<NavLink
						className='sub-menu-link'
						to='PostalSubscriptions'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
						<MenuItem>
							<MarkEmailReadIcon style={{ fontSize: "24px" }} />
							<span className='me-2'>الاشتراكات البريدية</span>
						</MenuItem>
					</NavLink>
					<NavLink
						className='sub-menu-link'
						to='SEOStore'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
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
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Rating className='rating-icon' />
						<span className='me-2'>التقييمات </span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Delegate'
					onClick={() => {
						closeSidebar();

						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						} else {
							dispatch(openDelegateRequestAlert());
						}
					}}>
					<MenuItem>
						<FaUserCheck />
						<span className='me-2'>طلب مندوب</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Pages'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<PagesIcon />
						<span className='me-2'> الصفحات</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='Academy'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Academy />
						<span className='me-2'> الأكاديمية</span>
					</MenuItem>
				</NavLink>
				<SubMenu label='القالب' icon={<Template />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='Template'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
						<MenuItem>
							<Layout />
							<span className='me-2'>تنسيق القالب</span>
						</MenuItem>
					</NavLink>
					<NavLink
						className='sub-menu-link'
						to='PaintStore'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
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
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
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
				</SubMenu>
				<NavLink
					className='menu-link'
					to='Support'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Support />
						<span className='me-2'> الدعم الفني</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='ShippingCompanies'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Delevray />
						<span className='me-2'> شركات الشحن</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='PaymentGetways'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Payment />
						<span className='me-2'> بوابات الدفع</span>
					</MenuItem>
				</NavLink>

				{/*<NavLink
					className='menu-link'
					to='wallet'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<IoWallet />
						<span className='me-2'> المحفظة و الفواتير</span>
					</MenuItem>
				</NavLink>*/}

				{/** Setting Sub menu */}
				<SubMenu label=' الاعدادات' icon={<Setting />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='MainInformation'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> إعدادت المتجر الأساسية</span>
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
					{/*<NavLink
						className='sub-menu-link'
						to='Management'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> الإدارة و المستخدمين </span>
						</MenuItem>
					</NavLink>*/}
					<NavLink
						className='sub-menu-link'
						to='Notifications'
						onClick={() => {
							closeSidebar();
							if (verificationStoreStatus !== "تم التوثيق") {
								dispatchVerifyModal(openVerifyModal());
							}
						}}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> الإشعارات </span>
						</MenuItem>
					</NavLink>
				</SubMenu>

				<NavLink
					className='menu-link'
					to='Report'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
					<MenuItem>
						<Reports />
						<span className='me-2'> التقارير</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='EvaluationThePlatform'
					onClick={() => {
						closeSidebar();
						if (verificationStoreStatus !== "تم التوثيق") {
							dispatchVerifyModal(openVerifyModal());
						}
					}}>
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
