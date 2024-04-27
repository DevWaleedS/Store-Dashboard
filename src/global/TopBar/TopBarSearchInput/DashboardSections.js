import {
	Academy,
	Background,
	BsCart,
	Caaard,
	Category,
	Delevray,
	Discoint,
	Evaluation,
	Eye,
	Footer,
	HomeImage,
	Icons,
	Info,
	Layout,
	Marketing,
	Menuu,
	MyAccountIcon,
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
} from "../../../data/Icons";
import { IoWallet } from "react-icons/io5";
import { FaCircle, FaUserCheck } from "react-icons/fa";
import MarkEmailReadIcon from "@mui/icons-material/MarkEmailRead";

export const dashboardSections = [
	{
		id: 233223,
		sectionName: "تعديل بيانات حسابي",
		route: "EditUserDetails",
		icon: <MyAccountIcon />,
	},
	{
		id: 1,
		sectionName: "الرئيسية ",
		route: "",
		icon: <HomeImage />,
	},
	{
		id: 2,
		sectionName: "الأنشطة",
		route: "Category",
		icon: <Category />,
	},
	{
		id: 99280990,
		sectionName: "اضافة نشاط",
		route: "Category/AddCategory",
		icon: <Category />,
	},
	{
		id: 3,
		sectionName: "المنتجات",
		route: "Products",
		icon: <Products />,
	},
	{
		id: 98076554,
		sectionName: "اضافة منتج",
		route: "Products/AddProduct",
		icon: <Products />,
	},
	{
		id: 98076554,
		sectionName: "سوق اطلبها",
		route: "Products",
		icon: <Products />,
	},
	{
		id: 4,
		sectionName: "الطلبات",
		route: "Orders",
		icon: <Orders />,
	},
	{
		id: 5,
		sectionName: "	التسويق",
		route: "Coupon",
		icon: <Marketing />,
	},
	{
		id: 6,
		sectionName: "أكواد الخصم",
		route: "Coupon",
		icon: <Discoint />,
	},
	{
		id: 6,
		sectionName: "اضافة كود خصم",
		route: "Coupon/AddCoupon",
		icon: <Discoint />,
	},
	{
		id: 7,
		sectionName: "السلات المتروكة",
		route: "EmptyCarts",
		icon: <BsCart />,
	},
	{
		id: 8,
		sectionName: "التسويق عبر المشاهير",
		route: "https://celebrity.sa/",
		icon: <Shoping />,
	},
	{
		id: 9,
		sectionName: "الاشتراكات البريدية",
		route: "PostalSubscriptions",
		icon: <MarkEmailReadIcon style={{ fontSize: "24px" }} />,
	},
	{
		id: 10,
		sectionName: "SEO المتجر",
		route: "SEOStore",
		icon: <FaCircle style={{ width: "14px" }} />,
	},
	{
		id: 11,
		sectionName: "التقييمات",
		route: "Rating",
		icon: <Rating className='rating-icon' />,
	},
	{
		id: 12,
		sectionName: "الصفحات",
		route: "Pages",
		icon: <PagesIcon />,
	},
	{
		id: 12,
		sectionName: "انشاء صفحة جديدة",
		route: "Pages/AddPage",
		icon: <PagesIcon />,
	},
	{
		id: 13,
		sectionName: "الأكاديمية",
		route: "Academy",
		icon: <Academy />,
	},
	{
		id: 14,
		sectionName: "الدورات التدريبية",
		route: "Academy",
		icon: <Academy />,
	},

	{
		id: 15,
		sectionName: "شروحات",
		route: "Academy",
		icon: <Academy />,
	},

	{
		id: 16,
		sectionName: "القالب",
		route: "Template",
		icon: <Template />,
	},
	{
		id: 160,
		sectionName: "تعديل السلايدر",
		route: "Template",
		icon: <Template />,
	},
	{
		id: 20098,
		sectionName: "تعديل البنر",
		route: "Template",
		icon: <Template />,
	},
	{
		id: 17,
		sectionName: "تنسيق القالب",
		route: "Template",
		icon: <Layout />,
	},
	{
		id: 18,
		sectionName: "هوية المتجر",
		route: "PaintStore",
		icon: <Paint />,
	},
	{
		id: 180347,
		sectionName: "تغيير اللون الأساسي للمتجر",
		route: "PaintStore",
		icon: <Caaard />,
	},
	{
		id: 187231,
		sectionName: "تغيير اللون الفرعي للمتجر",
		route: "PaintStore",
		icon: <Category />,
	},
	{
		id: 1802342932328347,
		sectionName: "تغيير  خلفية الهيدر للمتجر",
		route: "PaintStore",
		icon: <Menuu />,
	},
	{
		id: 233223,
		sectionName: "تغيير لون الخلفية للمتجر",
		route: "PaintStore",
		icon: <Background />,
	},

	{
		id: 2324,
		sectionName: "تغيير  لون إطار القائمه السلفيه Footer للمتجر",
		route: "PaintStore",
		icon: <Footer />,
	},
	{
		id: 34552,
		sectionName: "تغيير لون الأيقونات للمتجر",
		route: "PaintStore",
		icon: <Icons />,
	},

	{
		id: 19,
		sectionName: "بيانات المتجر",
		route: "SocialPages",
		icon: <Info />,
	},
	{
		id: 20,
		sectionName: "توثيق المتجر",
		route: "",
		icon: <Verification />,
	},

	{
		id: 21,
		sectionName: "صفحات التواصل",
		route: "SocialPages",
		icon: <Social />,
	},
	{
		id: 22,
		sectionName: "الدعم الفني",
		route: "Support",
		icon: <Support />,
	},
	{
		id: 23,
		sectionName: "شركات الشحن",
		route: "ShippingCompanies",
		icon: <Delevray />,
	},
	{
		id: 24,
		sectionName: "بوابات الدفع",
		route: "PaymentGateways",
		icon: <IoWallet />,
	},
	{
		id: 9908293892,
		sectionName: "المحفظة و الفواتير",
		route: "wallet",
		icon: <Payment />,
	},
	{
		id: 25,
		sectionName: "الاعدادات",
		route: "MainInformation",
		icon: <Setting />,
	},
	{
		id: 26,
		sectionName: "إعدادت المتجر الأساسية",
		route: "MainInformation",
		icon: <FaCircle style={{ width: "14px" }} />,
	},
	{
		id: 27,
		sectionName: "وضع الصيانة",
		route: "",
		icon: <FaCircle style={{ width: "14px" }} />,
	},
	// {
	// 	id: 28,
	// 	sectionName: "الإدارة و المستخدمين",
	// 	route: "Management",
	// 	icon: <FaCircle style={{ width: "14px" }} />,
	// },
	{
		id: 29,
		sectionName: "الإشعارات",
		route: "Notifications",
		icon: <FaCircle style={{ width: "14px" }} />,
	},
	{
		id: 30,
		sectionName: "خدمات المنصة",
		route: "PlatformServices",
		icon: <Services className='custom_fill_color' />,
	},
	{
		id: 31,
		sectionName: "التقارير",
		route: "Report",
		icon: <Reports />,
	},
	{
		id: 32,
		sectionName: "تقييم المنصة",
		route: "EvaluationThePlatform",
		icon: <Evaluation />,
	},
	{
		id: 27,
		sectionName: "طلب مندوب",
		route: "PlatformServices",
		icon: <FaUserCheck />,
	},
	// {
	// 	id: 27,
	// 	sectionName: "",
	// 	route: "SEOStore",
	// 	icon: <FaCircle style={{ width: "14px" }} />,
	// },
	// {
	// 	id: 27,
	// 	sectionName: "",
	// 	route: "SEOStore",
	// 	icon: <FaCircle style={{ width: "14px" }} />,
	// },
	// {
	// 	id: 27,
	// 	sectionName: "",
	// 	route: "SEOStore",
	// 	icon: <FaCircle style={{ width: "14px" }} />,
	// },
];
