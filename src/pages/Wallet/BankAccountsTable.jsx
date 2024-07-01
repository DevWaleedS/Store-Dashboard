import React from "react";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import CircularLoading from "../../HelperComponents/CircularLoading";
import { IoMdInformationCircleOutline } from "react-icons/io";

// Redux
import { useDispatch } from "react-redux";
import { openEditBankAccountModal } from "../../store/slices/EditBankAccountModal";
import { openCommentModal } from "../../store/slices/BankAccStatusCommentModal";
import { useGetBanksQuery } from "../../store/apiSlices/selectorsApis/selectBanksApi";
import { EditIcon } from "../../data/Icons";

function EnhancedTableHead(props) {
	return (
		<TableHead sx={{ backgroundColor: "#F4F5F7" }}>
			<TableRow>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					اسم البنك
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					اسم صاحب الحساب
				</TableCell>

				<TableCell align='center' sx={{ color: "#67747B" }}>
					رقم الحساب
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					رقم الآيبان
				</TableCell>
				<TableCell align='center' sx={{ color: "#67747B" }}>
					حالة الحساب
				</TableCell>
				{props?.supplierStatus !== "APPROVED" && (
					<TableCell align='center'>الاجراء</TableCell>
				)}
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	rowCount: PropTypes.number,
};

const BankAccountsTable = ({ bankAccount, loading }) => {
	const dispatch = useDispatch();

	// get banks selector
	const { data: banks } = useGetBanksQuery();

	// Handle get bank account name
	const bankAccountName = banks?.filter(
		(bank) => bank?.bankId === +bankAccount?.supplierUser?.bankId
	)[0]?.name_ar;

	return (
		<>
			<Box className='bank-accounts-table' sx={{ width: "100%" }}>
				<TableContainer>
					<Table>
						{loading ? (
							<TableBody>
								<TableCell colSpan={5}>
									<CircularLoading />
								</TableCell>
							</TableBody>
						) : !bankAccount ? (
							<TableBody>
								<TableCell className='text-center' colSpan={5}>
									لا يوجد لديك حساب بنكي
								</TableCell>
							</TableBody>
						) : (
							<>
								<EnhancedTableHead
									supplierStatus={bankAccount?.supplierUser?.status}
								/>
								<TableBody>
									<TableCell align='center'>{bankAccountName}</TableCell>
									<TableCell align='center'>
										{bankAccount?.supplierUser?.bankAccountHolderName}
									</TableCell>
									<TableCell align='center'>
										{bankAccount?.supplierUser?.bankAccount}
									</TableCell>
									<TableCell align='center'>
										{bankAccount?.supplierUser?.iban}
									</TableCell>
									<TableCell align='center'>
										<div className='sub-categories'>
											<span
												className='status d-flex justify-content-center align-items-center'
												style={{
													backgroundColor:
														bankAccount?.supplierUser?.status === "APPROVED" ||
														bankAccount?.supplierUser?.status === "Approved"
															? "#9df1ba"
															: bankAccount?.supplierUser?.status ===
																	"PENDING" ||
															  bankAccount?.supplierUser?.status === "Pending"
															? "#ffecd1c7"
															: bankAccount?.supplierUser?.status ===
																	"REJECTED" ||
															  bankAccount?.supplierUser?.status === "Rejected"
															? "#ffebeb"
															: bankAccount?.supplierUser?.status ===
																	"CLOSED" ||
															  bankAccount?.supplierUser?.status === "Closed"
															? "#ffecd1c7"
															: bankAccount?.supplierUser?.status ===
																	"DORMANT" ||
															  bankAccount?.supplierUser?.status === "Dormant"
															? "#d4ebf7"
															: null,
													color:
														bankAccount?.supplierUser?.status === "APPROVED" ||
														bankAccount?.supplierUser?.status === "Approved"
															? "##9df1ba"
															: bankAccount?.supplierUser?.status ===
																	"PENDING" ||
															  bankAccount?.supplierUser?.status === "Pending"
															? "#ff9f1a"
															: bankAccount?.supplierUser?.status ===
																	"REJECTED" ||
															  bankAccount?.supplierUser?.status === "Rejected"
															? "#ff7b7b"
															: bankAccount?.supplierUser?.status ===
																	"CLOSED" ||
															  bankAccount?.supplierUser?.status === "Closed"
															? "#0077ff"
															: bankAccount?.supplierUser?.status ===
																	"DORMANT" ||
															  bankAccount?.supplierUser?.status === "Dormant"
															? "#07b543"
															: null,
													borderRadius: "16px",
													padding: "4px 22px",
													fontWeight: 500,
													width: "120px",
													maxWidth: "132px",
												}}>
												{bankAccount?.supplierUser?.status === "PENDING" ||
												bankAccount?.supplierUser?.status === "Pending" ? (
													<>قيد المراجعه</>
												) : bankAccount?.supplierUser?.status === "APPROVED" ||
												  bankAccount?.supplierUser?.status === "Approved" ? (
													"نشط"
												) : bankAccount?.supplierUser?.status === "REJECTED" ||
												  bankAccount?.supplierUser?.status === "Rejected" ? (
													<>
														مرفوض
														{bankAccount?.supplierUser?.comment && (
															<IoMdInformationCircleOutline
																className='me-1'
																style={{ cursor: "pointer" }}
																onClick={() => dispatch(openCommentModal())}
															/>
														)}
													</>
												) : bankAccount?.supplierUser?.status === "CLOSED" ||
												  bankAccount?.supplierUser?.status === "Closed" ? (
													<>
														مغلق
														{bankAccount?.supplierUser?.comment && (
															<IoMdInformationCircleOutline
																className='me-1'
																style={{ cursor: "pointer" }}
																onClick={() => dispatch(openCommentModal())}
															/>
														)}
													</>
												) : bankAccount?.supplierUser?.status === "DORMANT" ||
												  bankAccount?.supplierUser?.status === "Dormant" ? (
													<>
														مجمد
														{bankAccount?.supplierUser?.comment && (
															<IoMdInformationCircleOutline
																className='me-1'
																style={{ cursor: "pointer" }}
																onClick={() => dispatch(openCommentModal())}
															/>
														)}
													</>
												) : null}
											</span>
										</div>
									</TableCell>

									{bankAccount?.supplierUser?.status !== "APPROVED" && (
										<TableCell align='center'>
											<EditIcon
												title='تعديل الحساب البنكي '
												style={{ cursor: "pointer" }}
												onClick={() => dispatch(openEditBankAccountModal())}
												className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'
											/>
										</TableCell>
									)}
								</TableBody>
							</>
						)}
					</Table>
				</TableContainer>
			</Box>
		</>
	);
};

export default BankAccountsTable;
