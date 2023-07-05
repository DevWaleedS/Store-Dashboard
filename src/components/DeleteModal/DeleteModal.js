import React, { useContext, Fragment } from 'react';
import ReactDom from 'react-dom';
import { NotificationContext } from '../../Context/NotificationProvider';
import { ReactComponent as Warning } from '../../data/Icons/icon-32-warning.svg';
import styles from './DeleteModal.module.css';

const BackDrop = () => {
	return <div className={styles.backdrop}></div>;
};
const DeleteModal = ({ cancelEarly }) => {
	const NotificationProvider = useContext(NotificationContext);

	const { notificationTitle, setNotificationTitle, setActionTitle, setConfirm } = NotificationProvider;

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
					<div className={`d-flex flex-row align-items-center ${styles.btn_box} gap-4`}>
						<button
							type={'normal'}
							style={{ backgroundColor: '#02466A', color: '#EFF9FF' }}
							className={`${styles.confirm_btn} ${styles.notifi_btn}`}
							onClick={() => {
								setNotificationTitle(null);
								setConfirm(true);
							}}
						>
							تأكيد
						</button>
						<button
							type={'outline'}
							className={`${styles.notifi_btn}`}
							style={{ backgroundColor: '#02466A00', border: '1px solid #02466A', color: '#02466A' }}
							onClick={() => {
								setNotificationTitle(null);
								setConfirm(false);
								setActionTitle(null);
							}}
						>
							الغاء
						</button>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

const DeleteModalComp = ({ title, cancelEarly }) => {
	return <Fragment>{ReactDom.createPortal(<DeleteModal title={title} cancelEarly={cancelEarly} />, document.getElementById('action_div'))}</Fragment>;
};

export default DeleteModalComp;
