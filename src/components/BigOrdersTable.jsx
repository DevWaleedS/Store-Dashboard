import React, { Fragment, useState } from "react";

import { useNavigate } from "react-router-dom";
import CircularLoading from "../HelperComponents/CircularLoading";
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

import TablePagination from "./TablePagination";
// Icons
import { ReactComponent as ReportIcon } from "../data/Icons/icon-24-actions-info_outined.svg";
import DateRangePicker from "rsuite/DateRangePicker";
import "rsuite/dist/rsuite.min.css";
import moment from "moment";

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
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					م
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					رقم الطلب
				</TableCell>
				<TableCell sx={{ color: "#02466a" }} align='right'>
					الاسم
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الحالة
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الموقع
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الكمية
				</TableCell>
				<TableCell sx={{ color: "#02466a" }} align='center'>
					المجموع
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
	rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
	const { dateValue, setDateValue } = props;

	return (
		<React.Fragment>
			{/** Filter Section */}
			<Toolbar>
				<div className='row mb-0 filter-wrapper m-0 mt-4'>
					<div className='filter-row d-flex align-items-center justify-content-between mb-3'>
						<div className='title-col'>
							<h4>جدول الطلبات</h4>
						</div>
						<div className='w-100 d-flex flex-row align-items-center justify-content-end flex-sm-nowrap flex-wrap'>
							<div className='orders-date-picker mw-100'>
								<div className='date-picker'>
									<DateRangePicker
										value={dateValue}
										onChange={setDateValue}
										dir='rtl'
										placeholder='اختر الفترة من - إلي'
									/>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Toolbar>
		</React.Fragment>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

export default function BigOrdersTable({ data, loading, reload, setReload }) {
	// Use Navigate for navigate to order details page
	const navigate = useNavigate();
	const [order, setOrder] = React.useState("asc");
	const [orderBy, setOrderBy] = React.useState("calories");
	const [selected, setSelected] = React.useState([]);
	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(8);
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [anchorEl, setAnchorEl] = React.useState(null);
	let filterData = data;
	let filterDataResult = filterData;
	const [itemSelected, setItemSelected] = useState("");
	const [dateValue, setDateValue] = useState([]);

	if (itemSelected === "new") {
		filterData = data?.sort((a, b) =>
			a?.created_at.localeCompare(b?.created_at)
		);
	} else if (itemSelected === "old") {
		filterData = data?.sort((a, b) =>
			b?.created_at.localeCompare(a?.created_at)
		);
	} else if (itemSelected === "location") {
		filterData = data?.sort((a, b) =>
			a?.user?.city?.name?.localeCompare(b?.user?.city?.name)
		);
	} else if (itemSelected === "status") {
		filterData = data?.sort((a, b) => a?.status.localeCompare(b?.status));
	} else {
		filterData = data?.sort((a, b) => a?.id - b?.id);
	}

	if (dateValue?.length !== 0 && dateValue !== null) {
		filterDataResult = filterData?.filter(
			(item) =>
				moment(item?.created_at).format("YYYY-MM-DD") >=
					moment(dateValue[0]).format("YYYY-MM-DD") &&
				moment(item?.created_at).format("YYYY-MM-DD") <=
					moment(dateValue[1]).format("YYYY-MM-DD")
		);
	} else {
		filterDataResult = filterData;
	}

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

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0
			? Math.max(0, (1 + page) * rowsPerPage - filterDataResult?.length)
			: 0;

	const allRows = () => {
		const num = Math.ceil(filterDataResult?.length / rowsPerPage);
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
					dateValue={dateValue}
					setDateValue={setDateValue}
					itemSelected={itemSelected}
					setItemSelected={setItemSelected}
					numSelected={selected.length}
					rowCount={filterDataResult?.length}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected.length}
							order={order}
							orderBy={orderBy}
							onRequestSort={handleRequestSort}
							rowCount={filterDataResult?.length}
						/>

						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={8}>
										<CircularLoading />
									</TableCell>
								</TableRow>
							) : (
								<Fragment>
									{filterDataResult?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										stableSort(filterDataResult, getComparator(order, orderBy))
											?.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											?.map((row, index) => {
												const labelId = `enhanced-table-checkbox-${index}`;

												return (
													<TableRow hover tabIndex={-1} key={index}>
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
																{(index + 1).toLocaleString("en-US", {
																	minimumIntegerDigits: 2,
																	useGrouping: false,
																})}
															</div>
														</TableCell>

														<TableCell align='right'>
															{row?.order_number}
														</TableCell>
														<TableCell align='right'>
															<div className='cate-prim'>
																<img
																	src={row?.user?.image}
																	alt='img'
																	className=' rounded-circle'
																/>
																<span className='me-3'>{row?.user?.name}</span>
															</div>
														</TableCell>
														<TableCell align='right' sx={{ width: "90px" }}>
															<div className='sub-categories'>
																<span
																	className='status d-flex justify-content-center align-items-center'
																	style={{
																		backgroundColor:
																			row?.status === "مكتمل"
																				? "#ebfcf1"
																				: row?.status === "جديد"
																				? "#d4ebf7"
																				: row?.status === "ملغي"
																				? "#ffebeb"
																				: row?.status === "جاري التجهيز"
																				? "#ffecd1c7"
																				: "#e8f8f8",
																		color:
																			row?.status === "مكتمل"
																				? "##9df1ba"
																				: row?.status === "جديد"
																				? "#0077ff"
																				: row?.status === "ملغي"
																				? "#ff7b7b"
																				: row?.status === "جاري التجهيز"
																				? "#ff9f1a"
																				: "#46c7ca",
																		borderRadius: "16px",
																		padding: "5px 25px",
																		fontWeight: 500,
																		width: "120px",
																	}}>
																	{row?.status}
																</span>
															</div>
														</TableCell>
														<TableCell align='center'>
															{row?.user?.city?.name}
														</TableCell>
														<TableCell align='center'>
															{row?.quantity}
														</TableCell>
														<TableCell align='center'>
															{row?.total_price} ر.س
														</TableCell>

														<TableCell align='right'>
															<div className='actions d-flex justify-content-evenly'>
																<span>
																	<ReportIcon
																		style={{ cursor: "pointer" }}
																		onClick={() => {
																			navigate(`OrderDetails/${row?.id}`);
																		}}
																	/>
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
			{filterDataResult?.length !== 0 && !loading && (
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
}
