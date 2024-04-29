import React, { useContext } from "react";

// COMPONENTS
import StoreLogo from "./StoreLogo/StoreLogo";
import Notifications from "./Notifications/Notifications";
import UserProfileImage from "./UserProfileImage/UserProfileImage";
import TopBarSearchInput from "./TopBarSearchInput/TopBarSearchInput";

// Context
import Context from "../../Context/context";

// MUI
import { tokens } from "../../Theme";
import { Box, useTheme } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

// RTK Query
import { useGetUserProfileDataQuery } from "../../store/apiSlices/editUserDetailsApi";
import { useGetMainInformationQuery } from "../../store/apiSlices/mainInformationApi";

const TopBar = ({ toggleSidebar }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette);

	// To change z-index of navbar when maintain mode is open
	const Z_index = useContext(Context);
	const { navbarZindex } = Z_index;

	// get user profile data from api...
	const { data: userProfileData, isFetching: isProfileFetching } =
		useGetUserProfileDataQuery();

	// To show the store info that come from api
	const { data: mainInformation, isFetching } = useGetMainInformationQuery();

	return (
		<Box
			className={` ${navbarZindex ? "top-bar zIndex" : "top-bar"} `}
			backgroundColor={colors.second[400]}>
			<nav className='navbar navbar-expand-lg ' dir='ltr'>
				<div className='container'>
					{/* Store logo component */}
					<StoreLogo
						isFetching={isFetching}
						storeLogo={mainInformation?.logo}
					/>

					<div
						className='w-100 d-flex flex-row-reverse align-items-center justify-content-between'
						id='navbarSupportedContent'>
						{/* Menu Mobile Icon */}
						<MenuIcon
							onClick={() => {
								toggleSidebar();
							}}
							className='navbar-menu-icon d-md-none d-flex'
						/>
						<ul className='navbar-nav ms-md-auto ms-0 d-flex align-items-lg-center justify-content-between'>
							{/** Search Input Component */}
							<li className='nav-item search-box d-md-flex d-none'>
								<TopBarSearchInput />
							</li>

							{/** notification Component */}
							<Notifications />

							{/** UserProfileImage Component */}
							<UserProfileImage
								isFetching={isProfileFetching}
								name={userProfileData?.name}
								userName={userProfileData?.username}
								userImage={userProfileData?.image}
							/>
						</ul>
					</div>
				</div>
			</nav>
		</Box>
	);
};

export default TopBar;
