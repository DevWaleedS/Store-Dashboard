import React, { useState, useContext, Fragment } from "react";

// Third party
import axios from "axios";
import ReactDom from "react-dom";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";

// Styles
import styles from "./DeleteOneModal.module.css";

// Icons
import { Warning } from "../../data/Icons";

// Backdrop Styles
const BackDrop = () => {
	return <div className={styles.backdrop}></div>;
};

const DeleteOneModal = () => {
	const [loading, setLoading] = useState(false);
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const DeleteProvider = useContext(DeleteContext);
	const {
		setUrl,
		url,
		actionDelete,
		setActionDelete,
		setDeleteReload,
		deleteReload,
		deleteMethod,
	} = DeleteProvider;

	const confirm = () => {
		if (deleteMethod === "delete") {
			setLoading(true);
			axios
				.delete(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("store_token")}`,
					},
				})
				.then((res) => {
					if (res?.data?.success === true && res?.data?.data?.status === 200) {
						setEndActionTitle(res?.data?.message?.ar);
						setDeleteReload(!deleteReload);
						setActionDelete(null);
						setUrl(null);
						setLoading(false);
					} else {
						setEndActionTitle(res?.data?.message?.ar);
						setDeleteReload(!deleteReload);
						setActionDelete(null);
						setUrl(null);
						setLoading(false);
					}
				});
		} else {
			setLoading(true);
			axios
				.get(url, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("store_token")}`,
					},
				})
				.then((res) => {
					if (res?.data?.success === true && res?.data?.data?.status === 200) {
						setEndActionTitle(res?.data?.message?.ar);
						setDeleteReload(!deleteReload);
						setActionDelete(null);
						setUrl(null);
						setLoading(false);
					} else {
						setEndActionTitle(res?.data?.message?.ar);
						setDeleteReload(!deleteReload);
						setActionDelete(null);
						setUrl(null);
						setLoading(false);
					}
				});
		}
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
					<h6 className={styles.notificationTitle}>{actionDelete}</h6>
					<div
						className={`d-flex flex-row align-items-center ${styles.btn_box} gap-4`}>
						<button
							type={"normal"}
							style={{ backgroundColor: "#02466A", color: "#EFF9FF" }}
							className={`${styles.confirm_btn} ${styles.notifi_btn}`}
							onClick={() => confirm()}
							disabled={loading}>
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
								setActionDelete(null);
								setUrl(null);
							}}
							disabled={loading}>
							الغاء
						</button>
					</div>
				</div>
			</div>
		</Fragment>
	);
};

const DeleteOneModalComp = ({ title, cancelEarly }) => {
	return (
		<Fragment>
			{ReactDom.createPortal(
				<DeleteOneModal title={title} cancelEarly={cancelEarly} />,
				document.getElementById("action_div")
			)}
		</Fragment>
	);
};

export default DeleteOneModalComp;
