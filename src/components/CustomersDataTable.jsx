import React, { Fragment, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";

import Context from "../Context/context";
import { NotificationContext } from "../Context/NotificationProvider";
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
import TablePagination from "./TablePagination";

// import icons
import { ReactComponent as ReportIcon } from "../data/Icons/icon-24-report.svg";
import { ReactComponent as DeletteIcon } from "../data/Icons/icon-24-delete.svg";
import CircularLoading from "../HelperComponents/CircularLoading";
import GetDateOnly from "../HelperComponents/GetDateOnly";
import { UserAuth } from "../Context/UserAuthorProvider";
function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell align='left' sx={{ color: "#02466a" }}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					ID
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a", width: "290px" }}>
					اسم العميل
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					تاريخ التسجيل
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					البريد الالكتروني
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					المدينه
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
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
	rowCount: PropTypes.number.isRequired,
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
									"سيتم حذف جميع العملاء وهذةالخطوة غير قابلة للرجوع"
								);
								setActionTitle("Delete");
							}}>
							<IconButton>
								<DeletteIcon />
								حذف الكل
							</IconButton>
						</Tooltip>

						{/**<Tooltip className='switch-all'>
							<IconButton>
								<Switch
									sx={{
										width: '50px',
										'& .MuiSwitch-track': {
											width: 26,
											height: 14,
											opacity: 1,
											backgroundColor: '#ff9f1a',
											boxSizing: 'border-box',
										},
										'& .MuiSwitch-thumb': {
											boxShadow: 'none',
											width: 10,
											height: 10,
											borderRadius: 5,
											transform: 'translate(6px,6px)',
											color: '#fff',
										},
										'&:hover': {
											'& .MuiSwitch-thumb': {
												boxShadow: 'none',
											},
										},

										'& .MuiSwitch-switchBase': {
											padding: 1,
											'&.Mui-checked': {
												transform: 'translateX(11px)',
												color: '#fff',
												'& + .MuiSwitch-track': {
													opacity: 1,
													backgroundColor: '#3AE374',
												},
											},
										},
									}}
								/>
								تعطيل الكل
							</IconButton>
						</Tooltip> */}
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

export default function CustomersDataTable({
	fetchedData,
	loading,
	reload,
	setReload,
}) {
	const [cookies] = useCookies(["access_token"]);

	const navigate = useNavigate();
	const NotificationStore = useContext(NotificationContext);
	const { confirm, setConfirm, actionTitle, setActionTitle } =
		NotificationStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
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

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = fetchedData?.map((n) => n.id);
			setSelected(newSelected);
			return;
		}
		setSelected([]);
	};
	// Delete single item
	const deleteItem = (id) => {
		axios
			.get(`https://backend.atlbha.com/api/Store/clientdeleteall?id[]=${id}`, {
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${cookies?.access_token}`,
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
				.get(
					`https://backend.atlbha.com/api/Store/clientdeleteall?${queryParams}`,
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
												const isItemSelected = isSelected(row.id);
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

														<TableCell align='center'>
															{row?.ID_number}
														</TableCell>
														<TableCell>
															<div
																className='cate-prim  d-flex align-items-center justify-content-start'
																style={{
																	width: " 290px",
																	paddingRight: "60px",
																}}>
																<img
																	src={row?.image}
																	alt={row?.first_name}
																	className='rounded-circle'
																/>
																<span className='me-2'>{`${row?.first_name} ${row?.last_name}`}</span>
															</div>
														</TableCell>
														<TableCell align='center'>
															{GetDateOnly(row?.created_at)}
														</TableCell>
														<TableCell align='center'>{row?.email}</TableCell>
														<TableCell align='center'>
															{row?.city?.name}
														</TableCell>

														<TableCell align='right'>
															<div className='actions d-flex justify-content-evenly'>
																<span
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		navigate(`customerDetails/${row?.id}`);
																	}}>
																	<ReportIcon />
																</span>
																<span>
																	<DeletteIcon
																		onClick={() => deleteItem(row?.id)}
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
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
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
		</Box>
	);
}
