import React, { Fragment, useState } from "react";
import MenuItem from "@mui/material/MenuItem";

import Select from "@mui/material/Select";

import { useNavigate } from "react-router-dom";
import CircularLoading from "../HelperComponents/CircularLoading";
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
import "rsuite/dist/rsuite.min.css";

import TablePagination from "./TablePagination";

// Icons
import { ReactComponent as ReportIcon } from "../data/Icons/icon-24-actions-info_outined.svg";
import { FiSearch } from "react-icons/fi";
import { IoIosArrowDown } from "react-icons/io";

// filter orders by
const filtersTypes = [
	{ id: 1, ar_name: "شركة الشحن", en_name: "shipping_company" },
	{ id: 2, ar_name: "حالة الطلب", en_name: "status" },
	{ id: 3, ar_name: "كمية الطلب", en_name: "qty" },
];

const selectFilterStyles = {
	width: "100%",
	height: "100%",
	display: "flex",
	justifyContent: "center",
	alignItems: "center",
	fontSize: "18px",
	fontWeight: "500",
	backgroundColor: "aliceblue",
	"& .css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input.css-11u53oe-MuiSelect-select-MuiInputBase-input-MuiOutlinedInput-input":
		{
			paddingRight: "20px",
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
					اجمالي الطلب
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
									value={search}
									onChange={(e) => setSearch(e.target.value)}
									placeholder=' ابحث عن طريق رقم التتبع أو اسم شركة الشحن'
								/>
							</div>
							<div className='select-input-box'>
								<Select
									displayEmpty
									sx={selectFilterStyles}
									IconComponent={IoIosArrowDown}
									value={select}
									onChange={(e) => setSelect(e.target.value)}
									inputProps={{ "aria-label": "Without label" }}
									renderValue={(selected) => {
										if (select === "") {
											return <p style={{ color: "#02466a" }}> فرز حسب </p>;
										}
										const result =
											filtersTypes?.filter(
												(item) => item?.en_name === selected
											) || "";
										return result[0]?.ar_name;
									}}>
									<MenuItem sx={menuItemStyles} value=''>
										الكل
									</MenuItem>
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
	data,
	loading,
	reload,
	setReload,
	search,
	setSearch,
	select,
	setSelect,
}) {
	const navigate = useNavigate();

	const [selected, setSelected] = React.useState([]);

	const [page, setPage] = React.useState(0);
	const [rowsPerPage, setRowsPerPage] = React.useState(8);
	const rowsPerPagesCount = [10, 20, 30, 50, 100];
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [itemSelected, setItemSelected] = useState("");

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

	// handle calc total price if codePrice is !== 0
	const calcTotalPrice = (codprice, totalPrice) => {
		const cashOnDelivery = codprice || 0;
		const totalCartValue = totalPrice;

		const totalValue = cashOnDelivery
			? (totalCartValue + cashOnDelivery)?.toFixed(2)
			: totalPrice;
		return totalValue;
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<EnhancedTableToolbar
					search={search}
					setSearch={setSearch}
					itemSelected={itemSelected}
					setItemSelected={setItemSelected}
					numSelected={selected.length}
					rowCount={data?.length}
					select={select}
					setSelect={setSelect}
				/>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead
							numSelected={selected.length}
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
																	justifyContent: "start",
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
															{row?.shipping?.track_id}
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
																	{`${row?.user?.name} ${row?.user?.user_name}`}
																</span>
															</div>
														</TableCell>
														<TableCell align='right' sx={{ width: "90px" }}>
															<div className='sub-categories'>
																<span
																	className='status d-flex justify-content-center align-items-center'
																	style={{
																		backgroundColor:
																			row?.status === "تم التوصيل"
																				? "#ebfcf1"
																				: row?.status === "جديد"
																				? "#d4ebf7"
																				: row?.status === "ملغي"
																				? "#ffebeb"
																				: row?.status === "جاهز للشحن"
																				? "#ffecd1c7"
																				: "",
																		color:
																			row?.status === "تم التوصيل"
																				? "##9df1ba"
																				: row?.status === "جديد"
																				? "#0077ff"
																				: row?.status === "ملغي"
																				? "#ff7b7b"
																				: row?.status === "جاهز للشحن"
																				? "#ff9f1a"
																				: "",
																		borderRadius: "16px",
																		padding: "5px 25px",
																		fontWeight: 500,
																		width: "120px",
																	}}>
																	{row?.status}
																</span>
															</div>
														</TableCell>
														<TableCell align='center'>
															{row?.shippingtypes?.name}
														</TableCell>
														<TableCell align='center'>
															{row?.quantity}
														</TableCell>
														<TableCell align='center'>
															{calcTotalPrice(row?.codprice, row?.total_price)}{" "}
															ر.س
														</TableCell>

														<TableCell align='right'>
															<div className='actions d-flex justify-content-evenly'>
																<span>
																	<ReportIcon
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
