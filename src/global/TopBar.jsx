import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useFetch from '../Hooks/UseFetch';
import CircularLoading from '../HelperComponents/CircularLoading';
import axios from 'axios';
import { NotificationContext } from '../Context/NotificationProvider';
import { useCookies } from 'react-cookie';

// MUI
import { Box, useTheme } from '@mui/material';
import { tokens } from '../Theme';
import { Avatar } from '@mui/material';

// images and icons
import notification from '../data/Icons/icon-Notification.svg';
import demoLogo from '../data/Icons/logo.png';

// Icons
import { IoIosArrowDown } from 'react-icons/io';
import { AiOutlineSearch } from 'react-icons/ai';
import MenuIcon from '@mui/icons-material/Menu';
import { ReactComponent as LogOutIcon } from '../data/Icons/icon-24-sign out.svg';
import { ReactComponent as UserIcon } from '../data/Icons/icon-24-client.svg';

const TopBar = ({ toggleSidebar }) => {
	const [cookies, removeCookies] = useCookies(['access_token']);

	// to change logo
	const { fetchedData: setting } = useFetch('https://backend.atlbha.com/api/Store/setting_store_show');
	const newLogo = setting?.data?.setting_store?.logo;
	localStorage.setItem('store_domain', setting?.data?.setting_store?.domain || '');

	// to get notification
	const { fetchedData, loading, reload, setReload } = useFetch('https://backend.atlbha.com/api/Store/NotificationIndex');

	// to get the user profile info
	const { fetchedData: profile } = useFetch('https://backend.atlbha.com/api/Store/profile');
	localStorage.setItem('user_name', profile?.data?.users?.name);
	localStorage.setItem('user_image', profile?.data?.users?.image);
	const theme = useTheme();
	const NotificationStore = useContext(NotificationContext);
	const { setEndActionTitle } = NotificationStore;
	const colors = tokens(theme.palette);
	const navigate = useNavigate();

	const deleteNotifications = () => {
		const queryParams = fetchedData?.data?.notifications?.map((not) => `id[]=${not?.id}`).join('&');
		axios
			.get(`https://backend.atlbha.com/api/Store/NotificationDeleteAll?${queryParams}`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				} else {
					setEndActionTitle(res?.data?.message?.ar);
					setReload(!reload);
				}
			});
	};


	// To log out from dashboard!
	const logOut = () => {
		
		axios
			.get('https://backend.atlbha.com/api/logout', {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookies.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
				
					localStorage.clear();
					removeCookies("access_token", { path: "/", domain: "store.atlbha.com" });
					window.location.href = 'https://home.atlbha.com/signInPage';
				} else {
					console.log(res?.data?.message?.ar);
				
				}
			});
		
		
	};

	return (
		<Box className='top-bar' backgroundColor={colors.second[400]}>
			<nav className='navbar navbar-expand-lg ' dir='ltr'>
				<div className='container'>
					<div className='navbar-brand d-md-flex d-none' style={{ width: '70px', height: '65.59px' }}>
						<img className=' img-fluid' style={{ objectFit: 'contain' }} src={newLogo ? newLogo : demoLogo} alt='logo' />
					</div>

					<div className='w-100 d-flex flex-row-reverse align-items-center justify-content-between' id='navbarSupportedContent'>
						<MenuIcon
							onClick={() => {
								toggleSidebar();
							}}
							className='navbar-menu-icon d-md-none d-flex'
						/>
						<ul className='navbar-nav ms-md-auto ms-0 d-flex align-items-lg-center justify-content-between'>
							{/** Search-box */}
							<li className='nav-item search-box d-md-flex d-none'>
								<input type='text' name='search' id='search' className='input' placeholder='أدخل كلمة البحث' />
								<AiOutlineSearch />
							</li>

							{/** notification */}
							<li className='nav-item notification '>
								<div className='nav-link dropdown' data-bs-toggle='dropdown' aria-expanded='false'>
									<img src={notification} alt='notification' />
								</div>
								<ul className='dropdown-menu notification-dropdown'>
									{fetchedData?.data?.notifications.length === 0 ? (
										<></>
									) : (
										<div className='d-flex justify-content-between align-items-center mb-2 px-3 notification-header'>
											<span onClick={() => deleteNotifications()} className='delete-notifications'>
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
											<li key={index} className='' onClick={() => navigate('/Notifications')}>
												<div className='dropdown-item d-flex justify-content-end align-items-center' to='UserDetails'>
													<div className='me-2'>
														<span className='user-name'>{not?.user[0]?.name}</span>
														<span className='notification-data'>{not?.message}</span>
													</div>
													<img width={35} height={35} className='img-fluid' src={not?.user[0]?.image} alt={not?.user[0]?.name} />
												</div>
											</li>
										))
									)}
								</ul>
							</li>

							{/** avatar-box */}
							<ul className='nav-item avatar-box'>
								{/** dropdown */}
								<li li className='nav-item dropdown d-flex align-items-end avatar-dropdown'>
									<Box className='nav-link  dropdown-wrapper' href='#' data-bs-toggle='dropdown' aria-expanded='false' color={colors.white[300]}>
										<div className='dropdown-title d-md-flex align-items-center d-none'>
											<span className='me-1 '>{profile?.data?.users?.name === 'null' ? '' : profile?.data?.users?.name || 'التاجر'}</span>
											<IoIosArrowDown />
										</div>
										{/** avatar img  */}
										<Avatar alt='avatarImage' src={profile?.data?.users?.image || localStorage.getItem('user_image')} />
									</Box>
									<ul className='dropdown-menu user-info-dropdown'>
										<li className=''>
											<Link className='dropdown-item d-flex justify-content-end align-items-center' to='UserDetails'>
												<span className='me-2'>حسابي</span>
												<UserIcon />
											</Link>
										</li>
										<li className=''>
											<Link className='dropdown-item d-flex justify-content-end align-items-center' to='' onClick={logOut}>
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
