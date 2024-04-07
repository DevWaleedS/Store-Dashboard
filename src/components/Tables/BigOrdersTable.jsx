import React, { Fragment, useState } from "react";

// Third party
import "rsuite/dist/rsuite.min.css";
import { useNavigate } from "react-router-dom";
import CircularLoading from "../../HelperComponents/CircularLoading";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import Select from "@mui/material/Select";
import Toolbar from "@mui/material/Toolbar";
import MenuItem from "@mui/material/MenuItem";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";

// Icons
import { ReportIcon } from "../../data/Icons";
import { IoIosArrowDown } from "react-icons/io";
import { FiSearch, FiFilter } from "react-icons/fi";

// Components
import { TablePagination } from "./TablePagination";

// filter orders by
const filtersTypes = [
	{ id: 1, ar_name: "الكل", en_name: "all" },
	{ id: 2, ar_name: "جديد", en_name: "new" },
	{ id: 5, ar_name: "قيد التجهيز", en_name: "ready" },
	{ id: 4, ar_name: "تم الشحن", en_name: "completed" },
	{ id: 3, ar_name: "الغاء الشحنة", en_name: "canceled" },
];

// Style The MUI Select
const selectFilterStyles = {
	width: "100%",
	height: "100%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	fontSize: "18px",
	fontWeight: "500",
	backgroundColor: "aliceblue",
	color: "#02466a",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "5px",
		},

	"& .MuiOutlinedInput-root": {
		"& :hover": {
			border: "none",
		},
	},
	"& .MuiOutlinedInput-notchedOutline": {
		border: "none",
	},

	"& .MuiSelect-nativeInput": {
		display: "none",
	},
	"& .MuiSelect-icon": {
		right: "88%",
	},
};

const menuItemStyles = {
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	backgroundColor: "aliceblue",
	height: "3rem",
	"&.Mui-selected": {
		backgroundColor: "#d9f2f9",
	},
	"&.Mui-selected:hover ": {
		backgroundColor: "#d9f2f9",
	},
	"&:hover ": {
		backgroundColor: "#d9f2f9",
	},
};
// ----------------------------------------------------------------------
function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#d9f2f9" }}>
			<TableRow>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					م
				</TableCell>
				<TableCell align='right' sx={{ color: "#02466a" }}>
					رقم التتبع
				</TableCell>
				<TableCell sx={{ color: "#02466a" }} align='right'>
					اسم العميل
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					حالة الطلب
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					شركة الشحن
				</TableCell>

				<TableCell align='center' sx={{ color: "#02466a" }}>
					الكمية
				</TableCell>
				<TableCell sx={{ color: "#02466a" }} align='center'>
					إجمالي الطلب
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					وسيلة الدفع
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					حالة الدفع
				</TableCell>
				<TableCell align='center' sx={{ color: "#02466a" }}>
					الاجراء
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	numSelected: PropTypes.number.isRequired,
	onSelectAllClick: PropTypes.func,
	rowCount: PropTypes.number,
};

function EnhancedTableToolbar(props) {
	const { search, setSearch, select, setSelect } = props;

	return (
		<React.Fragment>
			{/** Filter Section */}
			<Toolbar>
				<div className='row mb-0 filter-wrapper m-0 mt-4 order-toolbar'>
					<div className='filter-row d-flex align-items-center gap-3 mb-3'>
						<div className=''>
							<h4>جدول الطلبات</h4>
						</div>
						<div className='w-100 d-flex flex-row align-items-center gap-3 flex-wrap justify-content-end'>
							<div></div>

							<div className='search-input-box'>
								<FiSearch />
								<input
									type='text'
									autoComplete='false'
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder=' ابحث برقم التتبع أو اسم شركة الشحن أو اسم العميل'
								/>
							</div>
							<div className='select-input-box'>
								<FiFilter className='filter-icon' />
								<Select
									displayEmpty
									sx={selectFilterStyles}
									IconComponent={IoIosArrowDown}
									value={select}
									onChange={(e) => setSelect(e.target.value)}
									inputProps={{ "aria-label": "Without label" }}
									renderValue={(selected) => {
										if (select === "") {
											return <p style={{ color: "#02466a" }}>فرز حسب</p>;
										}
										const result =
											filtersTypes?.filter(
												(item) => item?.en_name === selected
											) || "";
										return result[0]?.ar_name;
									}}>
									{filtersTypes?.map((item) => (
										<MenuItem
											sx={menuItemStyles}
											key={item?.id}
											value={item?.en_name}>
											{item?.ar_name}
										</MenuItem>
									))}
								</Select>
							</div>
						</div>
					</div>
				</div>
			</Toolbar>
		</React.Fragment>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

export default function BigOrdersTable({
	orders,
	loading,

	rowsCount,
	setRowsCount,
	pageTarget,

	setPageTarget,
	pageCount,
	currentPage,

	search,
	setSearch,
	select,
	setSelect,
}) {
	const navigate = useNavigate();

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					search={search}
					setSearch={setSearch}
					rowCount={orders?.length}
					select={select}
					setSelect={setSelect}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead rowCount={orders?.length} />

						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={8}>
										<CircularLoading />
									</TableCell>
								</TableRow>
							) : (
								<Fragment>
									{orders?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										orders?.map((row, index) => {
											const labelId = `enhanced-table-checkbox-${index}`;

											return (
												<TableRow hover tabIndex={-1} key={index}>
													<TableCell
														component='th'
														id={labelId}
														scope='row'
														align='right'>
														<div
															className='flex items-center'
															style={{
																display: "flex",
																justifyContent: "center",
																alignItems: "center",
																gap: "7px",
															}}>
															{(index + 1).toLocaleString("en-US", {
																minimumIntegerDigits: 2,
																useGrouping: false,
															})}
														</div>
													</TableCell>

													<TableCell align='right'>
														<div
															className='text-overflow'
															style={{ maxWidth: "210px" }}>
															{row?.shipping?.shipping_id}
														</div>
													</TableCell>
													<TableCell align='right'>
														<div className='cate-prim'>
															<img
																src={row?.user?.image}
																alt='img'
																className=' rounded-circle img_icons'
															/>
															<span
																className='me-3'
																style={{
																	maxWidth: "100%",
																	whiteSpace: "nowrap",
																	overflow: "hidden",
																	textOverflow: "ellipsis",
																}}>
																{`${row?.user?.name} ${row?.user?.lastname}`}
															</span>
														</div>
													</TableCell>
													<TableCell align='right' sx={{ width: "90px" }}>
														<div className='sub-categories'>
															<span
																className='status d-flex justify-content-center align-items-center'
																style={{
																	backgroundColor:
																		row?.status === "تم الشحن"
																			? "#ebfcf1"
																			: row?.status === "جديد"
																			? "#d4ebf7"
																			: row?.status === "الغاء الشحنة"
																			? "#ffebeb"
																			: row?.status === "قيد التجهيز"
																			? "#ffecd1c7"
																			: "#9df1ba",
																	color:
																		row?.status === "تم الشحن"
																			? "##9df1ba"
																			: row?.status === "جديد"
																			? "#0077ff"
																			: row?.status === "الغاء الشحنة"
																			? "#ff7b7b"
																			: row?.status === "قيد التجهيز"
																			? "#ff9f1a"
																			: "#07b543",
																	borderRadius: "16px",
																	padding: "4px 12px",
																	fontWeight: 500,
																	fontSize: "16px",
																}}>
																{row?.status}
															</span>
														</div>
													</TableCell>
													<TableCell align='center'>
														{row?.shippingtypes?.name}
													</TableCell>

													<TableCell align='center'>{row?.quantity}</TableCell>

													<TableCell align='center'>
														{row?.total_price} ر.س
													</TableCell>
													<TableCell align='center'>
														{row?.paymenttypes?.paymentType}
													</TableCell>
													<TableCell align='right' sx={{ width: "90px" }}>
														<div className='sub-categories'>
															<span
																className='status d-flex justify-content-center align-items-center'
																style={{
																	backgroundColor:
																		row?.payment_status === "تم الدفع"
																			? "#ebfcf1"
																			: row?.payment_status === "فشل الدفع"
																			? "#ffebeb"
																			: row?.payment_status === "لم يتم الدفع"
																			? "#ffecd1c7"
																			: null,
																	color:
																		row?.payment_status === "تم الدفع"
																			? "#9df1ba"
																			: row?.payment_status === "فشل الدفع "
																			? "#ff7b7b"
																			: row?.payment_status === "لم يتم الدفع"
																			? "#ff9f1a"
																			: null,
																	borderRadius: "16px",
																	padding: "4px 12px",
																	fontWeight: 500,
																	fontSize: "16px",
																}}>
																{row?.payment_status}
															</span>
														</div>
													</TableCell>

													<TableCell align='right'>
														<div className='actions d-flex justify-content-evenly'>
															<span>
																<ReportIcon
																	title='تفاصيل الطلب'
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		navigate(`OrderDetails/${row?.id}`);
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
			{orders?.length !== 0 && !loading && (
				<TablePagination
					data={orders}
					pageCount={pageCount}
					currentPage={currentPage}
					pageTarget={pageTarget}
					rowsCount={rowsCount}
					setRowsCount={setRowsCount}
					setPageTarget={setPageTarget}
				/>
			)}
		</Box>
	);
}
