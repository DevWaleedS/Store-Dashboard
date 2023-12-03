import React, { useState } from "react";

// MUI
import Badge from "@mui/material/Badge";

// icons
import { MdNotifications } from "react-icons/md";

// Third Party
import axios from "axios";
import { useCookies } from "react-cookie";
import useFetch from "../../../Hooks/UseFetch";
import { useNavigate } from "react-router-dom";

// Loading Component
import CircularLoading from "../../../HelperComponents/CircularLoading";
import { toast } from "react-toastify";

const Notifications = () => {
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);
	const [loading, setLoading] = useState(false);
	const [closeMenu, setCloseMenu] = useState(false);

	// calling notifications
	const { fetchedData, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/NotificationIndex"
	);
	// ---------------------------------------------------------

	// Mark single notification as read
	const markSingleNotificationAsRead = (id) => {
		if (fetchedData?.data?.count_of_notifications === 0) return;

		axios
			.get(`https://backend.atlbha.com/api/Store/NotificationRead?id[]=${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies?.access_token}`,
				},
			})
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setReload(!reload);
				} else {
					setReload(!reload);
				}
			});
	};
	/* ------------------------------------------------------------------------------- */

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
					setLoading(!loading);
				} else {
					toast.error(res?.data?.message?.ar || res?.data?.message?.en, {
						theme: "light",
					});
				}
			});
	};
	// ------------------------------------------

	return (
		<li className='nav-item notification '>
			<div
				id='dropdownMenuClickableInside'
				data-bs-toggle='dropdown'
				data-bs-auto-close={closeMenu ? true : false}
				aria-expanded='false'
				className='nav-link'>
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

			<ul
				aria-labelledby='dropdownMenuClickableInside'
				className={`${
					closeMenu ? true : false
				} dropdown-menu notification-dropdown`}
				style={{ direction: "rtl" }}>
				{fetchedData?.data?.notifications.length === 0 ? (
					<></>
				) : (
					<div
						className='d-flex justify-content-between align-items-center mb-2 px-3 notification-header'
						style={{ direction: "ltr" }}>
						<span
							onClick={deleteNotifications}
							className='delete-notifications'>
							حذف الكل
						</span>
						<span className='notifications-title'>الاشعارات</span>
					</div>
				)}
				{fetchedData?.data?.notifications.length === 0 ? (
					<div className='notification-wrapper'>
						<div className='h-100 d-flex flex-column align-items-center justify-content-center'>
							<p style={{ direction: "ltr" }}>!لايوجد اشعارات حتى هذه اللحظة</p>
						</div>
					</div>
				) : (
					<div className='notification-wrapper'>
						{loading ? (
							<div className='notification-wrapper'>
								<div className='h-100 d-flex flex-column align-items-center justify-content-center'>
									<CircularLoading />
								</div>
							</div>
						) : (
							fetchedData?.data?.notifications?.map((not, index) => (
								<li
									key={index}
									className={`${
										not?.read_at === null || not?.read_at === ""
											? "un-read"
											: ""
									}`}
									onClick={() => {
										setReload(!reload);
										setCloseMenu(!closeMenu);
										navigate("/Notifications");
										markSingleNotificationAsRead(not?.id);
									}}>
									<div
										className='dropdown-item d-flex flex-row-reverse justify-content-end align-items-center text-overflow '
										to='UserDetails'>
										<div className='me-2 text-overflow '>
											<span
												className={`${
													not?.read_at === null || not?.read_at === ""
														? "un-read"
														: ""
												} user-name`}>
												{not?.user[0]?.name}
											</span>
											<span
												className={`${
													not?.read_at === null || not?.read_at === ""
														? "un-read"
														: ""
												} notification-data`}>
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
					</div>
				)}
			</ul>
		</li>
	);
};

export default Notifications;
