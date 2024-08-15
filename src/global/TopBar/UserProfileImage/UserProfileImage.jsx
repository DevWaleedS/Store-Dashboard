import React from "react";

// MUI
import { Box, Skeleton, styled, useTheme } from "@mui/material";
import { Avatar } from "@mui/material";
import Badge from "@mui/material/Badge";

// Icons and images
import { IoIosArrowDown } from "react-icons/io";
import { ReactComponent as UserIcon } from "../../../data/Icons/icon-24-client.svg";
import { ReactComponent as LogOutIcon } from "../../../data/Icons/icon-24-sign out.svg";

// Third Party
import { toast } from "react-toastify";

import { tokens } from "../../../Theme";
import { Link, useNavigate } from "react-router-dom";

// RTK QUERY
import { useLogOutMutation } from "../../../store/apiSlices/logOutApi";
import { MdVerified } from "react-icons/md";

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
	// Avatar Colors
	const theme = useTheme();
	const colors = tokens(theme.palette);
	const navigate = useNavigate();

	// -----------------------------------------------------------------------------

	// To log out from dashboard!
	const [logOut, { isLoading }] = useLogOutMutation();
	const handleLogOut = async () => {
		// make request...
		try {
			const response = await logOut();

			if (
				response.data?.success === true &&
				response.data?.data?.status === 200
			) {
				localStorage.clear();
				navigate("/auth/login");
				window.location.reload();
			} else {
				// Handle display errors using toast notifications
				toast.error(
					response?.data?.message?.ar
						? response.data.message.ar
						: response.data.message.en,
					{
						theme: "light",
					}
				);
			}
		} catch (error) {
			console.error("Error changing logout:", error);
		}
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
					{(localStorage.getItem("name") || localStorage.getItem("userName")) &&
					localStorage.getItem("userImage") ? (
						<>
							<div className='dropdown-title d-md-flex align-items-center d-none'>
								<IoIosArrowDown />
								<span className='me-1 '>
									{localStorage.getItem("name") !== null
										? localStorage.getItem("name") === "null"
											? localStorage.getItem("userName")
											: localStorage.getItem("name")
										: localStorage.getItem("name") || "اسم التاجر"}
								</span>
							</div>

							<StyledBadge
								overlap='circular'
								anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
								variant='dot'>
								<Avatar
									sx={{ border: "2px solid #ddd" }}
									alt='avatarImage'
									src={localStorage.getItem("userImage")}
								/>
							</StyledBadge>
						</>
					) : (
						<>
							{" "}
							<Skeleton width={120} height={15} />
							<Skeleton variant='circular'>
								<Avatar />
							</Skeleton>
						</>
					)}
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
						<button
							disabled={isLoading}
							className='dropdown-item d-flex justify-content-end align-items-center'
							onClick={handleLogOut}>
							<span className='me-2'>تسجيل الخروج</span>
							<LogOutIcon />
						</button>
					</li>
				</ul>
			</li>
		</ul>
	);
};

export default UserProfileImage;
