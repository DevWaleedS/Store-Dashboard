import React, { Fragment, useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
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
//
import TablePagination from "./TablePagination";
import Context from "../Context/context";
import { NotificationContext } from "../Context/NotificationProvider";
import { DeleteContext } from "../Context/DeleteProvider";

// ICONS
import { ReactComponent as DeletteIcon } from "../data/Icons/icon-24-delete.svg";
import editIcon from "../data/Icons/editt 2.svg";
import CircularLoading from "../HelperComponents/CircularLoading";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell align='left' sx={{ color: "#02466a", width: "73px" }}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a", width: "80px" }}>
					ID
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a", width: "300px" }}>
					الأساسي
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					فرعي
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					التصنيفات الفرعية
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					نشر
				</TableCell>
				<TableCell sx={{ color: "#02466a" }} align='center'>
					اجراء
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
									"سيتم حذف جميع التصنيفات وهذةالخطوة غير قابلة للرجوع"
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
									"سيتم تعطيل جميع التصنيفات التي قمت بتحديدهم"
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

export default function EnhancedTable({
	fetchedData,
	loading,
	reload,
	setReload,
}) {
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
	const [page, setPage] = useState(0);
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

	/** --------------------------------------------------- */
	// select all items
	const [selected, setSelected] = useState([]);
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = fetchedData?.map((n) => n.id);
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
	const changeCategoryStatus = (id) => {
		axios
			.get(
				`https://backend.atlbha.com/api/Store/categoryStorechangeSatusall?id[]=${id}`,
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
	};

	// Delete all items and Change all status
	useEffect(() => {
		if (confirm && actionTitle === "Delete") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(
					`https://backend.atlbha.com/api/Store/categoryStoredeleteall?${queryParams}`,
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
		if (confirm && actionTitle === "changeStatus") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(
					`https://backend.atlbha.com/api/Store/categoryStorechangeSatusall?${queryParams}`,
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

	const isSelected = (id) => selected.indexOf(id) !== -1;
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
							onSelectAllClick={handleSelectAllClick}
							rowCount={fetchedData?.length}
						/>

						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={7}>
										<CircularLoading />
									</TableCell>
								</TableRow>
							) : (
								<Fragment>
									{fetchedData?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={7}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										fetchedData
											?.slice(
												page * rowsPerPage,
												page * rowsPerPage + rowsPerPage
											)
											?.map((row, index) => {
												const isItemSelected = isSelected(row?.id);
												const labelId = `enhanced-table-checkbox-${index}`;

												return (
													<TableRow
														style={{
															backgroundColor:
																row?.store === null ? "#dfe2aa" : "",
														}}
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
																	gap: "7px",
																}}>
																{row?.store === null ? (
																	<Checkbox
																		disabled={
																			row?.store === null ? true : false
																		}
																		sx={{
																			color: "#356b88",
																			"& .MuiSvgIcon-root": {
																				color: "#356b88",
																			},
																		}}
																		inputProps={{
																			"aria-labelledby": labelId,
																		}}
																	/>
																) : (
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
																)}
																{(index + 1).toLocaleString("en-US", {
																	minimumIntegerDigits: 1,
																	useGrouping: false,
																})}
															</div>
														</TableCell>

														<TableCell
															align='center text-overflow'
															sx={{ width: "73px" }}>
															{row?.number}
														</TableCell>
														<TableCell>
															<div
																className='cate-prim d-flex align-items-center justify-content-start'
																style={{
																	width: " 300px",
																	paddingRight: "60px",
																}}>
																<img
																	src={row?.icon}
																	alt={row?.name}
																	style={{
																		minWidth: " 40px",
																		maxWidth: "40px",
																		height: "40px",
																		objectFit: "contain",
																	}}
																/>
																<span className='me-3 text-overflow'>
																	{row?.name}
																</span>
															</div>
														</TableCell>
														<TableCell align='center text-overflow'>
															{row?.countsubcategory}
														</TableCell>

														<TableCell align='right'>
															<div className='sub-categories'>
																{row?.subcategory.slice(0, 3).map((tag) => {
																	return (
																		<span
																			style={{
																				background:
																					row?.store === null
																						? "#FFFF"
																						: "#dcdcdc",
																			}}
																			key={tag?.id}>
																			{tag?.name}
																		</span>
																	);
																})}
																{row?.subcategory?.length > 3 && (
																	<span>...</span>
																)}
															</div>
														</TableCell>

														<TableCell align='center'>
															<div
																className='form-check form-switch'
																style={{ margin: "0 auto" }}>
																<Switch
																	disabled={row?.store === null ? true : false}
																	onChange={() => changeCategoryStatus(row?.id)}
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
															</div>
														</TableCell>

														<TableCell align='right'>
															<div className='actions d-flex justify-content-evenly'>
																<span
																	style={{
																		pointerEvents:
																			row?.store === null ? "none" : "",
																	}}>
																	<Link
																		to={`EditCategory/${row?.id}`}
																		style={{ cursor: "pointer" }}>
																		<img
																			src={editIcon}
																			alt='edit'
																			title='edit'
																		/>
																	</Link>
																</span>
																<span>
																	<DeletteIcon
																		onClick={() => {
																			setActionDelete(
																				"سيتم حذف التصنيف وهذة الخطوة غير قابلة للرجوع"
																			);
																			setDeleteMethod("get");
																			setUrl(
																				`https://backend.atlbha.com/api/Store/categoryStoredeleteall?id[]=${row?.id}`
																			);
																		}}
																		style={{
																			pointerEvents:
																				row?.store === null ? "none" : "",
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
}
