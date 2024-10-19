import React, { Fragment, useEffect, useState, useContext } from "react";

// Third part
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Switch from "@mui/material/Switch";
import Toolbar from "@mui/material/Toolbar";
import Tooltip from "@mui/material/Tooltip";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";

//Components
import DeleteModal from "../DeleteModal/DeleteModal";
import { TablePagination } from "./TablePagination";
import DeleteOneModalComp from "../DeleteOneModal/DeleteOneModal";
import CircularLoading from "../../HelperComponents/CircularLoading";
import DeleteCategoryAlert from "../../pages/Categories/DeleteCategoryAlert";
import { openDeleteCategoryAlert } from "../../store/slices/CategoriesSlice";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";

// Icons
import { DeleteIcon, EditIcon } from "../../data/Icons";
import { useDispatch } from "react-redux";

// RTK
import {
	useChangeAllCategoriesStatusMutation,
	useChangeCategoryStatusMutation,
	useDeleteAllCategoriesMutation,
	useDeleteCategoryMutation,
} from "../../store/apiSlices/categoriesApi";

function EnhancedTableHead(props) {
	const { tabSelectedId } = props;
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell
					align='left'
					sx={{ color: "#02466a", minWidth: "73px", textAlign: "center" }}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a", minWidth: "80px" }}>
					ID
				</TableCell>
				<TableCell
					align='center'
					sx={{
						color: "#02466a",
						minWidth: "300px",
						textAlign: "right",
						paddingRight: "68px !important",
					}}>
					النشاط الأساسي
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					فرعي
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a", textAlign: "right" }}>
					الأنشطة الفرعية
				</TableCell>
				{tabSelectedId === 1 && (
					<TableCell align='center' sx={{ color: "#02466a" }}>
						نشر
					</TableCell>
				)}
				{tabSelectedId === 1 && (
					<TableCell sx={{ color: "#02466a" }} align='center'>
						اجراء
					</TableCell>
				)}
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
		numSelected,
		rowCount,
		onSelectAllClick,
		tabSelectedId,
		itemsSelected,
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
			{tabSelectedId === 1 && (
				<div className=' d-flex flex-row-reverse  justify-content-between align-items-center '>
					<div></div>
					{numSelected > 0 && (
						<div>
							<Tooltip
								className='delete-all'
								onClick={() => {
									setNotificationTitle(
										"سيتم حذف جميع الأنشطة وهذه الخطوة غير قابلة للرجوع"
									);
									setItems(itemsSelected);
									setActionType("deleteAll");
								}}>
								<IconButton>
									<DeleteIcon title='حذف جميع الأنشطة' />
									حذف الكل
								</IconButton>
							</Tooltip>

							<Tooltip
								className='switch-all'
								onClick={() => {
									setNotificationTitle(
										"سيتم تعطيل جميع الأنشطة التي قمت بتحديدهم"
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
			)}
			{tabSelectedId === 1 && (
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
			)}
		</Toolbar>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({
	categories,
	pageCount,
	currentPage,
	loading,
	tabSelectedId,
	rowsCount,
	setRowsCount,
	pageTarget,
	setPageTarget,
}) {
	const dispatch = useDispatch();
	const NotificationStore = useContext(NotificationContext);
	const { notificationTitle } = NotificationStore;
	const DeleteStore = useContext(DeleteContext);
	const { setItemId, setActionDelete, actionDelete } = DeleteStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;

	//------------------------------------------------------------------------

	// select all items
	const [selected, setSelected] = useState([]);
	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelected = categories?.map((n) => n.id);
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

	//  reset the page target and rows count
	useEffect(() => {
		if (tabSelectedId) {
			setPageTarget(1);
			setRowsCount(10);
		}
	}, [tabSelectedId]);
	//------------------------------------------------------------------------

	// Delete items
	const [deleteCategory] = useDeleteCategoryMutation();
	const [deleteAllCategories] = useDeleteAllCategoriesMutation();

	const handleDeleteSingleItem = async (id) => {
		try {
			await deleteCategory({ categoryId: id })
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
			await deleteAllCategories({ selected: queryParams })
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
	const [changeCategoryStatus] = useChangeCategoryStatusMutation();
	const [changeAllCategoriesStatus] = useChangeAllCategoriesStatusMutation();

	const changeItemStatus = async (id) => {
		try {
			await changeCategoryStatus({ categoryId: id })
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
			await changeAllCategoriesStatus({ selected: queryParams })
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

	return (
		<>
			<Box sx={{ width: "100%" }}>
				<Paper sx={{ width: "100%", mb: 2 }}>
					<EnhancedTableToolbar
						itemsSelected={selected}
						numSelected={selected.length}
						rowCount={categories?.length}
						onSelectAllClick={handleSelectAllClick}
						tabSelectedId={tabSelectedId}
					/>
					<TableContainer>
						<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
							<EnhancedTableHead
								numSelected={selected.length}
								onSelectAllClick={handleSelectAllClick}
								rowCount={categories?.length}
								tabSelectedId={tabSelectedId}
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
										{categories?.length === 0 ? (
											<TableRow>
												<TableCell colSpan={7}>
													<p className='text-center'>لاتوجد بيانات</p>
												</TableCell>
											</TableRow>
										) : (
											categories?.map((row, index) => {
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
																	justifyContent:
																		tabSelectedId === 1 ? "start" : "center",
																	alignItems: "center",
																	gap: "7px",
																}}>
																{tabSelectedId === 1 && (
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

														<TableCell align='center' sx={{ minWidth: "73px" }}>
															{row?.number}
														</TableCell>
														<TableCell>
															<div
																className='cate-prim d-flex align-items-center justify-content-start'
																style={{
																	minWidth: " 300px",
																}}>
																<img
																	className='img_icons'
																	style={{
																		border:
																			row?.store === null
																				? "1px solid #cfcdcd"
																				: "1px solid #ddd",
																	}}
																	src={row?.icon}
																	alt={row?.name}
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
														<TableCell align='center'>
															{row?.countsubcategory}
														</TableCell>

														<TableCell align='right'>
															{row?.subcategory?.length === 0 ? (
																<div className='w-100 text-justfiy'>
																	لا يوجد أنشطة فرعية
																</div>
															) : (
																<div className='sub-categories'>
																	{row?.subcategory?.length <= 2
																		? row?.subcategory?.map((tag) => {
																				return (
																					<div
																						key={tag?.id}
																						style={{
																							background:
																								row?.store === null
																									? "#FFFF"
																									: "#dcdcdc",
																							minWidth: "40%",
																						}}>
																						<span className='w-100 text-center text-overflow'>
																							{tag?.name}
																						</span>
																					</div>
																				);
																		  })
																		: row?.subcategory
																				.slice(0, 2)
																				.map((tag) => {
																					return (
																						<div
																							key={tag?.id}
																							style={{
																								background:
																									row?.store === null
																										? "#FFFF"
																										: "#dcdcdc",
																							}}>
																							<span className='w-100 text-center text-overflow'>
																								{tag?.name}
																							</span>
																						</div>
																					);
																				})}

																	{row?.subcategory?.length > 2 && (
																		<div
																			style={{
																				background:
																					row?.store === null
																						? "#FFFF"
																						: "#dcdcdc",
																				minWidth: "max-content",
																			}}>
																			{tabSelectedId === 1 ? (
																				<Link
																					to={`EditCategory/${row?.id}`}
																					style={{ cursor: "pointer" }}
																					title='المزيد من الأنشطة'>
																					...
																				</Link>
																			) : (
																				<span>...</span>
																			)}
																		</div>
																	)}
																</div>
															)}
														</TableCell>

														{tabSelectedId === 1 && (
															<TableCell align='center'>
																<div
																	className='form-check form-switch'
																	style={{ margin: "0 auto" }}>
																	<Switch
																		disabled={
																			row?.store === null ? true : false
																		}
																		onChange={() => changeItemStatus(row?.id)}
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
														)}

														{tabSelectedId === 1 && (
															<TableCell align='right'>
																<div className='actions d-flex justify-content-center gap-1'>
																	<span
																		style={{
																			pointerEvents:
																				row?.store === null ? "none" : "",
																		}}>
																		<Link
																			to={
																				row?.is_service
																					? `edit-service-category/${row?.id}`
																					: `EditCategory/${row?.id}`
																			}
																			style={{ cursor: "pointer" }}>
																			<EditIcon title='تعديل النشاط' />
																		</Link>
																	</span>
																	<span>
																		<DeleteIcon
																			title='حذف النشاط'
																			onClick={() => {
																				if (row?.possibility_of_delete) {
																					setActionDelete(
																						"سيتم حذف النشاط وهذه الخطوة غير قابلة للرجوع"
																					);

																					setItemId(row.id);
																				} else {
																					dispatch(
																						openDeleteCategoryAlert(
																							"لا يمكن حذف الأنشطة لأنها تحتوى على منتجات"
																						)
																					);
																				}
																			}}
																			style={{
																				pointerEvents:
																					row?.store === null ? "none" : "",
																				cursor: "pointer",
																				color: "red",
																				fontSize: "1.2rem",
																			}}
																		/>
																	</span>
																</div>
															</TableCell>
														)}
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
				{categories?.length !== 0 && !loading && (
					<TablePagination
						data={categories}
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

			{/* dealate message when the user try to delete category that used in some products*/}
			<DeleteCategoryAlert />
		</>
	);
}
