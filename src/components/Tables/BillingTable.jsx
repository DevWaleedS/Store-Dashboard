import React from "react";

//Third party
import moment from "moment";
import { useNavigate } from "react-router-dom";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";

// Icons
import { Info } from "../../data/Icons";

//Components
import { TablePagination } from "./TablePagination";
import CircularLoading from "../../HelperComponents/CircularLoading";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#F4F5F7" }}>
			<TableRow>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					م
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					رقم الفاتورة
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					طريقة الدفع
				</TableCell>

				<TableCell align='center' sx={{ color: "#67747B" }}>
					تاريخ الفاتورة
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					حالة الطلب
				</TableCell>

				<TableCell align='center' sx={{ color: "#67747B" }}>
					المجموع
				</TableCell>

				<TableCell align='center' sx={{ color: "#67747B" }}>
					الاجراء
				</TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	rowCount: PropTypes.number,
};

const BillingTable = ({
	loadingBilling,
	billingInfo,
	rowsCount,
	setRowsCount,
	pageTarget,

	setPageTarget,
	pageCount,
	currentPage,
}) => {
	const navigate = useNavigate();
	return (
		<>
			<Box className='bank-accounts-table  mb-4' sx={{ width: "100%" }}>
				<TableContainer>
					<Table className='bank-accounts'>
						{loadingBilling ? (
							<TableBody>
								<TableCell colSpan={5}>
									<CircularLoading />
								</TableCell>
							</TableBody>
						) : billingInfo?.length === 0 ? (
							<TableBody>
								<TableCell className='text-center' colSpan={5}>
									لا يوجد لديك فواتير
								</TableCell>
							</TableBody>
						) : (
							<>
								<EnhancedTableHead />
								<TableBody>
									{billingInfo?.map((row, index) => (
										<TableRow hover tabIndex={-1} key={index}>
											<TableCell
												component='th'
												id={index}
												scope='row'
												align='center'>
												{(index + 1).toLocaleString("en-US", {
													minimumIntegerDigits: 1,
													useGrouping: false,
												})}
											</TableCell>
											<TableCell align='center'>
												{row?.paymentTransectionID}
											</TableCell>

											<TableCell align='center'>{row?.paymentType}</TableCell>

											<TableCell align='center'>
												{moment(row?.paymenDate).format("YYYY-MM-DD")}
											</TableCell>

											<TableCell align='right' sx={{ width: "90px" }}>
												<div className='sub-categories'>
													<span
														className='status d-flex justify-content-center align-items-center'
														style={{
															backgroundColor:
																row?.order?.status === "تم الشحن"
																	? "#ebfcf1"
																	: row?.order?.status === "جديد"
																	? "#d4ebf7"
																	: row?.order?.status === "الغاء الشحنة"
																	? "#ffebeb"
																	: row?.order?.status === "قيد التجهيز"
																	? "#ffecd1c7"
																	: "#9df1ba",
															color:
																row?.order?.status === "تم الشحن"
																	? "##9df1ba"
																	: row?.order?.status === "جديد"
																	? "#0077ff"
																	: row?.order?.status === "الغاء الشحنة"
																	? "#ff7b7b"
																	: row?.order?.status === "قيد التجهيز"
																	? "#ff9f1a"
																	: "#07b543",
															borderRadius: "16px",
															padding: "4px 12px",
															fontWeight: 500,
															fontSize: "16px",
														}}>
														{row?.order?.status}
													</span>
												</div>
											</TableCell>

											<TableCell align='center'>
												{row?.price_after_deduction} ر.س
											</TableCell>

											<TableCell align='center'>
												<Info
													onClick={() => {
														navigate(`billingInfo/${row?.id}`);
													}}
													style={{
														cursor: "pointer",
													}}
												/>
											</TableCell>
										</TableRow>
									))}
								</TableBody>
							</>
						)}
					</Table>
				</TableContainer>
			</Box>

			{billingInfo?.length !== 0 && !loadingBilling && (
				<TablePagination
					data={billingInfo}
					pageCount={pageCount}
					currentPage={currentPage}
					pageTarget={pageTarget}
					rowsCount={rowsCount}
					setRowsCount={setRowsCount}
					setPageTarget={setPageTarget}
				/>
			)}
		</>
	);
};

export default BillingTable;
