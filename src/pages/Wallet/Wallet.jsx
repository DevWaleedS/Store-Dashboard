import React, { useState } from "react";

// Third party
import { Helmet } from "react-helmet";

// components
import {
	WalletQuickDetails,
	AddBankAccountModal,
	EditBankAccountModal,
	BankAccountsTable,
} from "./index.js";
import { Breadcrumb } from "../../components";
import BillingTable from "../../components/Tables/BillingTable.jsx";
// Helpers
import { CircularLoading } from "../../HelperComponents";

// Icons
import { FiPlus } from "react-icons/fi";
import { RiBankFill } from "react-icons/ri";
import { FaFileInvoice } from "react-icons/fa";

// Redux
import { useDispatch } from "react-redux";
import { openAddBankAccountModal } from "../../store/slices/AddBankAccountModal";
import BankAccStatusComment from "./Add&EditBankAccountModal/BankAccStatusComment.jsx";
import AlertMessage from "./Add&EditBankAccountModal/AlerMessage.jsx";

// RTK Query
import {
	useGetBillingDataQuery,
	useGetCurrentBankAccountQuery,
	useGetWalletDataQuery,
} from "../../store/apiSlices/walletApi.js";

// custom hook
import UseAccountVerification from "../../Hooks/UseAccountVerification.js";

// global components
import { TopBarSearchInput } from "../../global/TopBar";

const Wallet = () => {
	// to Handle if the user is not verify  her account
	UseAccountVerification();

	const dispatch = useDispatch();
	const [pageTarget, setPageTarget] = useState(1);
	const [rowsCount, setRowsCount] = useState(10);

	// -----------------------------------------------------------

	// get supplier dashboard
	const { data: walletData, isLoading } = useGetWalletDataQuery();

	// showSupplier bank account
	const { data: currentBankAccount, isLoading: currentAccountIsLoading } =
		useGetCurrentBankAccountQuery();

	// Billing Data
	const { data: billing, isLoading: billingIsLoading } = useGetBillingDataQuery(
		{
			page: pageTarget,
			number: rowsCount,
		}
	);

	return (
		<>
			<Helmet>
				<title>لوحة تحكم اطلبها | المحفظة و الفواتير</title>
			</Helmet>
			<section className='payment-page p-lg-3'>
				<div className='col-12 d-md-none d-flex'>
					<div className='search-header-box'>
						<TopBarSearchInput />
					</div>
				</div>

				<Breadcrumb mb={"mb-3"} currentPage={"المحفظة و الفواتير"} />

				<div className='data-container wallet-data-container'>
					<>
						{currentAccountIsLoading || isLoading || billingIsLoading ? (
							<div
								style={{ minHeight: "250px" }}
								className='d-flex justify-content-center align-items-center'>
								<CircularLoading />
							</div>
						) : (
							<>
								{/* Wallet quick details component */}
								<section className='row mb-3 mb-md-5'>
									<WalletQuickDetails
										loading={isLoading}
										supplierDashboard={walletData}
									/>
								</section>

								{/* Bank Accounts */}
								<section className='bank-accounts mb-5'>
									<div className='d-flex justify-content-between flex-column flex-md-row bank-accounts-head'>
										<div className='d-flex align-items-center mb-3 mb-md-0'>
											<div className=' d-flex justify-content-start align-items-center gap-1 bank-acc-title'>
												<span>
													<RiBankFill />
												</span>
												<span>الحسابات البنكية</span>
											</div>
										</div>
										{!currentBankAccount ? (
											<div className=''>
												<button
													onClick={() => dispatch(openAddBankAccountModal())}
													className='d-flex justify-content-center justify-md-content-end align-items-center gap-1 me-md-auto'>
													<span>
														<FiPlus />
													</span>
													<span>اضافة حساب جديد</span>
												</button>
											</div>
										) : null}
									</div>

									{/* Bank Account Table */}
									<div className=' bank-accounts-box'>
										<BankAccountsTable
											bankAccount={currentBankAccount}
											loading={currentAccountIsLoading}
										/>
									</div>
								</section>

								{/* Billing Table */}
								<section className='bank-accounts'>
									<div className='d-flex justify-content-between flex-column flex-md-row bank-accounts-head'>
										<div className='d-flex align-items-center mb-3 mb-md-0'>
											<div className=' d-flex justify-content-start align-items-center gap-1 bank-acc-title'>
												<span>
													<FaFileInvoice />
												</span>
												<span>فواتير المبيعات</span>
											</div>
										</div>
									</div>
								</section>

								{/* Billing Table */}
								<BillingTable
									billingInfo={billing?.billing || []}
									loading={billingIsLoading}
									pageTarget={pageTarget}
									setRowsCount={setRowsCount}
									setPageTarget={setPageTarget}
									pageCount={billing?.page_count}
									currentPage={billing?.current_page}
								/>
							</>
						)}
					</>
				</div>
			</section>
			{/* Add & Edit Bank Account Modal */}
			<AddBankAccountModal />
			<EditBankAccountModal />
			<AlertMessage />

			<BankAccStatusComment
				comment={
					currentBankAccount?.supplierUser?.comment ||
					currentBankAccount?.supplierUser?.Comment
				}
			/>
		</>
	);
};

export default Wallet;
