import React, { useEffect, useContext } from "react";

// MUI
import { Box, styled, useTheme } from "@mui/material";
import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";

// Icons and images
import { IoIosArrowDown } from "react-icons/io";
import { ReactComponent as UserIcon } from "../../../data/Icons/icon-24-client.svg";
import { ReactComponent as LogOutIcon } from "../../../data/Icons/icon-24-sign out.svg";

// Third Party
import axios from "axios";
import { tokens } from "../../../Theme";
import useFetch from "../../../Hooks/UseFetch";
import { Link, useNavigate } from "react-router-dom";
import { UserAuth } from "../../../Context/UserAuthorProvider";

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
const UserProfileImage = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	// Avatar Colors
	const theme = useTheme();
	const colors = tokens(theme.palette);

	const navigate = useNavigate();

	// TO SET THE NAME AND IMAGE TO CONTEXT
	const UserInfo = useContext(UserAuth);
	const { userInfo, setUserInfo } = UserInfo;

	// to get the user profile info
	const { fetchedData: profile } = useFetch("profile");

	// to set data to the user aut
	useEffect(() => {
		if (profile) {
			setUserInfo({
				name: profile?.data?.users?.name,
				username: profile?.data?.users?.user_name,
				user_image: profile?.data?.users?.image,
			});
		}
	}, [profile]);
	// -----------------------------------------------------------------------------

	// To log out from dashboard!
	const logOut = () => {
		// Clear all cookies
		for (const cookie of document.cookie.split(";")) {
			const [name, value] = cookie.trim().split("=");

			// Set the cookie's expiration to a past date to delete it
			document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
		}

		axios
			.get("https://backend.atlbha.com/api/logout", {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${store_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					localStorage.clear();

					navigate("/auth/login");
				} else {
					console.log(res?.data?.message?.ar);
				}
			});
	};
	return (
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
							{userInfo?.name !== null
								? userInfo?.name === "null"
									? userInfo?.username
									: userInfo?.name
								: userInfo?.username || "اسم التاجر"}
						</span>
						<IoIosArrowDown />
					</div>

					{/** avatar img  */}
					<StyledBadge
						overlap='circular'
						anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
						variant='dot'>
						<Avatar
							sx={{ border: "2px solid #ddd" }}
							alt='avatarImage'
							src={profile?.data?.users?.image || userInfo?.user_image}
						/>
					</StyledBadge>
				</Box>
				<ul className='dropdown-menu user-info-dropdown'>
					<li className=''>
						<Link
							className='dropdown-item d-flex justify-content-end align-items-center'
							to='EditUserDetails'>
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
	);
};

export default UserProfileImage;
