import React, { Fragment, useEffect, useState, useContext } from "react";

// Third party
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

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
import DeleteModal from "../DeleteModal/DeleteModal";
import DeleteOneModalComp from "../DeleteOneModal/DeleteOneModal";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Icons
import { DeleteIcon, EditIcon } from "../../data/Icons";

// Context
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";
import { useDispatch, useSelector } from "react-redux";
import {
	useChangeAllProductsStatusMutation,
	useChangeProductStatusMutation,
	useChangeSpecialStatusMutation,
	useDeleteAllProductsMutation,
	useDeleteProductMutation,
} from "../../store/apiSlices/productsApi";
import { ChangeCategoriesForSomeSelectedProducts } from "../../pages/Products";
import { openModal } from "../../store/slices/ChangeCategoriesForSomeSelectedProducts";
import Context from "../../Context/context";

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
				<TableCell
					align='center'
					sx={{
						color: "#02466a",
						width: "68px",
						textAlign: "center",
					}}>
					م
				</TableCell>

				<TableCell
					align='center'
					sx={{
						color: "#02466a",
						width: "300px",
						textAlign: "right",
						paddingRight: "70px !important",
					}}>
					اسم المنتج
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					النشاط
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					السعر
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الكمية
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					المميزة
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
	onSelectAllClick: PropTypes.func.isRequired,
	rowCount: PropTypes.number,
};

function EnhancedTableToolbar(props) {
	const {
		itemsSelected,
		numSelected,
		rowCount,
		onSelectAllClick,
		handleOpenChangeCategoriesModal,
		tabSelectedId,
	} = props;
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
					<div className=' d-flex justify-content-start align-items-center flex-wrap '>
						<Tooltip
							className='delete-all'
							onClick={() => {
								setNotificationTitle(
									"سيتم حذف جميع المنتجات وهذه الخطوة غير قابلة للرجوع"
								);
								setItems(itemsSelected);
								setActionType("deleteAll");
							}}>
							<IconButton>
								<DeleteIcon title='حذف جميع المنتجات' />
								حذف الكل
							</IconButton>
						</Tooltip>
						<Tooltip
							className='switch-all '
							onClick={() => {
								setNotificationTitle(
									"سيتم تغيير حالة جميع المنتجات التي قمت بتحديدهم"
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
						{tabSelectedId === 1 && (
							<Tooltip>
								<button
									className='edit-all-categories-btn'
									onClick={handleOpenChangeCategoriesModal}>
									تعديل الأنشطة
								</button>
							</Tooltip>
						)}
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

export default function BigProductsTable({
	products,
	loading,
	rowsCount,
	setRowsCount,
	pageTarget,
	tabSelectedId,
	setPageTarget,
	pageCount,
	currentPage,
}) {
	const { modalIsOpen } = useSelector(
		(state) => state.ChangeCategoriesForSomeSelectedProductsSlice
	);

	const dispatch = useDispatch();
	const NotificationStore = useContext(NotificationContext);
	const { notificationTitle } = NotificationStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const DeleteStore = useContext(DeleteContext);
	const { setActionDelete, actionDelete, setItemId } = DeleteStore;

	// ----------------------------------------------------------------------------
	const [selected, setSelected] = useState([]);
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = products?.map((n) => n.id);

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
	/** --------------------------------------------------------------- */

	//to reset the taps to default value
	useEffect(() => {
		if (tabSelectedId) {
			setPageTarget(1);
			setRowsCount(10);
		}
	}, [tabSelectedId]);

	// Delete items
	const [deleteProduct] = useDeleteProductMutation();
	const [deleteAllProducts] = useDeleteAllProductsMutation();

	const handleDeleteSingleItem = async (id) => {
		try {
			await deleteProduct({ id })
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
			console.error("Failed to delete the category", err);
		}
	};
	const handleDeleteAllItems = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await deleteAllProducts({ selected: queryParams })
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
			console.error("Failed to delete the category", err);
		}
	};
	//------------------------------------------------------------------------

	// change category status
	const [changeProductStatus] = useChangeProductStatusMutation();
	const [changeSpecialStatus] = useChangeSpecialStatusMutation();
	const [changeAllProductsStatus] = useChangeAllProductsStatusMutation();

	const changeItemStatus = async (id) => {
		try {
			await changeProductStatus({ id })
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
			console.error("Failed to delete the category", err);
		}
	};
	const handleChangeAllItemsStatus = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await changeAllProductsStatus({ selected: queryParams })
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
			console.error("Failed to change Status for category", err);
		}
	};
	const handleChangeSpecialStatus = async (id) => {
		try {
			await changeSpecialStatus({ id })
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
			console.error("Failed to delete the category", err);
		}
	};

	/** open modal */
	const handleOpenChangeCategoriesModal = () => {
		dispatch(openModal());
	};

	return (
		<>
			<Box sx={{ width: "100%" }}>
				{modalIsOpen && (
					<ChangeCategoriesForSomeSelectedProducts
						selected={selected}
						setSelected={setSelected}
					/>
				)}

				<Paper sx={{ width: "100%", mb: 2 }}>
					<EnhancedTableToolbar
						itemsSelected={selected}
						numSelected={selected.length}
						tabSelectedId={tabSelectedId}
						rowCount={products?.length}
						onSelectAllClick={handleSelectAllClick}
						handleOpenChangeCategoriesModal={handleOpenChangeCategoriesModal}
					/>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
							<EnhancedTableHead
								numSelected={selected.length}
								onSelectAllClick={handleSelectAllClick}
								rowCount={products?.length}
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
											{products?.length === 0 ? (
												<TableRow>
													<TableCell colSpan={8}>
														<p className='text-center'>لاتوجد بيانات</p>
													</TableCell>
												</TableRow>
											) : (
												products?.map((row, index) => {
													const isItemSelected = isSelected(row.id);
													const labelId = `enhanced-table-checkbox-${index}`;

													return (
														<TableRow
															sx={{
																backgroundColor: row?.is_import
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
																<div className='flex items-center gap-4 '>
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
																		width: " 300px",
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
																row?.discount_price !== "0" ? (
																	<>
																		<span className='me-1 d-block'>
																			{row?.discount_price} ر.س
																		</span>

																		<del
																			className='original-price'
																			style={{
																				fontSize: "13px",
																				fontWeight: " 400",
																				color: "#b3b3b3",
																			}}>
																			{row?.selling_price} ر.س
																		</del>
																	</>
																) : (
																	<> {row?.selling_price} ر.س</>
																)}
															</TableCell>
															<TableCell align='center'>{row?.stock}</TableCell>
															<TableCell align='center'>
																<div
																	className='form-check form-switch'
																	style={{ margin: "0 auto" }}>
																	<Switch
																		onChange={() =>
																			handleChangeSpecialStatus(row?.id)
																		}
																		checked={
																			row?.special === "مميز" ? true : false
																		}
																		sx={switchStyle}
																	/>
																</div>
															</TableCell>

															<TableCell align='center'>
																<div
																	className='form-check form-switch'
																	style={{ margin: "0 auto" }}>
																	<Switch
																		onChange={() => changeItemStatus(row?.id)}
																		checked={
																			row?.status === "نشط" ? true : false
																		}
																		sx={switchStyle}
																	/>
																</div>
															</TableCell>

															<TableCell align='right'>
																<div className='actions d-flex justify-content-evenly'>
																	<Link
																		to={
																			row?.is_import
																				? `EditImportProducts/${row?.id}`
																				: `EditProduct/${row?.id}`
																		}
																		style={{ cursor: "pointer" }}>
																		<EditIcon title='تعديل المنتج' />
																	</Link>
																	<span>
																		<DeleteIcon
																			title='حذف المنتج'
																			onClick={() => {
																				setActionDelete(
																					"سيتم حذف المنتج وهذه الخطوة غير قابلة للرجوع"
																				);
																				setItemId(row.id);
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
									</>
								)}
							</TableBody>
						</Table>
					</TableContainer>
				</Paper>
				{products?.length !== 0 && !loading && (
					<TablePagination
						data={products}
						pageCount={pageCount}
						currentPage={currentPage}
						pageTarget={pageTarget}
						rowsCount={rowsCount}
						setRowsCount={setRowsCount}
						setPageTarget={setPageTarget}
					/>
				)}
			</Box>
			{actionDelete && (
				<DeleteOneModalComp handleDeleteSingleItem={handleDeleteSingleItem} />
			)}

			{notificationTitle && (
				<DeleteModal
					handleDeleteAllItems={handleDeleteAllItems}
					handleChangeAllItemsStatus={handleChangeAllItemsStatus}
				/>
			)}
		</>
	);
}
