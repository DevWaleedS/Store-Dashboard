import React, { Fragment, useEffect, useState, useContext } from "react";

// Third party
import axios from "axios";
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
import CircularLoading from "../../HelperComponents/CircularLoading";

// Icons
import CloseIcon from "@mui/icons-material/Close";
import { DeleteIcon, EditIcon } from "../../data/Icons";

// Context
import Context from "../../Context/context";
import { DeleteContext } from "../../Context/DeleteProvider";
import { NotificationContext } from "../../Context/NotificationProvider";
import useFetch from "../../Hooks/UseFetch";
import {
	FormControl,
	ListItemText,
	MenuItem,
	Modal,
	Select,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";

import { IoIosArrowDown, IoMdInformationCircleOutline } from "react-icons/io";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { toast } from "react-toastify";

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
		numSelected,
		rowCount,
		onSelectAllClick,
		handleOpenChangeCategoriesModal,
	} = props;
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
					<div className=' d-flex justify-content-start align-items-center flex-wrap '>
						<Tooltip
							className='delete-all'
							onClick={() => {
								setNotificationTitle(
									"سيتم حذف جميع المنتجات وهذةالخطوة غير قابلة للرجوع"
								);
								setActionTitle("Delete");
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

						<Tooltip>
							<button
								className='edit-all-categories-btn'
								onClick={handleOpenChangeCategoriesModal}>
								تعديل الأنشطة
							</button>
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
						Authorization: `Bearer ${store_token}`,
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

	// change special status
	const changeSpecialStatus = (id) => {
		axios
			.get(`https://backend.atlbha.com/api/Store/specialStatus/${id}`, {
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

	useEffect(() => {
		if (confirm && actionTitle === "Delete") {
			const queryParams = selected.map((id) => `id[]=${id}`).join("&");
			axios
				.get(
					`https://backend.atlbha.com/api/Store/productdeleteall?${queryParams}`,
					{
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${store_token}`,
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
							Authorization: `Bearer ${store_token}`,
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

	/**
	 * ----------------------------------------------------------------------------
	 * create change categories modal
	 * ----------------------------------------------------------------------------
	 */
	const { fetchedData } = useFetch(
		"https://backend.atlbha.com/api/Store/selector/mainCategories"
	);

	const [categories, setCategories] = useState([]);
	const [category_id, setCategory_id] = useState("");
	const [subcategory_id, setSubcategory_id] = useState([]);
	const [openChangeCategoriesModal, setOpenChangeCategoriesModal] =
		useState(false);

	useEffect(() => {
		if (fetchedData) {
			setCategories(fetchedData);
		}
	}, [fetchedData]);

	const subcategory =
		categories?.data?.categories?.filter(
			(sub) => sub?.id === parseInt(category_id)
		) || [];
	// ----------------------------------------------
	// Handle Errors
	const [productError, setProductError] = useState({
		category_id: "",
		subcategory_id: "",
	});

	const resetProductError = () => {
		setProductError({
			category_id: "",
			subcategory_id: "",
		});
	};

	/** open modal */
	const handleOpenChangeCategoriesModal = () => {
		setOpenChangeCategoriesModal(true);
	};

	/**  close modal */
	const handleCloseChangeCategoriesModal = () => {
		setOpenChangeCategoriesModal(false);
		setCategory_id([]);
		setSubcategory_id([]);
	};

	// Style the modal
	const style = {
		position: "absolute",
		top: "100px",
		left: "0",
		transform: "translateX(50%)",
		minWidth: "50%",
		maxWidth: "95%",
		"@media(max-width:768px)": {
			top: "80px",

			transform: "translateX(2%)",
		},
	};

	const selectStyle = {
		fontSize: "18px",
		height: "56px",
		color: "#6790a6",
		"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
			{
				paddingRight: "20px",
			},
		"&:hover": {
			"& .MuiOutlinedInput-notchedOutline": {
				borderColor: " #6790a6",
			},
		},
		"& .MuiOutlinedInput-notchedOutline": {
			border: "1px solid #6790a6",
		},

		"& .MuiSelect-icon": {
			right: "95%",
			color: "#6790a6",
		},

		"@media(max-width:768px)": {
			height: "48px",
		},
	};

	const formControlStyle = {
		m: 0,
		width: "95%",
		"@media(max-width:768px)": {
			width: "100%",
		},
	};
	/** ---------------------------------------------------------------------------------------------------------- */

	/** handle change categories function */
	const changeCategories = () => {
		resetProductError();
		const formData = new FormData();

		formData.append("category_id", category_id);
		for (let i = 0; i < subcategory_id?.length; i++) {
			formData.append(`subcategory_id[${i}]`, subcategory_id[i]);
		}

		const queryParams = selected.map((id) => `id[]=${id}`).join("&");

		axios
			.post(
				` https://backend.atlbha.com/api/Store/updateCategory?${queryParams}`,
				formData,
				{
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${store_token}`,
					},
				}
			)
			.then((res) => {
				if (res?.data?.success === true && res?.data?.data?.status === 200) {
					setEndActionTitle(res?.data?.message?.ar);
					handleCloseChangeCategoriesModal();
					setSelected([]);
					setCategory_id([]);
					setSubcategory_id([]);
					setReload(!reload);
				} else {
					setProductError({
						category_id: res?.data?.message?.en?.category_id?.[0],
						subcategory_id: res?.data?.message?.en?.subcategory_id?.[0],
					});

					toast.error(res?.data?.message?.en?.category_id?.[0], {
						theme: "light",
					});

					toast.error(res?.data?.message?.en?.subcategory_id?.[0], {
						theme: "light",
					});
				}
			});
	};

	const changeCategoriesModal = () => {
		return (
			<Modal open={openChangeCategoriesModal} closeAfterTransition>
				<Box component={"div"} sx={style}>
					<div className='change-categories-modal-content'>
						<section className='mb-4 '>
							<div className='row'>
								<div className='col-12'>
									<div
										className='form-title  d-flex justify-content-center align-content-center'
										style={{
											borderRadius: "16px 16px 0 0",
											backgroundColor: "#1DBBBE",
											padding: "20px ",
										}}>
										<h5
											className='text-white text-center'
											style={{
												fontSize: "22px",
												fontWeight: 400,
												whiteSpace: "normal",
											}}>
											تعديل أنشطة مجموعة من المنتجات
										</h5>

										<div className='close-icon-video-modal ps-2'>
											<AiOutlineCloseCircle
												style={{ cursor: "pointer", color: "white" }}
												onClick={handleCloseChangeCategoriesModal}
											/>
										</div>
									</div>
								</div>
							</div>
						</section>
						<section className='p-3'>
							<div className='row mb-md-5 mb-3'>
								<div className='col-12 '>
									<div className='mb-2 option-info-label d-flex justify-content-start align-items-center gap-2 '>
										<IoMdInformationCircleOutline />
										<span>بإمكانك تعديل أنشطة المنتجات التي قمت بتحديدها</span>
									</div>
								</div>
							</div>
							<div className='row mb-md-5 mb-3'>
								<div className='col-12'>
									<label htmlFor='product-category'>
										{" "}
										النشاط الرئيسي
										<span className='important-hint'>*</span>
									</label>
								</div>
								<div className='col-12'>
									<FormControl sx={formControlStyle}>
										<Select
											value={category_id}
											name='category_id'
											sx={selectStyle}
											onChange={(e) => {
												if (category_id !== e.target.value) {
													setSubcategory_id([]);
												}
												setCategory_id(e.target.value);
											}}
											IconComponent={IoIosArrowDown}
											displayEmpty
											renderValue={(selected) => {
												if (category_id?.length === 0) {
													return <p className='text-[#02466a]'>اختر النشاط</p>;
												}
												const result =
													categories?.data?.categories?.filter(
														(item) =>
															item?.id === parseInt(selected) ||
															item?.id === category_id
													) || "";
												return result[0]?.name;
											}}>
											{categories?.data?.categories?.map((cat, idx) => {
												return (
													<MenuItem
														key={idx}
														className='souq_storge_category_filter_items'
														sx={{
															backgroundColor: "rgba(211, 211, 211, 1)",
															height: "3rem",
															"&:hover": {},
														}}
														value={`${cat?.id}`}>
														{cat?.name}
													</MenuItem>
												);
											})}
										</Select>
									</FormControl>
								</div>
								<div className=' col-12'></div>
								<div className='col-12'>
									<span className='fs-6 text-danger'>
										{productError?.category_id}
									</span>
								</div>
							</div>

							{/* Sub catagories */}
							<div className='row mb-md-5 mb-3'>
								<div className=' col-12'>
									<label htmlFor='sub-category labeles'>النشاط الفرعي</label>
								</div>
								<div className=' col-12'>
									<FormControl sx={formControlStyle}>
										{category_id !== "" &&
										subcategory[0]?.subcategory?.length === 0 ? (
											<div
												className='d-flex justify-content-center align-items-center'
												style={{ color: "#1dbbbe" }}>
												لا يوجد أنشطة فرعية للنشاط الرئيسي الذي اخترتة
											</div>
										) : (
											<Select
												sx={selectStyle}
												IconComponent={IoIosArrowDown}
												multiple
												displayEmpty
												name='subcategory_id'
												value={subcategory_id || []}
												onChange={(e) => setSubcategory_id(e.target.value)}
												renderValue={(selected) => {
													if (subcategory_id?.length === 0) {
														return (
															<p className='text-[#02466a]'>النشاط الفرعي</p>
														);
													}
													return selected?.map((item) => {
														const result =
															subcategory[0]?.subcategory?.filter(
																(sub) => sub?.id === parseInt(item)
															) || subcategory_id;
														return `${result[0]?.name} , `;
													});
												}}>
												{subcategory[0]?.subcategory?.map((sub, index) => (
													<MenuItem key={index} value={sub?.id}>
														<Checkbox
															checked={subcategory_id?.indexOf(sub?.id) > -1}
														/>
														<ListItemText primary={sub?.name} />
													</MenuItem>
												))}
											</Select>
										)}
									</FormControl>
								</div>
								<div className='col-12'></div>
								<div className='col-12'>
									{productError?.subcategory_id && (
										<span className='fs-6 text-danger'>
											{productError?.subcategory_id}
										</span>
									)}
								</div>
							</div>

							<div className='row mb-3 d-flex justify-content-center align-items-center'>
								<div className='col-md-5 col-12'>
									<button
										className='save-change-btn w-100'
										onClick={changeCategories}>
										حفظ
									</button>
								</div>
							</div>
						</section>
					</div>
				</Box>
			</Modal>
		);
	};

	return (
		<Box sx={{ width: "100%" }}>
			{openChangeCategoriesModal && changeCategoriesModal()}

			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					numSelected={selected.length}
					rowCount={data?.length}
					onSelectAllClick={handleSelectAllClick}
					handleOpenChangeCategoriesModal={handleOpenChangeCategoriesModal}
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
								<>
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
																			changeSpecialStatus(row?.id)
																		}
																		checked={
																			row?.special === "مميز" ? true : false
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
																		<EditIcon title='تعديل المنتج' />
																	</Link>
																	<span>
																		<DeleteIcon
																			title='حذف المنتج'
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
								</>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			</Paper>
			{data?.length !== 0 && !loading && (
				<TablePagination
					page={page}
					open={open}
					setPage={setPage}
					allRows={allRows}
					anchorEl={anchorEl}
					data={data?.length}
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
