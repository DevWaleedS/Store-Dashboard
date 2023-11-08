import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// Helper component ( Loader Component )
import CircularLoading from "../HelperComponents/CircularLoading";

// Third party
import axios from "axios";
import useFetch from "../Hooks/UseFetch";
import { useCookies } from "react-cookie";

// Context
import Context from "../Context/context";
import { UserAuth } from "../Context/UserAuthorProvider";

// MUI
import { Box, styled, useTheme } from "@mui/material";
import { tokens } from "../Theme";
import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";

// images and icons
import demoLogo from "../data/Icons/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import { AiOutlineSearch } from "react-icons/ai";
import { IoIosArrowDown } from "react-icons/io";
import { MdNotifications } from "react-icons/md";
import { ReactComponent as UserIcon } from "../data/Icons/icon-24-client.svg";
import { ReactComponent as LogOutIcon } from "../data/Icons/icon-24-sign out.svg";

// NotificationSound
import notificationSound from "../data/notificationSound/out-of-nowhere-message-tone.mp3";

// Style dot active on avatar image
const StyledBadge = styled(Badge)(({ theme }) => ({
	"& .MuiBadge-badge": {
		backgroundColor: "#44b700",
		color: "#44b700",
		boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
		"&::after": {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			height: "100%",
			borderRadius: "50%",
			animation: "ripple 1.2s infinite ease-in-out",
			border: "1px solid currentColor",
			content: '""',
		},
	},
	"@keyframes ripple": {
		"0%": {
			transform: "scale(.8)",
			opacity: 1,
		},
		"100%": {
			transform: "scale(2.4)",
			opacity: 0,
		},
	},
}));

const TopBar = ({ toggleSidebar }) => {
	const theme = useTheme();
	const navigate = useNavigate();
	const colors = tokens(theme.palette);
	const [cookies] = useCookies(["access_token"]);

	// TO SET THE NAME AND IMAGE TO CONTEXT
	const UserInfo = useContext(UserAuth);
	const { userInfo, setUserInfo } = UserInfo;

	// To change z-index of navbar when maintain mode is open
	const Z_index = useContext(Context);
	const { navbarZindex } = Z_index;

	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/NotificationIndex"
	);

	// to get the user profile info
	const { fetchedData: profile } = useFetch(
		"https://backend.atlbha.com/api/Store/profile"
	);

	const { fetchedData: store_Setting } = useFetch(
		"https://backend.atlbha.com/api/Store/setting_store_show"
	);
	// to set the store logo to local storage
	localStorage.setItem("storeLogo", store_Setting?.data?.setting_store?.logo);
	// to set data to the user aut
	useEffect(() => {
		if (profile) {
			setUserInfo({
				user_name: profile?.data?.users?.user_name,
				name: profile?.data?.users?.name,
				user_image: profile?.data?.users?.image,
			});
		}
	}, [profile]);

	// handle play notification sound if the fetchedData?.data?.count_of_notifications is !== 0
	const Sound = new Audio(notificationSound);

	// Function to play the notification sound
	function playNotificationSound() {
		Sound.play().catch((error) => {
			console.error("Failed to play the notification sound:", error);
		});
	}

	useEffect(() => {
		const debounce = setTimeout(() => {
			if (
				!document.hasFocus() ||
				fetchedData?.data?.count_of_notifications !== 0
			) {
				playNotificationSound();
			}
		}, 1000);
		return () => {
			clearTimeout(debounce);
		};
	}, [fetchedData?.data?.count_of_notifications]);

	// Mark a notification as read
	const markNotificationAsRead = (e) => {
		if (fetchedData?.data?.count_of_notifications === 0) return;

		const queryParams = fetchedData?.data?.notifications
			?.map((not) => `id[]=${not?.id}`)
			.join("&");
		axios
			.get(
				`https://backend.atlbha.com/api/Store/NotificationRead?${queryParams}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setReload(!reload);
				} else {
					setReload(!reload);
				}
			});
	};

	// Delete Notification
	const deleteNotifications = () => {
		const queryParams = fetchedData?.data?.notifications
			?.map((not) => `id[]=${not?.id}`)
			.join("&");
		axios
			.get(
				`https://backend.atlbha.com/api/Store/NotificationDeleteAll?${queryParams}`,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${cookies?.access_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setReload(!reload);
				} else {
					setReload(!reload);
				}
			});
	};
	// ------------------------------------------

	// To log out from dashboard!
	const logOut = () => {
		axios
			.get("https://backend.atlbha.com/api/logout", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					document.cookie =
						"access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

					navigate("/Login");
				} else {
					console.log(res?.data?.message?.ar);
				}
			});
	};

	return (
		<Box
			className={` ${navbarZindex ? "top-bar zIndex" : "top-bar"} `}
			backgroundColor={colors.second[400]}>
			<nav className='navbar navbar-expand-lg ' dir='ltr'>
				<div className='container'>
					<div
						className='navbar-brand d-md-flex d-none'
						style={{ width: "70px", height: "65.59px" }}>
						<img
							className=' img-fluid'
							style={{ objectFit: "contain" }}
							src={
								localStorage.getItem("storeLogo")
									? localStorage.getItem("storeLogo")
									: demoLogo
							}
							alt=''
						/>
					</div>

					<div
						className='w-100 d-flex flex-row-reverse align-items-center justify-content-between'
						id='navbarSupportedContent'>
						<MenuIcon
							onClick={() => {
								toggleSidebar();
							}}
							className='navbar-menu-icon d-md-none d-flex'
						/>
						<ul className='navbar-nav ms-md-auto ms-0 d-flex align-items-lg-center justify-content-between'>
							{/** Search-box */}
							<li className='nav-item search-box d-md-flex d-none'>
								<input
									type='text'
									name='search'
									id='search'
									className='input'
									placeholder='أدخل كلمة البحث'
								/>
								<AiOutlineSearch />
							</li>

							{/** notification */}
							<li className='nav-item notification '>
								<div
									className='nav-link dropdown'
									data-bs-toggle='dropdown'
									aria-expanded='false'
									onClick={() => {
										markNotificationAsRead();
									}}>
									<Badge
										max={50}
										badgeContent={fetchedData?.data?.count_of_notifications}
										sx={{
											"& .MuiBadge-badge": {
												backgroundColor: "#ffc06a",
												border: "1px solid #fff",
												color: "#fff",
											},
										}}>
										<MdNotifications
											title='الاشعارات'
											style={{ width: "24px", height: "24px", fill: "#03476a" }}
										/>
									</Badge>
								</div>

								<ul className='dropdown-menu notification-dropdown'>
									{fetchedData?.data?.notifications.length === 0 ? (
										<></>
									) : (
										<div className='d-flex justify-content-between align-items-center mb-2 px-3 notification-header'>
											<span
												onClick={() => deleteNotifications()}
												className='delete-notifications'>
												حذف الكل
											</span>
											<span className='notifications-title'>الاشعارات</span>
										</div>
									)}
									{loading ? (
										<div className='h-100 d-flex flex-column align-items-center justify-content-center'>
											<CircularLoading />
										</div>
									) : fetchedData?.data?.notifications.length === 0 ? (
										<div className='h-100 d-flex flex-column align-items-center justify-content-center'>
											<p>!لايوجد اشعارات حتى هذه اللحظة</p>
										</div>
									) : (
										fetchedData?.data?.notifications?.map((not, index) => (
											<li
												key={index}
												className=''
												onClick={() => {
													navigate("/Notifications");
												}}>
												<div
													className='dropdown-item d-flex justify-content-end align-items-center text-overflow '
													to='UserDetails'>
													<div className='me-2'>
														<span className='user-name'>
															{not?.user[0]?.name}
														</span>
														<span className='notification-data'>
															{not?.message}
														</span>
													</div>
													<img
														width={35}
														height={35}
														className='img-fluid'
														src={not?.user[0]?.image}
														alt={not?.user[0]?.name}
													/>
												</div>
											</li>
										))
									)}
								</ul>
							</li>

							{/** avatar-box */}
							<ul className='nav-item avatar-box'>
								{/** dropdown */}
								<li className='nav-item dropdown d-flex align-items-end avatar-dropdown'>
									<Box
										className='nav-link dropdown-wrapper'
										href='#'
										data-bs-toggle='dropdown'
										aria-expanded='false'
										color={colors.white[300]}>
										<div className='dropdown-title d-md-flex align-items-center d-none'>
											<span className='me-1 '>
												{userInfo?.name === null
													? userInfo?.user_name || "التاجر"
													: userInfo?.name}
											</span>
											<IoIosArrowDown />
										</div>

										{/** avatar img  */}
										<StyledBadge
											overlap='circular'
											anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
											variant='dot'>
											<Avatar
												alt='avatarImage'
												src={
													profile?.data?.users?.image || userInfo?.user_image
												}
											/>
										</StyledBadge>
									</Box>
									<ul className='dropdown-menu user-info-dropdown'>
										<li className=''>
											<Link
												className='dropdown-item d-flex justify-content-end align-items-center'
												to='UserDetails'>
												<span className='me-2'>حسابي</span>
												<UserIcon />
											</Link>
										</li>
										<li className=''>
											<Link
												className='dropdown-item d-flex justify-content-end align-items-center'
												to=''
												onClick={logOut}>
												<span className='me-2'>تسجيل الخروج</span>
												<LogOutIcon />
											</Link>
										</li>
									</ul>
								</li>
							</ul>
						</ul>
					</div>
				</div>
			</nav>
		</Box>
	);
};

export default TopBar;
