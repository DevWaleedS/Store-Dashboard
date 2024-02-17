import React from "react";

import useFetch from "../../Hooks/UseFetch";

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
				<TableCell align='center'></TableCell>
			</TableRow>
		</TableHead>
	);
}

EnhancedTableHead.propTypes = {
	rowCount: PropTypes.number,
};

const BankAccountsTable = ({ bankAccount, loading }) => {
	const dispatch = useDispatch();

	// get banks api
	const { fetchedData: banks } = useFetch(
		"https://backend.atlbha.com/api/selector/banks"
	);

	// Handle get bank account name
	const bankAccountName = banks?.data?.Banks?.filter(
		(bank) => bank?.Value === +bankAccount?.supplierUser?.bankId
	)[0]?.Text;

	return (
		<>
			<Box className='bank-accounts-table' sx={{ width: "100%" }}>
				<TableContainer>
					<Table>
						{loading ? (
							<TableCell colSpan={5}>
								<CircularLoading />
							</TableCell>
						) : !bankAccount ? (
							<TableCell className='text-center' colSpan={5}>
								لا يوجد لديك حساب بنكي
							</TableCell>
						) : (
							<>
								<EnhancedTableHead />
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
														bankAccount?.SupplierDetails?.SupplierStatus ===
														"Active"
															? "#9df1ba"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Pending"
															? "#ffecd1c7"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Rejected"
															? "#ffebeb"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Closed"
															? "#ffecd1c7"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Dormant"
															? "#d4ebf7"
															: null,
													color:
														bankAccount?.SupplierDetails?.SupplierStatus ===
														"Active"
															? "##9df1ba"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Pending"
															? "#ff9f1a"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Rejected"
															? "#ff7b7b"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Closed"
															? "#0077ff"
															: bankAccount?.SupplierDetails?.SupplierStatus ===
															  "Dormant"
															? "#07b543"
															: null,
													borderRadius: "16px",
													padding: "4px 22px",
													fontWeight: 500,
													width: "120px",
													maxWidth: "132px",
												}}>
												{bankAccount?.SupplierDetails?.SupplierStatus ===
												"Pending" ? (
													<>قيد المراجعه</>
												) : bankAccount?.SupplierDetails?.SupplierStatus ===
												  "Active" ? (
													"نشط"
												) : bankAccount?.SupplierDetails?.SupplierStatus ===
												  "Rejected" ? (
													<>
														مرفوض
														{bankAccount?.SupplierDetails?.SupplierStatus
															?.Comment && (
															<IoMdInformationCircleOutline
																className='me-1'
																style={{ cursor: "pointer" }}
																onClick={() => dispatch(openCommentModal())}
															/>
														)}
													</>
												) : bankAccount?.SupplierDetails?.SupplierStatus ===
												  "Closed" ? (
													<>
														مغلق
														{bankAccount?.SupplierDetails?.SupplierStatus
															?.Comment && (
															<IoMdInformationCircleOutline
																className='me-1'
																style={{ cursor: "pointer" }}
																onClick={() => dispatch(openCommentModal())}
															/>
														)}
													</>
												) : bankAccount?.SupplierDetails?.SupplierStatus ===
												  "Dormant" ? (
													<>
														مجمد
														{bankAccount?.SupplierDetails?.SupplierStatus
															?.Comment && (
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
									<TableCell align='center'>
										<button
											onClick={() => dispatch(openEditBankAccountModal())}
											className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'>
											<span>تعديل بيانات الحساب</span>
										</button>
									</TableCell>
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
