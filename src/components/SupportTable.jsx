import React, { Fragment, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useDispatch } from "react-redux";
import Context from "../Context/context";
import { NotificationContext } from "../Context/NotificationProvider";
import { DeleteContext } from "../Context/DeleteProvider";
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import { openVerifyModal } from '../store/slices/VerifyStoreModal-slice';

import TablePagination from "./TablePagination";

// ICons
import { GoCheck } from "react-icons/go";
import CircularLoading from "../HelperComponents/CircularLoading";
import { ReactComponent as ReportIcon } from "../data/Icons/icon-24-report.svg";
import { ReactComponent as SortIcon } from "../data/Icons/icon-24-sort.svg";
import { ReactComponent as DeletteIcon } from "../data/Icons/icon-24-delete.svg";
import { ReactComponent as DeadLineIcon } from "../data/Icons/icon-24-deadline.svg";
import { ReactComponent as HourGleass } from "../data/Icons/icon-24-hourgleass_half.svg";

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
	const stabilizedThis = array?.map((el, index) => [el, index]);
	stabilizedThis?.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) {
			return order;
		}
		return a[1] - b[1];
	});
	return stabilizedThis?.map((el) => el[0]);
}

function EnhancedTableHead(props) {
	const { order, orderBy, onRequestSort } = props;
	const createSortHandler = (property) => (event) => {
		onRequestSort(event, property);
	};

	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell align='left' sx={{ color: "#02466a", width: "80px" }}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					عنوان الشكوى
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					اسم العميل
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					نوع الاتصال
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الحاله
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
										"سيتم حذف جميع الشكاوي وهذةالخطوة غير قابلة للرجوع"
									);
									setActionTitle("Delete");
								}}>
								<IconButton>
									<DeletteIcon />
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

const SupportTable = ({ fetchedData, loading, reload, setReload }) => {
	// Get Data From Redux Store
	const navigate = useNavigate();
	const dispatch = useDispatch(true);
	const [cookies] = useCookies(["access_token"]);

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
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(10);

	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleRequestSort = (property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	//
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = fetchedData?.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	//
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
					`https://backend.atlbha.com/api/Store/technicalSupportStoredeleteall?${queryParams}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${cookies.access_token}`,
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
	const isSelected = (name) => selected.indexOf(name) !== -1;

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - fetchedData?.length) : 0;

	const allRows = () => {
		const num = Math.ceil(fetchedData?.length / rowsPerPage);
		const arr = [];
		for (let index = 0; index < num; index++) {
			arr.push(index + 1);
		}
		return arr;
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					numSelected={selected.length}
					rowCount={fetchedData?.length}
					onSelectAllClick={handleSelectAllClick}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
							rowCount={fetchedData?.length}
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
									{fetchedData?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										stableSort(fetchedData, getComparator(order, orderBy))
											?.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											?.map((row, index) => {
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
																	onClick={(event) =>
																		handleClick(event, row.id)
																	}
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
														<TableCell align='center'> {row?.title}</TableCell>
														<TableCell align='center'>
															{" "}
															{row?.store?.user?.name}
														</TableCell>
														<TableCell align='center'> {row?.type}</TableCell>
														<TableCell align='center'>
															<div className='sub-categories'>
																<span
																	className='status d-inline-flex align-items-center'
																	style={{
																		backgroundColor:
																			row?.supportstatus === "منتهية"
																				? "#3ae374"
																				: row?.supportstatus === "قيد المعالجة"
																				? "#ff9f1a"
																				: "#d3d3d3",
																		color: "#fff",
																	}}>
																	{row?.supportstatus === "منتهية" ? (
																		<GoCheck />
																	) : row?.supportstatus === "قيد المعالجة" ? (
																		<HourGleass />
																	) : (
																		<DeadLineIcon />
																	)}
																	{row?.supportstatus}
																</span>
															</div>
														</TableCell>
														<TableCell align='right'>
															<div className='actions d-flex justify-content-evenly'>
																<span>
																	<DeletteIcon
																		onClick={() => {
																			setActionDelete(
																				"سيتم حذف الشكوى وهذة الخطوة غير قابلة للرجوع"
																			);
																			setDeleteMethod("get");
																			setUrl(
																				`https://backend.atlbha.com/api/Store/technicalSupportStoredeleteall?id[]=${row?.id}`
																			);
																		}}
																		style={{
																			cursor: "pointer",
																			color: "red",
																			fontSize: "1.2rem",
																		}}></DeletteIcon>
																</span>
																<span
																	style={{ cursor: "pointer" }}
																	onClick={() =>
																		navigate(`supportDetails/${row?.id}`)
																	}>
																	<ReportIcon />
																</span>
															</div>
														</TableCell>
													</TableRow>
												);
											})
									)}
									{emptyRows > 0 && (
										<TableRow
											style={{
												height: 53 * emptyRows,
											}}>
											<TableCell colSpan={6} />
										</TableRow>
									)}
								</Fragment>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			{fetchedData?.length !== 0 && !loading && (
				<TablePagination
					rowsPerPagesCount={rowsPerPagesCount}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
					handleRowsClick={handleRowsClick}
					anchorEl={anchorEl}
					open={open}
					handleClose={handleClose}
					page={page}
					setPage={setPage}
					allRows={allRows}
				/>
			)}
		</Box>
	);
};

export default SupportTable;
