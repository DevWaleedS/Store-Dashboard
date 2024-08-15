import React, { useContext } from "react";
import { Sidebar, Menu } from "react-pro-sidebar";

// Redux
import { useDispatch } from "react-redux";
import { openVerifyModal } from "../../store/slices/VerifyStoreModal-slice";
import { openMaintenanceModeModal } from "../../store/slices/MaintenanceModeModal";
import { openDelegateRequestAlert } from "../../store/slices/DelegateRequestAlert-slice";

// Context
import Context from "../../Context/context";

// Side bar components
import SidebarLink from "./SidebarLink";
import SidebarSubMenu from "./SidebarSubMenu";

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
} from "../../data/Icons";
import { FaCrown } from "react-icons/fa6";
import { BsCartX } from "react-icons/bs";
import { MdVerified } from "react-icons/md";
import { BiCartAdd, BiSolidRocket } from "react-icons/bi";
import { IoWallet } from "react-icons/io5";
import { FaCircle, FaUserCheck } from "react-icons/fa";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";
import { useNavigate } from "react-router-dom";
import { useGetUpgradePackagesQuery } from "../../store/apiSlices/upgradePackagesApi";

const SideBar = ({
	open,
	closeSidebar,
	verificationStatus,
	packagePaidStatus,
	packageId,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const Z_index = useContext(Context);
	const { setNavbarZindex } = Z_index;

	const { data: upgradePackages, isLoading: loadingPackages } =
		useGetUpgradePackagesQuery();

	const selectedPackage = upgradePackages?.find(
		(pack) => pack?.is_selected && pack?.package_paid
	);

	console.log(!loadingPackages && selectedPackage);

	const handleOpenVerificationModal = () => {
		if (
			verificationStatus !== "تم التوثيق" ||
			(!packagePaidStatus && !packageId && verificationStatus === "تم التوثيق")
		) {
			dispatch(openVerifyModal());
		}
	};

	// handle open Verification Status
	const handleOpenVerificationStatus = () => {
		dispatch(openVerifyModal());
	};

	// handle  Open Maintenance Mode Modal
	const handleOpenMaintenanceModeModal = () => {
		setNavbarZindex(true);
		dispatch(openMaintenanceModeModal());
	};

	// sub menu items
	const submenuItems = {
		orders: [
			{ to: "Orders", icon: BiCartAdd, label: "الطلبات" },
			{ to: "ReturnOrders", icon: BsCartX, label: "المرتجعات" },
		],

		marketing: [
			{ to: "Coupon", icon: Discoint, label: "أكواد الخصم" },
			{ to: "EmptyCarts", icon: BsCart, label: "السلات المتروكة" },
			// { to: "EmptyCarts", icon: Offer, label: "  العروض الخاصة" },
			{
				href: "https://celebrity.sa/",
				target: "_blank",
				rel: "noreferrer",
				icon: Shoping,
				label: "التسويق عبر المشاهير",
			},
			{
				to: "PostalSubscriptions",
				icon: MarkEmailReadIcon,
				label: "الاشتراكات البريدية",
			},
			{ to: "SEOStore", icon: FaCircle, label: "SEO المتجر" },
		],

		template: [
			{ to: "Template", icon: Layout, label: "تنسيق القالب" },
			{ to: "PaintStore", icon: Paint, label: "هوية المتجر" },
		],

		storeInfo: [
			{
				to: "Home",
				icon: Verification,
				label: "توثيق المتجر",
				isVerifyStoreModal: handleOpenVerificationStatus,
			},
			{ to: "SocialPages", icon: Social, label: "صفحات التواصل" },
			{ to: "upgrade-packages", icon: BiSolidRocket, label: " ترقية الباقة" },
		],

		setting: [
			{
				to: "MainInformation",
				icon: FaCircle,
				label: "إعدادت المتجر الأساسية",
			},
			{
				to: "Home",
				icon: FaCircle,
				label: "وضع الصيانة",
				isMaintenanceModeModal: handleOpenMaintenanceModeModal,
			},
			// { to: "Management", icon: FaCircle, label: "الإدارة و المستخدمين " },
			{ to: "Notifications", icon: FaCircle, label: "الإشعارات" },
		],
	};

	return (
		<Sidebar
			rtl={true}
			className={`sidebar ${open ? "show" : ""}`}
			style={{ height: "100%" }}>
			<div className=' store_is_verified py-3 d-flex justify-content-start align-content-center gap-1 pe-2'>
				{verificationStatus === "تم التوثيق" && (
					<div className='verify_box d-flex justify-content-center align-content-center gap-1 '>
						<MdVerified className='verify_icon' />
						<p className='mb-0 pb-0'>متجر موثق</p>
					</div>
				)}

				{!loadingPackages && selectedPackage && (
					<div
						onClick={() => navigate("/upgrade-packages")}
						className='verify_box d-flex justify-content-center align-content-center gap-1 mouse-pointer'>
						<FaCrown className='verify_icon' />
						<p className='mb-0 pb-0'>{selectedPackage?.name}</p>
					</div>
				)}
			</div>
			<Menu>
				{verificationStatus === "تم التوثيق" ? (
					<SidebarLink
						href={`https://${localStorage.getItem("domain")}`}
						target='_blank'
						rel='noreferrer'
						icon={Eye}
						label='عرض المتجر'
					/>
				) : (
					<SidebarLink
						to='Home'
						icon={Eye}
						label='عرض المتجر'
						className='menu-link'
						onClick={() => {
							closeSidebar();
							handleOpenVerificationModal();
						}}
					/>
				)}
				<SidebarLink
					to=''
					icon={HomeImage}
					label='الرئيسية'
					className='menu-link'
					onClick={closeSidebar}
				/>
				<SidebarLink
					to='Category'
					icon={Category}
					label='الأنشطة'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
				<SidebarLink
					to='Products'
					icon={Products}
					label='المنتجات'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
				<SidebarSubMenu
					label='الطلبات'
					icon={Orders}
					items={submenuItems.orders}
					onClose={closeSidebar}
					onVerify={handleOpenVerificationModal}
				/>
				<SidebarLink
					to='PlatformServices'
					icon={Services}
					label='خدمات المنصة'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>

				{/** marketing Sub menu */}
				<SidebarSubMenu
					label='التسويق'
					icon={Marketing}
					items={submenuItems.marketing}
					onClose={closeSidebar}
					href={submenuItems.marketing.href}
					onVerify={handleOpenVerificationModal}
				/>

				<SidebarLink
					to='Rating'
					icon={Rating}
					label='التقييمات'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>

				<SidebarLink
					to='RequestDelegate'
					icon={FaUserCheck}
					label='طلب مندوب'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						if (verificationStatus !== "تم التوثيق") {
							handleOpenVerificationModal();
						} else {
							dispatch(openDelegateRequestAlert());
						}
					}}
				/>

				<SidebarLink
					to='Pages'
					icon={PagesIcon}
					label='الصفحات'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
				<SidebarLink
					to='Academy'
					icon={Academy}
					label='الأكاديمية'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>

				{/* Template sub menu */}
				<SidebarSubMenu
					label='القالب'
					icon={Template}
					items={submenuItems.template}
					onClose={closeSidebar}
					onVerify={handleOpenVerificationModal}
				/>

				{/* Store Info Sub menu */}
				<SidebarSubMenu
					label='بيانات المتجر'
					icon={Info}
					items={submenuItems.storeInfo}
					onClose={closeSidebar}
					onVerify={handleOpenVerificationModal}
				/>

				<SidebarLink
					to='Support'
					icon={Support}
					label='الدعم الفني'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
				<SidebarLink
					to='ShippingCompanies'
					icon={Delevray}
					label='شركات الشحن'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
				<SidebarLink
					to='PaymentGateways'
					icon={Payment}
					label='بوابات الدفع'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
				<SidebarLink
					to='wallet'
					icon={IoWallet}
					label='المحفظة والفواتير'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>

				{/** Setting Sub menu */}
				<SidebarSubMenu
					label='الاعدادات'
					icon={Setting}
					items={submenuItems.setting}
					onClose={closeSidebar}
					onVerify={handleOpenVerificationModal}
				/>
				<SidebarLink
					to='Reports'
					icon={Reports}
					label='التقارير'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
				<SidebarLink
					to='EvaluationThePlatform'
					icon={Evaluation}
					label='تقييم المنصة'
					className='menu-link'
					onClick={() => {
						closeSidebar();
						handleOpenVerificationModal();
					}}
				/>
			</Menu>
		</Sidebar>
	);
};

export default SideBar;
