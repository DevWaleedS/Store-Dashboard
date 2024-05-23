import React, { Fragment, useContext } from "react";

// Third party

import moment from "moment";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import { alpha } from "@mui/material/styles";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";

// Components
import { TablePagination } from "./TablePagination";
import DeleteModal from "../DeleteModal/DeleteModal";
import DeleteOneModalComp from "../DeleteOneModal/DeleteOneModal";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Import Icons
import { DeleteIcon, EditIcon } from "../../data/Icons";
import {
	useChangeAllPagesStatusMutation,
	useChangePagesStatusMutation,
	useDeleteAllPagesMutation,
	useDeletePageMutation,
} from "../../store/apiSlices/pagesApi";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#c6e1f0" }}>
			<TableRow>
				<TableCell
					align='center'
					sx={{
						color: "#02466a",
						width: "80px",
						paddingRight: "50px !important",
					}}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					العنوان
				</TableCell>

				<TableCell align='center' sx={{ color: "#02466a" }}>
					تاريخ النشر
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الحالة
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الاجراء
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	rowCount: PropTypes.number,
};

function EnhancedTableToolbar(props) {
	const { numSelected, rowCount, onSelectAllClick, itemsSelected } = props;
	const NotificationStore = useContext(NotificationContext);
	const { setNotificationTitle, setItems, setActionType } = NotificationStore;

	return (
		<Toolbar
			sx={{
				pl: { sm: 2 },
				pr: { xs: 1, sm: 1 },
				...(numSelected > 0 && {
					bgcolor: (theme) =>
						alpha(
							theme.palette.primary.main,
							theme.palette.action.activatedOpacity
						),
				}),
				display: "flex",
				justifyContent: "space-between",
				flexDirection: "row-reverse",
			}}>
			<div className=' d-flex flex-row-reverse  justify-content-between align-items-center '>
				<div></div>
				{numSelected > 0 && (
					<div>
						<Tooltip
							className='delete-all'
							onClick={() => {
								setNotificationTitle(
									"سيتم حذف جميع الصفحات وهذه الخطوة غير قابلة للرجوع"
								);
								setItems(itemsSelected);
								setActionType("deleteAll");
							}}>
							<IconButton>
								<DeleteIcon title='حذف جميع الصفحات' />
								حذف الكل
							</IconButton>
						</Tooltip>

						<Tooltip
							className='switch-all'
							onClick={() => {
								setNotificationTitle(
									"سيتم تغيير حالة جميع الصفحات التي قمت بتحديدهم"
								);
								setItems(itemsSelected);
								setActionType("changeStatusAll");
							}}>
							<IconButton>
								<Switch
									sx={{
										width: "50px",
										"& .MuiSwitch-track": {
											width: 26,
											height: 14,
											opacity: 1,
											backgroundColor: "#ff9f1a",
											boxSizing: "border-box",
										},
										"& .MuiSwitch-thumb": {
											boxShadow: "none",
											width: 10,
											height: 10,
											borderRadius: 5,
											transform: "translate(6px,6px)",
											color: "#fff",
										},
										"&:hover": {
											"& .MuiSwitch-thumb": {
												boxShadow: "none",
											},
										},

										"& .MuiSwitch-switchBase": {
											padding: 1,
											"&.Mui-checked": {
												transform: "translateX(11px)",
												color: "#fff",
												"& + .MuiSwitch-track": {
													opacity: 1,
													backgroundColor: "#3AE374",
												},
											},
										},
									}}
								/>
								تعطيل الكل
							</IconButton>
						</Tooltip>
					</div>
				)}
			</div>

			<div className=' d-flex align-items-center flex-row-reverse'>
				<h2
					className='h4'
					style={{
						fontSize: "20px",
						fontWeight: "500",
						color: "#02466a",
						marginBottom: 0,
					}}>
					تحديد الكل
				</h2>

				<Checkbox
					sx={{
						color: "#356b88",
						"& .MuiSvgIcon-root": {
							color: "#356b88",
						},
					}}
					indeterminate={numSelected > 0 && numSelected < rowCount}
					checked={rowCount > 0 && numSelected === rowCount}
					onChange={onSelectAllClick}
					inputProps={{
						"aria-label": "select all desserts",
					}}
				/>
			</div>
		</Toolbar>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

// Start Pages Table
export default function PagesTable({
	data,
	loading,
	rowsCount,
	pageTarget,
	setRowsCount,
	setPageTarget,
	pageCount,
	currentPage,
}) {
	const NotificationStore = useContext(NotificationContext);
	const { notificationTitle } = NotificationStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const DeleteStore = useContext(DeleteContext);
	const { setActionDelete, actionDelete, setItemId } = DeleteStore;

	// ---------------------------------------------

	// Handle Select all Items
	const [selected, setSelected] = React.useState([]);
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = data?.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};
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
	const isSelected = (id) => selected.indexOf(id) !== -1;
	// ---------------------------------------------------

	// Delete items
	const [deletePage] = useDeletePageMutation();
	const [deleteAllPages] = useDeleteAllPagesMutation();

	const handleDeleteSingleItem = async (id) => {
		try {
			await deletePage({ pageId: id })
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
			console.error("Failed to delete the deletePage", err);
		}
	};
	const handleDeleteAllItems = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await deleteAllPages({ selected: queryParams })
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
			console.error("Failed to delete the deleteAllPages", err);
		}
	};
	//------------------------------------------------------------------------

	// change category status
	const [changePagesStatus] = useChangePagesStatusMutation();
	const [changeAllPagesStatus] = useChangeAllPagesStatusMutation();

	const changeItemStatus = async (id) => {
		try {
			await changePagesStatus({ pageId: id })
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
			console.error("Failed to delete the changePagesStatus", err);
		}
	};
	const handleChangeAllItemsStatus = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await changeAllPagesStatus({ selected: queryParams })
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
			console.error("Failed to change Status for changeAllCouponsStatus", err);
		}
	};

	// -------------------------------------------------------

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					itemsSelected={selected}
					numSelected={selected.length}
					rowCount={data?.length}
					onSelectAllClick={handleSelectAllClick}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected.length}
							onSelectAllClick={handleSelectAllClick}
							rowCount={data?.length}
						/>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={6}>
										<CircularLoading />
									</TableCell>
								</TableRow>
							) : (
								<Fragment>
									{data?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										data?.map((row, index) => {
											const isItemSelected = isSelected(row?.id);
											const labelId = `enhanced-table-checkbox-${index}`;
											return (
												<TableRow
													hover
													role='checkbox'
													aria-checked={isItemSelected}
													tabIndex={-1}
													key={index}
													selected={isItemSelected}
													style={{
														backgroundColor:
															row?.default_page === 1 ? "#dfe2aa" : "",
													}}>
													<TableCell
														component='th'
														id={labelId}
														scope='row'
														align='right'>
														<div
															className='flex items-center'
															style={{
																display: "flex",
																justifyContent: "start",
																alignItems: "center",
															}}>
															<Checkbox
																sx={{
																	color: "#356b88",
																	"& .MuiSvgIcon-root": {
																		color: "#356b88",
																	},
																}}
																checked={isItemSelected}
																onClick={(event) => handleClick(event, row.id)}
																inputProps={{
																	"aria-labelledby": labelId,
																}}
															/>
															{(index + 1).toLocaleString("en-US", {
																minimumIntegerDigits: 2,
																useGrouping: false,
															})}
														</div>
													</TableCell>
													<TableCell align='center'>{row?.title}</TableCell>

													<TableCell align='center'>
														{moment(row?.created_at).format("YYYY-MM-DD")}
													</TableCell>
													<TableCell align='center'>
														<span
															align='center'
															className='status'
															style={{
																backgroundColor: row.bgColor,
																color: row.color,
																borderRadius: "16px",
																padding: "5px 25px",
																fontWeight: 500,
															}}>
															{row?.status}
														</span>
													</TableCell>
													<TableCell align='center'>
														<div className='actions d-flex align-items-center justify-content-center'>
															<Link
																to={`EditPage/${row?.id}`}
																style={{ cursor: "pointer" }}>
																<EditIcon title='تعديل الصفحة ' />
															</Link>

															<Switch
																onChange={() => changeItemStatus(row?.id)}
																checked={
																	row?.status === "تم النشر" ? true : false
																}
																title={
																	row?.default_page === 1
																		? "لايمكنك تعديل الحالة"
																		: "تعديل الحالة"
																}
																disabled={row?.default_page === 1}
																sx={{
																	width: "50px",
																	"& .MuiSwitch-track": {
																		width: 26,
																		height: 14,
																		opacity: 1,
																		backgroundColor: "rgba(0,0,0,.25)",
																		boxSizing: "border-box",
																		cursor:
																			row?.default_page === 1
																				? "not-allowed"
																				: "pointer",
																	},
																	"& .MuiSwitch-thumb": {
																		boxShadow: "none",
																		width: 10,
																		height: 10,
																		borderRadius: 5,
																		transform: "translate(6px,6px)",
																		color: "#fff",
																	},

																	"&:hover": {
																		"& .MuiSwitch-thumb": {
																			boxShadow: "none",
																		},
																	},

																	"& .MuiSwitch-switchBase": {
																		padding: 1,
																		"&.Mui-checked": {
																			transform: "translateX(11px)",
																			color: "#fff",
																			"& + .MuiSwitch-track": {
																				opacity: 1,
																				backgroundColor: "#3AE374",
																			},
																		},
																	},
																}}
															/>
															<DeleteIcon
																title={
																	row?.default_page === 1
																		? "لايمكنك حذف الصفحة"
																		: "حذف الصفحة"
																}
																onClick={() => {
																	if (row?.default_page !== 1) {
																		setActionDelete(
																			"سيتم حذف الصفحة وهذه الخطوة غير قابلة للرجوع"
																		);
																		setItemId(row.id);
																	}
																}}
																style={{
																	paddingRight: "10px",
																	width: "40px",
																	color: "red",
																	cursor:
																		row?.default_page === 1
																			? "not-allowed"
																			: "pointer",
																}}
															/>
														</div>
													</TableCell>
												</TableRow>
											);
										})
									)}
								</Fragment>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			{data?.length !== 0 && !loading && (
				<TablePagination
					page={data}
					pageCount={pageCount}
					currentPage={currentPage}
					pageTarget={pageTarget}
					rowsCount={rowsCount}
					setRowsCount={setRowsCount}
					setPageTarget={setPageTarget}
				/>
			)}

			{actionDelete && (
				<DeleteOneModalComp handleDeleteSingleItem={handleDeleteSingleItem} />
			)}

			{notificationTitle && (
				<DeleteModal
					handleDeleteAllItems={handleDeleteAllItems}
					handleChangeAllItemsStatus={handleChangeAllItemsStatus}
				/>
			)}
		</Box>
	);
}
