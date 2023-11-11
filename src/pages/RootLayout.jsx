import React, { useContext, useEffect } from "react";

// REDUX
import { useSelector, useDispatch } from "react-redux";
import { StoreVerificationThunk } from "../store/Thunk/storeVerificationThunk";
import { openVerifyModal } from "../store/slices/VerifyStoreModal-slice";

// Context
import Context from "../Context/context";
import { LoadingContext } from "../Context/LoadingProvider";
import { DeleteContext } from "../Context/DeleteProvider";
import { NotificationContext } from "../Context/NotificationProvider";

// MUI
import { theme } from "../Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

// Third part
import { useCookies } from "react-cookie";
import { Outlet, ScrollRestoration } from "react-router-dom";

// top bar and side bar
import TopBar from "../global/TopBar/TopBar";
import SideBar from "../global/SideBar";

// App Modal
import MaintenanceMode from "./MaintenanceMode";
import { VerifyStoreModal } from "../components/Modal";
import { VerifayStoreAlert } from "../components/Modal";
import { VerifayAfterMainInfoAlert } from "../components/Modal";
// import CelebrityMarketingModal from "./CelebrityMarketingModal";
import DeleteModal from "../components/DeleteModal/DeleteModal";
import DeleteOneModal from "../components/DeleteOneModal/DeleteOneModal";
import LoadingRequest from "../components/LoadingRequest/LoadingRequest";
import ActionCompleteComp from "../components/ActionCompleteComp/ActionCompleteComp";

// PrivateRoute (Login Author)
import PrivateRoute from "./Login/PrivateRoute/PrivateRoute";

const RootLayout = () => {
	const [cookies] = useCookies(["access_token"]);
	// To open and close side bar in mobile screen
	const [openSidebar, setOpenSidebar] = React.useState(false);

	// Context That open app Modal
	const contextStore = useContext(Context);
	const { title } = contextStore;
	const DeleteStore = useContext(DeleteContext);
	const LoadingStore = useContext(LoadingContext);
	const NotificationStore = useContext(NotificationContext);
	const { notificationTitle } = NotificationStore;
	const { loadingTitle } = LoadingStore;
	const { actionDelete } = DeleteStore;

	// To handle Open Verify Modal
	const { isOpenVerifyModal, verificationStoreStatus } = useSelector(
		(state) => state.VerifyModal
	);

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
	const { isOpenCelebrityMarketingModal } = useSelector(
		(state) => state.CelebrityMarketingModal
	);

	const dispatch = useDispatch(false);
	const dispatchVerifyModal = useDispatch(false);

	useEffect(() => {
		dispatch(StoreVerificationThunk(cookies?.access_token));
	}, [dispatch]);

	// This is modal verification Store Status message That is display after dashboard is open
	useEffect(() => {
		const debounce = setTimeout(() => {
			if (
				verificationStoreStatus === "لم يتم الطلب" ||
				verificationStoreStatus === "جاري التوثيق" ||
				verificationStoreStatus === "طلب جديد" ||
				verificationStoreStatus === "التوثيق مرفوض"
			) {
				dispatchVerifyModal(openVerifyModal());
			}
		}, 100);

		return () => {
			clearTimeout(debounce);
		};
	}, [verificationStoreStatus]);

	return (
		<PrivateRoute>
			<ThemeProvider theme={theme}>
				<CssBaseline>
					<div className='app'>
						<TopBar
							toggleSidebar={() => {
								setOpenSidebar(!openSidebar);
							}}
						/>

						{title && <ActionCompleteComp />}
						{actionDelete && <DeleteOneModal />}
						{loadingTitle && <LoadingRequest />}
						{notificationTitle && <DeleteModal />}
						{isOpenVerifyModal && <VerifyStoreModal />}
						{isVerifyStoreAlertOpen && <VerifayStoreAlert />}
						{isOpenMaintenanceModeModal && <MaintenanceMode />}
						{isVerifyAfterMainOpen && <VerifayAfterMainInfoAlert />}

						{/* This modal is hidden currently 
						
						{isOpenCelebrityMarketingModal && (
							<CelebrityMarketingModal></CelebrityMarketingModal>
						)}
					*/}
						<main className='content'>
							<div className='row'>
								<div className='sidebar-col'>
									<SideBar
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
	);
};

export default RootLayout;
