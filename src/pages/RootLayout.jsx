import React, { useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { StoreVerificationThunk } from "../store/Thunk/storeVerificationThunk";
import { openVerifyModal } from "../store/slices/VerifyStoreModal-slice";

import Context from "../Context/context";
import { NotificationContext } from "../Context/NotificationProvider";
import { LoadingContext } from "../Context/LoadingProvider";
import { DeleteContext } from "../Context/DeleteProvider";
import { theme } from "../Theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Outlet, ScrollRestoration } from "react-router-dom";
import TopBar from "../global/TopBar";
import SideBar from "../global/SideBar";

import VerifyStoreModal from "../components/VerifyStoreModal";
import VerifayStoreAlert from "../components/VerifayStoreAlert";
import VerifayStoreAfterMainInfoAlert from "../components/VerifayStoreAlertAfterMainInfo";
import MaintenanceMode from "./MaintenanceMode";
import CelebrityMarketingModal from "./CelebrityMarketingModal";
import ActionCompleteComp from "../components/ActionCompleteComp/ActionCompleteComp";
import DeleteModal from "../components/DeleteModal/DeleteModal";
import DeleteOneModal from "../components/DeleteOneModal/DeleteOneModal";
import LoadingRequest from "../components/LoadingRequest/LoadingRequest";
import { useCookies } from "react-cookie";

import PrivateRoute from "./Login/PrivateRoute/PrivateRoute";

const RootLayout = () => {
	const [cookies] = useCookies(["access_token"]);
	const [openSidebar, setOpenSidebar] = React.useState(false);
	const contextStore = useContext(Context);
	const NotificationStore = useContext(NotificationContext);
	const LoadingStore = useContext(LoadingContext);
	const DeleteStore = useContext(DeleteContext);
	const { title } = contextStore;
	const { notificationTitle } = NotificationStore;
	const { loadingTitle } = LoadingStore;
	const { actionDelete } = DeleteStore;
	const { isOpenVerifyModal, verificationStoreStatus } = useSelector(
		(state) => state.VerifyModal
	);

	const { isOpenMaintenanceModeModal } = useSelector(
		(state) => state.MaintenanceModeModal
	);
	const { isVerifyStoreAlertOpen } = useSelector(
		(state) => state.VerifyStoreAlertModal
	);
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

	useEffect(() => {
		if (
			verificationStoreStatus === "لم يتم الطلب" ||
			verificationStoreStatus === "جاري التوثيق" ||
			verificationStoreStatus === "طلب جديد"
		) {
			const debounce = setTimeout(() => {
				dispatchVerifyModal(openVerifyModal());
			}, 100);

			return () => {
				clearTimeout(debounce);
			};
		}
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

						{title && <ActionCompleteComp></ActionCompleteComp>}
						{notificationTitle && <DeleteModal></DeleteModal>}
						{actionDelete && <DeleteOneModal></DeleteOneModal>}
						{loadingTitle && <LoadingRequest></LoadingRequest>}
						{isOpenMaintenanceModeModal && <MaintenanceMode></MaintenanceMode>}
						{isOpenVerifyModal && <VerifyStoreModal></VerifyStoreModal>}
						{isVerifyStoreAlertOpen && <VerifayStoreAlert></VerifayStoreAlert>}
						{isVerifyAfterMainOpen && <VerifayStoreAfterMainInfoAlert></VerifayStoreAfterMainInfoAlert>}
						{isOpenCelebrityMarketingModal && (
							<CelebrityMarketingModal></CelebrityMarketingModal>
						)}
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
