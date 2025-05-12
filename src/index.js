import { lazy, Suspense } from "react";

// import React Router Dom
import ReactDOM from "react-dom/client";

// Import these methods to create app routes
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// use redux toolkit
import { Provider } from "react-redux";
import { store } from "./store/store";

// Import Styles Files
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";

// INDEX CSS FILE
import "./index.css";

// Root Layout - keep this non-lazy as it's the main structure
import RootLayout from "./pages/RootLayout";

// IMPORT ALL Context Providers
import DeleteProvider from "./Context/DeleteProvider";
import LoadingProvider from "./Context/LoadingProvider";
import ContextProvider from "./Context/ContextProvider";
import TextEditorProvider from "./Context/TextEditorProvider";
import UserAuthorProvider from "./Context/UserAuthorProvider";
import NotificationProvider from "./Context/NotificationProvider";
import ResetPasswordProvider from "./Context/ResetPasswordProvider";
import Loading from "./pages/Loading/Loading";

// Lazy load all pages
const DashboardHomePage = lazy(() =>
	import("./pages/DashboardHomePage/DashboardHomePage")
);
const ErrorPage = lazy(() =>
	import("./pages/ErrorPage/ErrorPage").then((module) => ({
		default: module.ErrorPage,
	}))
);
const Offers = lazy(() => import("./pages/Offers"));
const SocialPages = lazy(() => import("./pages/SocialPages"));
const Notifications = lazy(() => import("./pages/Notifications"));
const PlatformServices = lazy(() =>
	import("./pages/PlatformServices/PlatformServices")
);
const EvaluationThePlatform = lazy(() =>
	import("./pages/EvaluationThePlatform/EvaluationThePlatform")
);
const PostalSubscriptions = lazy(() => import("./pages/PostalSubscriptions"));
const PaintStore = lazy(() => import("./pages/PaintStore"));
const RequestDelegate = lazy(() => import("./pages/RequestDelegate"));
const SEOStoreSetting = lazy(() => import("./pages/SEOStoreSetting"));
const Rating = lazy(() =>
	import("./pages/Rating").then((module) => ({ default: module.Rating }))
);

// Academy
const Academy = lazy(() =>
	import("./pages/Academy").then((module) => ({ default: module.Academy }))
);
const CourseDetails = lazy(() =>
	import("./pages/Academy/Courses").then((module) => ({
		default: module.CourseDetails,
	}))
);
const ExplainDetails = lazy(() =>
	import("./pages/Academy/Explains").then((module) => ({
		default: module.ExplainDetails,
	}))
);
const LiveCourseDetails = lazy(() =>
	import("./pages/Academy/LiveCourses/LiveCourseDetails")
);

// Products
const Products = lazy(() =>
	import("./pages/Products").then((module) => ({ default: module.Products }))
);
const AddNewProduct = lazy(() =>
	import("./pages/Products").then((module) => ({
		default: module.AddNewProduct,
	}))
);
const EditProduct = lazy(() =>
	import("./pages/Products").then((module) => ({ default: module.EditProduct }))
);
const EditImportProducts = lazy(() =>
	import("./pages/Products").then((module) => ({
		default: module.EditImportProducts,
	}))
);
const AddNewService = lazy(() =>
	import("./pages/Products/AddAndEditServices/AddNewService")
);
const EditService = lazy(() =>
	import("./pages/Products/AddAndEditServices/EditService")
);

// Authentication
const Main = lazy(() => import("./pages/Authentication/Main/Main"));
const VerificationPage = lazy(() =>
	import("./pages/Authentication/VerificationPage/VerificationPage")
);
const RestorePassword = lazy(() =>
	import("./pages/Authentication/Login/ResetPasswordPages/RestorePassword")
);
const CreateNewPassword = lazy(() =>
	import("./pages/Authentication/Login/ResetPasswordPages/CreateNewPassword")
);
const SendVerificationCode = lazy(() =>
	import(
		"./pages/Authentication/Login/ResetPasswordPages/SendVerificationCode/SendVerificationCode"
	)
);
const LogInVerificationCode = lazy(() =>
	import(
		"./pages/Authentication/Login/ResetPasswordPages/SendVerificationCode/LogInVerificationCode/LogInVerificationCode"
	)
);

// Categories
const Category = lazy(() =>
	import("./pages/Categories").then((module) => ({ default: module.Category }))
);
const AddCategory = lazy(() =>
	import("./pages/Categories").then((module) => ({
		default: module.AddCategory,
	}))
);
const EditCategory = lazy(() =>
	import("./pages/Categories").then((module) => ({
		default: module.EditCategory,
	}))
);

// Coupons
const Coupon = lazy(() =>
	import("./pages/Coupon").then((module) => ({ default: module.Coupon }))
);
const AddCoupon = lazy(() =>
	import("./pages/Coupon").then((module) => ({ default: module.AddCoupon }))
);
const EditCoupon = lazy(() =>
	import("./pages/Coupon").then((module) => ({ default: module.EditCoupon }))
);

// Empty Carts
const EmptyCarts = lazy(() =>
	import("./pages/EmptyCarts").then((module) => ({
		default: module.EmptyCarts,
	}))
);
const EditEmptyCart = lazy(() =>
	import("./pages/EmptyCarts").then((module) => ({
		default: module.EditEmptyCart,
	}))
);

// Store Pages
const Pages = lazy(() =>
	import("./pages/StorePages").then((module) => ({ default: module.Pages }))
);
const CreatePage = lazy(() =>
	import("./pages/StorePages").then((module) => ({
		default: module.CreatePage,
	}))
);
const EditPage = lazy(() =>
	import("./pages/StorePages").then((module) => ({ default: module.EditPage }))
);

// Orders
const Orders = lazy(() =>
	import("./pages/StoreOrders/Orders").then((module) => ({
		default: module.Orders,
	}))
);
const OrderDetails = lazy(() =>
	import("./pages/StoreOrders/Orders").then((module) => ({
		default: module.OrderDetails,
	}))
);
const ReturnOrders = lazy(() =>
	import("./pages/StoreOrders/ReturnOrders").then((module) => ({
		default: module.ReturnOrders,
	}))
);
const ReturnOrderDetails = lazy(() =>
	import("./pages/StoreOrders/ReturnOrders").then((module) => ({
		default: module.ReturnOrderDetails,
	}))
);

// Souq Otlobha
const SouqOtlobha = lazy(() =>
	import("./pages/nestedPages/SouqOtlbha").then((module) => ({
		default: module.SouqOtlobha,
	}))
);
const ProductRefund = lazy(() =>
	import("./pages/nestedPages/SouqOtlbha").then((module) => ({
		default: module.ProductRefund,
	}))
);
const CartPage = lazy(() =>
	import("./pages/nestedPages/SouqOtlbha").then((module) => ({
		default: module.CartPage,
	}))
);
const CheckoutPage = lazy(() =>
	import("./pages/nestedPages/SouqOtlbha").then((module) => ({
		default: module.CheckoutPage,
	}))
);
const CheckoutStatus = lazy(() =>
	import(
		"./pages/nestedPages/SouqOtlbha/CheckoutPage/CheckOutStatusPages"
	).then((module) => ({ default: module.CheckoutStatus }))
);

// Technical Support
const TechnicalSupport = lazy(() =>
	import("./pages/TechnicalSupport/TechnicalSupport")
);
const TechnicalSupportDetails = lazy(() =>
	import("./pages/TechnicalSupport/TechnicalSupportDetails")
);

// User Management
const EditUserDetails = lazy(() =>
	import("./pages/nestedPages").then((module) => ({
		default: module.EditUserDetails,
	}))
);

// Settings
const VerifyStore = lazy(() => import("./pages/VerifyStore"));
const TemplateSetting = lazy(() =>
	import("./pages/TemplateSetting/TemplateSetting")
);
const ShippingCompanies = lazy(() =>
	import("./pages/ShippingCompanies/ShippingCompanies")
);
const PaymentGateways = lazy(() =>
	import("./pages/PaymentGateways/PaymentGateways")
);
const MainInformation = lazy(() =>
	import("./pages/MainInformationSetting/MainInformation")
);

// Wallet
const Wallet = lazy(() => import("./pages/Wallet/Wallet"));
const BillingInfo = lazy(() => import("./pages/Wallet/BillingInfo"));

// Reports
const Reports = lazy(() => import("./pages/Reports/Reports"));

// Packages
const UpgradePackages = lazy(() => import("./pages/Packages/UpgradePackages"));
const ComparePackages = lazy(() => import("./pages/Packages/ComparePackages"));
const CheckoutPackages = lazy(() =>
	import("./pages/Packages/CheckoutPackages/CheckoutPackages")
);
const CheckoutServicesStatus = lazy(() =>
	import("./pages/PlatformServices/CheckoutServices/CheckoutServicesStatus")
);

/**
 * ----------------------------------------------------------------------------------------------
 *  ALL App Routes
 * -----------------------------------------------------------------------------------------------
 */

const router = createBrowserRouter([
	{
		path: "/auth/:type",
		element: <Main />,
	},
	{ path: "VerificationPage", element: <VerificationPage /> },
	// RestorePassword Pages
	{
		path: "RestorePassword",
		element: <RestorePassword />,
	},
	{
		path: "SendVerificationCode",
		element: <SendVerificationCode />,
	},

	// if user name is not verify his account
	// LogInVerificationCode
	{
		path: "LogInVerificationCode",
		element: <LogInVerificationCode />,
	},

	{
		path: "CreateNewPassword",
		element: <CreateNewPassword />,
	},

	{
		path: "compare-packages",
		element: <ComparePackages />,
	},
	{
		path: "/",
		element: <RootLayout />,
		errorElement: <ErrorPage />,

		children: [
			{ index: true, element: <DashboardHomePage /> },
			{ path: "Home", element: <DashboardHomePage /> },
			/**--------------------------------------------------------------------------- */

			/**--------------------------------------------------------------------------- */

			{
				path: "Academy",
				element: <Academy />,
			},
			// Add CourseDetails page nested page for Academy page
			// Add ExplainDetails page nested page for Academy page
			{
				path: "Academy/live-course-details/:id",
				element: <LiveCourseDetails />,
			},
			{
				path: "Academy/CourseDetails/:id",
				element: <CourseDetails />,
			},
			// Add ExplainDetails page nested page for Academy page
			{
				path: "Academy/ExplainDetails/:id",
				element: <ExplainDetails />,
			},

			{
				path: "Category",
				element: <Category />,
			},
			// Add Category page nested page for Category page
			{
				path: "Category/AddCategory",
				element: <AddCategory />,
			},

			{
				path: "Category/add-service-category",
				element: <AddCategory />,
			},

			// Category details page nested page for Category page
			{
				path: "Category/EditCategory/:id",
				element: <EditCategory />,
			},

			// Category details page nested page for Category page
			{
				path: "Category/edit-service-category/:id",
				element: <EditCategory />,
			},
			{
				path: "Coupon",
				element: <Coupon />,
			},
			// Add Coupon page nested page for Coupon page
			{
				path: "Coupon/AddCoupon",
				element: <AddCoupon />,
			},
			// Coupon details page nested page for Coupon page
			{
				path: "Coupon/EditCoupon/:id",
				element: <EditCoupon />,
			},
			{
				path: "Offers",
				element: <Offers />,
			},
			// nested Add Offer page
			// {
			// 	path: 'Offers/AddOffer',
			// 	element: <CreateOffer />,
			// },
			// {
			// 	path: 'Offers/OfferDetails/:id',
			// 	element: <OfferDetails />,
			// },
			{
				path: "EmptyCarts",
				element: <EmptyCarts />,
			},

			// EditEmptyCart page nested page for Carts page
			{
				path: "EmptyCarts/EditEmptyCart/:id",
				element: <EditEmptyCart />,
			},

			{
				path: "PostalSubscriptions",
				element: <PostalSubscriptions />,
			},
			// {
			// 	path: "MarketingCampaign",
			// 	element: <MarketingCampaign />,
			// },

			/** Store orders and return orders */
			{
				path: "Orders",
				element: <Orders />,
			},

			// nested order page
			{
				path: "Orders/OrderDetails/:id",
				element: <OrderDetails />,
			},

			{
				path: "ReturnOrders",
				element: <ReturnOrders />,
			},

			{
				path: "ReturnOrders/ReturnOrderDetails/:id",
				element: <ReturnOrderDetails />,
			},

			/** Store Pages  */
			{
				path: "Pages",
				element: <Pages />,
			},
			// nested order page
			{
				path: "Pages/AddPage",
				element: <CreatePage />,
			},
			{
				path: "Pages/EditPage/:id",
				element: <EditPage />,
			},

			{
				path: "Products",
				element: <Products />,
			},
			// nested Add Product Page
			{
				path: "Products/AddProduct",
				element: <AddNewProduct />,
			},
			// nested Edit Product Page
			{
				path: "Products/EditProduct/:id",
				element: <EditProduct />,
			},
			// add and edit services
			{
				path: "Products/add-service",
				element: <AddNewService />,
			},

			{
				path: "Products/edit-service/:id",
				element: <EditService />,
			},

			// EditImportProducts page
			{
				path: "Products/EditImportProducts/:id",
				element: <EditImportProducts />,
			},
			// nested SouqOtlobha Page
			{
				path: "Products/SouqOtlobha",
				element: <SouqOtlobha />,
			},
			// nested ProductRefund Page
			{
				path: "Products/SouqOtlobha/ProductRefund/:id",
				element: <ProductRefund />,
			},

			{
				path: "Products/SouqOtlobha/Cart",
				element: <CartPage />,
			},

			{
				path: "Products/SouqOtlobha/Checkout",
				element: <CheckoutPage />,
			},

			{
				path: "Products/SouqOtlobha/success",
				element: <CheckoutStatus />,
			},

			{
				path: "Products/SouqOtlobha/failed",
				element: <CheckoutStatus />,
			},

			{
				path: "checkout-packages/success",
				element: <CheckoutStatus />,
			},

			{
				path: "checkout-packages/failed",
				element: <CheckoutStatus />,
			},
			{
				path: "PlatformServices/success",
				element: <CheckoutServicesStatus />,
			},

			{
				path: "PlatformServices/failed",
				element: <CheckoutServicesStatus />,
			},

			{
				path: "Rating",
				element: <Rating />,
			},

			// {
			// 	path: "BranchesAndWarehouses",
			// 	element: <BranchesAndWarehouses />,
			// },

			{
				path: "Support",
				element: <TechnicalSupport />,
			},
			//
			{
				path: "Support/supportDetails/:id",
				element: <TechnicalSupportDetails />,
			},
			{
				path: "MainInformation",
				element: <MainInformation />,
			},
			// {
			// 	path: "Management",
			// 	element: <Management />,
			// },
			// // nested add user page
			// {
			// 	path: "Management/AddUser",
			// 	element: <AddNewUser />,
			// },
			// // nested add users page
			// {
			// 	path: "Management/user/:id",
			// 	element: <EditUserPage />,
			// },
			// // nested add users page
			// {
			// 	path: "Management/info/:id",
			// 	element: <UserData />,
			// },

			// Nested EditUserDetails
			{
				path: "EditUserDetails",
				element: <EditUserDetails />,
			},

			// nested job title page
			// {
			// 	path: "Management/JobTitles",
			// 	element: <JobTitles />,
			// },
			// // nested job title page
			// {
			// 	path: "Management/JobTitles/EditRole/:id",
			// 	element: <EditRole />,
			// },

			// // CreateRole page
			// {
			// 	path: "Management/JobTitles/CreateRole",
			// 	element: <CreateRole />,
			// },

			{
				path: "VerifyStore",
				element: <VerifyStore />,
			},
			{
				path: "SocialPages",
				element: <SocialPages />,
			},

			// packages
			{
				path: "upgrade-packages",
				element: <UpgradePackages />,
			},

			// Checkout Packages
			{
				path: "checkout-packages",
				element: <CheckoutPackages />,
			},

			{
				path: "ShippingCompanies",
				element: <ShippingCompanies />,
			},
			{
				path: "PaymentGateways",
				element: <PaymentGateways />,
			},
			{
				path: "wallet",
				element: <Wallet />,
			},

			// Billing Info

			{
				path: "wallet/billingInfo/:id",
				element: <BillingInfo />,
			},
			{
				path: "Template",
				element: <TemplateSetting />,
			},
			{
				path: "PaintStore",
				element: <PaintStore />,
			},
			{
				path: "Reports",
				element: <Reports />,
			},
			{
				path: "Notifications",
				element: <Notifications />,
			},
			{
				path: "PlatformServices",
				element: <PlatformServices />,
			},

			{
				path: "/RequestDelegate",
				element: <RequestDelegate />,
			},
			{
				path: "EvaluationThePlatform",
				element: <EvaluationThePlatform />,
			},
			{
				path: "seo_store_setting",
				element: <SEOStoreSetting />,
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<Provider store={store}>
		<UserAuthorProvider>
			<ContextProvider>
				<ResetPasswordProvider>
					<NotificationProvider>
						<LoadingProvider>
							<DeleteProvider>
								<TextEditorProvider>
									<Suspense fallback={<Loading />}>
										<RouterProvider router={router} />
									</Suspense>
								</TextEditorProvider>
							</DeleteProvider>
						</LoadingProvider>
					</NotificationProvider>
				</ResetPasswordProvider>
			</ContextProvider>
		</UserAuthorProvider>
	</Provider>
);
