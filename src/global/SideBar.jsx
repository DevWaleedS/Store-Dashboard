import React, { useContext } from "react";

// Use Sidebar Pro to create sidebar
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";

// Use Nav Link
import { NavLink, Link } from "react-router-dom";

// Redux
import { useDispatch } from "react-redux";
import { openVerifyModal } from "../store/slices/VerifyStoreModal-slice";
import { openMaintenanceModeModal } from "../store/slices/MaintenanceModeModal";
import { openDelegateRequestAlert } from "../store/slices/DelegateRequestAlert-slice";

// Context
import Context from "../Context/context";

// Icons
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
import { BsCartX } from "react-icons/bs";
import { BiCartAdd } from "react-icons/bi";
import { IoWallet } from "react-icons/io5";
import { FaCircle, FaUserCheck } from "react-icons/fa";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

const SideBar = ({ open, closeSidebar, verificationStatus }) => {
	const dispatch = useDispatch(false);
	const dispatchVerifyModal = useDispatch(false);

	// To change z-index of navbar when maintain mode is open
	const Z_index = useContext(Context);
	const { setNavbarZindex } = Z_index;

	const handleOpenVerificationModal = () => {
		if (verificationStatus !== "تم التوثيق") {
			dispatchVerifyModal(openVerifyModal());
		}
	};

	return (
		<Sidebar
			rtl={true}
			className={`sidebar ${open ? "show" : ""}`}
			style={{ height: "100%" }}>
			<Menu>
				{verificationStatus === "تم التوثيق" ? (
					<a
						as='li'
						className='menu-link'
						href={`https://template.atlbha.com/${localStorage.getItem(
							"domain"
						)}`}
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
						handleOpenVerificationModal();
					}}>
					<MenuItem>
						<Category />
						<span className='me-2'> الأنشطة</span>
					</MenuItem>
				</NavLink>
				<NavLink
					to='Products'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}>
					<MenuItem>
						<Products />
						<span className='me-2'> المنتجات</span>
					</MenuItem>
				</NavLink>

				{/** Markting Sub menu */}
				<SubMenu label='الطلبات' icon={<Orders />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='Orders'
						onClick={() => {
							closeSidebar();
							handleOpenVerificationModal();
						}}>
						<MenuItem>
							<BiCartAdd />
							<span className='me-2'> الطلبات</span>
						</MenuItem>
					</NavLink>

					<NavLink
						className='sub-menu-link'
						to='ReturnOrders'
						onClick={() => {
							closeSidebar();
							handleOpenVerificationModal();
						}}>
						<MenuItem>
							<BsCartX />
							<span className='me-2'>المرتجعات</span>
						</MenuItem>
					</NavLink>
				</SubMenu>
				<NavLink
					className='menu-link'
					to='PlatformServices'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
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
							handleOpenVerificationModal();
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
						to='EmptyCarts'
						onClick={() => {
							closeSidebar();
							handleOpenVerificationModal();
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
							handleOpenVerificationModal();
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
							handleOpenVerificationModal();
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
						handleOpenVerificationModal();
					}}>
					<MenuItem>
						<Rating className='rating-icon' />
						<span className='me-2'>التقييمات</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='RequestDelegate'
					onClick={() => {
						closeSidebar();

						if (verificationStatus !== "تم التوثيق") {
							handleOpenVerificationModal();
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
						handleOpenVerificationModal();
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
						handleOpenVerificationModal();
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
							handleOpenVerificationModal();
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
							handleOpenVerificationModal();
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
							handleOpenVerificationModal();
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
						handleOpenVerificationModal();
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
						handleOpenVerificationModal();
					}}>
					<MenuItem>
						<Delevray />
						<span className='me-2'> شركات الشحن</span>
					</MenuItem>
				</NavLink>
				<NavLink
					className='menu-link'
					to='PaymentGateways'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}>
					<MenuItem>
						<Payment />
						<span className='me-2'> بوابات الدفع</span>
					</MenuItem>
				</NavLink>

				<NavLink
					className='menu-link'
					to='wallet'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}>
					<MenuItem>
						<IoWallet />
						<span className='me-2'> المحفظة و الفواتير</span>
					</MenuItem>
				</NavLink>

				{/** Setting Sub menu */}
				<SubMenu label=' الاعدادات' icon={<Setting />} as='li'>
					<NavLink
						className='sub-menu-link'
						to='MainInformation'
						onClick={() => {
							closeSidebar();
							handleOpenVerificationModal();
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
							if (verificationStatus !== "تم التوثيق") {
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
							handleOpenVerificationModal();
						}}>
						<MenuItem>
							<FaCircle style={{ width: "14px" }} />
							<span className='me-2'> الإشعارات </span>
						</MenuItem>
					</NavLink>
				</SubMenu>

				<NavLink
					className='menu-link'
					to='Reports'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
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
						handleOpenVerificationModal();
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
