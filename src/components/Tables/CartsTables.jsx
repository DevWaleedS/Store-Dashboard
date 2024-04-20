import React, { Fragment, useState, useContext } from "react";

// Third party
import moment from "moment";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import Tooltip from "@mui/material/Tooltip";
import Toolbar from "@mui/material/Toolbar";
import Checkbox from "@mui/material/Checkbox";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableHead from "@mui/material/TableHead";
import TableCell from "@mui/material/TableCell";
import IconButton from "@mui/material/IconButton";
import TableContainer from "@mui/material/TableContainer";

// Components
import { TablePagination } from "./TablePagination";
import DeleteModal from "../DeleteModal/DeleteModal";
import DeleteOneModalComp from "../DeleteOneModal/DeleteOneModal";
import CircularLoading from "../../HelperComponents/CircularLoading";

// Import icon
import { FiSearch } from "react-icons/fi";
import { DeleteIcon, EditIcon } from "../../data/Icons";

//redux
import { useDispatch } from "react-redux";

import {
	useDeleteAllEmptyCartsMutation,
	useDeleteEmptyCartsMutation,
} from "../../store/apiSlices/emptyCartsApi";

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
					إجمالي السلة
				</TableCell>
				<TableCell sx={{ color: "#67747B" }} align='center'>
					الحالة
				</TableCell>
				<TableCell sx={{ color: "#02466a", width: "80px" }} align='center'>
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
	const {
		numSelected,
		rowCount,
		onSelectAllClick,
		search,
		setSearch,
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
			<div className='search-input-box'>
				<FiSearch />
				<input
					type='text'
					value={search}
					autoComplete='false'
					onChange={(e) => setSearch(e.target.value)}
					placeholder='ابحث عن طريق اسم العميل '
					className='w-100'
				/>
			</div>

			<div className=' d-flex flex-row-reverse  justify-content-between align-items-center '>
				<div></div>
				{numSelected > 0 && (
					<div>
						<Tooltip
							onClick={() => {
								setNotificationTitle(
									"سيتم حذف جميع السلات وهذه الخطوة غير قابلة للرجوع"
								);
								setItems(itemsSelected);
								setActionType("deleteAll");
							}}
							className='delete-all'>
							<IconButton>
								<DeleteIcon title='حذف جميع السلات' />
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
	search,
	setSearch,
	rowsCount,
	pageTarget,
	setRowsCount,
	setPageTarget,
	pageCount,
	currentPage,
}) {
	const navigate = useNavigate();
	const NotificationStore = useContext(NotificationContext);
	const { notificationTitle } = NotificationStore;
	const contextStore = useContext(Context);
	const { setEndActionTitle } = contextStore;
	const DeleteStore = useContext(DeleteContext);
	const { setActionDelete, actionDelete, setItemId } = DeleteStore;

	// _____________________________________________________________________ //
	const [selected, setSelected] = useState([]);
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
	const isSelected = (name) => selected.indexOf(name) !== -1;
	// --------------------------------------------------------------------

	// Delete items
	const [deleteEmptyCarts] = useDeleteEmptyCartsMutation();
	const [deleteAllEmptyCarts] = useDeleteAllEmptyCartsMutation();

	const handleDeleteSingleItem = async (id) => {
		try {
			await deleteEmptyCarts({ emptyCartId: id })
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
			console.error("Failed to delete the deleteEmptyCarts", err);
		}
	};
	const handleDeleteAllItems = async (selected) => {
		const queryParams = selected.map((id) => `id[]=${id}`).join("&");
		try {
			await deleteAllEmptyCarts({ selected: queryParams })
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
			console.error("Failed to delete the deleteAllEmptyCarts", err);
		}
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					search={search}
					setSearch={setSearch}
					itemsSelected={selected}
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
										cartsData?.map((row, index) => {
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
																onClick={(event) => handleClick(event, row?.id)}
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
														<div className='cate-prim'>
															<img
																src={row?.user?.image}
																alt='img'
																className=' rounded-circle img_icons'
															/>
															<span className='me-3 text-black'>
																{row?.user?.name}
															</span>
														</div>
													</TableCell>
													<TableCell align='right'>
														{moment(row?.created_at).format("YYYY-MM-DD")}
													</TableCell>
													<TableCell align='center'>{row?.count}</TableCell>

													<TableCell align='center'>{row?.total} ر.س</TableCell>

													<TableCell align='center'>{row?.status}</TableCell>
													<TableCell align='center' sx={{ width: "80px" }}>
														<div className='d-flex align-items-center justify-content-center gap-2 '>
															<EditIcon
																title='تعديل السلة'
																style={{ cursor: "pointer" }}
																onClick={() =>
																	navigate(`ClientData/${row?.id}`)
																}
															/>

															<DeleteIcon
																title='حذف السلة'
																style={{ cursor: "pointer" }}
																onClick={() => {
																	setActionDelete(
																		"سيتم حذف السلة وهذه الخطوة غير قابلة للرجوع"
																	);
																	setItemId(row.id);
																}}
															/>
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
			{cartsData?.length !== 0 && !loading && (
				<TablePagination
					data={cartsData}
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
				<DeleteModal handleDeleteAllItems={handleDeleteAllItems} />
			)}
		</Box>
	);
}
