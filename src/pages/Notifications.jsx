import React, { useEffect, useState, useContext } from "react";
import { Helmet } from "react-helmet";
import useFetch from "../Hooks/UseFetch";
import axios from "axios";
import Context from "../Context/context";
import { NotificationContext } from "../Context/NotificationProvider";
import { DeleteContext } from "../Context/DeleteProvider";
import CircularLoading from "../HelperComponents/CircularLoading";
import { useCookies } from "react-cookie";
// Icons
import Checkbox from "@mui/material/Checkbox";
import DeleteIcon from "../data/Icons/icon-24-delete.svg";
import { ReactComponent as CheckedSquare } from "../data/Icons/icon-24-square checkmark.svg";
import { AiOutlineSearch } from "react-icons/ai";
import moment from "moment-with-locales-es6";

const Notifications = () => {
	const [cookies] = useCookies(["access_token"]);

	const { fetchedData, loading, reload, setReload } = useFetch(
		"https://backend.atlbha.com/api/Store/NotificationIndex"
	);
	const [selected, setSelected] = useState([]);
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
		const calcPassedDays = (date1, date2) =>
			Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));
		const currentDate = calcPassedDays(+new Date(), +new Date(date));

		if (currentDate === 0)
			return "،اليوم" + moment(date).locale("ar").format(" h:mm a");
		if (currentDate === 1)
			return "،أمس" + moment(date).locale("ar").format(" h:mm a");
		if (currentDate <= 7)
			return (
				`منذ ${currentDate} أيام،` + moment(date).locale("ar").format(" h:mm a")
			);

		return moment(date).locale("ar").format("D MMMM YYYY, h:mm a");
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
						setEndActionTitle(res?.data?.message?.ar);
						setReload(!reload);
					} else {
						setEndActionTitle(res?.data?.message?.ar);
						setReload(!reload);
					}
				});
			setActionTitle(null);
			setConfirm(false);
		}
	}, [confirm]);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم أطلبها | الاشعارات</title>
			</Helmet>
			<section className='notifications'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<div className='search-icon'>
							<AiOutlineSearch color='#02466A' />
						</div>
						<input
							type='text'
							name='search'
							id='search'
							className='input'
							placeholder='أدخل كلمة البحث'
						/>
					</div>
				</div>
				<div className='row mb-md-4 mb-3'>
					<h4 className='page-title'>الاشعارات</h4>
				</div>

				<div className='notifications-table'>
					<div className='row'>
						{fetchedData?.data?.notifications.length === 0 ? (
							<h4 className='d-flex justify-content-center align-items-center'>
								لا يوجد اشعارات حتي هذه اللحظة!
							</h4>
						) : loading ? (
							<CircularLoading />
						) : (
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
											inputProps={{
												"aria-label": "select all desserts",
											}}
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
														"سيتم حذف جميع الاشعارات وهذةالخظوة غير قابلة للرجوع"
													);
													setActionTitle("Delete");
												}}>
												<img src={DeleteIcon} alt='delete-icon' />
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
												className='bg-white w-100 d-flex flex-md-row flex-col align-md-items-center align-items-start justify-content-between gap-2 px-md-4 py-md-3 py-3 px-2'>
												<div className='w-100 d-flex flex-row align-items-center gap-md-4 gap-2'>
													<Checkbox
														checkedIcon={<CheckedSquare />}
														sx={{
															color: "#1DBBBE",
															"& .MuiSvgIcon-root": {
																color: "#ADB5B9",
															},
														}}
														checked={isItemSelected}
														onClick={(event) => handleClick(event, not.id)}
													/>
													<div className='w-100 d-flex flex-row align-items-center justify-content-between '>
														<div className='flex flex-col gap-1'>
															<h2 className='notifications-title'>
																{not?.message}
															</h2>
															<p className='notification-user-name '>
																{not?.user[0]?.name}
															</p>
														</div>
													</div>
												</div>
												<div className=' w-100 h-100 d-flex flex-md-row flex-column align-items-md-center align-items-end justify-content-end gap-md-5 gap-2'>
													<div className=''>
														<p className='notification-time'>
															{formatDate(not.created_at)}
														</p>
													</div>

													<div className='d-flex flex-row align-items-center '>
														<img
															onClick={() => {
																setActionDelete(
																	"سيتم حذف التصنيف وهذة الخطوة غير قابلة للرجوع"
																);
																setDeleteMethod("get");
																setUrl(
																	`https://backend.atlbha.com/api/Store/NotificationDelete/${not?.id}`
																);
															}}
															src={DeleteIcon}
															alt='delete-icon'
															style={{ cursor: "pointer" }}
														/>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						)}
					</div>
				</div>
			</section>
		</>
	);
};

export default Notifications;
