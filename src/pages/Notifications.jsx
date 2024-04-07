import React, { useEffect, useState, useContext } from "react";

// Third party
import { Helmet } from "react-helmet";
import { toast } from "react-toastify";

// Components
import { TopBarSearchInput } from "../global";
import { FormatNotifications } from "../components";
import DeleteModal from "../components/DeleteModal/DeleteModal";
import CircularLoading from "../HelperComponents/CircularLoading";
import DeleteOneModalComp from "../components/DeleteOneModal/DeleteOneModal";

// Context
import Context from "../Context/context";
import { DeleteContext } from "../Context/DeleteProvider";
import { NotificationContext } from "../Context/NotificationProvider";

// MUI
import Checkbox from "@mui/material/Checkbox";

// Icons
import { CheckedSquare, DeleteIcon, Reports } from "../data/Icons";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

//redux
import { useDispatch, useSelector } from "react-redux";
import {
	DeleteAllDeleteNotificationsThunk,
	DeleteNotificationsThunk,
	NotificationsThunk,
} from "../store/Thunk/NotificationsThunk";
import { TablePagination } from "../components/Tables/TablePagination";

const Notifications = () => {
	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	const { NotificationsData, currentPage, pageCount, loading } = useSelector(
		(state) => state.NotificationsSlice
	);
	// --------------------------------------------------------

	/** get contact data */
	useEffect(() => {
		dispatch(NotificationsThunk({ page: pageTarget, number: rowsCount }));
	}, [rowsCount, pageTarget, dispatch]);

	const [showMore, setShowMore] = useState("");
	const NotificationStore = useContext(NotificationContext);
	const { notificationTitle, setNotificationTitle, setItems, setActionType } =
		NotificationStore;

	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const DeleteStore = useContext(DeleteContext);
	const { setActionDelete, actionDelete, setItemId } = DeleteStore;

	// -----------------------------------------------------------------
	const [selected, setSelected] = useState([]);
	const isSelected = (id) => selected.indexOf(id) !== -1;
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
			const newSelected = NotificationsData?.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};
	// -------------------------------------------------------------------------

	// Delete items
	const handleDeleteSingleItem = (id) => {
		dispatch(
			DeleteNotificationsThunk({
				id: id,
			})
		)
			.unwrap()
			.then((data) => {
				if (!data?.success) {
					toast.error(data?.message?.ar, {
						theme: "light",
					});
				} else {
					setEndActionTitle(data?.message?.ar);
				}
				dispatch(NotificationsThunk({ page: pageTarget, number: rowsCount }));
			})
			.catch((error) => {
				// handle error here
				// toast.error(error, {
				// 	theme: "light",
				// });
			});
	};

	const handleDeleteAllItems = (selected) => {
		dispatch(
			DeleteAllDeleteNotificationsThunk({
				selected: selected,
			})
		)
			.unwrap()
			.then((data) => {
				if (!data?.success) {
					toast.error(data?.message?.ar, {
						theme: "light",
					});
				} else {
					setEndActionTitle(data?.message?.ar);
				}
				dispatch(NotificationsThunk({ page: pageTarget, number: rowsCount }));
			})
			.catch((error) => {
				// handle error here
				// toast.error(error, {
				// 	theme: "light",
				// });
			});
	};

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
						{NotificationsData?.length === 0 ? (
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
									<div className='row mb-3'>
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
															selected.length < NotificationsData?.length
														}
														checked={
															NotificationsData?.length > 0 &&
															selected.length === NotificationsData?.length
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
																setItems(selected);
																setActionType("deleteAll");
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
												{NotificationsData?.map((not, index) => {
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
																		<FormatNotifications
																			date={not.created_at}
																		/>
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
																			setItemId(not.id);
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

									<div className='row'>
										{NotificationsData?.length !== 0 && !loading && (
											<TablePagination
												data={NotificationsData}
												pageCount={pageCount}
												currentPage={currentPage}
												pageTarget={pageTarget}
												rowsCount={rowsCount}
												setRowsCount={setRowsCount}
												setPageTarget={setPageTarget}
											/>
										)}
									</div>
								</div>

								{actionDelete && (
									<DeleteOneModalComp
										handleDeleteSingleItem={handleDeleteSingleItem}
									/>
								)}

								{notificationTitle && (
									<DeleteModal handleDeleteAllItems={handleDeleteAllItems} />
								)}
							</>
						)}
					</>
				)}
			</section>
		</>
	);
};

export default Notifications;
