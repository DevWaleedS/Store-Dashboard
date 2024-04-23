import React, { Fragment, useState, useContext } from "react";

// Third party
import { toast } from "react-toastify";
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
import DeleteModal from "../DeleteModal/DeleteModal";
import DeleteOneModalComp from "../DeleteOneModal/DeleteOneModal";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";

// import icons
import { DeleteIcon, Reports } from "../../data/Icons";

// RTK
import {
	useChangeAllCouponsStatusMutation,
	useChangeCouponStatusMutation,
	useDeleteAllCouponsMutation,
	useDeleteCouponMutation,
} from "../../store/apiSlices/couponApi";

const switchStyle = {
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
};

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
	const { numSelected, rowCount, onSelectAllClick, itemsSelected } = props;
	const NotificationStore = useContext(NotificationContext);
	const { setNotificationTitle, setItems, setActionType } = NotificationStore;
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
								setItems(itemsSelected);
								setActionType("deleteAll");
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

export default function CouponTable({
	coupons,
	loading,
	rowsCount,
	setRowsCount,
	pageTarget,
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

	/** --------------------------------------------------- */
	// select all items
	const [selected, setSelected] = useState([]);
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = coupons?.map((n) => n.id);
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

	// Delete items
	const [deleteCoupon] = useDeleteCouponMutation();
	const [deleteAllCoupons] = useDeleteAllCouponsMutation();

	const handleDeleteSingleItem = async (id) => {
		try {
			await deleteCoupon({ couponId: id })
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
			console.error("Failed to delete the deleteCoupon", err);
		}
	};
	const handleDeleteAllItems = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await deleteAllCoupons({ selected: queryParams })
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
			console.error("Failed to delete the deleteAllCoupons", err);
		}
	};
	//------------------------------------------------------------------------

	// change category status
	const [changeCouponStatus] = useChangeCouponStatusMutation();
	const [changeAllCouponsStatus] = useChangeAllCouponsStatusMutation();

	const changeItemStatus = async (id) => {
		try {
			await changeCouponStatus({ couponId: id })
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
			console.error("Failed to delete the changeCouponStatus", err);
		}
	};
	const handleChangeAllItemsStatus = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await changeAllCouponsStatus({ selected: queryParams })
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

	// ----------------------------------------------------------------------------

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					itemsSelected={selected}
					numSelected={selected.length}
					rowCount={coupons?.length}
					onSelectAllClick={handleSelectAllClick}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected.length}
							onSelectAllClick={handleSelectAllClick}
							rowCount={coupons?.length}
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
									{coupons?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										coupons?.map((row, index) => {
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
													<TableCell align='right'>{row?.code}</TableCell>
													<TableCell align='right'>
														{row?.discount_type}
													</TableCell>
													<TableCell align='right'>
														{moment(row?.expire_date).format("DD/MM/YYYY")}
													</TableCell>
													<TableCell align='center'>{row?.discount}</TableCell>
													<TableCell align='center'>
														{row?.total_price}
													</TableCell>
													<TableCell align='center'>
														<div
															align='center'
															className='status '
															style={{
																backgroundColor:
																	row?.status === "نشط" ? "#e0ffea" : "#ebebeb",
																color:
																	row?.status === "نشط" ? "#3ae374" : "#a7a7a7",
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
																onChange={() => changeItemStatus(row?.id)}
																checked={row?.status === "نشط" ? true : false}
																sx={switchStyle}
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
																		setItemId(row.id);
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
			{coupons?.length !== 0 && !loading && (
				<TablePagination
					data={coupons}
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
