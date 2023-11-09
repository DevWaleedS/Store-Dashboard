import React from "react";

// MUI
import Badge from "@mui/material/Badge";

// icons
import { MdNotifications } from "react-icons/md";

// Third Party
import axios from "axios";
import { useCookies } from "react-cookie";
import useFetch from "../../../Hooks/UseFetch";
import { useNavigate } from "react-router-dom";

const Notifications = () => {
	const navigate = useNavigate();
	const [cookies] = useCookies(["access_token"]);
	// calling notifications
	const { fetchedData, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/NotificationIndex"
	);
	// ---------------------------------------------------------

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

	return (
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
				{fetchedData?.data?.notifications.length === 0 ? (
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
									<span className='user-name'>{not?.user[0]?.name}</span>
									<span className='notification-data'>{not?.message}</span>
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
	);
};

export default Notifications;
