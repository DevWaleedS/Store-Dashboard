import React, { Fragment, useState, useContext, useEffect } from "react";

import PropTypes from "prop-types";
// import { useCookies } from 'react-cookie';
import axios from "axios";
import Context from "../Context/context";
import { NotificationContext } from "../Context/NotificationProvider";
import { DeleteContext } from "../Context/DeleteProvider";
import moment from "moment";
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
import { TextField } from "@mui/material";

import TablePagination from "./TablePagination";

// Import icon
import { ReactComponent as DeletteIcon } from "../data/Icons/icon-24-delete.svg";
import CircularLoading from "../HelperComponents/CircularLoading";
import { FiSearch } from "react-icons/fi";
import { Link } from "react-router-dom";
import { UserAuth } from "../Context/UserAuthorProvider";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#EDECFE" }}>
			<TableRow>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					اسم العميل
				</TableCell>
				<TableCell sx={{ color: "#67747B" }} align='right'>
					تاريخ السلة
				</TableCell>
				<TableCell sx={{ color: "#67747B" }} align='center'>
					عدد المنتجات
				</TableCell>
				<TableCell sx={{ color: "#67747B" }} align='center'>
					اجمالي السلة
				</TableCell>
				<TableCell sx={{ color: "#67747B" }} align='center'>
					الحالة
				</TableCell>
				<TableCell
					sx={{ color: "#02466a", width: "80px" }}
					align='center'></TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onSelectAllClick: PropTypes.func.isRequired,
	rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
	const { numSelected, rowCount, onSelectAllClick, search, setSearch } = props;
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
			<div className='search-input-box'>
				<FiSearch />
				<TextField
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					sx={{ paddingRight: "35px" }}
					id='outlined-basic'
					label='ابحث عن طريق اسم الزبون '
					variant='outlined'
				/>
			</div>

			<div className=' d-flex flex-row-reverse  justify-content-between align-items-center '>
				<div></div>
				{numSelected > 0 && (
					<div>
						<Tooltip
							onClick={() => {
								setNotificationTitle(
									"سيتم حذف جميع السلات وهذةالخطوة غير قابلة للرجوع"
								);
								setActionTitle("Delete");
							}}
							className='delete-all'>
							<IconButton>
								<DeletteIcon />
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

export default function CartsTables({
	cartsData,
	loading,
	reload,
	setReload,
	search,
	setSearch,
}) {
	// const [cookies] = useCookies(['access_token']);
	const userAuthored = useContext(UserAuth);
	const { userAuthor } = userAuthored;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const NotificationStore = useContext(NotificationContext);
	const { confirm, setConfirm, actionTitle, setActionTitle } =
		NotificationStore;
	const DeleteStore = useContext(DeleteContext);
	const {
		setUrl,
		setActionDelete,
		deleteReload,
		setDeleteReload,
		setDeleteMethod,
	} = DeleteStore;
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);

	// for pagination
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [anchorEl, setAnchorEl] = useState(null);
	const open = Boolean(anchorEl);
	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};
	// _____________________________________________________________________ //

	// Select all items
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = cartsData?.map((item) => item?.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, id) => {
		const selectedIndex = selected?.indexOf(id);
		let newSelected = [];

		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, id);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected?.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}

		setSelected(newSelected);
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
				.get(`https://backend.atlbha.com/api/Store/deleteCart?${queryParams}`, {
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${userAuthor}`,
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

	// for pagination
	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (name) => selected.indexOf(name) !== -1;

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - cartsData?.length) : 0;
	const allRows = () => {
		const num = Math.ceil(cartsData?.length / rowsPerPage);
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
					search={search}
					setSearch={setSearch}
					numSelected={selected?.length}
					rowCount={cartsData?.length}
					onSelectAllClick={handleSelectAllClick}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected?.length}
							onSelectAllClick={handleSelectAllClick}
							rowCount={cartsData?.length}
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
									{cartsData?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										cartsData
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
																	onClick={(event) =>
																		handleClick(event, row?.id)
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

														<TableCell align='right'>
															<Link
																to={`ClientData/${row?.id}`}
																style={{ cursor: "pointer" }}>
																<div className='cate-prim'>
																	<img
																		src={row?.user?.image}
																		alt='img'
																		className=' rounded-circle'
																	/>
																	<span className='me-3 text-black'>
																		{row?.user?.name}
																	</span>
																</div>
															</Link>
														</TableCell>
														<TableCell align='right'>
															{moment(row?.created_at).format("YYYY-MM-DD")}
														</TableCell>
														<TableCell align='center'>{row?.count}</TableCell>

														<TableCell align='center'>
															{row?.total} ر.س
														</TableCell>

														<TableCell align='center'>{row?.status}</TableCell>
														<TableCell align='center' sx={{ width: "80px" }}>
															<DeletteIcon
																style={{ cursor: "pointer" }}
																onClick={() => {
																	setActionDelete(
																		"سيتم حذف السلة وهذة الخطوة غير قابلة للرجوع"
																	);
																	setDeleteMethod("get");
																	setUrl(
																		`https://backend.atlbha.com/api/Store/deleteCart?id[]=${row?.id}`
																	);
																}}
															/>
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
			{cartsData?.length !== 0 && !loading && (
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
