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

const TopBar = ({ toggleSidebar }) => {
	const theme = useTheme();
	const colors = tokens(theme.palette);

	// To change z-index of navbar when maintain mode is open
	const Z_index = useContext(Context);
	const { navbarZindex } = Z_index;

	return (
		<Box
			className={` ${navbarZindex ? "top-bar zIndex" : "top-bar"} `}
			backgroundColor={colors.second[400]}>
			<nav className='navbar navbar-expand-lg ' dir='ltr'>
				<div className='container'>
					{/* Store logo component */}
					<StoreLogo />

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
							<TopBarSearchInput />

							{/** notification Component */}
							<Notifications />

							{/** UserProfileImage Component */}
							<UserProfileImage />
						</ul>
					</div>
				</div>
			</nav>
		</Box>
	);
};

export default TopBar;
