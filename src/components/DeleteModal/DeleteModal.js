import React, { useContext, Fragment } from "react";

// Third party
import ReactDom from "react-dom";
// Context
import { NotificationContext } from "../../Context/NotificationProvider";

// Styles
import styles from "./DeleteModal.module.css";

// Icons
import { Warning } from "../../data/Icons";

const BackDrop = () => {
	return <div className={styles.backdrop}></div>;
};
const DeleteModal = ({ handleDeleteAllItems, handleChangeAllItemsStatus }) => {
	const NotificationProvider = useContext(NotificationContext);

	const {
		notificationTitle,
		setNotificationTitle,
		setItems,
		items,
		actionType,
		setActionType,
	} = NotificationProvider;

	const handleClose = () => {
		setNotificationTitle(null);
		setActionType(null);
		setItems(null);
	};

	const confirmDeleteAll = () => {
		handleDeleteAllItems(items);
		handleClose();
	};

	const confirmChangeStatusAll = () => {
		handleChangeAllItemsStatus(items);
		handleClose();
	};

	return (
		<Fragment>
			<BackDrop />
			<div className={styles.alert_body}>
				<div className='d-flex flex-column align-items-center justify-content-center'>
					<div className='d-flex flex-row  align-items-center gap-3 gap-md-2'>
						<h6 className={styles.alert_title}>تنبيه</h6>
						<Warning fill='FF3838' className={styles.Warning_icon} />
					</div>
					<p className={styles.confirm_title}>هل أنت متأكد !</p>
					<h6 className={styles.notificationTitle}>{notificationTitle}</h6>
					<div
						className={`d-flex flex-row align-items-center ${styles.btn_box} gap-4`}>
						<button
							type={"normal"}
							style={{ backgroundColor: "#02466A", color: "#EFF9FF" }}
							className={`${styles.confirm_btn} ${styles.notifi_btn}`}
							onClick={() => {
								actionType === "deleteAll"
									? confirmDeleteAll()
									: confirmChangeStatusAll();
							}}>
							تأكيد
						</button>
						<button
							type={"outline"}
							className={`${styles.notifi_btn}`}
							style={{
								backgroundColor: "#02466A00",
								border: "1px solid #02466A",
								color: "#02466A",
							}}
							onClick={() => {
								handleClose();
							}}>
							الغاء
						</button>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

const DeleteModalComp = ({
	title,
	cancelEarly,
	handleDeleteAllItems,
	handleChangeAllItemsStatus,
}) => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<DeleteModal
					title={title}
					cancelEarly={cancelEarly}
					handleDeleteAllItems={handleDeleteAllItems}
					handleChangeAllItemsStatus={handleChangeAllItemsStatus}
				/>,
				document.getElementById("action_div")
			)}
		</Fragment>
	);
};

export default DeleteModalComp;
