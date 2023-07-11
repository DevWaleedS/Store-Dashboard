import React from 'react';
// import pro side bar from pro sidebar
import { ProSidebarProvider } from 'react-pro-sidebar';

// import React Router Dom
import ReactDOM from 'react-dom/client';

// Import these methods to create app routes
import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// use redux toolkit
import { Provider } from 'react-redux';
import { store } from './store/store';

// Import bootstrap files
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle';

// IMPORT ALL PAGES
import RootLayout from './pages/RootLayout';

// Import All Pages to create routes
import {
	Academy,
	Carts,
	Category,
	Coupon,
	ErrorPage,
	Home,
	Offers,
	Orders,
	Pages,
	PaymentGetways,
	Products,
	Rating,
	Report,
	Seo,
	MainInformation,
	Management,
	ShippingCompanies,
	SocialPages,
	PackageUpgrade,
	StoreData,
	Support,
	Template,
	VerifyStore,
	MarketingCampaign,
	BranchesAndWarehouses,
	Notifications,
	PlatformServices,
} from './pages';

// Import Nested Pages
import {
	OrderDetails,
	CourseDetails,
	SupportDetails,
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
	ShowImportEtlobhaProduct,
	CreateRole,
	AddCategory,
	AddNewUser,
	UserDetails,
	EditUserDetails,
	SouqOtlobha,
	ProductRefund,
	Delegate,
	// CreateOffer,
	CreatePage,
	EditPage,
	// OfferDetails,
} from './pages/nestedPages';


// INDEX CSS FILE
import './index.css';
import ContextProvider from './Context/ContextProvider';
import NotificationProvider from './Context/NotificationProvider';
import LoadingProvider from './Context/LoadingProvider';
import DeleteProvider from './Context/DeleteProvider';

// App Routes
const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		errorElement: <ErrorPage />,
		children: [
			{ index: true, element: <Home /> },
			{ path: 'Home', element: <Home /> },

			{
				path: 'Academy',
				element: <Academy />,
			},
			// Add CourseDetails page nested page for Academy page

			{
				path: 'Academy/CourseDetails/:id',
				element: <CourseDetails />,
			},
			{
				path: 'Category',
				element: <Category />,
			},
			// Add Category page nested page for Category page
			{
				path: 'Category/AddCategory',
				element: <AddCategory />,
			},

			// Category details page nested page for Category page
			{
				path: 'Category/EditCategory/:id',
				element: <EditCategory />,
			},
			{
				path: 'Coupon',
				element: <Coupon />,
			},
			// Add Coupon page nested page for Coupon page
			{
				path: 'Coupon/AddCoupon',
				element: <AddCoupon />,
			},
			// Coupon details page nested page for Coupon page
			{
				path: 'Coupon/EditCoupon/:id',
				element: <EditCoupon />,
			},
			{
				path: 'Offers',
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
				path: 'Carts',
				element: <Carts />,
			},

			// ClientData page nested page for Carts page
			{
				path: 'Carts/ClientData/:id',
				element: <ClientData />,
			},

			{
				path: 'Seo',
				element: <Seo />,
			},
			{
				path: 'MarketingCampaign',
				element: <MarketingCampaign />,
			},

			{
				path: 'Orders',
				element: <Orders />,
			},
			// nested order page
			{
				path: 'Orders/OrderDetails/:id',
				element: <OrderDetails />,
			},
			{
				path: 'Pages',
				element: <Pages />,
			},
			// nested order page
			{
				path: 'Pages/AddPage',
				element: <CreatePage />,
			},
			{
				path: 'Pages/EditPage/:id',
				element: <EditPage />,
			},

			{
				path: 'Products',
				element: <Products />,
			},
			// nested Add Product Page
			{
				path: 'Products/AddProduct',
				element: <AddNewProduct />,
			},
			// nested Edit Product Page
			{
				path: 'Products/EditProduct/:id',
				element: <EditProductPage />,
			},
			// ShowImportEtlobhaProduct page
			{
				path: 'Products/ShowImportEtlobhaProduct/:id',
				element: <ShowImportEtlobhaProduct />,
			},
			// nested SouqOtlobha Page
			{
				path: 'Products/SouqOtlobha',
				element: <SouqOtlobha />,
			},
			// nested ProductRefund Page
			{
				path: 'Products/SouqOtlobha/ProductRefund/:id',
				element: <ProductRefund />,
			},

			{
				path: 'Rating',
				element: <Rating />,
			},

			{
				path: 'BranchesAndWarehouses',
				element: <BranchesAndWarehouses />,
			},

			{
				path: 'Support',
				element: <Support />,
			},
			//
			{
				path: 'Support/supportDetails/:id',
				element: <SupportDetails />,
			},
			{
				path: 'MainInformation',
				element: <MainInformation />,
			},
			{
				path: 'Management',
				element: <Management />,
			},
			// nested add user page
			{
				path: 'Management/AddUser',
				element: <AddNewUser />,
			},
			// nested add users page
			{
				path: 'Management/user/:id',
				element: <EditUserPage />,
			},
			// nested add users page
			{
				path: 'Management/info/:id',
				element: <UserData />,
			},

			{
				path: 'UserDetails',
				element: <UserDetails />,
			},
			// Nested EditUserDetails from userDetails
			{
				path: 'UserDetails/EditUserDetails',
				element: <EditUserDetails />,
			},

			// nested job title page
			{
				path: 'Management/JobTitles',
				element: <JobTitles />,
			},
			// nested job title page
			{
				path: 'Management/JobTitles/EditRole/:id',
				element: <EditRole />,
			},

			// CreateRole page
			{
				path: 'Management/JobTitles/CreateRole',
				element: <CreateRole />,
			},
			{
				path: 'StoreData',
				element: <StoreData />,
			},
			{
				path: 'VerifyStore',
				element: <VerifyStore />,
			},
			{
				path: 'SocialPages',
				element: <SocialPages />,
			},
			{
				path: 'PackageUpgrade',
				element: <PackageUpgrade />,
			},

			{
				path: 'ShippingCompanies',
				element: <ShippingCompanies />,
			},
			{
				path: 'PaymentGetways',
				element: <PaymentGetways />,
			},
			{
				path: 'Template',
				element: <Template />,
			},
			{
				path: 'Report',
				element: <Report />,
			},
			{
				path: 'Notifications',
				element: <Notifications />,
			},
			{
				path: 'PlatformServices',
				element: <PlatformServices />,
			},
			{
				path: 'PlatformServices/Delegate',
				element: <Delegate />,
			},
		],
	},
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<ProSidebarProvider>
			<ContextProvider>
				<NotificationProvider>
					<LoadingProvider>
						<DeleteProvider>
							<RouterProvider router={router} />
						</DeleteProvider>
					</LoadingProvider>
				</NotificationProvider>
			</ContextProvider>
		</ProSidebarProvider>
	</Provider>
);
