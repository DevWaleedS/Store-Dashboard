import React, { Fragment, useEffect, useState, useContext } from "react";

// Third party
import axios from "axios";
import { Link } from "react-router-dom";
import moment from "moment-with-locales-es6";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
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
import { DeleteIcon, Reports } from "../../data/Icons";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					م
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					اسم كود الخصم
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					نوع كود الخصم
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					تاريخ الانتهاء
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					النسبة %
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					المبلغ
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الحالة
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
	onSelectAllClick: PropTypes.func.isRequired,
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
									"سيتم حذف جميع أكواد الخصم وهذه الخطوة غير قابلة للرجوع"
								);
								setActionTitle("Delete");
							}}>
							<IconButton>
								<DeleteIcon title='حذف جميع أكواد الخصم ' />
								حذف الكل
							</IconButton>
						</Tooltip>

						<Tooltip
							className='switch-all'
							onClick={() => {
								setNotificationTitle(
									"سيتم تعطيل جميع أكواد الخصم التي قمت بتحديدهم"
								);
								setActionTitle("changeStatus");
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

export default function CouponTable({ data, loading, reload, setReload }) {
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

	// Handel pagination
	const [page, setPage] = useState(0);
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [rowsPerPage, setRowsPerPage] = React.useState(10);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleRowsClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Avoid a layout jump when reaching the last page with empty rows.
	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data?.length) : 0;

	const allRows = () => {
		const num = Math.ceil(data?.length / rowsPerPage);
		const arr = [];
		for (let index = 0; index < num; index++) {
			arr.push(index + 1);
		}
		return arr;
	};

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
	// -----------------------------------------------------------

	// Delete single item
	useEffect(() => {
		if (deleteReload === true) {
			setReload(!reload);
		}
		setDeleteReload(false);
	}, [deleteReload]);

	// change category status
	const changeProductStatus = (id) => {
		axios
			.get(`couponchangeSatusall?id[]=${id}`, {
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
	};

	// Delete all items and Change all status
	useEffect(() => {
		if (confirm && actionTitle === "Delete") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(`coupondeleteall?${queryParams}`, {
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
		if (confirm && actionTitle === "changeStatus") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(`couponchangeSatusall?${queryParams}`, {
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
									<TableCell colSpan={8}>
										<CircularLoading />
									</TableCell>
								</TableRow>
							) : (
								<Fragment>
									{data?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										data
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
																		handleClick(event, row.id)
																	}
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
														<TableCell align='right'>{row?.code}</TableCell>
														<TableCell align='right'>
															{row?.discount_type}
														</TableCell>
														<TableCell align='right'>
															{moment(row?.expire_date).format("DD/MM/YYYY")}
														</TableCell>
														<TableCell align='center'>
															{row?.discount}
														</TableCell>
														<TableCell align='center'>
															{row?.total_price}
														</TableCell>
														<TableCell align='center'>
															<div
																align='center'
																className='status '
																style={{
																	backgroundColor:
																		row?.status === "نشط"
																			? "#e0ffea"
																			: "#ebebeb",
																	color:
																		row?.status === "نشط"
																			? "#3ae374"
																			: "#a7a7a7",
																	width: "100px",
																	fontWeight: 400,
																	margin: "0 auto",
																	borderRadius: "16px",
																}}>
																{row?.status}
															</div>
														</TableCell>

														<TableCell align='right'>
															<div className='actions d-flex align-items-center justify-content-evenly'>
																<Switch
																	onChange={() => changeProductStatus(row?.id)}
																	checked={row?.status === "نشط" ? true : false}
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

																<span style={{ marginRight: "5px" }}>
																	{/** We will replace row.id to id  when Get API  */}

																	<Link
																		to={`EditCoupon/${row.id}`}
																		style={{ cursor: "pointer" }}>
																		<Reports title='تفاصيل كود الخصم' />
																	</Link>
																</span>
																<span>
																	<DeleteIcon
																		title='حذف كود الخصم'
																		onClick={() => {
																			setActionDelete(
																				"سيتم حذف كود الخصم وهذه الخطوة غير قابلة للرجوع"
																			);
																			setDeleteMethod("get");
																			setUrl(`coupondeleteall?id[]=${row?.id}`);
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
			{data?.length !== 0 && !loading && (
				<TablePagination
					open={open}
					page={page}
					setPage={setPage}
					allRows={allRows}
					data={data?.length}
					anchorEl={anchorEl}
					rowsPerPage={rowsPerPage}
					handleClose={handleClose}
					handleRowsClick={handleRowsClick}
					rowsPerPagesCount={rowsPerPagesCount}
					handleChangeRowsPerPage={handleChangeRowsPerPage}
				/>
			)}
		</Box>
	);
}
