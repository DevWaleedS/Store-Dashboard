import React, { Fragment } from "react";

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
	{ id: 1, ar_name: "الكل", en_name: "" },
	{ id: 2, ar_name: "جديد", en_name: "pending" },
	{ id: 5, ar_name: "تم الاسترجاع", en_name: "accept" },
	{ id: 4, ar_name: "لم يتم الاسترجاع", en_name: "reject" },
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
				<TableCell sx={{ color: "#02466a" }} align='right'>
					رقم الطلب
				</TableCell>
				<TableCell sx={{ color: "#02466a" }} align='right'>
					اسم العميل
				</TableCell>

				<TableCell align='center' sx={{ color: "#02466a" }}>
					سبب الارجاع
				</TableCell>

				<TableCell align='center' sx={{ color: "#02466a" }}>
					حالة الطلب
				</TableCell>

				<TableCell sx={{ color: "#02466a" }} align='center'>
					إجمالي الطلب
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
			<Toolbar
				sx={{
					"&.MuiToolbar-root": {
						paddingRight: "0 !important",
						paddingLeft: "0 !important",
					},
				}}>
				<div className='filter-wrapper  mt-4 order-toolbar'>
					<div className='w-100 mb-4 d-flex flex-row align-items-center flex-wrap justify-content-between gap-md-0 gap-3'>
						<div className='search-input-box'>
							<FiSearch />
							<input
								type='text'
								autoComplete='false'
								value={search}
								onChange={(e) => setSearch(e.target.value)}
								placeholder=' ابحث برقم الطلب أو اسم العميل'
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
			</Toolbar>
		</React.Fragment>
	);
}

EnhancedTableToolbar.propTypes = {
	numSelected: PropTypes.number.isRequired,
};

export default function ReturnOrdersTable({
	returnOrders,
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
			<EnhancedTableToolbar
				search={search}
				setSearch={setSearch}
				rowCount={returnOrders?.length}
				select={select}
				setSelect={setSelect}
			/>
			<Paper sx={{ width: "100%", mb: 2 }}>
				<TableContainer>
					<Table sx={{ minWidth: 750 }} aria-labelledby='tableTitle'>
						<EnhancedTableHead rowCount={returnOrders?.length} />

						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={8}>
										<CircularLoading />
									</TableCell>
								</TableRow>
							) : (
								<Fragment>
									{!returnOrders || returnOrders?.length === 0 ? (
										<TableRow>
											<TableCell colSpan={8}>
												<p className='text-center'>لاتوجد بيانات</p>
											</TableCell>
										</TableRow>
									) : (
										returnOrders?.map((row, index) => {
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
															{row?.order?.order_number}
														</div>
													</TableCell>
													<TableCell align='right'>
														<div className='cate-prim'>
															<img
																src={row?.order?.user?.image}
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
																{`${row?.order?.user?.name} ${row?.order?.user?.lastname}`}
															</span>
														</div>
													</TableCell>
													<TableCell align='center'>
														{row?.reason_txt?.title}
													</TableCell>

													<TableCell align='right' sx={{ width: "90px" }}>
														<div className='sub-categories'>
															<span
																className='status d-flex justify-content-center align-items-center'
																style={{
																	backgroundColor:
																		row?.status === "جديد"
																			? "#d4ebf7"
																			: row?.status === "لم يتم الاسترجاع"
																			? "#ffebeb"
																			: row?.status === "تم الاسترجاع"
																			? "#9df1ba"
																			: null,
																	color:
																		row?.status === "جديد"
																			? "#0077ff"
																			: row?.status === "لم يتم الاسترجاع"
																			? "#ff7b7b"
																			: row?.status === "تم الاسترجاع"
																			? "#07b543"
																			: null,
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
														{row?.order?.total_price} ر.س
													</TableCell>

													<TableCell align='right'>
														<div className='actions d-flex justify-content-evenly'>
															<span>
																<ReportIcon
																	title='تفاصيل الطلب'
																	style={{ cursor: "pointer" }}
																	onClick={() => {
																		navigate(`ReturnOrderDetails/${row?.id}`);
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
			{returnOrders?.length !== 0 && !loading && (
				<TablePagination
					data={returnOrders}
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
