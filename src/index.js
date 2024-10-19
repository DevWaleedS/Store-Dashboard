import React from "react";
// import pro side bar from pro sidebar
import { ProSidebarProvider } from "react-pro-sidebar";

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

// IMPORT ALL PAGES
import RootLayout from "./pages/RootLayout";

// INDEX CSS FILE
import "./index.css";

import {
	Offers,
	// Management,
	SocialPages,
	//MarketingCampaign,
	//BranchesAndWarehouses,
	Notifications,
	PlatformServices,
	EvaluationThePlatform,
	PostalSubscriptions,
	PaintStore,
	RequestDelegate,
	SEOStoreSetting,
} from "./pages";

// rating and comments of store
import { Rating } from "./pages/Rating";

// Academy Component
import { Academy } from "./pages/Academy";
import { CourseDetails } from "./pages/Academy/Courses";
import { ExplainDetails } from "./pages/Academy/Explains";

// Products Pages ...
import {
	AddNewProduct,
	EditImportProducts,
	EditProduct,
	Products,
} from "./pages/Products";

import { ErrorPage } from "./pages/ErrorPage";
import { VerifyStore } from "./pages/VerifyStore";
import { TemplateSetting } from "./pages/TemplateSetting";
import { ShippingCompanies } from "./pages/ShippingCompanies";
import { DashboardHomePage } from "./pages/DashboardHomePage";
import { PaymentGateways } from "./pages/PaymentGateways";
// ---------------------------------------------------------------------------------------//

// Import Nested Pages
import {
	EditUserPage,
	JobTitles,
	EditRole,
	UserData,
	CreateRole,
	AddNewUser,
	EditUserDetails,

	// CreateOffer,

	// OfferDetails,
} from "./pages/nestedPages";

// ---------------------------------------------------------------------------------------//

// IMPORT ALL Context Providers
import DeleteProvider from "./Context/DeleteProvider";
import LoadingProvider from "./Context/LoadingProvider";
import ContextProvider from "./Context/ContextProvider";
import TextEditorProvider from "./Context/TextEditorProvider";
import UserAuthorProvider from "./Context/UserAuthorProvider";
import NotificationProvider from "./Context/NotificationProvider";
import ResetPasswordProvider from "./Context/ResetPasswordProvider";

// Souq Otlobha and checkout Pages
import {
	SouqOtlobha,
	ProductRefund,
	CartPage,
	CheckoutPage,
} from "./pages/nestedPages/SouqOtlbha";
import { CheckoutStatus } from "./pages/nestedPages/SouqOtlbha/CheckoutPage/CheckOutStatusPages";

// main Information setting Page
import { MainInformation } from "./pages/MainInformationSetting";

// Login and reset password  pages
import Main from "./pages/Authentication/Main/Main";

import { RestorePassword } from "./pages/Authentication/Login/ResetPasswordPages/RestorePassword";
import { CreateNewPassword } from "./pages/Authentication/Login/ResetPasswordPages/CreateNewPassword";
import SendVerificationCode from "./pages/Authentication/Login/ResetPasswordPages/SendVerificationCode/SendVerificationCode";
import LogInVerificationCode from "./pages/Authentication/Login/ResetPasswordPages/SendVerificationCode/LogInVerificationCode/LogInVerificationCode";
import VerificationPage from "./pages/Authentication/VerificationPage/VerificationPage";

// categories
import { Category, AddCategory, EditCategory } from "./pages/Categories";

// Technical Support
import { TechnicalSupport } from "./pages/TechnicalSupport";
import TechnicalSupportDetails from "./pages/TechnicalSupport/TechnicalSupportDetails";

// coupons
import { Coupon, AddCoupon, EditCoupon } from "./pages/Coupon";

// empty carts
import { EditEmptyCart, EmptyCarts } from "./pages/EmptyCarts";

// store pages
import { CreatePage, EditPage, Pages } from "./pages/StorePages";

// wallet and billing
import { Wallet } from "./pages/Wallet";
import BillingInfo from "./pages/Wallet/BillingInfo";

// reports
import { Reports } from "./pages/Reports";

/** Store orders and return orders */
import { OrderDetails, Orders } from "./pages/StoreOrders/Orders";
import {
	ReturnOrderDetails,
	ReturnOrders,
} from "./pages/StoreOrders/ReturnOrders";

// packages
import UpgradePackages from "./pages/Packages/UpgradePackages";
import ComparePackages from "./pages/Packages/ComparePackages";
import CheckoutPackages from "./pages/Packages/CheckoutPackages/CheckoutPackages";
import LiveCourseDetails from "./pages/Academy/LiveCourses/LiveCourseDetails";
import CheckoutServicesStatus from "./pages/PlatformServices/CheckoutServices/CheckoutServicesStatus";
import AddNewService from "./pages/Products/AddAndEditServices/AddNewService";
import EditService from "./pages/Products/AddAndEditServices/EditService";

/**
 * ----------------------------------------------------------------------------------------------
 *  ALL App Routes
 * -----------------------------------------------------------------------------------------------
 */

const router = createBrowserRouter([
	{ path: "/auth/:type", element: <Main /> },
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
		<ProSidebarProvider>
			<UserAuthorProvider>
				<ContextProvider>
					<ResetPasswordProvider>
						<NotificationProvider>
							<LoadingProvider>
								<DeleteProvider>
									<TextEditorProvider>
										<RouterProvider router={router} />
									</TextEditorProvider>
								</DeleteProvider>
							</LoadingProvider>
						</NotificationProvider>
					</ResetPasswordProvider>
				</ContextProvider>
			</UserAuthorProvider>
		</ProSidebarProvider>
	</Provider>
);
