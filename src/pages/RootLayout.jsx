import React, { useContext, useEffect } from "react";
// REDUX
import { useSelector, useDispatch } from "react-redux";

import {
	closeVerifyModal,
	openVerifyModal,
} from "../store/slices/VerifyStoreModal-slice";

// Context
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";

// MUI
import { theme } from "../Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

// Third part

import { ToastContainer } from "react-toastify";
import { Outlet, ScrollRestoration } from "react-router-dom";

// top bar and side bar
import TopBar from "../global/TopBar/TopBar";

// App Modal
import MaintenanceMode from "./MaintenanceMode";
import { VerifayStoreAlert } from "../components/Modal";
import { VerifayAfterMainInfoAlert } from "../components/Modal";
import { DelegateRequestAlert, VerifyStoreModal } from "../components/Modal";

import LoadingRequest from "../components/LoadingRequest/LoadingRequest";
import ActionCompleteComp from "../components/ActionCompleteComp/ActionCompleteComp";

// PrivateRoute (Login Authenticating)
import PrivateRoute from "./Authentication/Login/PrivateRoute/PrivateRoute";

// Using AXiso Global To wrapping the dashboard
import AxiosInterceptors from "../API/AxiosInterceptors";
import SideBar from "../global/Sidebar/SideBar";
import { useShowVerificationQuery } from "../store/apiSlices/verifyStoreApi";
import UseIsSubscribeInPackages from "../Hooks/UseIsSubscribeInPackages";

const RootLayout = () => {
	// im use this hook to check if the user is paid package or not
	UseIsSubscribeInPackages();
	const { data: showVerification, isFetching } = useShowVerificationQuery();

	// To open and close side bar in mobile screen
	const [openSidebar, setOpenSidebar] = React.useState(false);

	// Context That open app Modal
	const contextStore = useContext(Context);
	const { title } = contextStore;
	const LoadingStore = useContext(LoadingContext);
	const { loadingTitle } = LoadingStore;

	// To handle Open Verify Modal
	const { isOpenVerifyModal } = useSelector((state) => state.VerifyModal);

	// Open Maintenance Mode Modal
	const { isOpenMaintenanceModeModal } = useSelector(
		(state) => state.MaintenanceModeModal
	);

	// Open Verify Store Modal
	const { isVerifyStoreAlertOpen } = useSelector(
		(state) => state.VerifyStoreAlertModal
	);

	// Open Verify After Main
	const { isVerifyAfterMainOpen } = useSelector(
		(state) => state.VerifyAfterMainModal
	);
	const dispatchVerifyModal = useDispatch(false);

	// This is modal verification Store Status message That is display after dashboard is open
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (
				showVerification?.verification_status === "لم يتم الطلب" ||
				showVerification?.verification_status === "جاري التوثيق" ||
				showVerification?.verification_status === "طلب جديد" ||
				showVerification?.verification_status === "التوثيق مرفوض"
			) {
				dispatchVerifyModal(openVerifyModal());
			}
		}, 0);

		return () => {
			clearTimeout(debounce);
			dispatchVerifyModal(closeVerifyModal());
		};
	}, [showVerification?.verification_status, dispatchVerifyModal]);

	return (
		<AxiosInterceptors>
			<PrivateRoute>
				<ThemeProvider theme={theme}>
					<CssBaseline>
						<div className='app'>
							<TopBar
								toggleSidebar={() => {
									setOpenSidebar(!openSidebar);
								}}
							/>

							{/* This is Toast Library to Handle errors modal in dashboard*/}
							<ToastContainer
								rtl
								draggable
								closeOnClick
								pauseOnHover
								autoClose={5000}
								pauseOnFocusLoss
								position='top-left'
								newestOnTop={false}
								hideProgressBar={false}
								style={{
									fontSize: "14px",
									color: "#000",
									whiteSpace: "normal",
								}}
							/>

							{title && <ActionCompleteComp />}
							{loadingTitle && <LoadingRequest />}

							{/* if isVerifyStoreAlertOpen is not open and */}
							{!isVerifyStoreAlertOpen && isOpenVerifyModal && (
								<VerifyStoreModal
									isFetching={isFetching}
									verificationStatus={showVerification?.verification_status}
								/>
							)}

							{isVerifyStoreAlertOpen && <VerifayStoreAlert />}
							{isOpenMaintenanceModeModal && <MaintenanceMode />}
							{isVerifyAfterMainOpen && <VerifayAfterMainInfoAlert />}
							{/** Delegate Request Alert */}
							<DelegateRequestAlert />
							<main className='content'>
								<div className='row'>
									<div className='sidebar-col'>
										<SideBar
											verificationStatus={showVerification?.verification_status}
											open={openSidebar}
											closeSidebar={() => {
												setOpenSidebar(!openSidebar);
											}}
										/>
									</div>
									<div className='pages-content'>
										<div className='main-content'>
											{/** use ScrollRestoration from react router dom to fix scrolling issue */}
											<ScrollRestoration />
											<Outlet />
										</div>
									</div>
								</div>
							</main>
						</div>
					</CssBaseline>
				</ThemeProvider>
			</PrivateRoute>
		</AxiosInterceptors>
	);
};

export default RootLayout;
