import React, { useState } from "react";

export const NotificationContext = React.createContext({});

const NotificationProvider = (props) => {
	const [notificationTitle, setNotificationTitle] = useState(null);
	const [actionType, setActionType] = useState(null);
	const [items, setItems] = useState(null);
	const notification = {
		notificationTitle,
		setNotificationTitle,
		actionType,
		setActionType,
		items,
		setItems,
	};

	return (
		<NotificationContext.Provider value={notification}>
			{props.children}
		</NotificationContext.Provider>
	);
};

export default NotificationProvider;
