import React, { useState } from "react";

import useFetch from "../../Hooks/UseFetch";
import { FiPlus } from "react-icons/fi";

// Redux
import { useDispatch } from "react-redux";
import { openAddBankAccountModal } from "../../store/slices/AddBankAccountModal";

const BankAccountsTable = ({ bankAccount }) => {
	const dispatch = useDispatch();

	// get banks api
	const { fetchedData: banks } = useFetch(
		"https://backend.atlbha.com/api/selector/banks"
	);
	console.log(bankAccount?.supplierUser);

	// Handle get bank account name
	const bankAccountName = banks?.data?.Banks?.filter(
		(bank) => bank?.Value === +bankAccount?.supplierUser?.bankId
	)[0]?.Text;

	console.log(bankAccountName);

	return (
		<div className=' w-100 d-flex flex-md-row flex-col align-md-items-center align-items-start justify-content-between gap-2 '>
			<div className=' d-flex flex-row align-items-center gap-md-4 gap-2'>
				<div className=' d-flex flex-row align-items-center justify-content-between '>
					<div className='notification-user-name'>{bankAccountName}</div>
					<div className='notification-user-name'>
						{bankAccount?.supplierUser?.bankAccountHolderName}
					</div>
					<div className='notification-user-name'>
						{bankAccount?.supplierUser?.bankAccount}
					</div>
					<div className='notification-user-name'>
						{bankAccount?.supplierUser?.iban}
					</div>
				</div>
			</div>
			<div className='d-flex flex-row align-items-center gap-2'>
				<button
					onClick={() => dispatch(openAddBankAccountModal())}
					className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'>
					<span>تعديل بيانات الحساب</span>
				</button>
			</div>
		</div>
	);
};

export default BankAccountsTable;
