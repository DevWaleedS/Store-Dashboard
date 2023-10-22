import React, { Fragment, useEffect, useState, useContext } from "react";
import axios from "axios";
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
import Switch from "@mui/material/Switch";
import TablePagination from "./TablePagination";
// Icons
import { ReactComponent as DeletteIcon } from "../data/Icons/icon-24-delete.svg";
import { ReactComponent as EditIcon } from "../data/Icons/editt 2.svg";
// Sweet alert function
import { Link } from "react-router-dom";
import Context from "../Context/context";
import { NotificationContext } from "../Context/NotificationProvider";
import { DeleteContext } from "../Context/DeleteProvider";
import CircularLoading from "../HelperComponents/CircularLoading";
import { useCookies } from "react-cookie";
import { UserAuth } from "../Context/UserAuthorProvider";

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
				<TableCell align='left' sx={{ color: "#02466a", width: "68px" }}>
					م
				</TableCell>

				<TableCell align='center' sx={{ color: "#02466a", width: "350px" }}>
					اسم المنتج
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					النشاط أو التصنيف
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					السعر
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الكمية
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					نشر
				</TableCell>
				<TableCell sx={{ color: "#02466a" }} align='center'>
					{" "}
					اجراء
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
									"سيتم حذف جميع المنتجات وهذةالخظوة غير قابلة للرجوع"
								);
								setActionTitle("Delete");
							}}>
							<IconButton>
								<DeletteIcon />
								حذف الكل
							</IconButton>
						</Tooltip>

						<Tooltip
							className='switch-all'
							onClick={() => {
								setNotificationTitle(
									"سيتم تغيبر حالة جميع المنتجات التي قمت بتحديدهم"
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

export default function BigProductsTable({ data, loading, reload, setReload }) {
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
	const [order, setOrder] = useState("asc");
	const [orderBy, setOrderBy] = useState("calories");
	const [selected, setSelected] = useState([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
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

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = data?.map((n) => n.id);
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

	// change category status
	const changeCouponStatus = (id) => {
		axios
			.get(
				`https://backend.atlbha.com/api/Store/productchangeSatusall?id[]=${id}`,
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
	};

	useEffect(() => {
		if (confirm && actionTitle === "Delete") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(
					`https://backend.atlbha.com/api/Store/productdeleteall?${queryParams}`,
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
		if (confirm && actionTitle === "changeStatus") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(
					`https://backend.atlbha.com/api/Store/productchangeSatusall?${queryParams}`,
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

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const isSelected = (id) => selected.indexOf(id) !== -1;

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
							order={order}
							orderBy={orderBy}
							onSelectAllClick={handleSelectAllClick}
							onRequestSort={handleRequestSort}
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
								<>
									<Fragment>
										{data?.length === 0 ? (
											<TableRow>
												<TableCell colSpan={8}>
													<p className='text-center'>لاتوجد بيانات</p>
												</TableCell>
											</TableRow>
										) : (
											stableSort(data, getComparator(order, orderBy))
												?.slice(
													page * rowsPerPage,
													page * rowsPerPage + rowsPerPage
												)
												?.map((row, index) => {
													const isItemSelected = isSelected(row.id);
													const labelId = `enhanced-table-checkbox-${index}`;

													return (
														<TableRow
															sx={{
																backgroundColor:
																	row?.type === "importProduct" ||
																	row?.is_import
																		? "#dfe2aa"
																		: "",
															}}
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
																<div className='flex items-center gap-4 pe-2'>
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
																		minimumIntegerDigits: 2,
																		useGrouping: false,
																	})}
																</div>
															</TableCell>

															<TableCell align='center'>
																<div
																	className='cate-prim d-flex align-items-center justify-content-start'
																	style={{
																		width: " 350px",
																		paddingRight: "30px",
																	}}>
																	<img
																		className='img_icons'
																		src={row?.cover}
																		alt='img'
																	/>

																	<span
																		className='me-3'
																		style={{
																			maxWidth: "100%",
																			whiteSpace: "nowrap",
																			overflow: "hidden",
																			textOverflow: "ellipsis",
																		}}>
																		{row?.name}
																	</span>
																</div>
															</TableCell>
															<TableCell align='right'>
																{row?.category?.name}
															</TableCell>
															<TableCell align='center'>
																{row?.discount_price &&
																row?.discount_price !== 0 ? (
																	<>
																		<span class='me-1 d-block'>
																			{row?.discount_price} ر.س
																		</span>

																		<del
																			class='original-price'
																			style={{
																				fontSize: "13px",
																				fontWeight: " 400",
																				color: "#b3b3b3",
																			}}>
																			{row?.selling_price} ر.س
																		</del>
																	</>
																) : (
																	row?.selling_price
																)}
															</TableCell>
															<TableCell align='center'>{row?.stock}</TableCell>

															<TableCell align='center'>
																<div
																	className='form-check form-switch'
																	style={{ margin: "0 auto" }}>
																	<Switch
																		onChange={() => changeCouponStatus(row?.id)}
																		checked={
																			row?.status === "نشط" ? true : false
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
																</div>
															</TableCell>

															<TableCell align='right'>
																<div className='actions d-flex justify-content-evenly'>
																	<Link
																		to={
																			row?.type === "importProduct" ||
																			row?.is_import
																				? `ShowImportEtlobhaProduct/${row?.id}`
																				: `EditProduct/${row?.id}`
																		}
																		style={{ cursor: "pointer" }}>
																		<EditIcon />
																	</Link>
																	<span>
																		<DeletteIcon
																			onClick={() => {
																				setActionDelete(
																					"سيتم حذف المنتج وهذة الخطوة غير قابلة للرجوع"
																				);
																				setDeleteMethod("get");
																				setUrl(
																					`https://backend.atlbha.com/api/Store/productdeleteall?id[]=${row?.id}`
																				);
																			}}
																			style={{
																				cursor: "pointer",
																				color: "red",
																				fontSize: "1.2rem",
																			}}></DeletteIcon>
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
								</>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			{data?.length !== 0 && !loading && (
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
