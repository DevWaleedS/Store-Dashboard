import React from "react";

import useFetch from "../../Hooks/UseFetch";

// MUI
import PropTypes from "prop-types";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import Paper from "@mui/material/Paper";
import TableRow from "@mui/material/TableRow";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";

// Redux
import { useDispatch } from "react-redux";
import { openEditBankAccountModal } from "../../store/slices/EditBankAccountModal";

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

const BankAccountsTable = ({ bankAccount }) => {
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
						{!bankAccount ? (
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
										{bankAccount?.SupplierDetails?.SupplierStatus}
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
