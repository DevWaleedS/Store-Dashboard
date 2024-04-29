import React, { useContext, useState } from "react";

// MUI
import Badge from "@mui/material/Badge";
import { Avatar, Skeleton } from "@mui/material";

// icons
import { MdNotifications } from "react-icons/md";

// Third Party
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

// RTK Query
import {
	useDeleteAllNotificationsMutation,
	useGetNotificationsQuery,
	useMarkSingleNotificationAsReadMutation,
} from "../../../store/apiSlices/notificationsApi";

// Context
import Context from "../../../Context/context";

const Notifications = () => {
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	const navigate = useNavigate();
	const [closeMenu, setCloseMenu] = useState(false);
	const [countOfNotifications, setCountOfNotifications] = useState(false);

	// get notification from api
	const {
		data: notification,
		isFetching,
		isLoading,
	} = useGetNotificationsQuery({
		page: localStorage.getItem("notificationPageTarget") || 1,
		number: localStorage.getItem("notificationRowsCount") || 10,
	});

	// ---------------------------------------------------------

	// Mark single notification as read
	const [markSingleNotificationAsRead] =
		useMarkSingleNotificationAsReadMutation();

	const handleMarkSingleNotificationAsRead = async (id) => {
		if (notification?.count_of_notifications === 0) return;

		try {
			await markSingleNotificationAsRead({ notificationId: id })
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					}
				});
		} catch (err) {
			console.error("Failed to delete the markSingleNotificationAsRead", err);
		}
	};
	/* ------------------------------------------------------------------------------- */

	// Delete Notification
	const [deleteAllNotifications] = useDeleteAllNotificationsMutation();
	const handleDeleteAllItems = async () => {
		const queryParams = notification?.notifications
			?.map((not) => `id[]=${not?.id}`)
			.join("&");
		try {
			await deleteAllNotifications({ selected: queryParams })
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					} else {
						setEndActionTitle(data?.message?.ar);
					}
				});
		} catch (err) {
			console.error("Failed to delete the deleteAllNotifications", err);
		}
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
					badgeContent={
						countOfNotifications ? 0 : notification?.count_of_notifications
					}
					sx={{
						"& .MuiBadge-badge": {
							backgroundColor: "#ffc06a",
							border: "1px solid #fff",
							color: "#fff",
						},
					}}>
					<MdNotifications
						onClick={() => {
							setCountOfNotifications(true);
						}}
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
				{notification?.notifications.length === 0 ? (
					<></>
				) : (
					<div
						className='d-flex justify-content-between align-items-center mb-2 px-3 notification-header'
						style={{ direction: "ltr" }}>
						<span
							onClick={handleDeleteAllItems}
							className='delete-notifications'>
							حذف الكل
						</span>
						<span className='notifications-title'>الاشعارات</span>
					</div>
				)}
				{notification?.notifications.length === 0 ? (
					<div className='notification-wrapper'>
						<div className='h-100 d-flex flex-column align-items-center justify-content-center'>
							<p style={{ direction: "ltr" }}>!لايوجد اشعارات حتى هذه اللحظة</p>
						</div>
					</div>
				) : (
					<div className='notification-wrapper'>
						{isLoading || isFetching ? (
							<>
								<li>
									<div className='dropdown-item d-flex flex-row-reverse justify-content-end align-items-center'>
										<div
											className='me-2 text-overflow '
											style={{ textAlign: "right" }}>
											<span className=' user-name'>
												<Skeleton width={200} height={20} />
											</span>
											<span className='notification-data'>
												<Skeleton width={230} height={30} />
											</span>
										</div>
										<Skeleton variant='circular'>
											<Avatar />
										</Skeleton>
									</div>
								</li>
								<li>
									<div className='dropdown-item d-flex flex-row-reverse justify-content-end align-items-center'>
										<div
											className='me-2 text-overflow '
											style={{ textAlign: "right" }}>
											<span className=' user-name'>
												<Skeleton width={200} height={20} />
											</span>
											<span className='notification-data'>
												<Skeleton width={230} height={30} />
											</span>
										</div>
										<Skeleton variant='circular'>
											<Avatar />
										</Skeleton>
									</div>
								</li>
								<li>
									<div className='dropdown-item d-flex flex-row-reverse justify-content-end align-items-center'>
										<div
											className='me-2 text-overflow '
											style={{ textAlign: "right" }}>
											<span className=' user-name'>
												<Skeleton width={200} height={20} />
											</span>
											<span className='notification-data'>
												<Skeleton width={230} height={30} />
											</span>
										</div>
										<Skeleton variant='circular'>
											<Avatar />
										</Skeleton>
									</div>
								</li>
								<li>
									<div className='dropdown-item d-flex flex-row-reverse justify-content-end align-items-center'>
										<div
											className='me-2 text-overflow '
											style={{ textAlign: "right" }}>
											<span className=' user-name'>
												<Skeleton width={200} height={20} />
											</span>
											<span className='notification-data'>
												<Skeleton width={230} height={30} />
											</span>
										</div>
										<Skeleton variant='circular'>
											<Avatar />
										</Skeleton>
									</div>
								</li>
							</>
						) : (
							notification?.notifications?.map((not, index) => (
								<li
									key={index}
									className={`${
										not?.read_at === null || not?.read_at === ""
											? "un-read"
											: ""
									}`}
									onClick={() => {
										setCloseMenu(!closeMenu);
										navigate("/Notifications");
										handleMarkSingleNotificationAsRead(not?.id);
									}}>
									<div className='dropdown-item d-flex flex-row-reverse justify-content-end align-items-center'>
										<div
											className='me-2 text-overflow '
											style={{ textAlign: "right" }}>
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
												} notification-data`}
												dangerouslySetInnerHTML={{
													__html: not?.message,
												}}></span>
										</div>
										<img
											className='img-fluid notification_img_style'
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
