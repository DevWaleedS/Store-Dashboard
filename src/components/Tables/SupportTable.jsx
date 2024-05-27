import React, { Fragment, useContext, useState } from "react";

// Third party
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";

// Redux
import { useDispatch } from "react-redux";
import { openReplyModal } from "../../store/slices/ReplyModal-slice";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import { Switch } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
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

// Icons
import {
	DeadLineIcon,
	DeleteIcon,
	HourGleass,
	Reports,
	ReplayIcon,
} from "../../data/Icons";
import { GoCheck } from "react-icons/go";
import { SendSupportReplayModal } from "../Modal";

// RTK Query
import {
	useChangeTechnicalSupportStatusMutation,
	useDeleteAllTechnicalSupportMutation,
	useDeleteTechnicalSupportItemMutation,
} from "../../store/apiSlices/technicalSupportApi";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell align='left' sx={{ color: "#02466a", width: "80px" }}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					اسم العميل
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					عنوان الرسالة
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					محتوى الرسالة
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
		<React.Fragment>
			{/** Table Head */}
			<Toolbar
				sx={{
					pl: { sm: 2 },
					pr: { xs: 1, sm: 1 },

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
										"سيتم حذف جميع الشكاوي وهذه الخطوة غير قابلة للرجوع"
									);
									setItems(itemsSelected);
									setActionType("deleteAll");
								}}>
								<IconButton>
									<DeleteIcon title='حذف جميع الشكاوي' />
									حذف الكل
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
		</React.Fragment>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

const SupportTable = ({
	data,
	loading,
	rowsCount,
	pageTarget,
	setRowsCount,
	setPageTarget,
	pageCount,
	currentPage,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const [UserDetails, setUserDetails] = useState("");
	const NotificationStore = useContext(NotificationContext);
	const { notificationTitle } = NotificationStore;

	const DeleteStore = useContext(DeleteContext);
	const { setActionDelete, actionDelete, setItemId } = DeleteStore;

	// Handle select all Items
	const [selected, setSelected] = React.useState([]);
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = data?.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};
	const isSelected = (name) => selected.indexOf(name) !== -1;
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

	// ---------------------------------------------------------------

	// Delete items
	const [deleteTechnicalSupportItem] = useDeleteTechnicalSupportItemMutation();
	const [deleteAllTechnicalSupport] = useDeleteAllTechnicalSupportMutation();

	const handleDeleteSingleItem = async (id) => {
		try {
			await deleteTechnicalSupportItem({ technicalSupportId: id })
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					}
				});
		} catch (err) {
			console.error("Failed to delete the deleteTechnicalSupportItem", err);
		}
	};
	const handleDeleteAllItems = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await deleteAllTechnicalSupport({ selected: queryParams })
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					}
				});
		} catch (err) {
			console.error("Failed to delete the deleteAllTechnicalSupport", err);
		}
	};
	// ---------------------------------------------------------------

	// change technical Support status
	const [changeTechnicalSupportStatus] =
		useChangeTechnicalSupportStatusMutation();

	const changeItemStatus = async (id) => {
		try {
			await changeTechnicalSupportStatus({ technicalSupportId: id })
				.unwrap()

				.then((data) => {
					if (!data?.success) {
						toast.error(data?.message?.ar, {
							theme: "light",
						});
					}
				});
		} catch (err) {
			console.error("Failed to delete the changeTechnicalSupportStatus", err);
		}
	};
	//------------------------------------------------------------------------

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
													selected={isItemSelected}>
													<TableCell
														component='th'
														id={labelId}
														scope='row'
														align='right'>
														<div
															className='flex items-center '
															style={{
																display: "flex",
																justifyContent: "start",
																alignItems: "center",
																gap: "8px",
															}}>
															<Checkbox
																sx={{
																	color: "#356b88",
																	pr: "14px",
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
																minimumIntegerDigits: 1,
																useGrouping: false,
															})}
														</div>
													</TableCell>
													<TableCell align='center'>{row?.name}</TableCell>
													<TableCell align='center'>
														<div className='text-overflow support-title'>
															{row?.title}
														</div>
													</TableCell>
													<TableCell align='center'>
														<div className='text-overflow support-title'>
															{row?.content}
														</div>
													</TableCell>
													<TableCell align='center'>
														<div className='sub-categories'>
															<span
																className='status d-inline-flex align-items-center'
																style={{
																	backgroundColor:
																		row?.supportstatus === "منتهية"
																			? "#3ae374"
																			: row?.supportstatus === "غير منتهية "
																			? "#ff9f1a"
																			: "#d3d3d3",
																	color: "#fff",
																}}>
																{row?.supportstatus === "منتهية" ? (
																	<GoCheck />
																) : row?.supportstatus === "غير منتهية " ? (
																	<HourGleass />
																) : (
																	<DeadLineIcon />
																)}
																{row?.supportstatus}
															</span>
														</div>
													</TableCell>
													<TableCell align='right'>
														<div className='actions d-flex justify-content-center align-items-center gap-1'>
															<span
																style={{ cursor: "pointer" }}
																onClick={() => {
																	dispatch(openReplyModal());
																	setUserDetails(row);
																}}>
																<ReplayIcon title='الرد على الشكوى' />
															</span>

															<span
																style={{ cursor: "pointer" }}
																onClick={() => {
																	navigate(`supportDetails/${row?.id}`);
																}}>
																<Reports title='تفاصيل الشكوى' />
															</span>

															<span>
																<Switch
																	onChange={() => changeItemStatus(row?.id)}
																	checked={
																		row?.supportstatus === "منتهية"
																			? true
																			: false
																	}
																	sx={{
																		width: "50px",
																		"& .MuiSwitch-track": {
																			width: 26,
																			height: 14,
																			opacity: 1,
																			backgroundColor: "rgba(0,0,0,.25)",
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
															</span>

															<span>
																<DeleteIcon
																	title='حذف  الشكوى'
																	onClick={() => {
																		setActionDelete(
																			"سيتم حذف الشكوى وهذه الخطوة غير قابلة للرجوع"
																		);

																		setItemId(row?.id);
																	}}
																	style={{
																		cursor: "pointer",
																		color: "red",
																		fontSize: "1.2rem",
																	}}
																/>
															</span>
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
			<SendSupportReplayModal supportDetails={UserDetails} />

			{actionDelete && (
				<DeleteOneModalComp handleDeleteSingleItem={handleDeleteSingleItem} />
			)}

			{notificationTitle && (
				<DeleteModal handleDeleteAllItems={handleDeleteAllItems} />
			)}
		</Box>
	);
};

export default SupportTable;
