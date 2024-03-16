import React, { useEffect, useState, useContext } from "react";

// Third party
import axios from "axios";
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";
import moment from "moment-with-locales-es6";

// Components
import useFetch from "../Hooks/UseFetch";
import { TopBarSearchInput } from "../global";
import CircularLoading from "../HelperComponents/CircularLoading";

// Context
import Context from "../Context/context";
import { DeleteContext } from "../Context/DeleteProvider";
import { NotificationContext } from "../Context/NotificationProvider";

// MUI
import Checkbox from "@mui/material/Checkbox";

// Icons
import { CheckedSquare, DeleteIcon, Reports } from "../data/Icons";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

const Notifications = () => {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];
	const { fetchedData, loading, reload, setReload } =
		useFetch("NotificationIndex");
	const [selected, setSelected] = useState([]);
	const [showMore, setShowMore] = useState("");
	const NotificationStore = useContext(NotificationContext);
	const {
		confirm,
		setConfirm,
		actionTitle,
		setActionTitle,
		setNotificationTitle,
	} = NotificationStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const DeleteStore = useContext(DeleteContext);
	const {
		setUrl,
		setActionDelete,
		deleteReload,
		setDeleteReload,
		setDeleteMethod,
	} = DeleteStore;
	const isSelected = (id) => selected.indexOf(id) !== -1;

	// formatDate
	const formatDate = (date) => {
		const calcPassedMinutes = (date1, date2) =>
			Math.round(Math.abs(date2 - date1) / (1000 * 60));

		const currentMinutes = calcPassedMinutes(+new Date(), +new Date(date));

		if (currentMinutes < 1) {
			return "الآن";
		} else if (currentMinutes === 1) {
			return "منذ دقيقة";
		} else if (currentMinutes === 2) {
			return "منذ دقيقتين";
		} else if (currentMinutes <= 10) {
			return `منذ ${currentMinutes} دقائق`;
		} else if (currentMinutes < 60 && currentMinutes >= 11) {
			return `منذ ${currentMinutes} دقيقة`;
		} else if (currentMinutes === 60) {
			return "منذ ساعة";
		} else if (currentMinutes === 120) {
			return "منذ ساعتين";
		} else if (currentMinutes < 1440) {
			let hours = Math.floor(currentMinutes / 60);
			let min = currentMinutes % 60;
			if (hours === 1) {
				return `منذ ساعة و ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
			} else if (hours === 2) {
				return `منذ  و ساعتين ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
			} else if (hours <= 10) {
				return `منذ ${hours} ساعات و ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
			} else {
				return `منذ ${hours} ساعة و ${min} ${min <= 10 ? "دقائق" : "دقيقة"} `;
			}
		}

		const currentDate = Math.round(currentMinutes / 60 / 24);

		if (currentDate === 1) {
			return "أمس، الساعة " + moment(date).locale("ar").format(" h:mm a");
		} else if (currentDate === 2) {
			return " منذ يومين، الساعة" + moment(date).locale("ar").format(" h:mm a");
		} else if (currentDate <= 7) {
			return (
				`منذ ${currentDate}  أيام، الساعة` +
				moment(date).locale("ar").format(" h:mm a")
			);
		}

		return moment(date).locale("ar").format("D MMMM YYYY");
	};
	// -----------------------------------------------------------------

	const handleClick = (event, id) => {
		const selectedIndex = selected.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = fetchedData?.data?.notifications?.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};
	// -------------------------------------------------------------------------

	// Delete single item
	useEffect(() => {
		if (deleteReload === true) {
			setReload(!reload);
		}
		setDeleteReload(false);
	}, [deleteReload]);

	// Delete all items and Change all status
	useEffect(() => {
		if (confirm && actionTitle === "Delete") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(`NotificationDeleteAll?${queryParams}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store_token}`,
					},
				})
				.then((res) => {
					if (res?.data?.success === true && res?.data?.data?.status === 200) {
						setEndActionTitle(res?.data?.message?.ar);
						setReload(!reload);
					} else {
						toast.error(res?.data?.message?.ar, {
							theme: "light",
						});
					}
				});
			setActionTitle(null);
			setConfirm(false);
		}
	}, [confirm]);

	const readMoreModal = () => {
		return (
			<div className='read-more-modal'>
				<div className='modal'>
					<div className='header'>
						<CloseOutlinedIcon onClick={() => setShowMore("")} />
					</div>
					<div
						className='body'
						dangerouslySetInnerHTML={{
							__html: showMore,
						}}></div>
				</div>
			</div>
		);
	};

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | الاشعارات</title>
			</Helmet>
			{showMore !== "" && readMoreModal()}
			<section className='notifications'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				{loading ? (
					<section
						style={{ height: "70vh" }}
						className='d-flex justify-content-center align-items-center'>
						<CircularLoading />
					</section>
				) : (
					<>
						{fetchedData?.data?.notifications?.length === 0 ? (
							<h4
								style={{ height: "70vh" }}
								className='d-flex justify-content-center align-items-center'>
								لا يوجد اشعارات حتى هذه اللحظة!
							</h4>
						) : (
							<>
								<div className='row mb-md-4 mb-3'>
									<h4 className='page-title'>الاشعارات</h4>
								</div>

								<div className='notifications-table'>
									<div className='row'>
										<div className='table_wrapper'>
											<div className='d-flex flex-row align-items-center gap-5'>
												<div className='d-flex flex-row align-items-center gap-3'>
													<Checkbox
														checkedIcon={<CheckedSquare />}
														sx={{
															pr: "0",
															color: "#011723",
															"& .MuiSvgIcon-root": {
																color: "#011723",
															},
														}}
														indeterminate={
															selected.length > 0 &&
															selected.length <
																fetchedData?.data?.notifications?.length
														}
														checked={
															fetchedData?.data?.notifications?.length > 0 &&
															selected.length ===
																fetchedData?.data?.notifications?.length
														}
														onChange={handleSelectAllClick}
													/>
													<label
														className='md:text-[18px] text-[16px]'
														style={{ color: "#011723" }}
														htmlFor='all'>
														تحديد الكل
													</label>
												</div>

												<div className='d-flex flex-row justify-content-center align-items-center gap-2'>
													{selected.length > 0 && (
														<div
															className='d-flex flex-row justify-content-center align-items-center gap-2 cursor-pointer'
															style={{
																width: "110px",
																height: "40px",
																backgroundColor: "#FF38381A",
																borderRadius: "20px",
																cursor: "pointer",
															}}
															onClick={() => {
																setNotificationTitle(
																	"سيتم حذف جميع الاشعارات وهذه الخطوة غير قابلة للرجوع"
																);
																setActionTitle("Delete");
															}}>
															<DeleteIcon title='حذف جميع الاشعارات' />
															<h6 className='' style={{ color: "#FF3838" }}>
																حذف
															</h6>
														</div>
													)}
												</div>
											</div>
											<div className='d-flex flex-col gap-4 flex-wrap mt-3 flex '>
												{fetchedData?.data?.notifications?.map((not, index) => {
													const isItemSelected = isSelected(not.id);
													return (
														<div
															key={index}
															style={{ boxShadow: "3px 3px 6px #00000005" }}
															className='notification-box bg-white w-100 d-flex flex-md-row flex-col align-md-items-center align-items-start justify-content-between gap-2 px-md-4 py-md-3 py-3 px-2'>
															<div className='message w-100 d-flex flex-row align-items-center gap-md-4 gap-2'>
																<Checkbox
																	checkedIcon={<CheckedSquare />}
																	sx={{
																		color: "#1DBBBE",
																		"& .MuiSvgIcon-root": {
																			color: "#ADB5B9",
																		},
																	}}
																	checked={isItemSelected}
																	onClick={(event) =>
																		handleClick(event, not.id)
																	}
																/>
																<div className='w-100 d-flex flex-row align-items-center justify-content-between '>
																	<div className='d-flex flex-column gap-1'>
																		<div className='d-flex flex-row align-items-center'>
																			<h2
																				className='notifications-title'
																				dangerouslySetInnerHTML={{
																					__html: not?.message,
																				}}></h2>
																		</div>
																		<p className='notification-user-name'>
																			{not?.user[0]?.name}
																		</p>
																	</div>
																</div>
															</div>
															<div className='time-delete w-100 h-100 d-flex flex-md-row flex-column align-items-md-center align-items-end justify-content-end gap-md-5 gap-2'>
																<div className=''>
																	<p className='notification-time'>
																		{formatDate(not.created_at)}
																	</p>
																</div>

																<div className='d-flex flex-row align-items-center gap-2'>
																	<Reports
																		title='قراءة المزيد'
																		className='show-more'
																		onClick={() => setShowMore(not?.message)}
																	/>
																	<DeleteIcon
																		onClick={() => {
																			setActionDelete(
																				"سيتم حذف النشاط وهذه الخطوة غير قابلة للرجوع"
																			);
																			setDeleteMethod("get");
																			setUrl(`NotificationDelete/${not?.id}`);
																		}}
																		style={{ cursor: "pointer" }}
																		title='حذف الإشعار'
																	/>
																</div>
															</div>
														</div>
													);
												})}
											</div>
										</div>
									</div>
								</div>
							</>
						)}
					</>
				)}
			</section>
		</>
	);
};

export default Notifications;
