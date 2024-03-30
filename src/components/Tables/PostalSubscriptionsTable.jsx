import React, { Fragment, useEffect, useState, useContext } from "react";

// Third party
import axios from "axios";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";

// Components
import { TablePagination } from "./TablePagination";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";

// import icons
import { DeleteIcon } from "../../data/Icons";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell
					align='center'
					sx={{ width: "80px", maxWidth: "80px", color: "#02466a" }}>
					م
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					البريد الالكتروني
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الإجراء
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onRequestSort: PropTypes.func.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	order: PropTypes.oneOf(["asc", "desc"]).isRequired,
	orderBy: PropTypes.string.isRequired,
	rowCount: PropTypes.number,
};

function EnhancedTableToolbar(props) {
	const { numSelected, rowCount, onSelectAllClick } = props;
	const NotificationStore = useContext(NotificationContext);
	const { setNotificationTitle, setActionTitle } = NotificationStore;
	return (
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
									"سيتم حذف جميع الايميلات وهذه الخطوة غير قابلة للرجوع"
								);
								setActionTitle("Delete");
							}}>
							<IconButton>
								<DeleteIcon title='حذف جميع الايميلات' />
								حذف الكل
							</IconButton>
						</Tooltip>
					</div>
				)}
			</div>

			<div className=' d-flex align-items-center flex-row-reverse pe-0'>
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

export default function PostalSubscriptionsTable({
	data,
	loading,
	reload,
	setReload,
	search,
	setSearch,
	rowsCount,
	pageTarget,
	setRowsCount,
	setPageTarget,
	pageCount,
	currentPage,
}) {
	const store_token = document.cookie
		?.split("; ")
		?.find((cookie) => cookie.startsWith("store_token="))
		?.split("=")[1];

	const NotificationStore = useContext(NotificationContext);
	const { confirm, setConfirm, actionTitle, setActionTitle } =
		NotificationStore;
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

	/** --------------------------------------------------- */

	// select all items
	const [selected, setSelected] = useState([]);
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
	// -------------------------------------------------------------

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
				.get(`subsicriptionsdeleteall?${queryParams}`, {
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
						setEndActionTitle(res?.data?.message?.ar);
						setReload(!reload);
					}
				});
			setActionTitle(null);
			setConfirm(false);
		}
	}, [confirm]);

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					numSelected={selected?.length}
					rowCount={data?.length}
					onSelectAllClick={handleSelectAllClick}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected?.length}
							onSelectAllClick={handleSelectAllClick}
							rowCount={data?.length}
						/>

						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={3}>
										<CircularLoading />
									</TableCell>
								</TableRow>
							) : (
								<Fragment>
									{data?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={3}>
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
															className='flex items-center'
															style={{
																display: "flex",
																justifyContent: "start",
																alignItems: "center",
																gap: "7px",
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
													<TableCell align='right'>{row?.email}</TableCell>
													<TableCell align='right'>
														<div className='actions d-flex align-items-center justify-content-evenly'>
															<span>
																<DeleteIcon
																	title='حذف الايميل'
																	onClick={() => {
																		setActionDelete(
																			"سيتم حذف الايميل وهذه الخطوة غير قابلة للرجوع"
																		);
																		setDeleteMethod("get");
																		setUrl(
																			`subsicriptionsdeleteall?id[]=${row?.id}`
																		);
																	}}
																	style={{
																		cursor: "pointer",
																		color: "red",
																		fontSize: "1.2rem",
																		marginRight: "5px",
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
		</Box>
	);
}
