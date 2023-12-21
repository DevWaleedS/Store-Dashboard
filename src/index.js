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
	Carts,
	Category,
	Coupon,
	Offers,
	Pages,
	PaymentGetways,
	Report,
	Management,
	SocialPages,
	//PackageUpgrade,
	Support,
	//MarketingCampaign,
	//BranchesAndWarehouses,
	Notifications,
	PlatformServices,
	EvaluationThePlatform,
	PostalSubscriptions,
	PaintStore,
	SEOStore,
	CartPage,
	CheckoutPage
} from "./pages";

import { Rating } from "./pages/Rating";
import { Orders } from "./pages/Orders";

// Academy Component
import { Academy } from "./pages/Academy";
import { CourseDetails } from "./pages/Academy/Courses";
import { ExplainDetails } from "./pages/Academy/Explains";

import { Products } from "./pages/Products";
import { ErrorPage } from "./pages/ErrorPage";
import { VerifyStore } from "./pages/VerifyStore";
import { TemplateSetting } from "./pages/TemplateSetting";
import { ShippingCompanies } from "./pages/ShippingCompanies";
import { DashboardHomePage } from "./pages/DashboardHomePage";
// ---------------------------------------------------------------------------------------//

// Import Nested Pages
import {
	AddCoupon,
	EditCoupon,
	ClientData,
	EditUserPage,
	JobTitles,
	EditRole,
	UserData,
	EditCategory,
	AddNewProduct,
	EditProductPage,
	CreateRole,
	AddCategory,
	AddNewUser,
	EditUserDetails,
	Delegate,
	// CreateOffer,
	CreatePage,
	EditPage,
	SupportDetails,
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

// Souq Otlobha  Pages
import {
	SouqOtlobha,
	ProductRefund,
	ShowImportEtlobhaProduct,
} from "./pages/nestedPages/SouqOtlbha";

import { OrderDetails } from "./pages/nestedPages/orderDetails";

// Login and reset password  pages
import { RestorePassword } from "./pages/Authentication/Login/ResetPasswordPages/RestorePassword";
import { CreateNewPassword } from "./pages/Authentication/Login/ResetPasswordPages/CreateNewPassword";
import SendVerificationCode from "./pages/Authentication/Login/ResetPasswordPages/SendVerificationCode/SendVerificationCode";
import LogInVerificationCode from "./pages/Authentication/Login/ResetPasswordPages/SendVerificationCode/LogInVerificationCode/LogInVerificationCode";
import { MainInformation } from "./pages/MainInformationSetting";
import Main from "./pages/Authentication/Main/Main";
import VerificationPage from "./pages/Authentication/VerificationPage/VerificationPage";

/**
 * ----------------------------------------------------------------------------------------------
 *  ALL App Routes
 * -----------------------------------------------------------------------------------------------
 */

const router = createBrowserRouter([
	{ path: '/auth/:type', element: <Main /> },
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

			// Category details page nested page for Category page
			{
				path: "Category/EditCategory/:id",
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
				path: "Carts",
				element: <Carts />,
			},

			// ClientData page nested page for Carts page
			{
				path: "Carts/ClientData/:id",
				element: <ClientData />,
			},

			{
				path: "PostalSubscriptions",
				element: <PostalSubscriptions />,
			},
			// {
			// 	path: "MarketingCampaign",
			// 	element: <MarketingCampaign />,
			// },

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
				element: <EditProductPage />,
			},
			// ShowImportEtlobhaProduct page
			{
				path: "Products/ShowImportEtlobhaProduct/:id",
				element: <ShowImportEtlobhaProduct />,
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
				path: "Rating",
				element: <Rating />,
			},

			// {
			// 	path: "BranchesAndWarehouses",
			// 	element: <BranchesAndWarehouses />,
			// },

			{
				path: "Support",
				element: <Support />,
			},
			//
			{
				path: "Support/supportDetails/:id",
				element: <SupportDetails />,
			},
			{
				path: "MainInformation",
				element: <MainInformation />,
			},
			{
				path: "Management",
				element: <Management />,
			},
			// nested add user page
			{
				path: "Management/AddUser",
				element: <AddNewUser />,
			},
			// nested add users page
			{
				path: "Management/user/:id",
				element: <EditUserPage />,
			},
			// nested add users page
			{
				path: "Management/info/:id",
				element: <UserData />,
			},

			// Nested EditUserDetails
			{
				path: "EditUserDetails",
				element: <EditUserDetails />,
			},

			// nested job title page
			{
				path: "Management/JobTitles",
				element: <JobTitles />,
			},
			// nested job title page
			{
				path: "Management/JobTitles/EditRole/:id",
				element: <EditRole />,
			},

			// CreateRole page
			{
				path: "Management/JobTitles/CreateRole",
				element: <CreateRole />,
			},

			{
				path: "VerifyStore",
				element: <VerifyStore />,
			},
			{
				path: "SocialPages",
				element: <SocialPages />,
			},
			// {
			// 	path: "PackageUpgrade",
			// 	element: <PackageUpgrade />,
			// },

			{
				path: "ShippingCompanies",
				element: <ShippingCompanies />,
			},
			{
				path: "PaymentGetways",
				element: <PaymentGetways />,
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
				path: "Report",
				element: <Report />,
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
				path: "/Delegate",
				element: <Delegate />,
			},
			{
				path: "EvaluationThePlatform",
				element: <EvaluationThePlatform />,
			},
			{
				path: "SEOStore",
				element: <SEOStore />,
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
